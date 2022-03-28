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
import { getContextAttributes } from '@/utils/ADempiere/contextUtils.js'

const initStateLookup = {
  lookupItem: {},
  lookupList: {}
}

function generateContextKey(contextAttributes = []) {
  let contextKey = ''
  if (isEmptyValue(contextAttributes)) {
    return contextKey
  }

  contextAttributes.map(attribute => {
    contextKey += '|' + attribute.columnName + '|' + attribute.value
  })
  return '_' + contextKey
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
    getLookupItemFromServer({ commit, rootGetters }, {
      parentUuid,
      containerUuid,
      contextColumnNames,
      fieldUuid,
      processParameterUuid,
      browseFieldUuid,
      id,
      //
      referenceUuid,
      //
      tableName,
      columnName,
      columnUuid
    }) {
      return new Promise(resolve => {
        if (isEmptyValue(id) && isEmptyValue(fieldUuid)) {
          resolve()
          return
        }

        const contextAttributesList = getContextAttributes({
          parentUuid,
          containerUuid,
          contextColumnNames,
          isBooleanToString: true
        })

        requestLookup({
          contextAttributesList,
          fieldUuid,
          processParameterUuid,
          browseFieldUuid,
          id,
          //
          referenceUuid,
          //
          tableName,
          columnName,
          columnUuid
        })
          .then(lookupItemResponse => {
            const {
              DisplayColumn: label
            } = lookupItemResponse.values
            const option = {
              label: isEmptyValue(label) ? ' ' : label,
              uuid: lookupItemResponse.uuid,
              value: lookupItemResponse.values.KeyColumn
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

            commit('setLookupItem', {
              parentUuid, // used by suscription filter
              containerUuid, // used by suscription filter
              key,
              contextAttributesList,
              option,
              value: option.value, // isNaN(value) ? value : parseInt(value, 10),
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

    deleteLookup({ commit, rootGetters }, {
      parentUuid,
      containerUuid,
      uuid,
      contextColumnNames = [],
      value
    }) {
      return new Promise(resolve => {
        const clientId = rootGetters.getPreferenceClientId

        const contextAttributesList = getContextAttributes({
          parentUuid,
          containerUuid,
          contextColumnNames,
          isBooleanToString: true
        })
        let keyItem = `${clientId}|${uuid}`

        const contextKey = generateContextKey(contextAttributesList)
        keyItem += contextKey
        keyItem += `|${value}`

        commit('deleteLookupItem', {
          key: keyItem
        })

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
    getStoredLookupItem: (state, getters, rootState, rootGetters) => ({
      parentUuid,
      containerUuid,
      contextColumnNames = [],
      contextAttributesList = [],
      uuid
    }) => {
      const clientId = rootGetters.getPreferenceClientId
      let key = `${clientId}|${uuid}`

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

      const lookupItem = state.lookupItem[key]
      if (lookupItem) {
        return lookupItem.option
      }
      return undefined
    },

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
    getStoredLookupAll: (state, getters) => ({
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
        const option = getters.getStoredLookupItem({
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
