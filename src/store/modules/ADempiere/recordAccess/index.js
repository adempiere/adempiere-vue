import {
  getRecordAccess
} from '@/api/ADempiere/actions/record-access.js'

import { isEmptyValue } from '@/utils/ADempiere'

const initStateRecordAccess = {
  listRecordAccess: [],
  showRecordAccess: false
}

const containerInfo = {
  state: initStateRecordAccess,
  mutations: {
    setRecordAccess(state, payload) {
      state.listRecordAccess = payload
    },
    setShowRecordAccess(state, payload) {
      state.showRecordAccess = payload
    }
  },
  actions: {
    listRecordAccess({ commit }, {
      tableName,
      recordId,
      recordUuid
    }) {
      if (isEmptyValue(tableName) && (isEmptyValue(recordId) || isEmptyValue(recordUuid))) {
        return
      }
      return getRecordAccess({
        tableName,
        recordId,
        recordUuid
      })
        .then(response => {
          console.log({ response })
          commit('setRecordAccess', response)
          return response
        })
        .catch(error => {
          console.warn(`Error getting List Record Access: ${error.message}. Code: ${error.code}.`)
        })
    },
    showPanel({ commit }, show) {
      commit('setShowRecordAccess', show)
    }
  },
  getters: {
    getRecordAccess: (state) => {
      return state.listRecordAccess
    },
    getShowPanelRecordAccess: (state) => {
      return state.showRecordAccess
    }
  }
}

export default containerInfo
