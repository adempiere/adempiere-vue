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

import {
  getEntities
} from '@/api/ADempiere/user-interface/persistence'
import {
  createEntity,
  deleteEntity
} from '@/api/ADempiere/common/persistence'
import router from '@/router'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

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
    /**
     * Set default values to panel
     * @param {string}  parentUuid
     * @param {string}  containerUuid
     * TODO: Evaluate if it is necessary to parse the default values
     */
    setDefaultValues({ commit, dispatch, rootGetters }, {
      parentUuid,
      containerUuid,
      isOverWriteParent = true
    }) {
      return new Promise(resolve => {
        const tab = rootGetters.getStoredTab(parentUuid, containerUuid)

        const currentRoute = router.app._route
        delete currentRoute.query.filters
        // set action
        router.push({
          name: currentRoute.name,
          params: {
            ...currentRoute.params
          },
          query: {
            ...currentRoute.query,
            action: 'create-new'
          }
        }, () => {})

        let defaultAttributes = rootGetters.getParsedDefaultValues({
          parentUuid,
          containerUuid,
          isSOTrxMenu: currentRoute.meta.isSalesTransaction,
          fieldsList: tab.fieldsList
        })

        // set vales with permant link
        if (!rootGetters['permantLink/isReadFilters'] &&
          containerUuid === rootGetters['permantLink/getLinkContainerUuid']) {
          const parsedFilters = rootGetters['permantLink/getParsedFilters']
          if (!isEmptyValue(parsedFilters)) {
            // merge values
            defaultAttributes = defaultAttributes.map(attribute => {
              const filterValue = parsedFilters[attribute.columnName]
              return {
                ...attribute,
                value: filterValue
              }
            })
          }

          commit('permantLink/setIsReadFilters', null, {
            root: true
          })
        }

        defaultAttributes.forEach(attribute => {
          commit('addChangeToPersistenceQueue', {
            ...attribute,
            containerUuid
          }, {
            root: true
          })
        })

        dispatch('updateValuesOfContainer', {
          parentUuid,
          containerUuid,
          isOverWriteParent,
          attributes: defaultAttributes
        }, {
          root: true
        })

        resolve(defaultAttributes)
      })
    },

    createEntity({
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
