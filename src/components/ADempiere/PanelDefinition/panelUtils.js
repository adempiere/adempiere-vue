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

import { isEmptyValue } from '@/utils/ADempiere'
import { generateField } from '@/utils/ADempiere/dictionaryUtils'
import { getFieldTemplate } from '@/utils/ADempiere/lookupFactory'
import { sortFields } from '@/utils/ADempiere/dictionary/panel'

/**
 * Generate panel
 * @param {string} parentUuid
 * @param {string} containerUuid
 * @param {object} panelMetadata
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
