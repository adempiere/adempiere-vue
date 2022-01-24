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

export const CLIENT = 'AD_Client_ID'

export const ORGANIZATION = 'AD_Org_ID'

export const ACTIVE = 'IsActive'

export const PROCESSING = 'Processing'

export const PROCESSED = 'Processed'

/**
 * Log columns list into table
 * Manages with user session
 */
export const LOG_COLUMNS_NAME_LIST = [
  'Created',
  'CreatedBy',
  'Updated',
  'UpdatedBy'
]

/**
 * Columns list into standard table
 */
export const STANDARD_COLUMNS_NAME_LIST = [
  ...LOG_COLUMNS_NAME_LIST,
  // Table Name '_ID'
  CLIENT,
  ORGANIZATION,
  ACTIVE,
  'UUID'
]

/**
 * Columns list into document table
 */
export const DOCUMENT_COLUMNS_NAME_LIST = [
  ...STANDARD_COLUMNS_NAME_LIST,
  'C_DocType_ID',
  'DateDoc',
  'Description',
  'DocAction',
  'DocStatus',
  'DocumentNo',
  'IsApproved',
  PROCESSED,
  PROCESSING
]

export const ACCOUNTING_COLUMNS = [
  'C_AcctSchema_ID',
  'C_Currency_ID',
  'C_Convertion_Type_ID'
]

/**
 * Documents status columns list
 */
export const DOCUMENT_STATUS_COLUMNS_LIST = [
  'DocStatus',
  'O_DocStatus'
]

export function isDocumentStatus({ columnName, elementColumnName }) {
  return DOCUMENT_STATUS_COLUMNS_LIST.includes(columnName) ||
    DOCUMENT_STATUS_COLUMNS_LIST.includes(elementColumnName)
}

export const COLUMN_IS_ACTIVE = {
  columnName: ACTIVE, // column name of field
  defaultValue: true, // default value when loading
  valueIsReadOnlyForm: false, // value that activates read-only form
  isChangedAllForm: false // change the entire form to read only including this field
}

export const COLUMN_PROCESSING = {
  columnName: PROCESSING,
  defaultValue: true,
  valueIsReadOnlyForm: false,
  isChangedAllForm: true
}

export const COLUMN_PROCESSED = {
  columnName: PROCESSED,
  defaultValue: false,
  valueIsReadOnlyForm: true,
  isChangedAllForm: true
}

export const READ_ONLY_COLUMNS_LIST = [
  ACTIVE,
  PROCESSING,
  PROCESSED
]

/**
 * Fields with this column name, changed all fields is read only
 */
export const READ_ONLY_FORM_COLUMNS = [
  COLUMN_IS_ACTIVE,
  COLUMN_PROCESSED,
  COLUMN_PROCESSING
]

export function readOnlyColumn(columnName) {
  return READ_ONLY_FORM_COLUMNS.find(item => {
    return item.columnName === columnName
  })
}
