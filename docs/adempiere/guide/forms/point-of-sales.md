# Point of sale

The point of sale form allows salespeople to take customer orders quickly and efficiently. During the process, the total amount of the order can be viewed, converted into the different currencies with which the organization works, for this there must necessarily be a previously created exchange rate.

## Create New Order

A new sales order record can be created by adding a product to the form.

<img :src="$withBase('/images/forms/point-of-sales/create-new-order.gif')" />

Similarly, a new record can be created by selecting the option "**New Order**", located on the right side of the "**Business Partner**" field. This option is enabled when the user is positioned in a sales order record, in the form "**Point of Sale**".

<img :src="$withBase('/images/forms/point-of-sales/option-create-new-order.png')" alt="Create New Order Option" width="800px">

## Add Customer to an Order

To add a customer to a sales order, the customer's data must be entered in the "**Business Partner**" field.

<img :src="$withBase('/images/forms/point-of-sales/add-business-partner.gif')" />

Additionally, a new record of a client business partner can be created by selecting the "**+**" icon, located at the top of the "**Business Partner**" field.

<img :src="$withBase('/images/forms/point-of-sales/create-business-partner.png')" alt="Create Business Partner" width="800px">

## Add Product to an Order

The products of the sales order can be added to it as follows:

- Entering the code or name of the product in the field "**Product Code**". When entering a value in this field, ADempiere performs the search automatically, displaying the results below the field.

<img :src="$withBase('/images/forms/point-of-sales/add-product-with-code-or-name.gif')" />

- Selecting the products in the product catalog that is displayed by selecting the "**<**" icon, located in the central right part of the "**Point of Sale**" form window.

<img :src="$withBase('/images/forms/point-of-sales/add-product-with-catalog.gif')" />

- In addition to this, the products can be added with the help of the barcode reader.

<img :src="$withBase('/images/forms/point-of-sales/add-product-with-code-reader.gif')" />

## Order Lines

<img :src="$withBase('/images/forms/point-of-sales/sales-order-lines.png')" alt="Sales Order Lines" width="800px">

The order lines section contains the following six (6) columns that represent the main fields of the product:

- **Product**: Name of the product loaded to the sales order.

- **Price**: Unit price of the product charged to the sales order.

- **Quantity**: The quantity of the product loaded to the sales order.

- **% Discount**: The discount percentage applied to the price of the product charged to the sales order.

- **Total**: The total of the product line, according to the amount entered.

- **Options**: The column consists of three (3) options that allow the user to perform certain actions

  - The first option from left to right, allows you to view the product information

  - The second option from left to right, allows you to modify the quantity, price and discount percentage of the product.

  - The third option from left to right, allows you to delete the record of the sales order line.

    <img :src="$withBase('/images/forms/point-of-sales/sales-order-lines.gif')" />

## Order Information

The information of the sales order is located in the lower right part of the form. It is made up of the following fields:

- **Order**: Indicates the document number of the sales order.

- **Seller**: Indicates the name of the commercial agent (seller) who is placing the sale order.

- **Date**: Indicates the date of the sale order.

- **Sub-Total**: Indicates the total amount of the order without taxes.

- **Type**: Indicates the type of document with which the sales order is being generated.

- **Discount**: Indicates the total amount of the discount applied to the order.

- **Item Quantity**: Indicates the total quantity of items that the sales order has.

- **Tax**: Indicates the total amount of tax applied to the order.

- **Number of Lines**: Indicates the total number of product lines that the sales order has.

- **Total**: Indicates the total amount of the order with discount and taxes.

<img :src="$withBase('/images/forms/point-of-sales/sales-order-information.png')" alt="Sales Order Information" width="800px">

## Point of Sale Options

To position yourself in any product line of the order you are placing, you can click on it or select the "**Positioning**" icons located at the bottom left of the "**Point of Sale**" form. . Where the first icon allows positioning in the "**Previous Record**", and the second icon allows positioning in the "**Next Record**".

<img :src="$withBase('/images/forms/point-of-sales/position-yourself-on-the-order-lines.gif')" />

In the same way, you can delete the product record where it is located, by selecting the "**Delete**" icon located at the bottom left of the "**Point of Sale**" form.

<img :src="$withBase('/images/forms/point-of-sales/remove-the-order-line.gif')" />

Select the icon "**Charge**", to collect the sales order that you are carrying out.

<img :src="$withBase('/images/forms/point-of-sales/collect-the-order.gif')" />

To change the POS terminal in the point of sale form, select the option "**Point of Sale**" located at the bottom left of the form. Then, select the POS terminal with which you need to carry out the sales operations.

<img :src="$withBase('/images/forms/point-of-sales/change-point-of-sale-terminal.gif')" />

---

## Cash Session — Opening the Register

Before processing any orders, the cashier must open the cash session for the day.

1. Select the POS terminal.
2. A dialog prompts for the **opening cash amount** (the float placed in the drawer).
3. Enter the amount and confirm. The session is now open.

This triggers the `cashOpening` API call, which registers the opening balance
as the first movement in the cash summary for the session.

::: tip
If the register was not properly closed at the end of the previous shift, the system
may prevent a new opening. Use the cash summary view to verify the previous session
status before opening a new one.
:::

---

## Cash Session — Closing the Register

At the end of a shift, the cashier closes the cash session:

1. Open the **Cash Closing** dialog from the POS toolbar.
2. The dialog shows a summary of all cash movements for the session:
   - Opening balance
   - Cash received from sales
   - Cash withdrawals
   - Closing balance (calculated)
3. Enter the **physical cash count** and optionally a description.
4. Confirm. The session is closed and no further orders can be processed on this terminal
   until a new session is opened.

This triggers the `cashClosing` API call:

```
PUT /api/point-of-sales/cash/closings/{id}/process
```

::: tip
A past bug caused this call to send the literal text `{id}` in the URL instead of the
actual session ID, resulting in a 404 error. It has been fixed.
See [POS Debugging Cases — Case 1](../debugging/pos-debugging-cases.md) for the full analysis.
:::

---

## Payment Collection in Detail

When the cashier clicks **Charge**, the payment collection dialog opens.

### Payment types (tender types)

The dialog lists all payment methods configured for the POS terminal
(fetched via `listTenderTypes`). Common types:

| Type     | Description          |
| -------- | -------------------- |
| Cash     | Physical currency    |
| Card     | Credit or debit card |
| Transfer | Bank transfer        |
| Check    | Cheque payment       |

The cashier selects a payment type, enters the amount received, and confirms.
Multiple partial payments are supported — the dialog remains open until the
full order total is covered.

### Exact payment

When the amount entered equals the order total, the order is completed immediately.

### Overpayment (change)

When the amount entered exceeds the order total, the system calculates the change:

```
Change = Amount received − Order total
```

An **overpayment dialog** appears, asking the cashier to select how the change
will be returned to the customer (cash, bank transfer, etc.).

The system creates two payment records:

1. A receipt payment for the full amount received.
2. A disbursement payment for the change amount, using the document type
   configured as `POSWithdrawalDocumentType_ID` on the POS terminal.

::: tip
An earlier version created the change payment with the wrong document type
(receipt instead of withdrawal). It has been fixed in the gRPC server.
See [POS Debugging Cases — Case 3](../debugging/pos-debugging-cases.md) for the full analysis.
:::

---

## Unit of Measure (UOM) on Order Lines

The UOM field on each order line shows the unit in which the product is being sold
(e.g. each, box, kg).

**Current behaviour:** the UOM field is read-only in the Vue UI. It displays the
product's default sales UOM and cannot be changed from within the POS form.

**Expected behaviour (not yet implemented):** when a product has UOM conversions
defined in ADempiere (`C_UOM_Conversion`), a dropdown should appear allowing the
cashier to choose the selling unit. The price would be recalculated automatically
based on the selected UOM.

This feature requires coordinated changes in the gRPC server (to return available
UOMs per product) and in the Vue frontend (to render the dropdown and call
`updateOrderLine` with the selected `uomId`).

See [POS Debugging Cases — Case 4](../debugging/pos-debugging-cases.md)
for the full implementation plan.

---

## Known cases — see debugging guide

| Symptom                                | Status              | Case study                                    |
| -------------------------------------- | ------------------- | --------------------------------------------- |
| 404 on cash closing                    | Resolved            | [Case 1](../debugging/pos-debugging-cases.md) |
| Overpayment dialog: OK button disabled | Resolved            | [Case 2](../debugging/pos-debugging-cases.md) |
| Refund payment has wrong document type | Resolved            | [Case 3](../debugging/pos-debugging-cases.md) |
| UOM field is not editable              | Not yet implemented | [Case 4](../debugging/pos-debugging-cases.md) |
