// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com www.erpya.com
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

import store from '@/store'

import {
  // currencies
  isCurrencyField,
  //
  NUMBER,
  QUANTITY,
  // integers
  isIntegerField
} from '@/utils/ADempiere/references.js'

import { charInText, isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

/**
 * Get Default currency ISO code
 */
export function getCurrency() {
  return store.getters.getCurrencyCode
}

export function getStandardPrecision() {
  return store.getters.getStandardPrecision
}

/**
 * Get country code from store
 */
export function getCountryCode() {
  return store.getters.getCountryLanguage
}

/**
 * Fromat number based on diplay type
 * @param {number} value
 * @param {number} displayType
 * @param {string} currency
 * @param {string} country
 * @returns {string|number}
 */
export function formatNumber({
  value,
  displayType,
  currency,
  country
}) {
  if (isEmptyValue(value)) {
    value = 0
  }

  let formattedNumber
  switch (displayType) {
    case (isCurrencyField(displayType) && displayType):
      formattedNumber = formatPrice({ value, currency, country })
      break

    case NUMBER.id:
    case QUANTITY.id:
      formattedNumber = formatQuantity({ value })
      break

    case (isIntegerField(displayType) && displayType):
    default:
      formattedNumber = formatQuantity({ value, isInteger: true })
      break
  }

  return formattedNumber
}

/**
 * Format Quantity
 * @param {number} value
 * @param {boolean} isInteger
 */
export function formatQuantity({ value, isInteger = false }) {
  if (isEmptyValue(value)) {
    value = 0
  }

  let precision = getStandardPrecision()
  // without decimals
  // if (Number.isInteger(value)) {
  if (isInteger) {
    precision = 0
  }

  // get formatted decimal number
  return new Intl.NumberFormat(undefined, {
    useGrouping: true, // thousands separator
    minimumIntegerDigits: 1,
    minimumFractionDigits: precision,
    maximumFractionDigits: precision
  }).format(value)
}

/**
 * Get Formatted Price
 * @param {number} value
 * @param {string} currency
 * @param {string} country
 */
export function formatPrice({ value, currency, country = '' }) {
  if (isEmptyValue(value)) {
    value = 0
  }

  if (isEmptyValue(currency)) {
    currency = getCurrency()
  }

  // const precision = getStandardPrecision()

  if (isEmptyValue(country)) {
    country = getCountryCode()
  }

  // get formatted currency number
  return new Intl.NumberFormat(country, {
    style: 'currency',
    currency,
    useGrouping: true,
    // minimumFractionDigits: precision,
    // maximumFractionDigits: precision,
    minimumIntegerDigits: 1
  }).format(value)
}

/**
 * Format percentage based on Intl library
 * @param {number} value
 */
export function formatPercent(value) {
  if (isEmptyValue(value)) {
    value = 0
  }

  //  Get formatted number
  return new Intl.NumberFormat(getCountryCode(), {
    style: 'percent',
    minimumIntegerDigits: 1
  }).format(value)
}

/**
 * zero pad
 * @author EdwinBetanc0urt <EdwinBetanc0urt@oulook.com>
 * @param {number|string} number
 * @param {number} pad
 * @returns {string}
 */
export function zeroPad(number, pad = 2) {
  const zero = Number(pad) - number.toString().length + 1
  return Array(+(zero > 0 && zero)).join('0') + number
}

/**
 * Round decimal numbers
 * @param {number} number
 * @returns {number}
 */
export function round(number, standardPrecision = 2) {
  const amount = number.toFixed(standardPrecision)
  return Number(amount)
}

export const OPERATION_PATTERN = /[\d\/.()%\*\+-]/

export const INPUT_NUMBER_PATTERN = /[^\d\/.()%\*\+-=]/g

/**
 * Solve an arithmetic operation (+, -, /, * and %)
 * @author Edwin Betancourt <EdwinBetanc0urt@oulook.com>
 * @param {string} mathExpression, mathematical expression to be solved or numerical value
 */
function solveMathOperation(mathExpression) {
  let expressionIndex = Math.max(mathExpression.lastIndexOf('-'), mathExpression.lastIndexOf('+'))
  if (expressionIndex === -1) {
    expressionIndex = Math.max(mathExpression.lastIndexOf('*'), mathExpression.lastIndexOf('/'))
  }
  if (expressionIndex === -1) {
    const num = Number.parseInt(mathExpression.trim())
    if (isNaN(num)) {
      return null
    }
    return num
  }

  const leftVal = solveMathOperation(mathExpression.substring(0, expressionIndex).trim())
  const rightVal = solveMathOperation(mathExpression.substring(expressionIndex + 1).trim())

  switch (mathExpression[expressionIndex]) {
    case '+':
      return leftVal + rightVal
    case '-':
      return leftVal - rightVal
    case '*':
      return leftVal * rightVal
    case '/':
      return leftVal / rightVal
    case '%':
      return leftVal % rightVal
  }
}

export function calculationValue(value, event) {
  const evalOperation = (value) => {
    try {
      return solveMathOperation(value) + ''
    } catch (error) {
      return null
    }
  }

  const isDeleteKey = ['Backspace', 'Delete'].includes(event.key)

  if (event.type === 'keydown') {
    const { selectionStart, selectionEnd } = event.target
    const operation = charInText({
      value: event.target.value,
      char: event.key,
      selectionStart,
      selectionEnd
    })
    // if (isDeleteKey) {
    //   operation = event.target.value
    // }
    if (!isEmptyValue(operation)) {
      const val = evalOperation(operation)
      console.log('operation', operation, val)
      return val
    }
  } else if (event.type === 'click') {
    if (!isEmptyValue(value)) {
      return evalOperation(value)
    }
  } else {
    if (isDeleteKey && !isEmptyValue(value)) {
      return evalOperation(value)
    }
    return null
  }
}

/**
 * Convert exponetial to decimals quantity
 * @param {number} value ej: 314e-2, 4e+3
 * @returns ej: 3.14, 400
 */
export function formatExponential(value) {
  const regExpr = /(\d{1,})(e-)/g // number end e-
  const strValue = value.toString()

  if (regExpr.test(strValue)) {
    let exponential = strValue.replace(regExpr, '')

    if (isEmptyValue(exponential) || exponential <= 0) {
      exponential = getStandardPrecision()
    }

    // TODO: Verify with formatQuantity
    return Number.parseFloat(value)
      .toFixed(exponential)
  }

  return value
}
