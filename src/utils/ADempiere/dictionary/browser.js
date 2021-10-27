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

import { isHiddenField } from '@/utils/ADempiere/references'

/**
 * Is displayed field in panel query criteria
 */
export function isDisplayedField({ displayType, isActive, isQueryCriteria, isDisplayedFromLogic }) {
  // button field not showed
  if (isHiddenField(displayType)) {
    return false
  }

  return isActive && isQueryCriteria && isDisplayedFromLogic
}

/**
 * Smart Browser not manager mandatory logic, used as query
 * @param {boolean} isMandatoryFromLogic
 * @returns {boolean}
 */
export function isMandatoryField({ isQueryCriteria, isMandatory, isMandatoryFromLogic }) {
  return isQueryCriteria && (isMandatory || isMandatoryFromLogic)
}

export function isReadOnlyField({ isQueryCriteria, isReadOnlyFromLogic }) {
  return isQueryCriteria && isReadOnlyFromLogic
}

/**
 * Is displayed column in table multi record
 */
export function isDisplayedColumn({ displayType, isActive, isDisplayed, isKey }) {
  // column check to selection or button field not showed
  if (isKey || isHiddenField(displayType)) {
    return false
  }

  return isActive && isDisplayed
}

export function isMandatoryColumn({ isMandatory, isMandatoryFromLogic }) {
  return isMandatory || isMandatoryFromLogic
}

export function isReadOnlyColumn({ isReadOnly }) {
  return isReadOnly
}
