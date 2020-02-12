import { requestListRecordsLogs, requestListWorkflowsLogs, requestListWorkflows, requestListRecordChats, requestListChatEntries, requestCreateChatEntry } from '@/api/ADempiere/data'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

const containerInfo = {
  state: {
    listworkflowLog: [],
    listRecordLogs: [],
    listRecordChats: [],
    listChatEntries: [],
    listWorkflows: [],
    chat: [],
    note: [],
    isNote: false
  },
  mutations: {
    addListWorkflow(state, payload) {
      state.listworkflowLog = payload
    },
    addListWorkflows(state, payload) {
      state.listworkflows = payload
    },
    addListRecordLogs(state, payload) {
      state.listRecordLogs = payload
    },
    addListRecordChats(state, payload) {
      state.listRecordChats = payload
    },
    addListChatEntries(state, payload) {
      state.listChatEntries = payload
    },
    addListChat(state, payload) {
      state.chat = payload
    },
    addNote(state, payload) {
      state.note = payload
    },
    isNote(state, payload) {
      state.isNote = payload
    }
  },
  actions: {
    createChatEntry({ commit, dispatch }, params) {
      const tableName = params.tableName
      const recordId = params.recordId
      const comment = params.comment
      return requestCreateChatEntry({ tableName, recordId, comment })
        .then(response => {
          commit('isNote', true)
          dispatch('listChatEntries', {
            tableName: tableName,
            recordId: recordId
          })
          commit('addNote', response)
        })
        .catch(error => {
          console.warn(`Error getting epale error en guardar: ${error.message}. Code: ${error.code}.`)
        })
    },
    isNote({ commit }, params) {
      commit('isNote', params)
    },
    listChatEntries({ commit, state, dispatch }, params) {
      const tableName = params.tableName
      const recordId = params.recordId
      const pageSize = 0
      const pageToken = 0
      return requestListRecordChats({ tableName, recordId, pageSize, pageToken })
        .then(response => {
          var chatList = response.recordChatsList
          var listRecord = {
            recordChatsList: response.recordChatsList,
            recordCount: response.recordCount,
            nextPageToken: response.nextPageToken
          }
          chatList.forEach(chat => {
            var uuid = chat.chatUuid
            requestListChatEntries({ uuid, pageSize, pageToken })
              .then(response => {
                var listlogsChat = state.chat
                let chatUpgrade = []
                let chatAll
                if (recordId === chat.recordId) {
                  chatUpgrade = response.chatEntriesList
                  listlogsChat.concat(chatUpgrade)
                  chatAll = listlogsChat.concat(chatUpgrade)
                  commit('addListChat', response.chatEntriesList)
                }
                commit('addListChatEntries', chatAll)
              })
              .catch(error => {
                console.warn(`Error getting List Chat: ${error.message}. Code: ${error.code}.`)
              })
          })
          commit('isNote', !isEmptyValue(response.recordChatsList))
          commit('addListRecordChats', listRecord)
        })
        .catch(error => {
          console.warn(`Error getting List Chat: ${error.message}. Code: ${error.code}.`)
        })
    },
    listRecordLogs({ commit, state }, params) {
      const tableName = params.tableName
      const recordId = params.recordId
      const pageSize = 0
      const pageToken = 0
      return requestListRecordsLogs({ tableName, recordId, pageSize, pageToken })
        .then(response => {
          var listRecord = {
            recordCount: response.recordCount,
            recorLogs: response.recordLogsList
          }
          commit('addListRecordLogs', listRecord)
        })
        .catch(error => {
          console.warn(`Error getting List Record Logs: ${error.message}. Code: ${error.code}.`)
        })
    },
    listWorkflowLogs({ commit, state, dispatch }, params) {
      const tableName = params.tableName
      const recordId = params.recordId
      const pageSize = 0
      const pageToken = 0
      dispatch('listWorkflows', {
        tableName: tableName
      })
      return requestListWorkflowsLogs({ tableName, recordId, pageSize, pageToken })
        .then(response => {
          var workflowLog = {
            recordCount: response.recordCount,
            workflowLogsList: response.workflowLogsList,
            nextPageToken: response.nextPageToken
          }
          commit('addListWorkflow', workflowLog)
        })
        .catch(error => {
          console.warn(`Error getting List workflow: ${error.message}. Code: ${error.code}.`)
        })
    },
    listWorkflows({ commit, state }, params) {
      const tableName = params.tableName
      const pageSize = 0
      const pageToken = 0
      return requestListWorkflows({ tableName, pageSize, pageToken })
        .then(response => {
          commit('addListWorkflows', response)
        })
        .catch(error => {
          console.warn(`Error getting List workflow: ${error.message}. Code: ${error.code}.`)
        })
    }
  },
  getters: {
    getWorkflow: (state) => {
      return state.listworkflowLog.workflowLogsList
    },
    getRecordLogs: (state) => {
      return state.listRecordLogs
    },
    getListRecordChats: (state) => {
      return state.listRecordChats.recordChatsList
    },
    getChatEntries: (state) => {
      return state.listChatEntries
    },
    getAddNote: (state) => {
      return state.note
    },
    getIsNote: (state) => {
      return state.isNote
    }
  }
}

export default containerInfo
