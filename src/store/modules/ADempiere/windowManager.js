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
import router from '@/router'

// api request methods
import {
  getEntities
} from '@/api/ADempiere/user-interface/persistence.js'
import {
  deleteEntity
} from '@/api/ADempiere/common/persistence.js'

// constants
import { ROW_ATTRIBUTES } from '@/utils/ADempiere/constants/table'

// utils and helper methods
import { getContext } from '@/utils/ADempiere/contextUtils.js'
import { isEmptyValue, generatePageToken } from '@/utils/ADempiere/valueUtils.js'

const initState = {
  tabData: {}
}

const windowManager = {
  state: initState,

  mutations: {
    setTabData(state, {
      parentUuid,
      containerUuid,
      recordsList = [],
      selectionsList = [],
      nextPageToken,
      recordCount = 0,
      isLoaded = true,
      isLoadedContext = false,
      pageNumber = 1
    }) {
      const dataTab = {
        parentUuid,
        containerUuid,
        recordsList,
        selectionsList,
        nextPageToken,
        recordCount,
        isLoaded,
        isLoadedContext,
        pageNumber
      }
      Vue.set(state.tabData, containerUuid, dataTab)
    },

    setTabSelectionsList(state, {
      containerUuid,
      selectionsList
    }) {
      Vue.set(state.tabData[containerUuid], 'selectionsList', selectionsList)
    },

    resetStateWindowManager(state) {
      state = initState
    }
  },

  actions: {
    /**
     * Get list entities
     * @param {string} parentUuid
     * @param {string} containerUuid
     * @param {number} pageNumber
     * @returns {promise} array entities list
     */
    getEntities({
      commit,
      getters,
      rootGetters
    }, {
      parentUuid,
      containerUuid,
      pageNumber
    }) {
      let pageToken
      if (!isEmptyValue(pageNumber)) {
        pageNumber-- // TODO: Remove with fix in backend
        const token = getters.getTabPageToken({ containerUuid })
        pageToken = generatePageToken({ pageNumber, token })
      }

      const { contextColumnNames } = rootGetters.getStoredTab(parentUuid, containerUuid)

      const contextAttriburesList = []
      if (!isEmptyValue(contextColumnNames)) {
        contextColumnNames.forEach(columnName => {
          const value = getContext({
            parentUuid,
            containerUuid,
            columnName
          })
          contextAttriburesList.push({
            value,
            columnName
          })
        })
      }

      return new Promise(resolve => {
        getEntities({
          windowUuid: parentUuid,
          tabUuid: containerUuid,
          attributes: contextAttriburesList,
          pageToken
        })
          .then(dataResponse => {
            const dataToStored = dataResponse.recordsList.map((record, rowIndex) => {
              return {
                ...record.attributes,
                // datatables app attributes
                ...ROW_ATTRIBUTES,
                rowIndex
              }
            })

            commit('setTabData', {
              parentUuid,
              containerUuid,
              recordsList: dataToStored,
              nextPageToken: dataResponse.nextPageToken,
              recordCount: dataResponse.recordCount
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
      return new Promise((resolve, reject) => {
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
              .then(listEntities => {
                const entity = listEntities[0]
                const currentRoute = router.app._route
                // set first record of table in panel
                router.push({
                  name: currentRoute.name,
                  params: {
                    ...currentRoute.params
                  },
                  query: {
                    ...currentRoute.query,
                    action: entity.UUID
                  }
                }, () => {})

                dispatch('notifyPanelChange', {
                  parentUuid,
                  containerUuid,
                  attributes: entity
                }, {
                  root: true
                })
              })

            resolve(responseDeleteEntity)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  },

  getters: {
    /**
     * Used by result in tab
     * @param {string} containerUuid
     */
    getTabData: (state, getters) => ({ containerUuid }) => {
      return state.tabData[containerUuid] || {
        parentUuid: undefined,
        containerUuid,
        recordsList: [],
        selectionsList: [],
        nextPageToken: undefined,
        recordCount: 0,
        isLoadedContext: false,
        pageNumber: 1,
        isLoaded: false
      }
    },
    getTabRecordsList: (state, getters) => ({ containerUuid }) => {
      return getters.getTabData({ containerUuid }).recordsList
    },
    getTabSelectionsList: (state, getters) => ({ containerUuid }) => {
      return getters.getTabData({ containerUuid }).selectionsList
    },
    getTabPageNumber: (state, getters) => ({ containerUuid }) => {
      return getters.getTabData({ containerUuid }).pageNumber
    },
    getTabPageToken: (state, getters) => ({ containerUuid }) => {
      return getters.getTabData({ containerUuid }).nextPageToken
    },
    getTabRowData: (state, getters) => ({ containerUuid, recordUuid, rowIndex }) => {
      const recordsList = getters.getTabRecordsList({ containerUuid })
      if (!isEmptyValue(rowIndex)) {
        return recordsList[rowIndex]
      }

      return recordsList.find(itemData => {
        if (itemData.UUID === recordUuid) {
          return true
        }
      })
    },
    getTabCellData: (state, getters) => ({ containerUuid, recordUuid, rowIndex, columnName }) => {
      const recordsList = getters.getTabRecordsList({ containerUuid })

      let row = {}
      if (!isEmptyValue(rowIndex)) {
        row = recordsList[rowIndex]
      }

      if (isEmptyValue(row) && !isEmptyValue(recordUuid)) {
        row = recordsList.find(itemData => {
          if (itemData.UUID === recordUuid) {
            return true
          }
        })
      }

      if (!isEmptyValue(row)) {
        return row[columnName]
      }
      return undefined
    }
  }
}

export default windowManager
