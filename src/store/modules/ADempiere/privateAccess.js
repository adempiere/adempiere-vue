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
import language from '@/lang'

// api request methods
import {
  getPrivateAccess,
  lockPrivateAccess,
  unlockPrivateAccess
} from '@/api/ADempiere/actions/private-access'

// utils and helper methods
import { showMessage } from '@/utils/ADempiere/notification'

const initState = {
  privateAccessRecord: {}
}

const privateAccess = {
  state: initState,

  mutations: {
    resetStatePrivateAccess(state) {
      state = initState
    },
    setPrivateAccess(state, { tableName, recordUuid, recordId, isLocked }) {
      const key = `${tableName}_${recordUuid}`

      Vue.set(state.privateAccessRecord, key, {
        tableName,
        recordUuid,
        recordId,
        isLocked
      })
    }
  },

  actions: {
    getPrivateAccessFromServer({ commit }, {
      tableName,
      recordId,
      recordUuid
    }) {
      return new Promise(resolve => {
        getPrivateAccess({
          tableName,
          recordId,
          recordUuid
        })
          .then(privateAccessResponse => {
            const { isLocked } = privateAccessResponse

            commit('setPrivateAccess', {
              tableName,
              recordId,
              recordUuid,
              isLocked
            })

            resolve(isLocked)
          })
          .catch(error => {
            console.warn(`Error get private access: ${error.message}. Code: ${error.code}.`)
          })
      })
    },

    lockRecordFromServer({ commit }, {
      tableName,
      recordId,
      recordUuid
    }) {
      return new Promise(resolve => {
        lockPrivateAccess({
          tableName,
          recordId,
          recordUuid
        })
          .then(lockRecordResponse => {
            const { isLocked } = lockRecordResponse

            commit('setPrivateAccess', {
              tableName,
              recordId,
              recordUuid,
              isLocked
            })

            showMessage({
              message: language.t('notifications.recordLocked'),
              type: 'success'
            })

            resolve(isLocked)
          })
          .catch(error => {
            showMessage({
              message: language.t('login.unexpectedError') + error.message,
              type: 'error'
            })
            console.warn(`Error lock private access: ${error.message}. Code: ${error.code}.`)
          })
      })
    },

    unlockRecordFromServer({ commit }, {
      tableName,
      recordId,
      recordUuid
    }) {
      return new Promise(resolve => {
        unlockPrivateAccess({
          tableName,
          recordId,
          recordUuid
        })
          .then(unLockRecordResponse => {
            const { isLocked } = unLockRecordResponse

            commit('setPrivateAccess', {
              tableName,
              recordId,
              recordUuid,
              isLocked
            })

            showMessage({
              message: language.t('notifications.recordUnlocked'),
              type: 'success'
            })

            resolve(isLocked)
          })
          .catch(error => {
            showMessage({
              message: language.t('login.unexpectedError') + error.message,
              type: 'error'
            })
            console.warn(`Error unlock private access: ${error.message}. Code: ${error.code}.`)
          })
      })
    }
  },

  getters: {
    getStoredPrivateAccess: (state) => ({ tableName, recordUuid }) => {
      return state.privateAccessRecord[`${tableName}_${recordUuid}`]
    }
  }
}

export default privateAccess
