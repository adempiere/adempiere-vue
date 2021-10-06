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
import { requestReferencesList } from '@/api/ADempiere/window'

const references = {
  state: {
    storedReferences: {}
  },

  mutations: {
    addReferencesList(state, payload) {
      const { windowUuid, tableName, recordUuid } = payload
      const key = windowUuid + '_' + tableName + '_' + recordUuid

      Vue.set(state.storedReferences, key, payload)
    }
  },

  actions: {
    /**
     * Get references asociate to record
     * @param {string} parentUuid as windowUuid
     * @param {string} tableName
     * @param {string} recordUuid
     */
    getReferencesFromServer({ commit }, {
      parentUuid,
      tableName,
      recordUuid
    }) {
      return new Promise((resolve, reject) => {
        requestReferencesList({
          windowUuid: parentUuid,
          tableName,
          recordUuid
        })
          .then(referenceResponse => {
            const references = {
              windowUuid: parentUuid,
              tableName,
              recordUuid,
              referencesList: referenceResponse.referencesList
            }

            commit('addReferencesList', references)

            resolve(references)
          })
          .catch(error => {
            console.warn(`References Load Error ${error.code}: ${error.message}.`)
            reject(error)
          })
      })
    }
  },

  getters: {
    getStoredReferences: (state) => ({
      windowUuid,
      tableName,
      recordUuid
    }) => {
      const key = windowUuid + '_' + tableName + '_' + recordUuid

      return state.storedReferences[key]
    }
  }
}

export default references
