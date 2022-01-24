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

// A util class for handle format for time, date and others values to beused to display information
// Note that this file use moment library for a easy conversion
import moment from 'moment'
import store from '@/store'

// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { getDateFormat } from '@/utils/ADempiere/formatValue/dateFormat.js'
import { DATE, DATE_PLUS_TIME, TIME, AMOUNT, COSTS_PLUS_PRICES, NUMBER, QUANTITY } from '@/utils/ADempiere/references.js'

/**
 * Convert a object to array pairs
 * @param {object} object, object to convert
 * @param {string} nameKey, name from key in pairs
 * @param {string} nameValue, name from value in pairs
 * @returns {array} [ { nameKey: key, nameValue: value } ]
 */
export function convertObjectToKeyValue({
  object,
  keyName = 'columnName',
  valueName = 'value'
}) {
  return Object.keys(object).map(key => {
    const returnPairs = {}
    returnPairs[keyName] = key
    returnPairs[valueName] = object[key]
    return returnPairs
  })
}

/**
 * Convert array pairs of object to literal object { key: value }
 * @param {array} array, Array to convert
 * @param {string} keyName, name from key in pairs
 * @param {string} valueName, name from value in pairs
 * @returns {object} { key: value, key2: value2 }
 */
export function convertArrayKeyValueToObject({
  array,
  keyName = 'columnName',
  valueName = 'value'
}) {
  const result = {}
  array.forEach(element => {
    result[element[keyName]] = element[valueName]
  })

  return result
}

/**
 * Convert map of pairs to literal object
 * @param {object} object
 * @returns {map}
 */
export function convertObjectToHasMap({ object }) {
  return new Map(
    Object.entries(object)
  )
}

/**
 * Convert map of pairs to literal object
 * @param {map} hasMapToConvert
 * @returns {object} { key: value, key2: value2 }
 */
export function convertHasMapToObject({ map }) {
  return Object.fromEntries(map)
  // const result = {}
  // map.forEach((value, key) => {
  //   result[key] = value
  // })
  // return result
}

// TODO: Duplicated exported method, removed this
export { formatDate } from '@/utils/ADempiere/formatValue/dateFormat'

//  Get Formatted Price
export function formatPrice(number, currency) {
  if (isEmptyValue(number)) {
    return undefined
  }
  if (isEmptyValue(currency)) {
    currency = getCurrency()
  }
  //  Get formatted number
  return new Intl.NumberFormat(getCountryCode(), {
    style: 'currency',
    currency
  }).format(number)
}

//  Format Quantity
export function formatQuantity(number) {
  if (isEmptyValue(number)) {
    return undefined
  }
  if (!Number.isInteger(number)) {
    return number
  }
  return Number.parseFloat(number).toFixed(2)
  //  Get formatted number
}

// TODO: Duplicated exported method, removed this
// Format percentage based on Intl library
export { formatPercent } from '@/utils/ADempiere/formatValue/numberFormat.js'

//  Get country code from store
function getCountryCode() {
  const languageDefinition = store.getters.getCurrentLanguageDefinition
  return languageDefinition.languageISO + '-' + languageDefinition.countryCode
}

// Get Default country
function getCurrency() {
  const currencyDefinition = store.getters.getCurrency
  return currencyDefinition.iSOCode
}

// Return a format for field depending of reference for him
export function formatField(value, reference, optionalFormat) {
  if (isEmptyValue(value)) {
    return undefined
  }
  if (!reference) {
    return value
  }
  //  Format
  let formattedValue
  switch (reference) {
    case DATE.id:
      formattedValue = moment.utc(value).format(getDateFormat({
        format: optionalFormat
      }))
      break
    case DATE_PLUS_TIME.id:
      formattedValue = moment.utc(value).format(getDateFormat({
        isTime: true
      }))
      break
    case TIME.id:
      formattedValue = moment.utc(value).format(getDateFormat({
        isTime: true
      }))
      break
    case AMOUNT.id:
      formattedValue = formatPrice(value)
      break
    case COSTS_PLUS_PRICES.id:
      formattedValue = formatPrice(value)
      break
    case NUMBER.id:
      formattedValue = formatQuantity(value)
      break
    case QUANTITY.id:
      formattedValue = formatQuantity(value)
      break
    default:
      formattedValue = value
  }
  return formattedValue
}

/**
 * Removes the % of a text string, only from the beginning and end if they exist,
 * this in case you need to use a match or local search to find matches between
 * text strings.
 * @param {string} stringToParsed ej: '%qwerty asd%' | '%zxc 123'
 * @returns {string} ej: 'qwerty asd' | 'zxc 123'
 */
export function trimPercentage(stringToParsed) {
  if (!isEmptyValue(stringToParsed) && String(stringToParsed).includes('%')) {
    let parsedValue = stringToParsed
    if (parsedValue[0] === '%') {
      parsedValue = parsedValue.slice(1)
    }

    const wordSize = parsedValue.length - 1
    if (parsedValue[wordSize] === '%') {
      parsedValue = parsedValue.slice(0, wordSize)
    }
    return parsedValue
  }
  return stringToParsed
}
export function formatDateToSend(date) {
  if (isEmptyValue(date)) {
    return undefined
  }
  return date.slice(0, 10)
}
