# Debugging

This section documents the tools and techniques used to diagnose problems in adempiere-vue.

---

## Guides in this section

| Guide                                           | When to use                                                                                      |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [Browser DevTools](./browser-devtools.md)       | A network request fails (404, 500, wrong data); trace it from the UI error back to the API call  |
| [POS Debugging Cases](./pos-debugging-cases.md) | Worked examples of the full debugging workflow: symptom → DevTools → source → fix (POS-specific) |
| [Vuex Inspection](./vuex-inspection.md)         | The UI shows wrong data or stale state; you need to see what the store actually contains         |

---

## General approach

```
1. Open browser DevTools (F12)
2. Reproduce the error
3. Check the Console tab for JS exceptions
4. Check the Network tab for failed HTTP requests
5. Match the failed URL to a function in src/api/ADempiere/
6. Check the Vuex store state (Vue DevTools)
7. If the request reaches the backend, check the gRPC server log
```

See [Architecture Overview](../architecture/overview.md) for how
requests flow from the browser to the database.
