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
import { parseContext } from '@/utils/ADempiere/contextUtils'

const initState = {
  inRequest: new Map(),
  storedDefaultValue: {}
}

const defaultValueManager = {
  state: initState,

  mutations: {
    setDefaultValue(state, { clientId, parsedQuery, value }) {
      const key = `${clientId}_${parsedQuery}`

      Vue.set(state.storedDefaultValue, key, {
        clientId,
        parsedQuery,
        value
      })
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
     * @param {string} query
     */
    getDefaultValue({ state, commit, rootGetters }, {
      parentUuid,
      containerUuid,
      columnName,
      query
    }) {
      return new Promise(resolve => {
        let parsedQuery = query
        if (query.includes('@')) {
          const context = parseContext({
            parentUuid,
            containerUuid,
            isSQL: true,
            value: query
          })
          if (context.isError) {
            return undefined
          }
          parsedQuery = context.query
        }

        const clientId = rootGetters.getPreferenceClientId
        const key = `${clientId}_${parsedQuery}`

        // if it is the same request, it is not made
        if (state.inRequest.get(key)) {
          return
        }
        state.inRequest.set(key, true)
        requestDefaultValue(parsedQuery)
          .then(valueResponse => {
            commit('setDefaultValue', {
              clientId,
              parsedQuery,
              value: valueResponse
            })

            commit('updateValueOfField', {
              parentUuid,
              containerUuid,
              columnName,
              value: valueResponse
            })

            resolve(valueResponse)
          })
          .catch(error => {
            console.warn(`Error getting default value from server. Error code ${error.code}: ${error.message}.`)
          })
          .finally(() => {
            // current request finalized
            state.inRequest.set(key, false)
          })
      })
    }
  },

  getters: {
    getStoredDefaultValue: (state, getters, rootState, rootGetters) => ({
      parentUuid,
      containerUuid,
      query
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

      const clientId = rootGetters.getPreferenceClientId
      const key = `${clientId}_${parsedQuery}`

      const defaultValue = state.storedDefaultValue[key]
      if (!isEmptyValue(defaultValue)) {
        return defaultValue.value
      }
      return undefined
    }
  }
}

export default defaultValueManager
