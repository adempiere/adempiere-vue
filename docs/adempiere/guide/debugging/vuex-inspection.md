# Vuex Inspection with Vue DevTools

When the UI displays incorrect or stale data, the fastest way to diagnose the
problem is to inspect the live Vuex store state directly in the browser.
This requires the **Vue DevTools** browser extension.

---

## Install Vue DevTools

| Browser                  | Link                                                                                                                         |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| Chrome / Chromium / Edge | [Chrome Web Store — Vue DevTools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) |
| Firefox                  | [Firefox Add-ons — Vue DevTools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)                            |

After installing, reload the page. A **Vue** tab appears in DevTools (F12).

::: warning Development build required
Vue DevTools only works when the app is running in development mode (`yarn dev`) or
when the production build includes devtools support. In a standard production build
(`yarn build:prod`), Vue DevTools is disabled and the tab will not appear.
:::

---

## Navigate to the Vuex tab

1. Open DevTools (F12).
2. Click the **Vue** tab.
3. Click **Vuex** in the left panel (the icon that looks like a timeline).

You will see a timeline of all Vuex mutations on the left and the full store state
tree on the right.

---

## Read store state

The state tree mirrors the module structure described in the
[Store documentation](../architecture/store.md).

Expand the tree to find the module you need:

```
state
├── app
├── user
│   ├── token
│   ├── name
│   └── roles
├── ADempiere
│   ├── windowManager
│   │   └── window/<uuid>
│   │       ├── recordsList
│   │       └── currentRecord
│   ├── fieldValue
│   │   └── <containerUuid>/<columnName>
│   └── ...
```

**To find a specific value:**

1. Perform an action in the UI (e.g. open an order).
2. Watch the Vuex timeline for mutations.
3. Click a mutation to see the payload and the store state before/after.

---

## Use the timeline to trace a problem

**Example: POS shows wrong total**

1. Open the POS, load the order.
2. In the Vuex timeline, find the mutation that sets the order total.
   Search for `order` in the mutation search box.
3. Click the mutation — the right panel shows the exact value committed.
4. If the value is wrong at commit time, the bug is in the API call or the Vuex action.
5. If the value is correct at commit time but wrong in the UI, the bug is in the
   component's computed property or template.

---

## Time-travel debugging

Vuex DevTools supports **time-travel**: click any past mutation in the timeline
and the store (and UI) reverts to the state it was in at that moment.
This is useful for stepping through a sequence of mutations to find where the
state diverged.

---

## Trigger a Vuex action manually

In the **Vuex** tab, click the **dispatch** button (play icon) to manually dispatch
any action with a custom payload. This lets you test an action without going through
the UI.

Alternatively, in the **Console** tab:

```js
// Dispatch a Vuex action directly from the console
window.__vue__.$store.dispatch('windowManager/getEntities', {
  containerUuid: 'your-uuid-here'
})
```

---

## Component inspector

Switch back to the **Components** tab in Vue DevTools to inspect any component's
`data`, `computed`, and `props`. Click a component in the tree, then edit values
directly in the right panel to test what the UI looks like with different data.
