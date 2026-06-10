# Browser DevTools

This guide shows how to use the browser's built-in developer tools to trace a
Vue UI error back to its root cause in the API or backend.

The screenshots reference Firefox and Chrome/Chromium — both work the same way.
Open DevTools with **F12** (or right-click → Inspect).

---

## Step 1 — Reproduce the error with the Console open

Open **Console** before reproducing the error. JavaScript exceptions appear here
with a stack trace that points to the exact source file and line number.

Example of a useful exception:

```
TypeError: Cannot read properties of undefined (reading 'iso_code')
    at setCurrency (overdrawnInvoice.vue:157)
    at VueComponent.amountLimit (overdrawnInvoice.vue:177)
```

This immediately tells you:

- The file: `overdrawnInvoice.vue`
- The line: 157
- The problem: a property was accessed on `undefined`

---

## Step 2 — Find the failing HTTP request

Switch to the **Network** tab. Check **Preserve log** so requests are not cleared
on navigation. Reproduce the error, then filter by **XHR/Fetch** to see only API calls.

Look for requests with a red status code:

| Status | Meaning       | Typical cause                                      |
| ------ | ------------- | -------------------------------------------------- |
| `404`  | URL not found | Typo in the URL template in `src/api/ADempiere/`   |
| `400`  | Bad request   | Wrong or missing parameter sent to the backend     |
| `401`  | Unauthorized  | Session expired — log out and back in              |
| `403`  | Forbidden     | User role does not have permission for this action |
| `500`  | Server error  | Backend exception — check gRPC server log          |

Click the failing request. In the **Headers** tab you can see the exact URL that
was sent. Compare it to what the API function intended to send.

---

## Step 3 — Match the URL to the source file

The URL structure follows a predictable pattern:

```
/api/<endpoint>/<resource>/<id>/<action>
```

The endpoint prefix comes from `config/default.json`. For POS:

```json
"pointOfSales": { "endpoint": "/point-of-sales" }
```

So a URL like `/api/point-of-sales/cash/closings/123/process` maps to:

```
src/api/ADempiere/form/point-of-sales.js  →  cashClosing()
```

Use **Ctrl+Shift+F** in VS Code to search across the codebase for the path fragment,
e.g. `cash/closings` to find the exact function.

---

## Step 4 — Read the response body

Click the failing request → **Response** tab. The gRPC server returns JSON with a
`message` field that describes the backend error:

```json
{
  "code": 5,
  "message": "No record found for id: {id}",
  "details": []
}
```

This is often more informative than the HTTP status code alone.

---

## Step 5 — Trace a 404 caused by a URL template bug

A common mistake is using `{id}` (literal curly braces) instead of `${id}` (JavaScript
template literal) in a URL string. The result is a request to a URL containing the
literal text `{id}`, which the backend rejects as 404.

**How to spot it in the Network tab:**

The Request URL shows:

```
/api/point-of-sales/cash/closings/{id}/process
```

instead of:

```
/api/point-of-sales/cash/closings/1000043/process
```

**Where to fix it:** find the function in `src/api/ADempiere/` and change `{id}` to `${id}`.

---

## Step 6 — Check the gRPC server log for 500 errors

When the backend returns 500, the Vue UI cannot tell you more. Check the container log:

```bash
# on the machine running adempiere-ui-gateway
docker logs adempiere-ui-gateway.adempiere-grpc-server --tail 100 -f
```

The gRPC server logs the exception with a Java stack trace. Look for lines containing
`ERROR` or `Exception`.

---

## Step 7 — Source maps

The production build minifies JavaScript, making stack traces unreadable.
In development (`yarn dev`), source maps are enabled (`devtool: "source-map"` in
`vue.config.js`), so the Console and debugger show the original `.vue` file and
line number directly.

If you need to debug a production issue: temporarily set `productionSourceMap: true`
in `vue.config.js`, build, and deploy to a test environment.
