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
const tableName = 'C_BPartner'

export default [
  {
    elementColumnName: 'Value',
    columnName: 'Value',
    isFromDictionary: true,
    overwriteDefinition: {
      isCustomField: true,
      tabindex: 0,
      sequence: 0,
      size: 6,
      isMandatory: true
    }
  },
  {
    elementColumnName: 'TaxID',
    columnName: 'TaxID',
    isFromDictionary: true,
    overwriteDefinition: {
      isCustomField: true,
      tabindex: 0,
      sequence: 0,
      size: 6,
      isMandatory: false
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
      size: 6,
      sequence: 1,
      isMandatory: true
    }
  },
  {
    elementColumnName: 'Name2',
    columnName: 'Name2',
    tableName,
    isFromDictionary: true,
    overwriteDefinition: {
      tabindex: 2,
      isCustomField: true,
      sequence: 2,
      size: 6
    }
  }
]
