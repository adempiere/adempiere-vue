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
import { requestDefaultValue } from '@/api/ADempiere/user-interface/persistence.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

// utils and helper methods
import { isSameSize } from '@/utils/ADempiere/formatValue/iterableFormat'
import { generateContextKey, getContextAttributes } from '@/utils/ADempiere/contextUtils'

const initState = {
  inRequest: new Map(),
  storedDefaultValue: {}
}

const defaultValueManager = {
  state: initState,

  mutations: {
    setDefaultValue(state, { key, clientId, contextAttributesList, uuid, displayedValue, value }) {
      Vue.set(state.storedDefaultValue, key, {
        clientId,
        contextAttributesList,
        uuid,
        displayedValue,
        value
      })
    },

    deleteDefaultValue(state, {
      key
    }) {
      Vue.set(state.storedDefaultValue, key, undefined)
    },

    resetStateDefaultValue(state) {
      state = initState
    }
  },

  actions: {
    /**
     * @param {string} parentUuid
     * @param {string} containerUuid
     * @param {string} columnName
     * @param {array} contextColumnNames
     * @param {string} fieldUuid|processParameterUuid|columnUuid|browseFieldUuid
     */
    getDefaultValueFromServer({ state, commit, rootGetters }, {
      parentUuid,
      containerUuid,
      contextColumnNames,
      //
      id,
      fieldUuid,
      processParameterUuid,
      browseFieldUuid,
      columnUuid,
      columnName
    }) {
      const defaultEmptyResponse = {
        uuid: undefined,
        displayedValue: undefined,
        value: undefined
      }
      return new Promise(resolve => {
        if (isEmptyValue(id) && isEmptyValue(fieldUuid) && isEmptyValue(processParameterUuid) && isEmptyValue(browseFieldUuid)) {
          resolve(defaultEmptyResponse)
          return
        }

        const contextAttributesList = getContextAttributes({
          parentUuid,
          containerUuid,
          contextColumnNames,
          isBooleanToString: true
        })
        // fill context value to continue
        if (!isSameSize(contextColumnNames, contextAttributesList)) {
          resolve(defaultEmptyResponse)
          return
        }

        const isWithoutValues = contextAttributesList.find(attribute => isEmptyValue(attribute.value))
        if (isWithoutValues) {
          console.warn(`Without response, fill the ${isWithoutValues.columnName} field.`)
          resolve(defaultEmptyResponse)
          return
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

        // if it is the same request, it is not made
        if (state.inRequest.get(key)) {
          resolve()
          return
        }
        state.inRequest.set(key, true)
        requestDefaultValue({
          contextAttributesList,
          id,
          fieldUuid,
          processParameterUuid,
          browseFieldUuid,
          columnUuid
        })
          .then(valueResponse => {
            const values = {}

            // TODO: Response from server same name key of value
            if (valueResponse.attributes.length === 1) {
              values.KeyColumn = valueResponse.attributes[0].value
              values.DisplayColumn = undefined
            } else {
              valueResponse.attributes.forEach(attribute => {
                const { key: column, value } = attribute
                values[column] = value
              })
            }
            const value = values.KeyColumn
            const displayedValue = values.DisplayColumn

            commit('setDefaultValue', {
              key,
              clientId,
              contextAttributesList,
              id,
              displayedValue,
              value,
              uuid: values.uuid
            })

            commit('updateValueOfField', {
              parentUuid,
              containerUuid,
              columnName,
              value
            })
            if (!isEmptyValue(values.DisplayColumn)) {
              commit('updateValueOfField', {
                parentUuid,
                containerUuid,
                columnName: `DisplayColumn_${columnName}`,
                value: displayedValue
              })
            }

            resolve({
              displayedValue,
              value: value,
              uuid: values.uuid
            })
          })
          .catch(error => {
            console.warn(`Error getting default value (${columnName}) from server. Error code ${error.code}: ${error.message}.`)
          })
          .finally(() => {
            // current request finalized
            state.inRequest.set(key, false)
          })
      })
    },

    deleteDefaultValue({ commit, rootGetters }, {
      parentUuid,
      containerUuid,
      uuid,
      contextColumnNames = [],
      value
    }) {
      return new Promise(resolve => {
        const clientId = rootGetters.getPreferenceClientId
        let key = `${clientId}|${uuid}`

        const contextAttributesList = getContextAttributes({
          parentUuid,
          containerUuid,
          contextColumnNames,
          isBooleanToString: true
        })

        const contextKey = generateContextKey(contextAttributesList)

        key += contextKey
        key += `|${value}`

        commit('deleteDefaultValue', {
          key
        })

        resolve()
      })
    }
  },

  getters: {
    getStoredDefaultValue: (state, getters, rootState, rootGetters) => ({
      parentUuid,
      containerUuid,
      contextColumnNames = [],
      contextAttributesList = [],
      uuid
    }) => {
      if (isEmptyValue(contextAttributesList) && !isEmptyValue(contextColumnNames)) {
        contextAttributesList = getContextAttributes({
          parentUuid,
          containerUuid,
          contextColumnNames,
          isBooleanToString: true
        })
      }

      const clientId = rootGetters.getPreferenceClientId
      let key = `${clientId}|${uuid}`
      const contextKey = generateContextKey(contextAttributesList)
      key += contextKey

      const values = state.storedDefaultValue[key]

      return values
    }
  }
}

export default defaultValueManager
