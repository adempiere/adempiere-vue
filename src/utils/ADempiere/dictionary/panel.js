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

import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

/**
 * Order the fields, then assign the groups to each field, and finally group
 * in an array according to each field group to show in panel (or table).
 * @param {array} fieldsList
 * @param {string} orderBy sequence, sortNo, seqNoGrid
 * @param {string} type asc | desc
 * @returns {array}
 */
export function sortFields({
  fieldsList,
  orderBy = 'sequence',
  type = 'asc'
}) {
  // ascending order
  let orderMethod = (itemA, itemB) => {
    return itemA[orderBy] - itemB[orderBy]
    // return itemA[orderBy] > itemB[orderBy]
  }

  if (type.toLowerCase() === 'desc') {
    // descending order
    orderMethod = (itemA, itemB) => {
      return itemA[orderBy] + itemB[orderBy]
      // return itemA[orderBy] < itemB[orderBy]
    }
  }

  return fieldsList.sort(orderMethod)
}

/**
 * [assignedGroup]
 * @param {array} fieldsList List of fields
 * @param {string} groupToAssigned group assing to fields
 * @param {string} orderBy sequence, sortNo, seqNoGrid
 * @return {array} fieldsList
 */
export function assignedGroup({
  fieldsList,
  groupToAssigned,
  orderBy
}) {
  if (isEmptyValue(fieldsList)) {
    return fieldsList
  }

  fieldsList = sortFields({
    fieldsList,
    orderBy
  })

  let firstChangeGroup = false
  let currentGroup = ''
  let typeGroup = ''

  fieldsList.forEach(fieldElement => {
    if (fieldElement.panelType !== 'window') {
      fieldElement.groupAssigned = ''
      fieldElement.typeGroupAssigned = ''
      return
    }

    // change the first field group, change the band
    if (!firstChangeGroup) {
      if (!isEmptyValue(fieldElement.fieldGroup.name) &&
        currentGroup !== fieldElement.fieldGroup.name &&
        fieldElement.isDisplayed) {
        firstChangeGroup = true
      }
    }
    //  if you change the field group for the first time and it is different
    //  from 0, updates the field group, since it is another field group and
    //  assigns the following field items to the current field group whose
    //  field group is '' or null
    if (firstChangeGroup) {
      if (!isEmptyValue(fieldElement.fieldGroup.name)) {
        currentGroup = fieldElement.fieldGroup.name
        typeGroup = fieldElement.fieldGroup.fieldGroupType
      }
    }

    fieldElement.groupAssigned = currentGroup
    fieldElement.typeGroupAssigned = typeGroup

    if (groupToAssigned !== undefined) {
      fieldElement.groupAssigned = groupToAssigned
    }
  })

  return fieldsList
}
