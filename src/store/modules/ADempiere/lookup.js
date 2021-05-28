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

import { requestLookup, requestLookupList } from '@/api/ADempiere/window.js'
import { getToken as getSession } from '@/utils/auth'
import { isEmptyValue, convertBooleanToString, typeValue } from '@/utils/ADempiere/valueUtils'
import { parseContext } from '@/utils/ADempiere/contextUtils'

const initStateLookup = {
  lookupItem: [],
  lookupList: []
}

const lookup = {
  state: initStateLookup,
  mutations: {
    addLoockupItem(state, payload) {
      state.lookupItem.push(payload)
    },
    addLoockupList(state, payload) {
      state.lookupList.push(payload)
    },
    deleteLookupList(state, payload) {
      state.lookupItem = payload.lookupItem
      state.lookupList = payload.lookupList
    },
    resetStateLookup(state) {
      state = initStateLookup
    }
  },
  actions: {
    /**
    * Get display column from lookup
    * @param {string} parentUuid
    * @param {string} containerUuid
    * @param {string} tableName
    * @param {string} directQuery
    * @param {string|number} value identifier or key
    */
    getLookupItemFromServer({ commit, rootGetters }, {
      parentUuid,
      containerUuid,
      tableName,
      directQuery,
      value
    }) {
      if (isEmptyValue(directQuery)) {
        return
      }

      let parsedDirectQuery = directQuery
      if (parsedDirectQuery.includes('@')) {
        parsedDirectQuery = parseContext({
          parentUuid,
          containerUuid,
          value: directQuery,
          isBooleanToString: true
        }).value
      }

      // TODO: Remove this code, it should be fixed in  Proxy API and gRPC-API
      if (parsedDirectQuery.includes('?')) {
        let parsedValue = value
        const type = typeValue(value)
        // to date convert to timestamp or long value
        if (type === 'DATE') {
          parsedValue = value.getTime()
        }
        // to boolean convert to Y and N string value
        if (type === 'BOOLEAN') {
          parsedValue = convertBooleanToString(value)
        }
        // set doble quotes if is string value in query
        if (typeValue(parsedValue) === 'STRING') {
          parsedValue = `"${parsedValue}"`
        }

        parsedDirectQuery = parsedDirectQuery.replace('?', parsedValue)
      }

      return requestLookup({
        tableName,
        directQuery: parsedDirectQuery,
        value
      })
        .then(lookupItemResponse => {
          const label = lookupItemResponse.values.DisplayColumn
          const option = {
            label: isEmptyValue(label) ? ' ' : label,
            uuid: lookupItemResponse.uuid,
            id: value // lookupItemResponse.values.KeyColumn
          }

          commit('addLoockupItem', {
            option,
            value, // isNaN(objectParams.value) ? objectParams.value : parseInt(objectParams.value, 10),
            parsedDirectQuery: directQuery,
            tableName,
            sessionUuid: getSession(),
            clientId: rootGetters.getPreferenceClientId
          })
          return option
        })
        .catch(error => {
          console.warn(`Get Lookup, Select Base - Error ${error.code}: ${error.message}.`)
        })
    },
    /**
    * Get display column's list from lookup
    * @param {string}  parentUuid
    * @param {string}  containerUuid
    * @param {string}  tableName
    * @param {string}  query
    * @param {string}  whereClause
    * @param {boolean} isAddBlankValue
    * @param {mixed}   blankValue
    * @param {Array<String>|<Number>}  valuesList
    */
    getLookupListFromServer({ commit, rootGetters }, {
      parentUuid,
      containerUuid,
      columnName,
      tableName,
      query,
      whereClause,
      isAddBlankValue = false,
      blankValue,
      valuesList = []
    }) {
      if (isEmptyValue(query)) {
        return
      }
      let parsedQuery = query
      if (String(parsedQuery).includes('@')) {
        parsedQuery = parseContext({
          parentUuid,
          containerUuid,
          value: query,
          isBooleanToString: true
        }).value
      }

      let parsedWhereClause = whereClause
      if (String(parsedWhereClause).includes('@')) {
        parsedWhereClause = parseContext({
          parentUuid,
          containerUuid,
          value: parsedWhereClause,
          isBooleanToString: true
        }).value
      }

      return requestLookupList({
        columnName,
        tableName,
        query: parsedQuery,
        whereClause: parsedWhereClause,
        valuesList
      })
        .then(lookupListResponse => {
          const list = []
          lookupListResponse.recordsList.forEach(itemLookup => {
            const {
              KeyColumn: id,
              DisplayColumn: label
            } = itemLookup.values

            if (!isEmptyValue(id)) {
              list.push({
                label,
                id,
                uuid: itemLookup.uuid
              })
            }
          })
          if (isAddBlankValue) {
            list.unshift({
              label: ' ',
              id: blankValue,
              uuid: undefined
            })
          }
          commit('addLoockupList', {
            list,
            tableName,
            parsedQuery,
            sessionUuid: getSession(),
            clientId: rootGetters.getPreferenceClientId
          })
          return list
        })
        .catch(error => {
          console.warn(`Get Lookup List, Select Base - Error ${error.code}: ${error.message}.`)
        })
    },
    deleteLookupList({ commit, state }, {
      parentUuid,
      containerUuid,
      tableName,
      query,
      directQuery,
      value
    }) {
      let parsedDirectQuery = directQuery
      if (directQuery && parsedDirectQuery.includes('@')) {
        parsedDirectQuery = parseContext({
          parentUuid,
          containerUuid,
          value: parsedDirectQuery,
          isBooleanToString: true
        }).value
      }
      const lookupItem = state.lookupItem.filter(itemLookup => {
        return itemLookup.parsedDirectQuery !== parsedDirectQuery &&
        itemLookup.tableName !== tableName &&
        itemLookup.value !== value &&
        itemLookup.sessionUuid !== getSession()
      })

      let parsedQuery = query
      if (parsedQuery && parsedQuery.includes('@')) {
        parsedQuery = parseContext({
          parentUuid,
          containerUuid,
          value: parsedQuery,
          isBooleanToString: true
        }).value
      }
      const lookupList = state.lookupList.filter(itemLookup => {
        return itemLookup.parsedQuery !== parsedQuery &&
        itemLookup.tableName !== tableName &&
        itemLookup.sessionUuid !== getSession()
      })
      commit('deleteLookupList', {
        lookupItem,
        lookupList
      })
    }
  },
  getters: {
    getLookupItem: (state, getters, rootState, rootGetters) => ({
      parentUuid,
      containerUuid,
      tableName,
      directQuery,
      value
    }) => {
      let parsedDirectQuery = directQuery
      if (parsedDirectQuery && parsedDirectQuery.includes('@')) {
        parsedDirectQuery = parseContext({
          parentUuid,
          containerUuid,
          value: parsedDirectQuery,
          isBooleanToString: true
        }).value
      }
      const lookupItem = state.lookupItem.find(itemLookup => {
        return itemLookup.parsedDirectQuery === parsedDirectQuery &&
          itemLookup.tableName === tableName &&
          itemLookup.sessionUuid === getSession() &&
          itemLookup.clientId === rootGetters.getPreferenceClientId &&
          itemLookup.value === value
      })
      if (lookupItem) {
        return lookupItem.option
      }
      return undefined
    },
    getLookupList: (state, getters, rootState, rootGetters) => ({
      parentUuid,
      containerUuid,
      tableName,
      query
    }) => {
      let parsedQuery = query
      if (parsedQuery && parsedQuery.includes('@')) {
        parsedQuery = parseContext({
          parentUuid,
          containerUuid,
          value: parsedQuery,
          isBooleanToString: true
        }).value
      }
      const lookupList = state.lookupList.find(itemLookup => {
        return itemLookup.parsedQuery === parsedQuery &&
          itemLookup.tableName === tableName &&
          itemLookup.sessionUuid === getSession() &&
          itemLookup.clientId === rootGetters.getPreferenceClientId
      })
      if (lookupList) {
        return lookupList.list
      }
      return []
    },
    /**
     * Get all lookups, item and list joined
     */
    getLookupAll: (state, getters) => ({
      parentUuid,
      containerUuid,
      tableName,
      query,
      directQuery,
      value
    }) => {
      const list = getters.getLookupList({
        parentUuid,
        containerUuid,
        tableName,
        query
      })
      const allList = list
      // set item values getter from server into list
      if (isEmptyValue(list)) {
        const item = getters.getLookupItem({
          parentUuid,
          containerUuid,
          tableName,
          directQuery,
          value
        })
        if (!isEmptyValue(item)) {
          allList.push(item)
        }
      }
      return allList
    }
  }
}

export default lookup
