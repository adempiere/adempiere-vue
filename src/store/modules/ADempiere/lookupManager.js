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
import { requestLookupList } from '@/api/ADempiere/window.js'

// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { getContextAttributes, generateContextKey } from '@/utils/ADempiere/contextUtils.js'

const initStateLookup = {
  lookupItem: {},
  lookupList: {}
}

const lookupManager = {

  state: initStateLookup,

  mutations: {
    setLookupItem(state, {
      clientId,
      key,
      option,
      value
    }) {
      Vue.set(state.lookupItem, key, {
        clientId,
        key,
        option,
        value
      })
    },

    setLookupList(state, {
      clientId,
      key,
      contextAttributesList,
      optionsList
    }) {
      Vue.set(state.lookupList, key, {
        clientId,
        key,
        contextAttributesList,
        optionsList
      })
    },

    deleteLookupList(state, {
      key
    }) {
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
    getLookupListFromServer({ commit, rootGetters }, {
      isAddBlankValue = false,
      blankValue,
      parentUuid,
      containerUuid,
      contextColumnNames = [],
      fieldUuid,
      processParameterUuid,
      browseFieldUuid,
      id,
      //
      referenceUuid,
      searchValue,
      //
      tableName,
      columnName,
      columnUuid
    }) {
      return new Promise(resolve => {
        if (isEmptyValue(fieldUuid) && isEmptyValue(processParameterUuid) && isEmptyValue(browseFieldUuid)) {
          resolve([])
          return
        }

        const contextAttributesList = getContextAttributes({
          parentUuid,
          containerUuid,
          contextColumnNames,
          isBooleanToString: true
        })

        requestLookupList({
          contextAttributesList,
          fieldUuid,
          processParameterUuid,
          browseFieldUuid,
          id,
          //
          referenceUuid,
          searchValue,
          //
          tableName,
          columnName,
          columnUuid
        })
          .then(lookupListResponse => {
            const optionsList = []

            lookupListResponse.recordsList.forEach(itemLookup => {
              const {
                KeyColumn: value,
                DisplayColumn: displayedValue
              } = itemLookup.values

              if (!isEmptyValue(value)) {
                optionsList.push({
                  displayedValue,
                  value,
                  uuid: itemLookup.uuid
                })
              }
            })
            if (isAddBlankValue) {
              optionsList.unshift({
                displayedValue: ' ',
                value: blankValue,
                uuid: undefined
              })
            }

            const clientId = rootGetters.getPreferenceClientId

            let key = clientId
            if (!isEmptyValue(fieldUuid)) {
              key += `|${fieldUuid}`
            } else if (!isEmptyValue(processParameterUuid)) {
              key += `|${processParameterUuid}`
            } else if (!isEmptyValue(browseFieldUuid)) {
              key += `|${browseFieldUuid}`
            }

            const contextKey = generateContextKey(contextAttributesList)
            key += contextKey

            commit('setLookupList', {
              clientId,
              parentUuid, // used by suscription filter
              containerUuid, // used by suscription filter
              contextAttributesList,
              optionsList,
              key
            })

            resolve(optionsList)
          })
          .catch(error => {
            console.warn(`Get Lookup List, Select Base - Error ${error.code}: ${error.message}.`)
          })
      })
    },

    deleteLookup({ commit, dispatch, rootGetters }, {
      parentUuid,
      containerUuid,
      uuid,
      contextColumnNames = [],
      value
    }) {
      return new Promise(resolve => {
        dispatch('deleteDefaultValue', {
          parentUuid,
          containerUuid,
          uuid,
          contextColumnNames,
          value
        })

        const clientId = rootGetters.getPreferenceClientId

        const contextAttributesList = getContextAttributes({
          parentUuid,
          containerUuid,
          contextColumnNames,
          isBooleanToString: true
        })

        const contextKey = generateContextKey(contextAttributesList)

        let keyList = clientId
        if (!isEmptyValue(uuid)) {
          keyList += `|${uuid}`
        }

        keyList += contextKey

        commit('deleteLookupList', {
          key: keyList
        })

        resolve()
      })
    }
  },

  getters: {
    getStoredLookupList: (state, getters, rootState, rootGetters) => ({
      parentUuid,
      containerUuid,
      contextColumnNames = [],
      contextAttributesList = [],
      uuid
    }) => {
      let key = rootGetters.getPreferenceClientId
      if (!isEmptyValue(uuid)) {
        key += `|${uuid}`
      }

      if (isEmptyValue(contextAttributesList) && !isEmptyValue(contextColumnNames)) {
        contextAttributesList = getContextAttributes({
          parentUuid,
          containerUuid,
          contextColumnNames,
          isBooleanToString: true
        })
      }
      const contextKey = generateContextKey(contextAttributesList)
      key += contextKey

      const lookupList = state.lookupList[key]
      if (lookupList) {
        return lookupList.optionsList
      }
      return []
    },

    /**
     * Get all lookups, item and list joined
     */
    getStoredLookupAll: (state, getters, rootState, rootGetters) => ({
      parentUuid,
      containerUuid,
      contextColumnNames,
      uuid
    }) => {
      const contextAttributesList = getContextAttributes({
        parentUuid,
        containerUuid,
        contextColumnNames,
        isBooleanToString: true
      })

      const optionsList = getters.getStoredLookupList({
        parentUuid,
        containerUuid,
        uuid,
        contextColumnNames,
        contextAttributesList
      })

      // set item values getter from server into list
      if (isEmptyValue(optionsList)) {
        const option = rootGetters.getStoredDefaultValue({
          parentUuid,
          containerUuid,
          contextColumnNames,
          contextAttributesList,
          uuid
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
