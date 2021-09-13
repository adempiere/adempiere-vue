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

import { generateField } from '@/utils/ADempiere/dictionaryUtils'
import { getFieldTemplate } from '@/utils/ADempiere/lookupFactory'

export function generatePanelAndFields({
  parentUuid,
  containerUuid,
  panelMetadata = {}
}) {
  const fieldAdditionalAttributes = {
    parentUuid,
    containerUuid,
    // tab attributes
    tabTableName: panelMetadata.tableName,
    // app attributes
    isShowedFromUser: true,
    isReadOnlyFromForm: false
  }

  // convert fields and add app attributes
  const fieldsList = panelMetadata.fields.map((fieldItem, index) => {
    fieldItem = generateField({
      fieldToGenerate: fieldItem,
      moreAttributes: {
        ...fieldAdditionalAttributes,
        fieldsListIndex: index
      }
    })

    return fieldItem
  })

  // parent link column name
  let fieldLinkColumnName = fieldsList.find(fieldItem => {
    return fieldItem.isParent
  })
  if (fieldLinkColumnName) {
    fieldLinkColumnName = fieldLinkColumnName.columnName
  }

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

  // panel for save on store
  const panel = {
    ...panelMetadata,
    parentUuid,
    containerUuid,
    fieldLinkColumnName,
    fieldsList,
    // app attributes
    isLoadedFieldsList: true,
    isShowedTotals: false
  }

  // delete unused and dupicated property with 'fieldsList'
  delete panel.fields

  return panel
}
