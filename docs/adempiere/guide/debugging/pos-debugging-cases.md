# POS Debugging Case Studies

Each case below documents a real problem that was investigated and resolved in the Point of Sale form.  
They are not a list of active errors — they are worked examples of the complete debugging workflow:

**symptom → DevTools observation → source code location → root cause → fix**

Use them as a model when investigating a new unknown problem.  
The same tools and reasoning apply to any issue in the codebase, not only POS

---

## Case index

| Symptom                                         | Type                                          | Status              | Case                                                    |
| ----------------------------------------------- | --------------------------------------------- | ------------------- | ------------------------------------------------------- |
| Cash closing button results in 404              | Bug — template literal typo                   | Resolved            | [Case 1](#case-1-cash-closing-404)                      |
| Overpayment dialog: OK button disabled          | Bug — unsafe property access + inverted logic | Resolved            | [Case 2](#case-2-overpayment-dialog-ok-button-disabled) |
| Refund payment created with wrong document type | Bug — wrong doctype passed to API             | Resolved            | [Case 3](#case-3-refund-payment-wrong-document-type)    |
| UOM field not editable on order lines           | Missing feature                               | Not yet implemented | [Case 4](#case-4-uom-field-not-editable)                |

---

## Case 1 — Cash closing 404

### Symptom

Clicking the cash closing button in the POS results in a 404 error.
The close dialog either does not open or shows a network error.

### What DevTools showed

**Network tab:**

```
PUT /api/point-of-sales/cash/closings/{id}/process  →  404
```

The literal text `{id}` appeared in the URL instead of an actual session ID.

### Root cause

`src/api/ADempiere/form/point-of-sales.js` — `cashClosing()` function.
A JavaScript template literal was written with curly braces but without the `$` prefix,
so the variable was never interpolated:

```js
// Bug — {id} is a literal string, not a variable
url: `point-of-sales/cash/closings/{id}/process`

// Fix — ${id} is a JavaScript template literal
url: `point-of-sales/cash/closings/${id}/process`
```

### Fix

Change `{id}` → `${id}` in the URL string.

### Lesson

When a URL contains `{variableName}` and the request returns 404, check whether
the template literal is missing the `$` prefix. The browser sends the literal text,
the server finds no matching route, and returns 404. The Network tab makes this
immediately visible.

---

## Case 2 — Overpayment dialog: OK button disabled

### Symptom

Order total is e.g. $39.43, customer pays $40.00. The overpayment (change) dialog
opens but the OK button is greyed out and the Console shows JavaScript errors.
The sale cannot be completed.

### What DevTools showed

**Console:**

```
TypeError: Cannot read properties of undefined (reading 'iso_code')
    at setCurrency (overdrawnInvoice.vue:157)
    at VueComponent.amountLimit (overdrawnInvoice.vue:177)
```

### Root cause

Two separate bugs in the same dialog:

**Bug A — Unsafe property access** in `VPOS2/DialogInfo/overdrawnInvoice.vue`:

```js
// Bug — missing .value for a Vue ref; no null guard
return currentPos.refund_reference_currency.iso_code

// Fix — use optional chaining; access .value on the ref
return currentPos.value?.refund_reference_currency?.iso_code
```

**Bug B — Inverted button logic** in `VPOS2/Collection/ButtonGroupOptions.vue`:

```js
// Bug — disables the button exactly when a refund IS present (wrong)
return convertToNumber(currentOrder.value.refund_amount) !== 0

// Fix — disable when refund amount is zero (nothing to return)
return convertToNumber(currentOrder.value.refund_amount) === 0
```

### Lesson

When a dialog opens but an action button is permanently disabled, check two things:

1. Console errors that fire on every render (often a TypeError on `undefined`)
2. The computed property that controls the button's disabled state — verify the
   condition is not inverted

---

## Case 3 — Refund payment wrong document type

### Symptom

When a sale involves overpayment, two payment records are created correctly (one
receipt, one refund), but the refund payment appears in reports as a receipt
(`isreceipt = Y`) rather than a disbursement. Cash flow and payment method reports
are corrupted.

### What DevTools showed

No visible UI error. The problem was discovered by inspecting the created payment
records directly in the database and noticing that both had `isreceipt = Y`.

### Root cause

The `createPayment()` call for the refund leg passed the same `documentTypeId` as
the original receipt payment. The refund must use the document type configured as
`POSWithdrawalDocumentType_ID` on the POS terminal (`c_POS` table), and must set
`isReceipt = false`.

### Fix location

Backend logic in `adempiere-grpc-server` —
`PointOfSalesServiceLogic.createCashPayment()` — updated to:

- Use `c_POS.POSWithdrawalDocumentType_ID` for the refund document type
- Copy the payment method and conversion type from the original payment
- Set the payment direction correctly (`isReceipt = false`)

### Lesson

Not all bugs produce visible UI errors. When financial data looks wrong (reports,
balances), query the records directly. The discrepancy between expected and actual
database values often points to the wrong parameter being passed into a create/update
call.

---

## Case 4 — UOM field not editable

### Symptom

In the POS order line, the Unit of Measure (UOM) field is displayed as plain text
and cannot be changed, even when the product has multiple UOM conversions defined
in ADempiere (e.g. selling by piece vs. by box). The ZK UI shows a dropdown in
this situation.

### Diagnosis

This is a **missing feature**, not a bug. The investigation confirmed:

- The ZK UI reads available UOM conversions from `C_UOM_Conversion` and renders
  a dropdown when more than one option exists.
- The Vue frontend renders UOM as a plain text label — no dropdown, no edit.
- The gRPC API does not return available UOM conversions per order line, so even
  if the frontend tried to render a dropdown, there is no data to populate it.

### Required changes (3-layer implementation)

| Layer        | File                      | Change needed                                                            |
| ------------ | ------------------------- | ------------------------------------------------------------------------ |
| gRPC Server  | `OrderConverUtil.java`    | Add method to query `C_UOM_Conversion`                                   |
| gRPC Server  | `PointOfSalesForm.java`   | Return `available_uoms` and `is_uom_editable` with each order line       |
| gRPC Server  | `point_of_sales.proto`    | Add `available_uoms` and `is_uom_editable` fields to `OrderLine` message |
| Vue Frontend | `VPOS/Order/index.vue`    | Replace plain-text UOM with a dropdown when `availableUoms.length > 1`   |
| Vue Frontend | `store/…/order.js`        | Add `changeOrderLineUOM` Vuex action                                     |
| Vue Frontend | `api/…/point-of-sales.js` | Add `uomId` parameter to `updateOrderLine()`                             |

::: tip
The backend change must be deployed before the frontend change, since the frontend
depends on the new fields being present in the API response.
:::

### Lesson

Before assuming a missing capability is a bug, compare behaviour with the ZK UI.
If ZK has the feature and Vue does not, the gap is most likely in the API layer —
the backend was never updated to expose the required data to the Vue client.
Check the `.proto` definition to confirm whether the fields exist at all.
