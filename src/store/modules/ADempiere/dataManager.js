import {
  getEntities
} from '@/api/ADempiere/user-interface/persistence'
import {
  createEntity,
  deleteEntity
} from '@/api/ADempiere/common/persistence'

const dataManager = {
  namespaced: true,

  state: {
    containerData: []
  },

  mutations: {
    setContainerData(state, payload) {
      const index = state.containerData.findIndex(element => {
        return element.containerUuid === payload.containerUuid
      })
      if (index > -1) {
        // update records
        state.containerData.splice(index, 0, payload)
      } else {
        state.containerData.push(payload)
      }
    }
  },

  actions: {
    createEntity({
      dispatch,
      rootGetters
    }, {
      parentUuid,
      containerUuid
    }) {
      return new Promise(resolve => {
        const tab = rootGetters.getStoredTab(parentUuid, containerUuid)

        createEntity({
          tableName: tab.tableName
        })
          .then(createResponse => {
            resolve(createResponse)
          })
      })
    },

    getEntities({
      commit
    }, {
      parentUuid,
      containerUuid,
      pageToken,
      pageSize
    }) {
      return new Promise(resolve => {
        getEntities({
          windowUuid: parentUuid,
          tabUuid: containerUuid,
          pageToken,
          pageSize
        })
          .then(data => {
            const dataToStored = data.recordsList.map(record => {
              return record.attributes
            })

            commit('setContainerData', {
              parentUuid,
              containerUuid,
              recordsList: dataToStored
            })

            resolve(dataToStored)
          })
      })
    },

    deleteEntity({
      dispatch,
      rootGetters
    }, {
      parentUuid,
      containerUuid,
      recordId,
      recordUuid
    }) {
      return new Promise(resolve => {
        const tab = rootGetters.getStoredTab(parentUuid, containerUuid)

        deleteEntity({
          tableName: tab.tableName,
          recordId,
          recordUuid
        })
          .then(responseDeleteEntity => {
            dispatch('getEntities', {
              parentUuid,
              containerUuid
            })

            resolve(responseDeleteEntity)
          })
      })
    }
  },

  getters: {
    getContainerData: (state) => ({
      containerUuid
    }) => {
      return state.containerData.find(dataStored => {
        return dataStored.containerUuid === containerUuid
      })
    }
  }
}

export default dataManager
