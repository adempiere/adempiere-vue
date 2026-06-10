# Vuex Store Structure

The application state is managed with **Vuex**. All modules are registered in
`src/store/index.js`. This page lists every module, its responsibility, and the
components or views that depend on it most heavily.

---

## Store layout

```
src/store/
├── index.js          ← assembles all modules
├── getters.js        ← global getters (thin aliases into modules)
└── modules/
    ├── ADempiere/    ← all ADempiere-specific state (40+ modules)
    │   └── *.js
    ├── app.js        ← sidebar collapse, device type
    ├── errorLog.js   ← captured JS errors
    ├── permission.js ← dynamic routes built from menu
    ├── settings.js   ← theme, fixed header, sidebar logo flags
    ├── tagsView.js   ← open tab list (breadcrumb tabs)
    └── user.js       ← login session, token, user info
```

---

## Framework modules (non-ADempiere)

| Module       | File            | What it holds                                |
| ------------ | --------------- | -------------------------------------------- |
| `app`        | `app.js`        | Sidebar state, device type (mobile/desktop)  |
| `user`       | `user.js`       | Login token, user UUID, role, org, warehouse |
| `permission` | `permission.js` | Dynamic route list built after login         |
| `tagsView`   | `tagsView.js`   | Open tabs for the tab-bar at the top         |
| `settings`   | `settings.js`   | UI preferences (theme, fixed header, …)      |
| `errorLog`   | `errorLog.js`   | Captured JS exceptions                       |

---

## ADempiere modules

### Dictionary / Metadata

| Module                | File                     | What it holds                                       |
| --------------------- | ------------------------ | --------------------------------------------------- |
| `fieldDefinition`     | `fieldDefinition.js`     | Column metadata (type, label, validation) per panel |
| `formDefinition`      | `formDefinition.js`      | Form metadata (internal name, UUID)                 |
| `panelWindows`        | `panelWindows.js`        | Panel state for each open window/tab                |
| `defaultValueManager` | `defaultValueManager.js` | Default field values from the dictionary            |
| `calloutManager`      | `calloutManager.js`      | Callout execution results (field interdependencies) |
| `contextInfo`         | `contextInfo.js`         | Context-info popup content for fields               |

### Field Values and Lookup

| Module          | File               | What it holds                                               |
| --------------- | ------------------ | ----------------------------------------------------------- |
| `fieldValue`    | `fieldValue.js`    | Current field values per container (window/browser/process) |
| `lookupManager` | `lookupManager.js` | Lookup list results and loading state                       |
| `references`    | `references.js`    | Cross-references from field zoom actions                    |
| `zoomManager`   | `zoomManager.js`   | Zoom-in navigation stack                                    |

### Windows

| Module            | File                 | What it holds                                          |
| ----------------- | -------------------- | ------------------------------------------------------ |
| `windowManager`   | `windowManager.js`   | Record list, current record, pagination per window tab |
| `defaultTable`    | `defaultTable.js`    | Table/grid display state                               |
| `tabSequence`     | `tabSequence.js`     | Tab sequence (ordering within a window)                |
| `treeTab`         | `treeTab.js`         | Tree-view tab state                                    |
| `persistence`     | `persistence.js`     | Unsaved-change tracking per record                     |
| `documentManager` | `documentManager.js` | Document action state (complete, void, etc.)           |
| `privateAccess`   | `privateAccess.js`   | Record lock/unlock (private access) state              |
| `tabSequence`     | `tabSequence.js`     | Tab ordering for multi-tab windows                     |

### Browsers (Smart Browser)

| Module           | File                | What it holds                                          |
| ---------------- | ------------------- | ------------------------------------------------------ |
| `browserManager` | `browserManager.js` | Browser search criteria, result records, selected rows |

### Processes and Reports

| Module           | File                | What it holds                                |
| ---------------- | ------------------- | -------------------------------------------- |
| `processManager` | `processManager.js` | Process parameter values, execution state    |
| `processLog`     | `processLog.js`     | Process run history and output               |
| `reportManager`  | `reportManager.js`  | Report parameters, output format, viewer URL |

### Point of Sale

| Module               | File                    | What it holds                  |
| -------------------- | ----------------------- | ------------------------------ |
| `businessPartnerPOS` | `businessPartnerPOS.js` | Customer search results in POS |

::: tip
Most POS state (current order, order lines, payment list, cash session, POS terminal)
is held inside the VPOS form's own Vuex module at
`src/store/modules/ADempiere/form/point-of-sales/` (directory, not listed above individually).
:::

### Session and Context

| Module            | File                 | What it holds                                      |
| ----------------- | -------------------- | -------------------------------------------------- |
| `sessionContext`  | `sessionContext.js`  | Global context variables (#Date, #AD_Org_ID, etc.) |
| `system`          | `system.js`          | System-level settings (language, currency, …)      |
| `languageManager` | `languageManager.js` | Available languages and translations               |

### UI State

| Module                | File                     | What it holds                        |
| --------------------- | ------------------------ | ------------------------------------ |
| `contextMenu`         | `contextMenu.js`         | Right-click context menu items       |
| `actionMenuManager`   | `actionMenuManager.js`   | Action toolbar items per view        |
| `modalDialogManager`  | `modalDialogManager.js`  | Currently open modal dialog          |
| `notificationManager` | `notificationManager.js` | Notification/alert queue             |
| `dashboard`           | `dashboard.js`           | Dashboard widget data                |
| `attachmentManager`   | `attachmentManager.js`   | File attachment list per record      |
| `chatEntries`         | `chatEntries.js`         | Notes/chat entries per record        |
| `event`               | `event.js`               | Custom inter-component events        |
| `permantLink`         | `permantLink.js`         | Permanent link (shareable URL) state |
| `workflowDefinition`  | `workflowDefinition.js`  | Workflow definition metadata         |

### Specialised

| Module          | File               | What it holds                  |
| --------------- | ------------------ | ------------------------------ |
| `generalLedger` | `generalLedger.js` | General Ledger view state      |
| `wTrialBalance` | `wTrialBalance.js` | Trial balance drill-down state |
| `mailTemplate`  | `mailTemplate.js`  | Mail template selection        |
| `DocumentsTaks` | `DocumentsTaks.js` | Document task list             |
| `utils`         | `utils.js`         | Shared store utility functions |

---

## How to find the relevant module for a bug

1. Identify the view that shows the problem (`src/views/ADempiere/…`).
2. Look at which Vuex actions the view dispatches (`this.$store.dispatch('…')`).
3. The action name is namespaced: `'windowManager/getEntities'` → module is `windowManager.js`.
4. Read the module's `actions` section to find the API call, then trace to `src/api/ADempiere/`.

See [Vuex Inspection with Vue DevTools](../debugging/vuex-inspection.md) for
how to inspect live store state in the browser.
