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

// api request methods
import { requestFieldMetadata } from '@/api/ADempiere/dictionary/window'

const initStateLookup = {
  referenceList: [],
  fieldsList: [],
  validationRuleList: []
}

const field = {
  state: initStateLookup,
  mutations: {
    addField(state, payload) {
      state.fieldsList.push(payload)
    },
    addReference(state, payload) {
      state.referenceList.push(payload)
    },
    addValidationRule(state, payload) {
      state.validationRuleList.push(payload)
    },
    resetStateLookup(state) {
      state = initStateLookup
    }
  },
  actions: {
    // Get Reference from Server based on criteria
    getFieldFromServer({ commit }, {
      uuid,
      columnUuid,
      elementUuid,
      tableName,
      columnName,
      elementColumnName
    }) {
      return requestFieldMetadata({
        uuid,
        columnUuid,
        elementUuid,
        // TableName + ColumnName
        tableName,
        columnName,
        elementColumnName
      })
        .then(fieldResponse => {
          if (columnUuid) {
            fieldResponse.columnUuid = columnUuid
          } else if (elementUuid) {
            fieldResponse.elementUuid = elementUuid
          } else if (elementColumnName) {
            fieldResponse.elementColumnName = elementColumnName
          } else if (tableName && columnName) {
            fieldResponse.tableName = tableName
            fieldResponse.columnName = columnName
          }

          commit('addField', fieldResponse)

          return fieldResponse
        })
        .catch(error => {
          console.warn(`Get Field - Error ${error.code}: ${error.message}.`)
        })
    }
  },
  getters: {
    getFieldFromUuid: (state) => (uuid) => {
      return state.fieldsList.find(fieldItem => {
        return fieldItem.uuid === uuid
      })
    },
    getFieldFromColumnUuid: (state) => (columnUuid) => {
      return state.fieldsList.find(fieldItem => {
        return fieldItem.columnUuid === columnUuid
      })
    },
    getFieldFromElementUuid: (state) => (elementUuid) => {
      return state.fieldsList.find(fieldItem => {
        return fieldItem.elementUuid === elementUuid
      })
    },
    getFieldFromElementColumnName: (state) => (elementColumnName) => {
      return state.fieldsList.find(fieldItem => {
        return fieldItem.elementColumnName === elementColumnName
      })
    },
    getFieldFromTableNameAndColumnName: (state) => ({
      tableName,
      columnName
    }) => {
      return state.fieldsList.find(fieldItem => {
        return fieldItem.tableName === tableName && fieldItem.columnName === columnName
      })
    }
  }
}

export default field
