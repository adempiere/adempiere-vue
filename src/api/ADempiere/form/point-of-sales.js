// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

// Get Instance for connection
import { request } from '@/utils/ADempiere/request'
import { config } from '@/utils/ADempiere/config'
import { isEmptyValue } from '@/utils/ADempiere'
import { camelizeObjectKeys } from '@/utils/ADempiere/transformObject.js'

/**
 * method in api/price-checking.js as getProductPrice
 * @author elsiosanchez <elsiosanches@gmail.com>
 */
export { getProductPrice as findProduct } from '@/api/ADempiere/form/price-checking.js'
export { requestGetConversionRate } from '@/api/ADempiere/system-core.js'

// List Point of sales
export function getPointOfSales({
  posUuid
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/point-of-sales`,
    method: 'get',
    params: {
      pos_uuid: posUuid
    }
  })
    .then(posResponse => {
      const { convertPointOfSales } = require('@/utils/ADempiere/apiConverts/pos.js')

      return convertPointOfSales(posResponse)
    })
}

// List Point of sales
export function listPointOfSales({
  userUuid,
  pageSize,
  pageToken
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/selling-points`,
    method: 'get',
    params: {
      user_uuid: userUuid,
      page_size: pageSize,
      page_token: pageToken
    }
  })
    .then(posListResponse => {
      const { convertPointOfSales } = require('@/utils/ADempiere/apiConverts/pos.js')

      return {
        nextPageToken: posListResponse.next_page_token,
        recordCount: posListResponse.record_count,
        sellingPointsList: posListResponse.records.map(pos => {
          return convertPointOfSales(pos)
        })
      }
    })
}

// Create order from POS
export function createOrder({
  posUuid,
  customerUuid,
  documentTypeUuid,
  salesRepresentativeUuid,
  priceListUuid,
  warehouseUuid,
  campaignUuid
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/create-order`,
    method: 'post',
    data: {
      pos_uuid: posUuid,
      customer_uuid: customerUuid,
      document_type_uuid: documentTypeUuid,
      sales_representative_uuid: salesRepresentativeUuid,
      price_list_uuid: priceListUuid,
      warehouse_uuid: warehouseUuid,
      campaign_uuid: campaignUuid
    }
  })
    .then(createOrderResponse => {
      const { convertOrder } = require('@/utils/ADempiere/apiConverts/pos.js')

      return convertOrder(createOrderResponse)
    })
}

// Update order from POS
export function updateOrder({
  orderUuid,
  posUuid,
  customerUuid,
  documentTypeUuid,
  description,
  priceListUuid,
  discount,
  discountAmount,
  discountRateOff,
  warehouseUuid,
  campaignUuid
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/update-order`,
    method: 'post',
    data: {
      order_uuid: orderUuid,
      pos_uuid: posUuid,
      customer_uuid: customerUuid,
      document_type_uuid: documentTypeUuid,
      description,
      price_list_uuid: priceListUuid,
      warehouse_uuid: warehouseUuid,
      discount_rate: discount,
      discount_amount_off: discountAmount,
      campaign_uuid: campaignUuid,
      discount_rate_off: discountRateOff
    }
  })
    .then(updateOrderResponse => {
      const { convertOrder } = require('@/utils/ADempiere/apiConverts/pos.js')

      return convertOrder(updateOrderResponse)
    })
}
// Create Customer
export function createCustomer({
  value,
  taxId,
  duns,
  naics,
  name,
  lastName,
  description,
  addresses,
  phone,
  additionalAttributes,
  posUuid
}) {
  return request({
    url: 'form/addons/point-of-sales/create-customer',
    method: 'post',
    data: {
      value,
      tax_id: taxId,
      name,
      last_name: lastName,
      description,
      phone,
      addresses,
      additional_attributes: additionalAttributes,
      pos_uuid: posUuid
    }
  })
    .then(businessPartnerResponse => {
      const { convertBusinessPartner } = require('@/utils/ADempiere/apiConverts/core.js')

      return convertBusinessPartner(businessPartnerResponse)
    })
}
// Update Customer
export function updateCustomer({
  uuid,
  value,
  taxId,
  duns,
  naics,
  name,
  lastName,
  description,
  additionalAttributes,
  addresses,
  phone,
  posUuid
}) {
  return request({
    url: 'form/addons/point-of-sales/update-customer',
    method: 'post',
    data: {
      uuid,
      value,
      tax_id: taxId,
      name,
      additional_attributes: additionalAttributes,
      last_name: lastName,
      description,
      phone,
      addresses,
      pos_uuid: posUuid
    }
  })
    .then(businessPartnerResponse => {
      const { convertBusinessPartner } = require('@/utils/ADempiere/apiConverts/core.js')

      return convertBusinessPartner(businessPartnerResponse)
    })
}

export function customer({
  searchValue,
  value,
  name,
  contactName,
  eMail,
  phone,
  postalCode
}) {
  return request({
    url: 'form/addons/point-of-sales/customer',
    method: 'get',
    params: {
      search_value: searchValue,
      value,
      name,
      contact_name: contactName,
      e_mail: eMail,
      phone,
      postal_code: postalCode
    }
  })
    .then(businessPartnerResponse => {
      const { convertBusinessPartner } = require('@/utils/ADempiere/apiConverts/core.js')

      return convertBusinessPartner(businessPartnerResponse)
    })
}

// Get order from uuid
export function getOrder(orderUuid) {
  return request({
    url: `${config.pointOfSales.endpoint}/order`,
    method: 'get',
    params: {
      order_uuid: orderUuid
    }
  })
    .then(getOrderResponse => {
      const { convertOrder } = require('@/utils/ADempiere/apiConverts/pos.js')

      return convertOrder(getOrderResponse)
    })
}

// Create order from POS
export function deleteOrder({
  orderUuid
  // posUuid,
  // customerUuid,
  // documentTypeUuid,
  // salesRepresentativeUuid
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/delete-order`,
    method: 'post',
    data: {
      order_uuid: orderUuid
      // pos_uuid: posUuid,
      // customer_uuid: customerUuid,
      // document_type_uuid: documentTypeUuid,
      // sales_representative_uuid: salesRepresentativeUuid
    }
  })
    .then(response => {
      return response
    })
}

// List orders from pos uuid
export function listOrders({
  posUuid,
  documentNo,
  businessPartnerUuid,
  grandTotal,
  openAmount,
  isWaitingForPay,
  isOnlyProcessed,
  isOnlyAisleSeller,
  isWaitingForInvoice,
  isWaitingForShipment,
  dateOrderedFrom,
  dateOrderedTo,
  salesRepresentativeUuid,
  pageSize,
  pageToken
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/orders`,
    method: 'get',
    params: {
      pos_uuid: posUuid,
      document_no: documentNo,
      business_partner_uuid: businessPartnerUuid,
      sales_representative_uuid: salesRepresentativeUuid,
      grand_total: grandTotal,
      open_amount: openAmount,
      is_waiting_for_pay: isWaitingForPay,
      is_only_processed: isOnlyProcessed,
      is_only_aisle_seller: isOnlyAisleSeller,
      is_waiting_for_invoice: isWaitingForInvoice,
      is_waiting_for_shipment: isWaitingForShipment,
      date_ordered_from: dateOrderedFrom,
      date_ordered_to: dateOrderedTo,
      page_size: pageSize,
      page_token: pageToken
    }
  })
    .then(ordersListResponse => {
      const { convertOrder } = require('@/utils/ADempiere/apiConverts/pos.js')

      return {
        nextPageToken: ordersListResponse.next_page_token,
        recordCount: ordersListResponse.record_count,
        ordersList: ordersListResponse.records.map(productPrice => {
          return convertOrder(productPrice)
        })
      }
    })
}

// Create order line from order uuid and product
export function createOrderLine({
  orderUuid,
  priceListUuid,
  warehouseUuid,
  productUuid,
  chargeUuid,
  description,
  quantity,
  price,
  discountRate
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/create-order-line`,
    method: 'post',
    data: {
      order_uuid: orderUuid,
      product_uuid: productUuid,
      description,
      quantity,
      price,
      discount_rate: discountRate,
      charge_uuid: chargeUuid,
      price_list_uuid: priceListUuid,
      warehouse_uuid: warehouseUuid
    }
  })
    .then(createOrderLineResponse => {
      const { convertOrderLine } = require('@/utils/ADempiere/apiConverts/pos.js')

      return convertOrderLine(createOrderLineResponse)
    })
}

// updateOrderLine orders from pos uuid
export function updateOrderLine({
  orderLineUuid,
  description,
  quantity,
  price,
  discountRate,
  priceListUuid,
  warehouseUuid
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/update-order-line`,
    method: 'post',
    data: {
      // is_add_quantity: true,
      order_line_uuid: orderLineUuid,
      description,
      quantity,
      price,
      discount_rate: discountRate,
      price_list_uuid: priceListUuid,
      warehouse_uuid: warehouseUuid
    }
  })
    .then(createOrderLineResponse => {
      const { convertOrderLine } = require('@/utils/ADempiere/apiConverts/pos.js')

      return convertOrderLine(createOrderLineResponse)
    })
}

// delete Order Line
export function deleteOrderLine({
  orderLineUuid
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/delete-order-line`,
    method: 'post',
    data: {
      order_line_uuid: orderLineUuid
    }
  })
    .then(response => {
      return response
    })
}

export function listOrderLines({
  orderUuid,
  pageSize,
  pageToken
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/order-lines`,
    method: 'get',
    params: {
      order_uuid: orderUuid,
      page_size: pageSize,
      page_token: pageToken
    }
  })
    .then(ordersLineListResponse => {
      const { convertOrderLine } = require('@/utils/ADempiere/apiConverts/pos.js')

      return {
        nextPageToken: ordersLineListResponse.next_page_token,
        recordCount: ordersLineListResponse.record_count,
        orderLineList: ordersLineListResponse.records.map(productPrice => {
          return convertOrderLine(productPrice)
        })
      }
    })
}

export function getKeyLayout({ keyLayoutUuid }) {
  return request({
    url: `${config.pointOfSales.endpoint}/key-layout`,
    method: 'get',
    params: {
      key_layout_uuid: keyLayoutUuid
    }
  })
    .then(keyLayoutResponse => {
      const { convertKeyLayout } = require('@/utils/ADempiere/apiConverts/pos.js')

      return convertKeyLayout(keyLayoutResponse)
    })
}

// ListProductPrice
export function getProductPriceList({
  searchValue,
  businessPartnerUuid,
  posUuid,
  pageSize,
  priceListUuid,
  warehouseUuid,
  pageToken
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/product-prices`,
    method: 'get',
    params: {
      pos_uuid: posUuid,
      search_value: searchValue,
      business_partner_uuid: businessPartnerUuid,
      price_list_uuid: priceListUuid,
      warehouse_uuid: warehouseUuid,
      page_size: pageSize,
      page_token: pageToken
    }
  })
    .then(productPriceListResponse => {
      const { convertProductPrice } = require('@/utils/ADempiere/apiConverts/core.js')

      return {
        nextPageToken: productPriceListResponse.next_page_token,
        recordCount: productPriceListResponse.record_count,
        productPricesList: productPriceListResponse.records.map(productPrice => {
          return convertProductPrice(productPrice)
        })
      }
    })
}

export function printTicket({
  posUuid,
  orderUuid
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/print-ticket`,
    method: 'post',
    data: {
      pos_uuid: posUuid,
      order_uuid: orderUuid
    }
  })
    .then(printTicketResponse => {
      return printTicketResponse
    })
}

export function generateImmediateInvoice({
  posId,
  posUuid
}) {
  console.info(`Generate imediate invoice with POS id ${posId}, and uuid ${posUuid}`)
}

export function completeOrder({
  orderUuid
}) {
  console.info(`Complete prepared order ${orderUuid}`)
}

export function reverseSalesTransaction({
  orderUuid
}) {
  console.info(`Reverse sales transaction ${orderUuid}`)
}

export function withdrawal({
  posId,
  posUuid
}) {
  console.info(`Withdrall cash with POS id ${posId}, and uuid ${posUuid}`)
}

export function createNewReturnOrder({
  orderUuid
}) {
  console.info(`New Customer Return Order ${orderUuid}`)
}

// Create Payment

export function createPayment({
  posUuid,
  orderUuid,
  invoiceUuid,
  bankUuid,
  referenceNo,
  description,
  amount,
  paymentDate,
  tenderTypeCode,
  paymentMethodUuid,
  chargeUuid,
  isRefund,
  currencyUuid
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/create-payment`,
    method: 'post',
    data: {
      pos_uuid: posUuid,
      order_uuid: orderUuid,
      invoice_uuid: invoiceUuid,
      bank_uuid: bankUuid,
      reference_no: referenceNo,
      description: description,
      amount: amount,
      charge_uuid: chargeUuid,
      payment_date: paymentDate,
      tender_type_code: tenderTypeCode,
      payment_method_uuid: paymentMethodUuid,
      is_refund: isRefund,
      currency_uuid: currencyUuid
    }
  })
    .then(createPaymentResponse => {
      return camelizeObjectKeys(createPaymentResponse)
    })
}

// Update Payment

export function updatePayment({
  paymentUuid,
  bankUuid,
  referenceNo,
  description,
  amount,
  paymentDate,
  tenderTypeCode
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/update-payment`,
    method: 'post',
    data: {
      payment_uuid: paymentUuid,
      bank_uuid: bankUuid,
      reference_no: referenceNo,
      description: description,
      amount: amount,
      payment_date: paymentDate,
      tender_type_code: tenderTypeCode
    }
  })
    .then(updatePaymentResponse => {
      return updatePaymentResponse
    })
}

// Delete Payment

export function deletePayment({
  paymentUuid
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/delete-payment`,
    method: 'post',
    data: {
      payment_uuid: paymentUuid
    }
  })
    .then(deletePaymentResponse => {
      return deletePaymentResponse
    })
}

// List Payments

export function getPaymentsList({
  posUuid,
  orderUuid,
  isOnlyRefund,
  isOnlyReceipt
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/payments`,
    method: 'get',
    params: {
      pos_uuid: posUuid,
      order_uuid: orderUuid,
      is_only_refund: isOnlyRefund,
      is_only_receipt: isOnlyReceipt
    }
  })
    .then(listPaymentsResponse => {
      const { paymentsMethod } = require('@/utils/ADempiere/apiConverts/pos.js')
      return {
        nextPageToken: listPaymentsResponse.next_page_token,
        recordCount: listPaymentsResponse.record_count,
        listPayments: listPaymentsResponse.records.map(payments => {
          return paymentsMethod(payments)
        })
      }
    })
}

/**
 * Process Order
 * This request allows process a draft order with payments
 *
 * req.query.token - user token
 * Body:
 *.pos_uuid - POS UUID reference
 *.order_uuid - Order UUID reference
 *.create_payments - Optional create payments (if is true then hope payments array)
 *.payments
 * [
 * invoice_uuid - Invoice UUID reference
 * bank_uuid - Bank UUID reference
 * reference_no - Reference no
 * description - Description for Payment
 * amount - Payment Amount
 * tender_type_code - Tender Type
 * payment_date - Payment Date (default now)
 * currency_uuid - Currency UUID reference
 * ]
 */
export function processOrder({
  posUuid,
  orderUuid,
  createPayments,
  payments
}) {
  if (!isEmptyValue(payments)) {
    payments = payments.map(parameter => {
      return {
        invoice_uuid: parameter.invoiceUuid,
        bank_uuid: parameter.bankUuid,
        reference_no: parameter.referenceNo,
        description: parameter.description,
        amount: parameter.amount,
        tender_type_code: parameter.tenderTypeCode,
        payment_ate: parameter.paymentDate,
        currency_uid: parameter.currencyUuid
      }
    })
  }
  return request({
    url: `${config.pointOfSales.endpoint}/process-order`,
    method: 'post',
    data: {
      pos_uuid: posUuid,
      order_uuid: orderUuid,
      create_payments: createPayments,
      payments: payments
    }
  })
    .then(processOrderResponse => {
      return processOrderResponse
    })
}

/**
 * Overdrawn Invoice
 * This request allows you to process an order if the payment is more or less than the invoice.
 *
 * req.query.token - user token
 * Body:
 *.pos_uuid - POS UUID reference
 *.order_uuid - Order UUID reference
 *.create_payments - Optional create payments (if is true then hope payments array)
 *.payments
 * [
 * invoice_uuid - Invoice UUID reference
 * bank_uuid - Bank UUID reference
 * reference_no - Reference no
 * description - Description for Payment
 * amount - Payment Amount
 * tender_type_code - Tender Type
 * payment_date - Payment Date (default now)
 * currency_uuid - Currency UUID reference
 * ]
 *.customer_details [
 * key - columnName
 * value - value
 * ] - customer data in case of refund or voucher card
 *.option - reimbursement rate
 */

export function overdrawnInvoice({
  posUuid,
  orderUuid,
  createPayments,
  payments,
  customerDetails,
  option
}) {
  if (!isEmptyValue(payments)) {
    payments = payments.map(parameter => {
      return {
        invoice_uuid: parameter.invoiceUuid,
        bank_uuid: parameter.bankUuid,
        reference_no: parameter.referenceNo,
        description: parameter.description,
        amount: parameter.amount,
        tender_type_code: parameter.tenderTypeCode,
        payment_date: parameter.paymentDate,
        currency_uuid: parameter.currencyUuid
      }
    })
  }
  return request({
    url: '/form/addons/point-of-sales/overdrawn-invoice',
    method: 'post',
    data: {
      pos_uuid: posUuid,
      order_uuid: orderUuid,
      create_payments: createPayments,
      payments: payments,
      customer_details: customerDetails,
      option: option
    }
  })
    .then(processOrderResponse => {
      return processOrderResponse
    })
}

/**
 * Validate Ping
 * @param {string} posUuidd - POS UUID reference
 * @param {string} pin - User PIN
 * @returns {string}
 */
export function validatePin({
  posUuid,
  pin
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/validate-pin`,
    method: 'post',
    data: {
      pos_uuid: posUuid,
      pin: pin
    }
  })
    .then(pinResponse => {
      return pinResponse
    })
}

/**
 * list Warehouses
 * @param {string} posUuidd - POS UUID reference
 */
export function listWarehouses({
  posUuid
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/available-warehouses`,
    method: 'get',
    params: {
      pos_uuid: posUuid
    }
  })
    .then(listWarehouseResponse => {
      return listWarehouseResponse
    })
}

/**
 * list Document Types
 * @param {string} posUuidd - POS UUID reference
 */
export function listDocumentTypes({
  posUuid
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/available-document-types`,
    method: 'get',
    params: {
      pos_uuid: posUuid
    }
  })
    .then(response => {
      return response
    })
}

/**
 * List Prices
 * @param {string} posUuidd - POS UUID reference
 */
export function listPrices({
  posUuid
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/available-price-list`,
    method: 'get',
    params: {
      pos_uuid: posUuid
    }
  })
    .then(listPricesResponse => {
      return listPricesResponse
    })
}

/**
 * Currencies
 * @param {string} posUuidd - POS UUID reference
 */
export function listCurrencies({
  posUuid
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/available-currencies`,
    method: 'get',
    params: {
      pos_uuid: posUuid
    }
  })
    .then(listCurrencies => {
      return listCurrencies
    })
}

/**
 * Tender Type
 * @param {string} posUuidd - POS UUID reference
 */
export function listTenderTypes({
  posUuid
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/available-payment-methods`,
    method: 'get',
    params: {
      pos_uuid: posUuid
    }
  })
    .then(listTenderType => {
      return listTenderType
    })
}

/**
 * Create Customer Account
 * @param {string} posUuidd - POS UUID reference
 */
export function createCustomerAccount({
  posUuid,
  orderUuid,
  customerAccount,
  tenderTypeCode,
  currencyUuid
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/available-payment-methods`,
    method: 'post',
    data: {
      pos_uuid: posUuid,
      order_uuid: orderUuid,
      customer_account: customerAccount,
      tender_type_code: tenderTypeCode,
      currency_uuid: currencyUuid
    }
  })
    .then(responseCustomerAccount => {
      return responseCustomerAccount
    })
}
/**
 * Refund payment at a later time
 * customer_uuid - Customer UUID
 * pos_uuid - Value
 * city - City
 * country - Country
 * email - EMail
 * driver_license - Driver Licence
 * social_security_number - Social Security Number (SSN)
 * name - Name
 * state - State
 * street - Strert
 * zip - ZIP
 * bank_account_type - Bank Accoubnt Type
 * bank_uuid - Bank UUID
 * is_ach - ACH
 * address_verified - Address Verified
 * zip_verified - ZIP Verified
 * routing_no - Routing No
 * iban - IBAN
 */
export function createCustomerBankAccount({
  posUuid,
  customerUuid,
  city,
  country,
  email,
  driverLicense,
  socialSecurityNumber,
  name,
  state,
  street,
  zip,
  bankAccountType,
  bankUuid,
  isAch,
  addressVerified,
  zipVerified,
  AccountNo,
  routingNo,
  iban
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/create-customer-bank-account`,
    method: 'post',
    data: {
      pos_uuid: posUuid,
      customer_uuid: customerUuid,
      city,
      country,
      email,
      driver_license: driverLicense,
      social_security_number: socialSecurityNumber,
      name,
      state,
      account_no: AccountNo,
      street,
      zip,
      bank_account_type: bankAccountType,
      bank_uuid: bankUuid,
      is_ach: isAch,
      address_verified: addressVerified,
      zip_verified: zipVerified,
      routing_no: routingNo,
      iban
    }
  })
    .then(responseCreateCustomerBankAccount => {
      return camelizeObjectKeys(responseCreateCustomerBankAccount)
    })
}
export function listCustomerBankAccounts({
  customerUuid,
  pageToken
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/customer-bank-accounts`,
    method: 'get',
    params: {
      customer_uuid: customerUuid,
      page_token: pageToken
    }
  })
    .then(responseListCustomerBankAccounts => {
      return camelizeObjectKeys(responseListCustomerBankAccounts)
    })
}
export function daleteCustomerBankAccounts({
  customerBankAccountUuid
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/delete-bank-account`,
    method: 'post',
    data: {
      customer_bank_account_uuid: customerBankAccountUuid
    }
  })
    .then(responseCreateCustomerBankAccount => {
      return camelizeObjectKeys(responseCreateCustomerBankAccount)
    })
}
/**
 * Create Shipment
 * @param {string} posUuidd - POS UUID reference
 * @param {string} orderUuid - Order UUID reference
 * @param {string} salesRepresentativeUuid - Sales Representative UUID reference
 */
export function createShipment({
  posUuid,
  orderUuid,
  salesRepresentativeUuid
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/create-shipment`,
    method: 'post',
    data: {
      pos_uuid: posUuid,
      order_uuid: orderUuid,
      sales_representative_uuid: salesRepresentativeUuid
    }
  })
    .then(responseShipment => {
      return camelizeObjectKeys(responseShipment)
    })
}
export function RefundReferenceRequest({
  posUuid,
  description,
  amount,
  date,
  tenderTypeCode,
  currencyUuid,
  conversionTypeUuid,
  paymentMethodUuid,
  paymentAccountDate,
  customerBankAccountUuid,
  customerUuid,
  isReceipt,
  sourceAmount,
  orderUuid,
  salesRepresentativeUuid
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/create-payment-reference`,
    method: 'post',
    data: {
      pos_uuid: posUuid,
      description,
      amount,
      is_receipt: isReceipt,
      source_amount: sourceAmount,
      payment_date: date,
      tender_type_code: tenderTypeCode,
      currency_uuid: currencyUuid,
      conversion_type_uuid: conversionTypeUuid,
      payment_method_uuid: paymentMethodUuid,
      payment_account_date: paymentAccountDate,
      customer_bank_account_uuid: customerBankAccountUuid,
      order_uuid: orderUuid,
      customer_uuid: customerUuid,
      sales_representative_uuid: salesRepresentativeUuid
    }
  })
    .then(responseCreateCustomerBankAccount => {
      return camelizeObjectKeys(responseCreateCustomerBankAccount)
    })
}
export function listRefundReference({
  posUuid,
  customerUuid,
  orderUuid
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/payment-references`,
    method: 'get',
    params: {
      pos_uuid: posUuid,
      customer_uuid: customerUuid,
      order_uuid: orderUuid
    }
  })
    .then(responseCreateCustomerBankAccount => {
      return camelizeObjectKeys(responseCreateCustomerBankAccount)
    })
}
export function deleteRefundReference({
  uuid
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/delete-payment-reference`,
    method: 'post',
    data: {
      uuid
    }
  })
    .then(responseShipmentLine => {
      return camelizeObjectKeys(responseShipmentLine)
    })
}

/**
 * Create Shipment Line
 * @param {string} posUuidd - POS UUID reference
 * @param {string} orderUuid - Order UUID reference
 * @param {string} salesRepresentativeUuid - Sales Representative UUID reference
 */
export function createShipmentLine({
  shipmentUuid,
  orderLineUuid
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/create-shipment-line`,
    method: 'post',
    data: {
      shipment_uuid: shipmentUuid,
      order_line_uuid: orderLineUuid
    }
  })
    .then(responseShipmentLine => {
      return camelizeObjectKeys(responseShipmentLine)
    })
}

// Delete Shipment
export function deleteShipment({
  shipmentLineUuid
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/delete-shipment-line`,
    method: 'post',
    data: {
      shipment_line_uuid: shipmentLineUuid
    }
  })
    .then(response => {
      return response
    })
}

// List Shipment
export function shipments({
  shipmentUuid
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/shipment-lines`,
    method: 'get',
    params: {
      shipment_uuid: shipmentUuid
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

/**
 * POST Process Shipment
 *
 * req.query.token - user token
 * Body:
 * req.body.shipment_uuid - POS UUID shipment uuid
 * req.body.description - POS UUID description
 * req.body.document_action - Sales Representative UUID reference
 * Details:
 */

export function processShipment({
  shipmentUuid,
  description
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/process-shipment`,
    method: 'post',
    data: {
      shipment_uuid: shipmentUuid,
      description,
      document_action: 'CO'
    }
  })
    .then(response => {
      return response
    })
}

/**
 * POST Reverse Sales
 *
 * req.query.token - user token
 * Body:
 * req.body.order_uuid - Order UUID
 * req.body.pos_uuid - POS UUID
 * req.body.description - POS UUID description
 * Details:
 */

export function reverseSales({
  posUuid,
  orderUuid,
  description
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/reverse-sales`,
    method: 'post',
    data: {
      pos_uuid: posUuid,
      order_uuid: orderUuid,
      description
    }
  })
    .then(response => {
      return response
    })
}

/**
 * Discount List
 * @param {string} posUuidd - POS UUID reference
 */
export function listDiscount({
  posUuid
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/available-discount`,
    method: 'get',
    params: {
      pos_uuid: posUuid
    }
  })
    .then(listDiscountResponse => {
      return listDiscountResponse
    })
}

/**
 * POST Reverse Sales
 *
 * req.query.token - user token
 * Body:
 * req.body.order_uuid - Order UUID
 * req.body.pos_uuid - POS UUID
 * req.body.description - POS UUID description
 * Details:
 */

export function cashOpening({
  posUuid,
  collectingAgentUuid,
  description,
  payments
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/cash-opening`,
    method: 'post',
    data: {
      pos_uuid: posUuid,
      collecting_agent_uuid: collectingAgentUuid,
      description,
      payments
    }
  })
    .then(response => {
      return response
    })
}

/**
 * POST Reverse Sales
 *
 * req.query.token - user token
 * Body:
 * req.body.order_uuid - Order UUID
 * req.body.pos_uuid - POS UUID
 * req.body.description - POS UUID description
 * Details:
 */

export function cashWithdrawal({
  posUuid,
  collectingAgentUuid,
  description,
  payments
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/cash-withdrawal`,
    method: 'post',
    data: {
      pos_uuid: posUuid,
      collecting_agent_uuid: collectingAgentUuid,
      description,
      payments
    }
  })
    .then(response => {
      return response
    })
}

export function cashSummaryMovements({
  posUuid
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/cash-summary-movements`,
    method: 'get',
    params: {
      pos_uuid: posUuid
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function cashClosing({
  posUuid,
  id,
  uuid
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/cash-closing`,
    method: 'post',
    data: {
      pos_uuid: posUuid,
      id,
      uuid
    }
  })
    .then(response => {
      return response
    })
}
export function allocateSeller({
  posUuid,
  salesRepresentativeUuid
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/allocate-seller`,
    method: 'post',
    data: {
      pos_uuid: posUuid,
      sales_representative_uuid: salesRepresentativeUuid
    }
  })
    .then(response => {
      return response
    })
}
export function deallocate({
  posUuid,
  salesRepresentativeUuid
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/deallocate-seller`,
    method: 'post',
    data: {
      pos_uuid: posUuid,
      sales_representative_uuid: salesRepresentativeUuid
    }
  })
    .then(response => {
      return response
    })
}
export function releaseOrder({
  posUuid,
  salesRepresentativeUuid,
  orderUuid
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/release-order`,
    method: 'post',
    data: {
      pos_uuid: posUuid,
      sales_representative_uuid: salesRepresentativeUuid,
      order_uuid: orderUuid
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function holdOrder({
  posUuid,
  salesRepresentativeUuid,
  orderUuid
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/hold-order`,
    method: 'post',
    data: {
      pos_uuid: posUuid,
      sales_representative_uuid: salesRepresentativeUuid,
      order_uuid: orderUuid
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

/**
 * GET List Available Sellers
 *
 * token - user token
 * page_size - custom page size for batch
 * page_token - specific page token
 * pos_uuid - POS UUID reference
 * is_only_allocated - Only allocated to current point of sales
 */
export function availableSellers({
  posUuid,
  isOnlyAllocated
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/available-sellers`,
    method: 'get',
    params: {
      pos_uuid: posUuid,
      is_only_allocated: isOnlyAllocated
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}
