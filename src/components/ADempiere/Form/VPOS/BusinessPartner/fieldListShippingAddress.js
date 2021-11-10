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

// List of fields to send for create new
import language from '@/lang'
const tableName = 'C_BPartner'
const fieldBase = {
  tableName: 'C_Location',
  isFromDictionary: true,
  overwriteDefinition: {
    size: 24,
    index: 0
  }
}

export default [
  {
    ...fieldBase,
    elementColumnName: 'C_Country_ID',
    columnName: 'C_Country_ID',
    overwriteDefinition: {
      isCustomField: true,
      isActiveLogics: true, // enable logics
      defaultValue: '@#C_Country_ID@',
      tabindex: 5,
      size: 24,
      sequenceFields: 'CO',
      isMandatory: false
    }
  },
  {
    ...fieldBase,
    elementColumnName: 'C_Region_ID',
    columnName: 'C_Region_ID',
    overwriteDefinition: {
      isCustomField: true,
      tabindex: 6,
      size: 24,
      sequenceFields: 'R',
      isMandatory: false
    }
  },
  {
    ...fieldBase,
    elementColumnName: 'C_City_ID',
    columnName: 'C_City_ID',
    overwriteDefinition: {
      isCustomField: true,
      tabindex: 7,
      size: 24,
      sequenceFields: 'C',
      isMandatory: false
    }
  },
  {
    ...fieldBase,
    elementColumnName: 'Address1',
    columnName: 'Address1',
    overwriteDefinition: {
      isCustomField: true,
      tabindex: 6,
      size: 24,
      isMandatory: true,
      sequenceFields: 'A1'
    }
  },
  {
    ...fieldBase,
    elementColumnName: 'Address2',
    columnName: 'Address2',
    overwriteDefinition: {
      isCustomField: true,
      tabindex: 9,
      size: 24,
      isDisplayed: false,
      sequenceFields: 'A2'
    }
  },
  {
    ...fieldBase,
    elementColumnName: 'Address3',
    columnName: 'Address3',
    overwriteDefinition: {
      isCustomField: true,
      tabindex: 10,
      size: 24,
      isDisplayed: false,
      sequenceFields: 'A3'
    }
  },
  {
    ...fieldBase,
    elementColumnName: 'Address4',
    columnName: 'Address4',
    overwriteDefinition: {
      tabindex: 11,
      isCustomField: true,
      size: 24,
      isDisplayed: false,
      sequenceFields: 'A4'
    }
  },
  {
    ...fieldBase,
    elementColumnName: 'Postal',
    columnName: 'Postal',
    overwriteDefinition: {
      tabindex: 12,
      isCustomField: true,
      size: 24,
      sequenceFields: 'P'
    }
  },
  {
    elementColumnName: 'Name',
    columnName: 'Name',
    tableName,
    isFromDictionary: true,
    overwriteDefinition: {
      tabindex: 1,
      isCustomField: true,
      size: 24,
      name: language.t('components.contextMenuReferences'),
      sequence: 24,
      sequenceFields: 'P',
      isMandatory: true
    }
  }
]
