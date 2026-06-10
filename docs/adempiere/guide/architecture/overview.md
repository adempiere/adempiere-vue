# Architecture Overview

This page explains where adempiere-vue sits in the full ADempiere stack and how a
browser request travels from the UI to the database and back.

---

## Position in the full stack

adempiere-vue is a **Single Page Application (SPA)**.  
The browser downloads it once and then communicates with the backend via REST (Representational State Transfer) / JSON API calls — it never reloads the full page.

In production it runs as the `vue-ui` container inside the
[adempiere-ui-gateway](https://github.com/Systemhaus-Westfalia/adempiere-ui-gateway)
Docker Compose stack.

```
┌─────────────────────────────────────────────────┐
│                    BROWSER                      │
│          adempiere-vue (Vue SPA)                │
└────────────────────┬────────────────────────────┘
                     │ HTTP  port 80
                     ▼
┌─────────────────────────────────────────────────┐
│              nginx  (ui-gateway)                │
│         Single entry point — path routing       │
└───────┬─────────────────────────┬───────────────┘
        │ path /vue               │ path /api/
        │                         │
        ▼                         ▼
┌───────────────┐      ┌──────────────────────────┐
│   vue-ui      │      │       Envoy Proxy        │
│  (serves SPA) │      │   HTTP/JSON ↔ gRPC       │
└───────────────┘      └────────────┬─────────────┘
                                    │ gRPC  port 50059
                                    ▼
                        ┌───────────────────────────┐
                        │    adempiere-grpc-server  │
                        │  ADempiere business logic │
                        └────────────┬──────────────┘
                                     │ SQL  port 5432
                                     ▼
                        ┌───────────────────────────┐
                        │        PostgreSQL         │
                        └───────────────────────────┘
```

**Key points:**

- nginx is the single external entry point (port 80).
- `/vue` serves the static SPA files (HTML, JS, CSS).
- `/api/` is **not** a browser URL — it is used internally by the SPA to send API calls.
  The browser never navigates there; only the Vue code does.
- Envoy translates the SPA's JSON/REST calls into gRPC (Google Remote Procedure Call) and forwards them to the gRPC server.
- The gRPC server implements all ADempiere business logic (POS, invoicing, inventory, etc.)
  and reads/writes PostgreSQL.

---

## Request flow in detail

A typical action in the Vue UI — for example, loading an order in the POS form —
follows this path:

```
1. User clicks "Load Order" in the POS form
        │
        ▼
2. Vue component calls a Vuex action
   (e.g. store/modules/ADempiere/point-of-sales → loadOrder)
        │
        ▼
3. Vuex action calls an API function
   (src/api/ADempiere/form/point-of-sales.js → getOrder)
        │
        ▼
4. API function sends HTTP GET to /api/point-of-sales/orders/{uuid}
   via src/utils/ADempiere/request.js (axios wrapper)
        │
        ▼
5. nginx routes /api/ → Envoy (port 5555)
        │
        ▼
6. Envoy transcodes JSON → gRPC and calls adempiere-grpc-server
        │
        ▼
7. gRPC server queries PostgreSQL, builds response
        │
        ▼
8. Response travels back: gRPC → Envoy (gRPC → JSON) → axios → Vuex action
        │
        ▼
9. Vuex action commits the result to the store
        │
        ▼
10. Vue component re-renders with the new data
```

---

## Where the API base URL is configured

The base URL the SPA uses for all `/api/` calls is set in `config/default.json`:

```json
{
  "adempiere": {
    "api": {
      "url": "http://localhost/api/",
      "timeout": 99999999
    }
  }
}
```

In development this points to `localhost` (the gateway running on the local machine or forwarded via SSH).  
In production the Docker container is served behind nginx, so the SPA always calls back to the same host it was loaded from.

See [Development Setup](../essentials/dev-setup.md) for how to configure this when working locally against a remote gateway.

---

## Additional services used by the application

| Service                      | Used for                                                               | Path in gateway         |
| ---------------------------- | ---------------------------------------------------------------------- | ----------------------- |
| `dictionary-rs` (OpenSearch) | Application Dictionary metadata — window, browser, process definitions | `/api/` via gRPC server |
| `adempiere-report-engine`    | Running and downloading reports                                        | `/api/` via gRPC server |
| `s3-gateway-rs`              | File attachments, uploaded documents                                   | `/api/`                 |
| `adempiere-processor`        | Background processes                                                   | internal only           |

All of these are reached through the same `/api/` nginx path — the gRPC server
routes internally to the appropriate service.
