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

/**
 * Row default app attributes
 */
export const ROW_ATTRIBUTES = {
  // indicate if is new record (add mew row)
  isNewRow: false,
  // indicate if is edit record to render fields
  isEditRow: false,
  // indicate if is selected record to manage
  isSelectedRow: false,
  // row index to fast manager
  rowIndex: 0,
  // indicate if is read only row (same isReadOnlyForm)
  isReadOnlyFromRow: false
}

/**
 * Row table key name attributes
 * not to send to the server
 */
export const ROW_KEY_ATTRIBUTES = Object.keys(ROW_ATTRIBUTES)
