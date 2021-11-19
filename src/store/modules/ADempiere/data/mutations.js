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

const mutations = {
  addRecordSelection(state, payload) {
    state.recordSelection.push(payload)
  },
  setRecordSelection(state, payload) {
    payload.dataStore.record = payload.newDataStore.record
    payload.dataStore.selection = payload.newDataStore.selection
    payload.dataStore.pageNumber = payload.newDataStore.pageNumber
    payload.dataStore.recordCount = payload.newDataStore.recordCount
    payload.dataStore.nextPageToken = payload.newDataStore.nextPageToken
    payload.dataStore.isLoadedContext = payload.newDataStore.isLoadedContext
    payload.dataStore.isLoaded = payload.newDataStore.isLoaded
  },
  setSelection(state, payload) {
    payload.data.selection = payload.newSelection
  },
  deleteRecordContainer(state, payload) {
    state.recordSelection = payload
  },
  notifyCellTableChange: (state, payload) => {
    payload.row[payload.columnName] = payload.value
    if (payload.displayColumnName !== undefined) {
      const key = `DisplayColumn_${payload.columnName}`
      payload.row[key] = payload.displayColumnName
    }
  },
  notifyCellSelectionChange: (state, payload) => {
    if (payload.row !== undefined) {
      payload.row[payload.columnName] = payload.value
      if (payload.displayColumnName !== undefined) {
        const key = `DisplayColumn_${payload.columnName}`
        payload.row[key] = payload.displayColumnName
      }
    }
  },
  notifyRowTableChange: (state, payload) => {
    Object.assign(payload.row, payload.newRow)
  },
  setIsloadContext(state, payload) {
    payload.data.isLoadedContext = payload.isLoadedContext
  },
  addNewRow(state, payload) {
    payload.data = payload.data.unshift(payload.values)
  },
  setContextInfoField(state, payload) {
    state.contextInfoField.push(payload)
  }
}

export default mutations
