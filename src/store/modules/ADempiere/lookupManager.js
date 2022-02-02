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

import Vue from 'vue'

// api request methods
import { requestLookup, requestLookupList } from '@/api/ADempiere/window.js'

// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { parseContext } from '@/utils/ADempiere/contextUtils.js'

const initStateLookup = {
  lookupItem: {},
  lookupList: {}
}

const lookupManager = {

  state: initStateLookup,

  mutations: {
    setLookupItem(state, {
      clientId,
      parsedDirectQuery,
      tableName,
      option,
      value
    }) {
      const key = `${clientId}_${tableName}_${parsedDirectQuery}_${value}`

      Vue.set(state.lookupItem, key, {
        clientId,
        tableName,
        parsedDirectQuery,
        option,
        value
      })
    },

    setLookupList(state, {
      clientId,
      tableName,
      parsedQuery,
      parsedValidationCode,
      optionsList
    }) {
      const key = `${clientId}_${tableName}_${parsedQuery}_${parsedValidationCode}`

      Vue.set(state.lookupList, key, {
        clientId,
        tableName,
        parsedQuery,
        parsedValidationCode,
        optionsList
      })
    },

    deleteLookupItem(state, {
      clientId,
      tableName,
      parsedDirectQuery,
      value
    }) {
      const key = `${clientId}_${tableName}_${parsedDirectQuery}_${value}`
      Vue.set(state.lookupItem, key, undefined)
    },

    deleteLookupList(state, {
      clientId,
      tableName,
      parsedQuery,
      parsedValidationCode
    }) {
      const key = `${clientId}_${tableName}_${parsedQuery}_${parsedValidationCode}`
      Vue.set(state.lookupList, key, undefined)
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
      return new Promise(resolve => {
        if (isEmptyValue(directQuery)) {
          resolve()
          return
        }

        let parsedDirectQuery = directQuery
        if (directQuery.includes('@')) {
          parsedDirectQuery = parseContext({
            parentUuid,
            containerUuid,
            value: directQuery,
            isBooleanToString: true
          }).value
        }

        requestLookup({
          tableName,
          directQuery: parsedDirectQuery,
          value
        })
          .then(lookupItemResponse => {
            const {
              DisplayColumn: label
            } = lookupItemResponse.values
            const option = {
              label: isEmptyValue(label) ? ' ' : label,
              uuid: lookupItemResponse.uuid,
              value // lookupItemResponse.values.KeyColumn
            }

            commit('setLookupItem', {
              parentUuid, // used by suscription filter
              containerUuid, // used by suscription filter
              option,
              value, // isNaN(value) ? value : parseInt(value, 10),
              parsedDirectQuery: directQuery,
              tableName,
              clientId: rootGetters.getPreferenceClientId
            })

            resolve(option)
          })
          .catch(error => {
            console.warn(`Get Lookup, Select Base - Error ${error.code}: ${error.message}.`)
          })
      })
    },

    /**
    * Get display column's list from lookup
    * @param {string}  parentUuid
    * @param {string}  containerUuid
    * @param {string}  tableName
    * @param {string}  query
    * @param {string}  validationCode
    * @param {boolean} isAddBlankValue
    * @param {mixed}   blankValue
    * @param {string}  columnName, used by multiple values
    * @param {Array<String>|<Number>}  valuesList, used by multiple values
    */
    getLookupListFromServer({ commit, rootGetters }, {
      parentUuid,
      containerUuid,
      columnName,
      tableName,
      query,
      validationCode,
      isAddBlankValue = false,
      blankValue,
      valuesList = []
    }) {
      return new Promise(resolve => {
        if (isEmptyValue(query)) {
          resolve()
          return
        }

        let parsedQuery = query
        if (String(query).includes('@')) {
          parsedQuery = parseContext({
            parentUuid,
            containerUuid,
            value: query,
            isBooleanToString: true
          }).value
        }

        let parsedValidationCode = validationCode
        if (String(validationCode).includes('@')) {
          parsedValidationCode = parseContext({
            parentUuid,
            containerUuid,
            value: validationCode,
            isBooleanToString: true
          }).value
        }

        requestLookupList({
          tableName,
          query: parsedQuery,
          whereClause: parsedValidationCode,
          columnName,
          valuesList
        })
          .then(lookupListResponse => {
            const optionsList = []

            lookupListResponse.recordsList.forEach(itemLookup => {
              const {
                KeyColumn: value,
                DisplayColumn: label
              } = itemLookup.values

              if (!isEmptyValue(value)) {
                optionsList.push({
                  label,
                  value,
                  uuid: itemLookup.uuid
                })
              }
            })
            if (isAddBlankValue) {
              optionsList.unshift({
                label: ' ',
                value: blankValue,
                uuid: undefined
              })
            }
            commit('setLookupList', {
              clientId: rootGetters.getPreferenceClientId,
              tableName,
              parsedQuery,
              parsedValidationCode,
              optionsList
            })

            resolve(optionsList)
          })
          .catch(error => {
            console.warn(`Get Lookup List, Select Base - Error ${error.code}: ${error.message}.`)
          })
      })
    },

    deleteLookupList({ commit, rootGetters }, {
      parentUuid,
      containerUuid,
      tableName,
      query,
      directQuery,
      validationCode,
      value
    }) {
      return new Promise(resolve => {
        const clientId = rootGetters.getPreferenceClientId

        let parsedDirectQuery = directQuery
        if (directQuery && parsedDirectQuery.includes('@')) {
          parsedDirectQuery = parseContext({
            parentUuid,
            containerUuid,
            value: directQuery,
            isBooleanToString: true
          }).value
        }
        commit('deleteLookupItem', {
          clientId,
          tableName,
          parsedDirectQuery,
          value
        })

        let parsedQuery = query
        if (!isEmptyValue(parsedQuery) && parsedQuery.includes('@')) {
          parsedQuery = parseContext({
            parentUuid,
            containerUuid,
            value: parsedQuery,
            isBooleanToString: true
          }).value
        }
        let parsedValidationCode = validationCode
        if (!isEmptyValue(validationCode) && validationCode.includes('@')) {
          parsedValidationCode = parseContext({
            parentUuid,
            containerUuid,
            value: validationCode,
            isBooleanToString: true
          }).value
        }
        commit('deleteLookupList', {
          clientId,
          tableName,
          parsedQuery,
          parsedValidationCode
        })

        resolve()
      })
    }
  },

  getters: {
    getStoredLookupItem: (state, getters, rootState, rootGetters) => ({
      parentUuid,
      containerUuid,
      tableName,
      directQuery,
      value
    }) => {
      let parsedDirectQuery = directQuery
      if (!isEmptyValue(parsedDirectQuery) && parsedDirectQuery.includes('@')) {
        parsedDirectQuery = parseContext({
          parentUuid,
          containerUuid,
          value: directQuery,
          isBooleanToString: true
        }).value
      }

      const clientId = rootGetters.getPreferenceClientId
      const key = `${clientId}_${tableName}_${parsedDirectQuery}_${value}`

      const lookupItem = state.lookupItem[key]
      if (lookupItem) {
        return lookupItem.option
      }
      return undefined
    },

    getStoredLookupList: (state, getters, rootState, rootGetters) => ({
      parentUuid,
      containerUuid,
      tableName,
      query,
      validationCode
    }) => {
      let parsedQuery = query
      if (!isEmptyValue(query) && query.includes('@')) {
        parsedQuery = parseContext({
          parentUuid,
          containerUuid,
          value: query,
          isBooleanToString: true
        }).value
      }

      let parsedValidationCode = validationCode
      if (!isEmptyValue(validationCode) && validationCode.includes('@')) {
        parsedValidationCode = parseContext({
          parentUuid,
          containerUuid,
          value: validationCode,
          isBooleanToString: true
        }).value
      }

      const clientId = rootGetters.getPreferenceClientId
      const key = `${clientId}_${tableName}_${parsedQuery}_${parsedValidationCode}`

      const lookupList = state.lookupList[key]
      if (lookupList) {
        return lookupList.optionsList
      }
      return []
    },

    /**
     * Get all lookups, item and list joined
     */
    getStoredLookupAll: (state, getters) => ({
      parentUuid,
      containerUuid,
      tableName,
      query,
      directQuery,
      validationCode,
      value
    }) => {
      const optionsList = getters.getStoredLookupList({
        parentUuid,
        containerUuid,
        tableName,
        query,
        validationCode
      })

      // set item values getter from server into list
      if (isEmptyValue(optionsList)) {
        const option = getters.getStoredLookupItem({
          parentUuid,
          containerUuid,
          tableName,
          directQuery,
          value
        })

        // add a item option
        if (!isEmptyValue(option)) {
          optionsList.push(option)
        }
      }

      return optionsList
    }
  }
}

export default lookupManager
