# Development Setup

This guide explains how to run adempiere-vue locally in development mode and
connect it to a live ADempiere backend (the `adempiere-ui-gateway` stack running
on a remote machine).

---

## Prerequisites

| Tool    | Minimum version | Check            |
| ------- | --------------- | ---------------- |
| Node.js | 12              | `node --version` |
| yarn    | 1.x             | `yarn --version` |
| git     | any             | `git --version`  |

---

## 1. Fork, clone and install

1. Fork [adempiere/adempiere-vue](https://github.com/adempiere/adempiere-vue) on GitHub.
2. Clone your fork:

```bash
git clone https://github.com/<your-github-username>/adempiere-vue.git
cd adempiere-vue
yarn install
```

3. Add the upstream repository as a remote so you can pull in future changes:

```bash
git remote add upstream https://github.com/adempiere/adempiere-vue.git
```

`yarn install` downloads all dependencies into `node_modules/`. This can take
2–5 minutes on the first run.

---

## 2. Point the app at the backend

The API base URL is **not** in `.env.development`. It is in `config/default.json`:

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

Change `url` to the address of the running `adempiere-ui-gateway`:

```json
"url": "http://<gateway-host>/api/"
```

Replace `<gateway-host>` with the IP address or hostname of the machine running the
gateway (e.g. `192.168.1.12`, `my-server.local`, or `localhost`).
The path `/api/` must be kept exactly as shown — this is the nginx route
that forwards to the Envoy proxy.

::: warning
`config/default.json` is tracked by git. Do not commit a machine-specific IP address.
Use `git restore config/default.json` to undo the change after your session,
or add a local override (see below).
:::

### Optional: local override file

To keep `config/default.json` clean, you can create `config/local.json` with only
the values you want to override. The app merges it at startup if it exists:

```json
{
  "adempiere": {
    "api": {
      "url": "http://<gateway-host>/api/"
    }
  }
}
```

Add `config/local.json` to `.gitignore` so it is never committed.

---

## 3. Start the development server

```bash
yarn dev
```

The app starts on `http://localhost:9527` and opens in the default browser automatically.

Hot module reload is active — saving any `.vue` or `.js` file updates the browser
without a full page reload.

::: tip
Changes to `config/default.json` or `config/local.json` require restarting
`yarn dev` to take effect.
:::

---

## 4. Understanding the mock server

`.env.development` contains:

```
VUE_APP_BASE_API = '/dev-api'
```

This activates the mock server (`mock/mock-server.js`) which intercepts a small
number of routes and returns fake data. In practice, when you have a real backend
configured in `config/default.json`, most requests bypass the mock entirely — the
mock only intercepts routes explicitly listed in `mock/`.

If a request is going to the mock instead of the real backend, check whether the
URL matches a mock route. To disable all mocking, remove the `before` line from
`vue.config.js`:

```js
// vue.config.js — devServer section
devServer: {
  // before: require('./mock/mock-server.js')  ← comment this out
}
```

---

## 5. Accessing the running gateway

When the gateway is on a remote machine (e.g. `mini-pc`), your browser must be
able to reach port 80 of that machine.

If you are on the same LAN:

```bash
# Test connectivity
curl http://<gateway-host>/api/
# Expected: 404 or JSON error (not a connection refused)
```

If you are not on the same LAN (Local Area Network), set up an SSH (Secure Shell) tunnel:

```bash
ssh -L 8080:localhost:80 westfalia@mini-pc-hostname
```

Then set the API URL to `http://localhost:8080/api/` in `config/default.json`.

---

## 6. Building for production

```bash
yarn build:prod
```

Output is written to `dist/`. Copy this folder into the `vue-ui` Docker image or
serve it from any static web server.

The `publicPath` in `vue.config.js` reads from `config/default.json` →
`server.publicPath`. When deployed behind nginx at `/vue`, set:

```json
"server": {
  "publicPath": "/vue/"
}
```
