# Component and View Tree

This page maps the source tree of `src/views/ADempiere/` and explains how the
router loads each view dynamically from the ADempiere Application Dictionary.

---

## How views are loaded

The Vue router is configured dynamically at login time. When the user logs in,
the gRPC server returns the menu tree for that user's role. Each menu item carries
a `component_name` that maps to one of the view components listed below.
The router registers these routes programmatically — there are no hard-coded routes
for individual windows or browsers.

```
Login
  │
  ▼ gRPC: getMenu (returns menu tree with component names)
  │
  ▼ permission.js builds dynamic routes
  │
  ▼ Router renders the matching view component
```

---

## Top-level view components (`src/views/ADempiere/`)

```
src/views/ADempiere/
│
├── Window/                   ← Standard ADempiere windows (most frequent)
│   ├── index.vue             ← Entry point, selects sub-type
│   ├── StandardWindow.vue    ← Single-tab window
│   ├── MultiTabWindow.vue    ← Window with child tabs
│   ├── DocumentWindow.vue    ← Document-type window (orders, invoices, …)
│   ├── Finances.vue          ← Finance-specific window variant
│   ├── GeneralLedger.vue     ← General Ledger window
│   └── MaterialsManagement.vue ← Materials Management window
│
├── Browser/                  ← Smart Browsers (search + process)
│   └── index.vue
│
├── Form/                     ← Full-screen custom forms
│   └── index.vue             ← Dispatcher; loads specific form by name
│       (loaded forms include VPOS — Vue Point of Sale, VBankStatementMatch, etc.)
│
├── Process/                  ← Process execution panel
│   └── index.vue
│
├── ProcessActivity/          ← Process activity log (recent runs)
│   ├── index.vue
│   ├── modeDesktop.vue
│   └── modeMobile.vue
│
├── Report/                   ← Report parameter panel + runner
│   ├── index.vue
│   ├── Report.vue
│   └── ReportEngine.vue      ← Uses adempiere-report-engine service
│
├── ReportViewer/             ← Inline PDF/HTML report viewer
│   └── index.vue
│
├── ReportViewerEngine/       ← Engine-based report viewer
│   ├── index.vue
│   ├── infoReport.vue
│   └── reportPanel.vue
│
├── Workflow/                 ← Workflow status and actions
│   └── index.vue
│
├── CalendarView/             ← Calendar display for schedulable windows
│   ├── index.vue
│   └── resourceTimelineView.vue
│
├── Charts/                   ← Dashboard charts
│   └── index.vue
│
├── Summary/                  ← Summary/dashboard panels
│   └── index.vue
│
├── ImportExcel/              ← Bulk import via Excel upload
│   └── index.vue
│
└── Unsupported/              ← Fallback for unrecognised component types
    └── index.vue
```

---

## How a Window is rendered

```
Router → Window/index.vue
              │
              ├── reads metadata from Vuex (fieldDefinition, panelWindows)
              │   (fetched from gRPC server / dictionary-rs on first load)
              │
              ├── selects sub-component based on window type:
              │   StandardWindow, MultiTabWindow, DocumentWindow, …
              │
              └── sub-component renders:
                    ├── Tab header list
                    ├── Field components (driven by metadata column type)
                    │   ├── TextField, DateField, AmountField, …
                    │   ├── LookupField (uses lookupManager store)
                    │   └── … (one component per AD_Column reference)
                    └── Action toolbar (process buttons from metadata)
```

The field layout, field types, mandatory flags, display logic, and validation rules
all come from the Application Dictionary — **no field is hard-coded in the Vue source**.
This is the core concept of the dictionary-driven UI: a single generic window component
renders any ADempiere window by reading its metadata.

---

## How a Form (e.g. POS) is loaded

```
Router → Form/index.vue
              │
              ├── reads the form's internal_name from the route
              │
              ├── looks up the form definition in Vuex (formDefinition)
              │   (fetched from gRPC server's dictionary service)
              │
              └── dynamically imports the matching Vue component
                  e.g. internal_name = "VPOS" → loads VPOS/index.vue
```

Forms bypass the generic metadata system — each form is a purpose-built Vue component
with its own logic, stored under `src/components/ADempiere/Form/`.

---

## Key source directories for component development

| Path                                  | Content                                                   |
| ------------------------------------- | --------------------------------------------------------- |
| `src/views/ADempiere/`                | Top-level route components (one per ADempiere concept)    |
| `src/components/ADempiere/`           | Reusable components (fields, toolbars, dialogs)           |
| `src/components/ADempiere/Form/VPOS/` | Point of Sale form components                             |
| `src/store/modules/ADempiere/`        | Vuex modules — state for each ADempiere concept           |
| `src/api/ADempiere/`                  | API call functions — one file per domain                  |
| `src/utils/ADempiere/`                | Shared utilities (request wrapper, converters, constants) |
