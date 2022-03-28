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

// constants
import { ACCOUNTING_COLUMNS } from '@/utils/ADempiere/constants/systemColumns.js'

// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { convertBooleanToString } from '@/utils/ADempiere/formatValue/booleanFormat.js'
import evaluator from '@/utils/ADempiere/evaluator'

export default evaluator

/**
 * Get context state from vuex store
 * @param {string} parentUuid UUID Window
 * @param {string} containerUuid  UUID Tab, Process, SmartBrowser, Report and Form
 * @param {boolean} isBooleanToString if convert true to 'Y'
 * @param {string} columnName (context)  Entity to search
 * @returns
 */
export const getContext = ({
  parentUuid,
  containerUuid,
  isBooleanToString = false,
  isForceBoolean = true,
  columnName
}) => {
  let value
  const isPreferenceValue = columnName.startsWith('$') ||
    columnName.startsWith('#') ||
    columnName.startsWith(`P|`)

  // get value to session context
  if (isPreferenceValue) {
    value = store.getters.getPreference({
      parentUuid,
      containerUuid,
      columnName
    })
  } else {
    // get value to container view
    value = store.getters.getValueOfField({
      parentUuid,
      containerUuid,
      columnName
    })
  }

  if (isBooleanToString) {
    return convertBooleanToString(value, isForceBoolean)
  }

  return value
}

/**
 *  Get Preference.
 *  <pre>
 *      0)  Current Setting
 *      1)  Window Preference
 *      2)  Global Preference
 *      3)  Login settings
 *      4)  Accounting settings
 *  </pre>
 *  @param  {string} parentUuid UUID Window
 *  @param  {string} containerUuid  UUID Tab, Process, SmartBrowser, Report and Form
 *  @param  {string}  columnName (context)  Entity to search
 *  @return preference value
 */
export function getPreference({
  parentUuid,
  containerUuid,
  columnName
}) {
  let value
  if (isEmptyValue(columnName)) {
    console.warn('Require Context ColumnName')
    return value
  }

  //        USER PREFERENCES
  // View Preferences
  if (parentUuid) {
    value = getContext({
      parentUuid: 'P|' + parentUuid,
      containerUuid: 'P|' + containerUuid,
      columnName
    })
    if (!isEmptyValue(value)) {
      return value
    }
  }

  //  Global Preferences
  value = getContext({
    columnName: 'P|' + columnName
  })
  if (!isEmptyValue(value)) {
    return value
  }

  //        SYSTEM PREFERENCES
  // Login setting
  // get # globals context only window
  value = getContext({
    columnName: '#' + columnName
  })
  if (!isEmptyValue(value)) {
    return value
  }

  //  Accounting setting
  value = getContext({
    columnName: '$' + columnName
  })

  return value
} // get preference value

/**
 * Extracts the associated fields from the logics or default values
 * @param {string} displayLogic
 * @param {string} mandatoryLogic
 * @param {string} readOnlyLogic
 * @param {object} reference.contextColumnNames array
 * @param {string} defaultValue
 * @returns {array} List column name of parent fields
 */
export function getParentFields({
  displayLogic,
  mandatoryLogic,
  readOnlyLogic,
  reference,
  defaultValue
}) {
  let contextColumnNames = []
  //  Validate reference
  if (!isEmptyValue(reference) && !isEmptyValue(reference.contextColumnNames)) {
    contextColumnNames = reference.contextColumnNames
  }
  const parentFields = Array.from(new Set([
    //  For Display logic
    ...evaluator.parseDepends(displayLogic),
    //  For Mandatory Logic
    ...evaluator.parseDepends(mandatoryLogic),
    //  For Read Only Logic
    ...evaluator.parseDepends(readOnlyLogic),
    //  For Default Value
    ...evaluator.parseDepends(defaultValue),
    //  For Validation Code / SQL values
    ...contextColumnNames
  ]))

  return parentFields
}

/**
 * Parse Context String
 * @param {string} value: (REQUIRED) String to parsing
 * @param {string} parentUuid: (REQUIRED from Window) UUID Window
 * @param {string} containerUuid: (REQUIRED) UUID Tab, Process, SmartBrowser, Report and Form
 * @param {string} columnName: (Optional if exists in value) Column name to search in context
 * @param {boolean} isBooleanToString, convert boolean values to string ('Y' or 'N')
 * @param {boolean} isSQL
 * @param {boolean} isSOTrxMenu
 */
export function parseContext({
  parentUuid,
  containerUuid,
  columnName,
  value,
  isSQL = false,
  isBooleanToString = false,
  isSOTrxMenu
}) {
  let isError = false
  const errorsList = []

  if (isEmptyValue(value)) {
    value = undefined
    if (ACCOUNTING_COLUMNS.includes(columnName)) {
      value = contextInfo = getContext({
        columnName: '$' + columnName
      })
    }

    return {
      value,
      isError: true,
      errorsList
    }
  }
  value = String(value).replace('@SQL=', '')
  // const instances = value.length - value.replace('@', '').length
  // if ((instances > 0) && (instances % 2) !== 0) { // could be an email address
  //   return value
  // }

  let token, contextInfo
  let inString = value
  let outString = ''

  let firstIndexTag = inString.indexOf('@')

  while (firstIndexTag !== -1) {
    outString = outString + inString.substring(0, firstIndexTag) // up to @
    inString = inString.substring(firstIndexTag + 1, inString.length) // from first @
    const secondIndexTag = inString.indexOf('@') // next @
    // no exists second tag
    if (secondIndexTag < 0) {
      console.info(`No second tag: ${inString}`)
      return {
        value: undefined,
        isError: true,
        errorsList,
        isSQL
      }
    }

    token = inString.substring(0, secondIndexTag)
    columnName = token

    contextInfo = getContext({
      parentUuid,
      containerUuid,
      columnName
    }) // get context

    if (isEmptyValue(contextInfo)) {
      // get global context
      if (token.startsWith('#') || token.startsWith('$')) {
        contextInfo = getContext({
          columnName
        })
      } else {
        // get accounting context
        if (ACCOUNTING_COLUMNS.includes(columnName)) {
          contextInfo = getContext({
            columnName: '$' + columnName
          })
        }
      }
    }

    // menu attribute isEmptyValue isSOTrx
    if (!isEmptyValue(isSOTrxMenu) && token === 'IsSOTrx' && isEmptyValue(contextInfo)) {
      contextInfo = isSOTrxMenu
    }

    if ((isBooleanToString || isSQL) && typeof contextInfo === 'boolean') {
      contextInfo = convertBooleanToString(contextInfo)
    }

    if (isEmptyValue(contextInfo)) {
      // console.info(`No Context for: ${token}`)
      isError = true
      errorsList.push(token)
    } else {
      if (['object', 'boolean'].includes(typeof contextInfo)) {
        outString = contextInfo
      } else {
        outString = outString + contextInfo // replace context with Context
      }
    }

    inString = inString.substring(secondIndexTag + 1, inString.length) // from second @
    firstIndexTag = inString.indexOf('@')
  } // end while loop

  if (!['object', 'boolean'].includes(typeof contextInfo)) {
    outString = outString + inString // add the rest of the string
  }
  if (isSQL) {
    return {
      errorsList,
      isError,
      isSQL,
      query: outString,
      value: contextInfo
    }
  }
  return {
    errorsList,
    isError,
    isSQL,
    value: outString
  }
} // parseContext

/**
 * Get context attribures list
 * @param {string} containerUuid
 * @param {array<string>} contextColumnNames
 * @returns {array<object>}
 */
export function getContextAttributes({
  parentUuid,
  containerUuid,
  contextColumnNames = [],
  isBooleanToString = false,
  isForceBoolean = false
}) {
  const contextAttributesList = []
  if (isEmptyValue(contextColumnNames)) {
    return contextAttributesList
  }

  contextColumnNames.forEach(columnName => {
    const value = getContext({
      parentUuid,
      containerUuid,
      columnName,
      isBooleanToString,
      isForceBoolean
    })

    contextAttributesList.push({
      value,
      columnName
    })
  })

  return contextAttributesList
}
