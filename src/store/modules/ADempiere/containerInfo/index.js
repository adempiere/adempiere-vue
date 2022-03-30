import {
  requestListEntityLogs
} from '@/api/ADempiere/window'
import {
  getAttachment
} from '@/api/ADempiere/user-interface/resources.js'
import { isEmptyValue, getSource } from '@/utils/ADempiere'

// const initStateContainerInfo = {
//   recordLogs: [],
//   recordAttachment: []
// }

const containerInfo = {
  // TODO: Go to Vuex Module
  state: {
    listRecordLogs: [],
    recordAttachment: []
  },
  mutations: {
    addListRecordLogs(state, payload) {
      state.listRecordLogs = payload
    },
    setAttachment(state, attachment) {
      state.recordAttachment = attachment
    }
  },
  actions: {
    listRecordLogs({ commit }, {
      tableName,
      recordId,
      recordUuid
    }) {
      const pageSize = 0
      const pageToken = 0
      if (isEmptyValue(tableName) && (isEmptyValue(recordId) || isEmptyValue(recordUuid))) {
        return
      }
      return requestListEntityLogs({
        tableName,
        recordId,
        recordUuid,
        pageSize,
        pageToken
      })
        .then(response => {
          commit('addListRecordLogs', response)
          return response
        })
        .catch(error => {
          console.warn(`Error getting List Record Logs: ${error.message}. Code: ${error.code}.`)
        })
    },
    findAttachment({ commit }, {
      tableName,
      recordId,
      recordUuid
    }) {
      const pageSize = 0
      const pageToken = 0
      if (isEmptyValue(tableName) && (isEmptyValue(recordId) || isEmptyValue(recordUuid))) {
        return
      }
      return getAttachment({
        tableName,
        recordId,
        recordUuid,
        pageSize,
        pageToken
      })
        .then(response => {
          if (response.resourceReferencesList.length > 0) {
            const image = response.resourceReferencesList.map(element => {
              return {
                ...element,
                url: getSource({ resourceUuid: element.resource_uuid, resourceName: element.file_name, resourceType: element.content_type })
              }
            })
            if (image.length > 0) {
              commit('setAttachment', image)
            }
          }
          return response
        })
        .catch(error => {
          console.warn(`Error getting List Record Logs: ${error.message}. Code: ${error.code}.`)
        })
    }
  },
  getters: {
    getRecordLogs: (state) => {
      return state.listRecordLogs
    },
    getAttachment: (state) => {
      return state.recordAttachment
    }
  }
}

export default containerInfo
