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

// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { generateField } from '@/utils/ADempiere/dictionaryUtils.js'
import { getFieldTemplate } from '@/utils/ADempiere/lookupFactory.js'

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

/**
 * Generate panel
 * @param {string} parentUuid
 * @param {string} containerUuid
 * @param {object} panelMetadata
 * @param {boolean} isAddFieldsRange
 * @param {boolean} isAddFieldUuid
 * @param {boolean} isAddLinkColumn
 * @param {object} fieldOverwrite
 * @returns
 */
export function generatePanelAndFields({
  parentUuid,
  containerUuid,
  panelMetadata = {},
  isAddFieldsRange = false,
  isAddFieldUuid = false,
  isAddLinkColumn = false,
  fieldOverwrite = {}
}) {
  const fieldAdditionalAttributes = {
    parentUuid,
    containerUuid,
    // tab attributes
    tabTableName: panelMetadata.tableName,
    // app attributes
    isShowedFromUser: true,
    isReadOnlyFromForm: false,
    ...fieldOverwrite
  }

  const fieldsRangeList = []
  const selectionColumns = []
  let identifierColumns = []

  let keyColumn

  // convert fields and add app attributes
  let fieldsList = panelMetadata.fields.map((fieldItem, index) => {
    const fieldDefinition = generateField({
      fieldToGenerate: fieldItem,
      moreAttributes: {
        ...fieldAdditionalAttributes,
        fieldsListIndex: index
      }
    })
    const { columnName, componentPath } = fieldDefinition

    if (fieldDefinition.isKey) {
      keyColumn = columnName
    }
    if (fieldDefinition.isSelectionColumn) {
      selectionColumns.push(columnName)
    }
    if (fieldDefinition.isIdentifier) {
      identifierColumns.push({
        columnName,
        identifierSequence: fieldDefinition.identifierSequence,
        componentPath
      })
    }

    // Add new field if is range number
    if (isAddFieldsRange && fieldDefinition.isRange && componentPath === 'FieldNumber') {
      const fieldRange = generateField({
        fieldToGenerate: fieldItem,
        moreAttributes: fieldAdditionalAttributes,
        typeRange: true
      })

      fieldsRangeList.push(fieldRange)
    }

    return fieldDefinition
  })

  if (!isEmptyValue(fieldsRangeList)) {
    fieldsList = fieldsList.concat(fieldsRangeList)
    // order range fields
    fieldsList = sortFields({
      fieldsList
    })
  }

  // TODO: Improve performance and reduce array cycles
  // Get dependent fields
  fieldsList.forEach((itemField, index, listFields) => {
    if (!isEmptyValue(itemField.parentFieldsList) && itemField.isActive) {
      itemField.parentFieldsList.forEach(parentColumnName => {
        const parentField = listFields.find(parentFieldItem => {
          return parentFieldItem.columnName === parentColumnName &&
            parentColumnName !== itemField.columnName
        })
        if (parentField) {
          parentField.dependentFieldsList.push(itemField.columnName)
        }
      })
    }
  })

  identifierColumns = sortFields({
    fieldsList: identifierColumns,
    orderBy: 'identifierSequence'
  })

  let fieldLinkColumnName
  if (isAddLinkColumn) {
    // parent link column name
    fieldLinkColumnName = fieldsList.find(fieldItem => {
      return fieldItem.isParent
    })
    if (fieldLinkColumnName) {
      fieldLinkColumnName = fieldLinkColumnName.columnName
    }
  }

  if (isAddFieldUuid) {
    // indicates it contains the uuid field
    const isWithUuidField = fieldsList.some(fieldItem => {
      return fieldItem.columnName === 'UUID'
    })
    // add field uuid column name
    if (!isWithUuidField) {
      const fieldUuid = getFieldTemplate({
        ...fieldAdditionalAttributes,
        fieldsListIndex: fieldsList.length,
        isShowedFromUser: false,
        name: 'UUID',
        columnName: 'UUID',
        componentPath: 'FieldText'
      })

      fieldsList.push(fieldUuid)
    }
  }

  // panel for save on store
  const panel = {
    ...panelMetadata,
    parentUuid,
    containerUuid,
    fieldLinkColumnName,
    fieldsList,
    // app attributes
    keyColumn,
    selectionColumns,
    identifierColumns,
    isLoadedFieldsList: true,
    isShowedTotals: false
  }

  // delete unused and dupicated property with 'fieldsList'
  delete panel.fields

  return panel
}
