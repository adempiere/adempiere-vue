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

import { isEmptyValue } from '../valueUtils'
import { camelizeObjectKeys } from '../transformObject'

export function convertContextInfo(contextInfo) {
  if (!contextInfo) {
    return {
      messageText: {}
    }
  }
  camelizeObjectKeys(contextInfo)
  contextInfo.messageText = convertMessageText(contextInfo.messageText)
  return contextInfo
}

export function convertMessageText(messageTextToConvert) {
  if (!messageTextToConvert) {
    return {}
  }
  camelizeObjectKeys(messageTextToConvert)
  return messageTextToConvert
}

export function convertOrganization(organization) {
  const { id, uuid, name, description } = organization

  return {
    id,
    uuid,
    name,
    description,
    isReadOnly: organization.is_read_only,
    duns: organization.duns,
    taxId: organization.tax_id,
    phone: organization.phone,
    phone2: organization.phone2,
    fax: organization.fax,
    corporateBrandingImage: organization.corporate_branding_image
  }
}

export function convertLanguage(languageToConvert) {
  return {
    language: languageToConvert.language,
    languageName: languageToConvert.language_name,
    languageISO: languageToConvert.language_iso,
    countryCode: languageToConvert.country_code,
    isBaseLanguage: languageToConvert.is_base_language,
    isSystemLanguage: languageToConvert.is_system_language,
    isDecimalPoint: languageToConvert.is_decimal_point,
    datePattern: languageToConvert.date_pattern,
    timePattern: languageToConvert.time_pattern
  }
}

export function convertCountry(countryToConvert) {
  const { id, uuid, name, description } = countryToConvert

  return {
    id,
    uuid,
    countryCode: countryToConvert.country_code,
    name,
    description,
    hasRegion: countryToConvert.has_region,
    regionName: countryToConvert.region_name,
    displaySequence: countryToConvert.display_sequence,
    isAddressLinesReverse: countryToConvert.is_address_lines_reverse,
    captureSequence: countryToConvert.capture_sequence,
    displaySequenceLocal: countryToConvert.display_sequence_local,
    isAddressLinesLocalReverse: countryToConvert.is_address_lines_local_reverse,
    expressionPostal: countryToConvert.expression_postal,
    hasPostalAdd: countryToConvert.has_postal_add,
    expressionPhone: countryToConvert.expression_phone,
    mediaSize: countryToConvert.media_size,
    expressionBankRoutingNo: countryToConvert.expression_bank_routing_no,
    expressionBankAccountNo: countryToConvert.expression_bank_account_no,
    language: countryToConvert.language,
    allowCitiesOutOfList: countryToConvert.allow_cities_out_of_list,
    isPostcodeLookup: countryToConvert.is_post_code_lookup,
    currency: convertCurrency(
      countryToConvert.currency
    )
  }
}

export function convertCurrency(currencyToConvert) {
  if (isEmptyValue(currencyToConvert)) {
    return {
      id: 0,
      uuid: '',
      iSOCode: '',
      curSymbol: '',
      description: '',
      standardPrecision: 0,
      costingPrecision: 0
    }
  }
  return {
    id: currencyToConvert.id,
    uuid: currencyToConvert.uuid,
    iSOCode: currencyToConvert.iso_code,
    curSymbol: currencyToConvert.currency_symbol,
    description: currencyToConvert.description,
    standardPrecision: currencyToConvert.standard_precision,
    costingPrecision: currencyToConvert.costing_precision
  }
}

export function convertBusinessPartner(businessPartnerToConvert) {
  const { id, uuid, name, description } = businessPartnerToConvert

  return {
    uuid,
    id,
    value: businessPartnerToConvert.value,
    taxId: businessPartnerToConvert.tax_id,
    duns: businessPartnerToConvert.duns,
    naics: businessPartnerToConvert.naics,
    name,
    lastName: businessPartnerToConvert.last_name,
    description
  }
}

export function convertConversionRate(conversionRateToConvert) {
  const { id, uuid } = conversionRateToConvert
  if (isEmptyValue(conversionRateToConvert.currency_from) && isEmptyValue(conversionRateToConvert.currency_from)) {
    return {
      uuid,
      id,
      multiplyRate: conversionRateToConvert.multiply_rate,
      divideRate: conversionRateToConvert.divide_rate
    }
  }
  return {
    uuid,
    id,
    conversionTypeUuid: conversionRateToConvert.conversion_type_uuid,
    validFrom: conversionRateToConvert.valid_from,
    currencyFrom: convertCurrency(
      conversionRateToConvert.currency_from
    ),
    currencyTo: convertCurrency(
      conversionRateToConvert.currency_to
    ),
    multiplyRate: conversionRateToConvert.multiply_rate,
    divideRate: conversionRateToConvert.divide_rate
  }
}

export function convertSalesRepresentative(salesRepresentativeToConvert) {
  const { uuid, id, name, description } = salesRepresentativeToConvert

  return {
    uuid,
    id,
    name,
    description
  }
}

export function convertBankAccount(bankAccountToConvert) {
  if (!bankAccountToConvert) {
    return undefined
  }

  const { uuid, id, name, description } = bankAccountToConvert
  return {
    uuid,
    id,
    name,
    accountNo: bankAccountToConvert.account_no,
    description,
    currency: convertCurrency(
      bankAccountToConvert.currency
    ),
    bban: bankAccountToConvert.bban,
    iban: bankAccountToConvert.iban,
    creditLimit: bankAccountToConvert.credit_limit,
    current_balance: bankAccountToConvert.current_balance,
    isDefault: bankAccountToConvert.is_default,
    businessPartner: convertBusinessPartner(
      bankAccountToConvert.business_partner
    ),
    bankAccountType: bankAccountToConvert.bank_account_type,
    bankAccountTypeName: bankAccountToConvert.bank_account_type_name
  }
}

export function convertDocumentType(documentTypeToConvert) {
  if (!documentTypeToConvert) {
    return undefined
  }
  const { uuid, id, name, description } = documentTypeToConvert

  return {
    uuid,
    id,
    name,
    description,
    printName: documentTypeToConvert.print_name
  }
}

export function convertDocumentStatus(documentStatusToConvert) {
  const { name, description } = documentStatusToConvert

  return {
    name,
    description,
    value: documentStatusToConvert.value
  }
}

export function convertPriceList(priceListToConvert) {
  const { uuid, id, name, description } = priceListToConvert

  return {
    uuid,
    id,
    name,
    description,
    currency: convertCurrency(
      priceListToConvert.currency
    ),
    isDefault: priceListToConvert.is_default,
    isTaxIncluded: priceListToConvert.is_tax_included,
    isEnforcePriceLimit: priceListToConvert.is_enforce_price_limit,
    isNetPrice: priceListToConvert.is_net_price,
    pricePrecision: priceListToConvert.price_precision
  }
}

export function convertProductPrice(productPriceToConvert) {
  return {
    currency: convertCurrency(
      productPriceToConvert.currency
    ),
    taxRate: convertTaxRate(
      productPriceToConvert.tax_rate
    ),
    product: convertProduct(
      productPriceToConvert.product
    ),
    schemaCurrency: convertCurrency(
      productPriceToConvert.schema_currency
    ),
    schemaPriceLimit: productPriceToConvert.schema_price_limit,
    schemaPriceList: productPriceToConvert.schema_price_list,
    schemaPriceStandard: productPriceToConvert.schema_price_standard,
    priceList: productPriceToConvert.price_list,
    priceStandard: productPriceToConvert.price_standard,
    priceLimit: productPriceToConvert.price_limit,
    priceListName: productPriceToConvert.price_list_name,
    isTaxIncluded: productPriceToConvert.is_tax_included,
    valid_from: productPriceToConvert.validFrom,
    pricePrecision: productPriceToConvert.price_precision,
    quantityOnHand: productPriceToConvert.quantity_on_hand,
    quantityReserved: productPriceToConvert.quantity_reserved,
    quantityOrdered: productPriceToConvert.quantity_ordered,
    quantityAvailable: productPriceToConvert.quantity_available
  }
}

export function convertTaxRate(taxRateToConvert) {
  return {
    name: taxRateToConvert.name,
    description: taxRateToConvert.description,
    taxIndicator: taxRateToConvert.tax_indicator,
    rate: taxRateToConvert.rate
  }
}

export function convertProduct(productToConvert) {
  const { uuid, id, name, description, help } = productToConvert

  return {
    uuid,
    id,
    value: productToConvert.value,
    name,
    help,
    documentNote: productToConvert.document_note,
    uomName: productToConvert.uom_name,
    productType: productToConvert.product_type,
    isStocked: productToConvert.is_stocked,
    isDropShip: productToConvert.is_drop_ship,
    isPurchased: productToConvert.is_purchased,
    isSold: productToConvert.is_sold,
    imageUrl: productToConvert.image_url,
    productCategoryName: productToConvert.product_category_name,
    productGroupName: productToConvert.product_group_name,
    productClassName: productToConvert.product_class_name,
    productClassification_name: productToConvert.product_classification_name,
    weight: productToConvert.weight,
    volume: productToConvert.volume,
    upc: productToConvert.upc,
    sku: productToConvert.sku,
    shelfWidth: productToConvert.shelf_width,
    shelfHeight: productToConvert.shelf_height,
    shelfDepth: productToConvert.shelf_depth,
    unitsPerPack: productToConvert.units_per_pack,
    unitsPerPallet: productToConvert.units_per_pallet,
    guaranteeDays: productToConvert.guarantee_days,
    descriptionUrl: productToConvert.description_url,
    versionNo: productToConvert.version_no,
    taxCategory: productToConvert.tax_category,
    description
  }
}
