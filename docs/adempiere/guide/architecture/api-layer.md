# API Layer

All HTTP calls from adempiere-vue to the backend go through a single axios wrapper
and are organized into domain files under `src/api/ADempiere/`.
This page describes the structure, naming conventions, and how to find or add an endpoint.

---

## Request wrapper

`src/utils/ADempiere/request.js` is the single axios instance used by every API file.

It handles:

- Base URL from `config/default.json` → `adempiere.api.url`
- Request timeout
- Authorization token injection (from Vuex `user` module)
- Global error interception (401 → logout, 500 → notification)

**Never import axios directly in API files.** Always use:

```js
import { request } from '@/utils/ADempiere/request'
```

---

## Directory structure

```
src/api/ADempiere/
│
├── index.js                  ← re-exports commonly used functions
├── system-core.js            ← session login/logout, language, system info
├── window.js                 ← window record CRUD — Create, Read, Update, Delete (getEntity, createEntity, etc.)
├── workflow.js               ← workflow actions
├── generalLedger.js          ← general ledger queries
├── enrollment.js             ← user self-registration
│
├── dictionary/               ← Application Dictionary metadata fetchers
│   ├── form.js               ← form metadata (by internal name or UUID — Universally Unique Identifier)
│   ├── process.js            ← process/report metadata
│   └── smart-browser.js      ← smart browser metadata
│
├── fields/                   ← Field-specific API calls
│   ├── preference.js         ← set/delete field default values
│   ├── zoom.js               ← zoom-in record lookup
│   ├── location.js           ← location/address fields
│   ├── binary.js             ← binary (file) fields
│   ├── product-info.js       ← product information panel
│   ├── productAttribute.js   ← product attribute sets
│   ├── warehouseLocator.js   ← warehouse locator lookup
│   └── accoutingCombination.js ← accounting combination
│
├── form/                     ← Full-screen form APIs (one file per form)
│   ├── point-of-sales.js     ← POS: orders, payments, cash, terminals
│   ├── price-checking.js     ← Price check form
│   ├── express-receipt.js    ← Express receipt form
│   ├── express-shipment.js   ← Express shipment form
│   ├── expres-movement.js    ← Express inventory movement
│   ├── accouting.js          ← Accounting viewer
│   ├── match.js / VMatch.js  ← Invoice/PO matching
│   ├── VPayPrint.js          ← Payment print/export
│   ├── ReturnRMA.js          ← Return merchandise authorization
│   ├── VFileImport.js        ← File import form
│   ├── TaskManager.js        ← Task manager
│   ├── CommandShortcut.js    ← Keyboard shortcuts
│   ├── workflow-activity.js  ← Workflow activity form
│   ├── notice.js             ← Notices
│   ├── payrollActionNotice.js ← Payroll notices
│   ├── storeProduct.js       ← Store product form
│   ├── timeControl.js        ← Time control form
│   ├── weight.js             ← Weight entry form
│   └── TrialBalanceDrillable.js ← Trial balance drill
│
├── actions/                  ← Record-level actions
│   ├── private-access.js     ← Lock / unlock a record
│   ├── record-access.js      ← Record access rules
│   └── translation.js        ← Field translation
│
├── user-interface/           ← UI-level interactions
│   ├── browser.js            ← Smart browser queries
│   └── persistence.js        ← Unsaved-changes API
│
└── user-customization/       ← Per-user layout customizations
    ├── index.js
    ├── windows.js
    ├── browsers.js
    └── processes.js
```

---

## Naming conventions

| Pattern    | Example                           | Meaning                   |
| ---------- | --------------------------------- | ------------------------- |
| `get*`     | `getOrder`, `getPointOfSales`     | Fetch a single record     |
| `list*`    | `listOrders`, `listPayments`      | Fetch a paginated list    |
| `create*`  | `createOrder`, `createPayment`    | Create a new record       |
| `update*`  | `updateOrder`, `updateOrderLine`  | Update an existing record |
| `delete*`  | `deleteOrder`, `deletePayment`    | Delete a record           |
| `process*` | `processOrder`, `processShipment` | Execute a business action |

---

## POS API surface (`form/point-of-sales.js`)

The POS form has the largest API file in the codebase. Key function groups:

**Terminal management**

- `listPointOfSales` — list terminals available to the logged-in user
- `getPointOfSales` — load a specific POS terminal configuration

**Order lifecycle**

- `createOrder`, `getOrder`, `updateOrder`, `deleteOrder`, `listOrders`
- `completeOrder` — mark the order as complete
- `processOrder` — trigger the full process workflow (generate invoice + shipment)
- `holdOrder`, `releaseOrder` — put an order on hold / release it
- `copyOrder` — duplicate an existing order
- `reverseSalesTransaction`, `reverseSales` — reverse/void a completed sale

**Order lines**

- `createOrderLine`, `updateOrderLine`, `deleteOrderLine`, `listOrderLines`

**Payments and cash**

- `createPayment`, `updatePayment`, `deletePayment`, `getPaymentsList`
- `listTenderTypes` — available payment methods (cash, card, transfer, …)
- `cashOpening` — open the cash register at start of shift
- `cashWithdrawal` — register a cash withdrawal
- `cashSummaryMovements` — summary of cash movements
- `cashClosing` — close the cash register at end of shift

**Overpayment**

- `overdrawnInvoice` — handle the case where payment exceeds order total

**Supporting lookups**

- `listDocumentTypes`, `listPrices`, `listCurrencies`, `listWarehouses`
- `listDiscount`, `listStocks`, `banks`, `campaigns`
- `availableSellers`, `allocateSeller`, `deallocate`

---

## How to add a new endpoint

1. Find the right domain file (or create one if the domain doesn't exist yet).
2. Import the request wrapper:
   ```js
   import { request } from '@/utils/ADempiere/request'
   import { config } from '@/utils/ADempiere/config'
   ```
3. Write and export a function:
   ```js
   export function myNewCall({ paramOne, paramTwo }) {
     return request({
       url: `${config.myService.endpoint}/my-path`,
       method: 'get',
       params: {
         param_one: paramOne,
         param_two: paramTwo
       }
     })
   }
   ```
4. Import the function in the relevant Vuex module and call it from an action.
5. The Vuex action commits the result to the store; the component reads it via a getter.

---

## Common mistakes

::: warning Template literals vs literal strings
The most frequent bug in this file is using `{id}` instead of `${id}` in URL strings.

```js
// WRONG — sends the literal string "{id}" as part of the URL → 404
url: `point-of-sales/cash/closings/{id}/process`

// CORRECT
url: `point-of-sales/cash/closings/${id}/process`
```

This was the root cause of the POS cash closing 404 error (case 20260226-POS_Close).
:::

::: tip Finding the backend route
If a 404 occurs, compare the URL sent (visible in DevTools → Network) with the
route patterns in the gRPC server's REST transcoding configuration.
See [Browser DevTools Guide](../debugging/browser-devtools.md).
:::
