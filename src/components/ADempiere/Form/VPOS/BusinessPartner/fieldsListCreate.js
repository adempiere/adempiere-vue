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

export default [
  {
    elementColumnName: 'Value',
    columnName: 'Value',
    fieldUuid: '8d382fa8-fb40-11e8-a479-7a0060f0aa01',
    uuid: '8d382fa8-fb40-11e8-a479-7a0060f0aa01',
    isFromDictionary: true,
    overwriteDefinition: {
      isCustomField: true,
      tabindex: 0,
      handleFocusGained: true,
      handleFocusLost: true,
      sequence: 0,
      size: 8,
      isMandatory: true
    }
  },
  {
    elementColumnName: 'TaxID',
    columnName: 'TaxID',
    fieldUuid: '8cef473e-fb40-11e8-a479-7a0060f0aa01',
    uuid: '8cef473e-fb40-11e8-a479-7a0060f0aa01',
    isFromDictionary: true,
    overwriteDefinition: {
      isCustomField: true,
      tabindex: 0,
      sequence: 0,
      size: 8,
      isMandatory: true
    }
  },
  {
    elementColumnName: 'Name',
    columnName: 'Name',
    fieldUuid: '8cf0a87c-fb40-11e8-a479-7a0060f0aa01',
    uuid: '8cf0a87c-fb40-11e8-a479-7a0060f0aa01',
    isFromDictionary: true,
    overwriteDefinition: {
      tabindex: 1,
      isCustomField: true,
      size: 8,
      sequence: 1,
      isMandatory: true
    }
  },
  {
    elementColumnName: 'Name2',
    columnName: 'Name2',
    fieldUuid: '8cec3710-fb40-11e8-a479-7a0060f0aa01',
    uuid: '8cec3710-fb40-11e8-a479-7a0060f0aa01',
    isFromDictionary: true,
    overwriteDefinition: {
      tabindex: 2,
      isCustomField: true,
      sequence: 2,
      size: 8
    }
  },
  {
    uuid: '8d9f2910-fb40-11e8-a479-7a0060f0aa01',
    fieldUuid: '8d9f2910-fb40-11e8-a479-7a0060f0aa01',
    elementColumnName: 'EMail',
    columnName: 'EMail',
    tableName: 'AD_user',
    tabindex: '3',
    isFromDictionary: true,
    overwriteDefinition: {
      tabindex: 3,
      isCustomField: true,
      sequence: 3,
      size: 8
    }
  },
  {
    elementColumnName: 'Phone',
    columnName: 'Phone',
    tableName: 'AD_user',
    isFromDictionary: true,
    overwriteDefinition: {
      isCustomField: true,
      isMandatory: true,
      size: 8
    }
  }
]
