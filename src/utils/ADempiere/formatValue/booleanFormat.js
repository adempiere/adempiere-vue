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

import language from '@/lang'

/**
 * Convert boolean value to current translation language
 * @param {boolean} booleanValue
 * @returns {string} true => 'Yes' or 'Si', false => 'Not' or 'No'
 */
export const convertBooleanToTranslationLang = (booleanValue) => {
  if (booleanValue === true || booleanValue === 'true' || booleanValue === 'Y') {
    return language.t('components.switchActiveText')
  }

  return language.t('components.switchInactiveText')
}

/**
 * Convert boolean value to string value
 * @param {boolean|string} booleanValue
 * @param {boolean} isForce
 * @returns {strin}
 */
export const convertBooleanToString = (booleanValue, isForce = true) => {
  if (booleanValue === true || booleanValue === 'true' || booleanValue === 'Y') {
    return 'Y'
  }
  if (isForce) {
    return 'N'
  }

  return booleanValue
}

/**
 * Convert string values ('Y' or 'N') to component compatible Boolean values
 * @param {mixed} valueToParsed
 */
export const convertStringToBoolean = (valueToParsed) => {
  let valReturn = valueToParsed

  switch (String(valueToParsed).trim()) {
    case 'N':
    case 'false':
    case language.t('components.switchInactiveText'):
      valReturn = false
      break

    case 'Y':
    case 'true':
    case language.t('components.switchActiveText'):
      valReturn = true
      break

    default:
      valReturn = valueToParsed
      break
  }

  return valReturn
}
