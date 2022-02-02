// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
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

import language from '@/lang'

// constants
import { LOG_COLUMNS_NAME_LIST } from '@/utils/ADempiere/constants/systemColumns'

// api request methods
import {
  createEntity,
  updateEntity
} from '@/api/ADempiere/common/persistence.js'

// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification.js'

const persistence = {
  state: {
    persistence: {}
  },

  mutations: {
    resetStatepersistence(state) {
      state = {
        persistence: {}
      }
    },
    addChangeToPersistenceQueue(state, {
      containerUuid,
      columnName,
      // valueType,
      value
    }) {
      if (isEmptyValue(state.persistence[containerUuid])) {
        state.persistence[containerUuid] = new Map()
      }
      // Set value
      state.persistence[containerUuid].set(columnName, {
        columnName: columnName,
        // valueType,
        value
      })
    }
  },

  actions: {
    actionPerformed({ commit, getters, dispatch }, {
      field,
      recordUuid,
      value
    }) {
      return new Promise((resolve, reject) => {
        const { parentUuid, containerUuid } = field
        commit('addChangeToPersistenceQueue', {
          containerUuid,
          columnName: field.columnName,
          value
        })

        const emptyFields = getters.getTabFieldsEmptyMandatory({
          parentUuid,
          containerUuid,
          formatReturn: false
        }).filter(itemField => {
          // omit send to server (to create or update) columns manage by backend
          return itemField.isAlwaysUpdateable ||
            !LOG_COLUMNS_NAME_LIST.includes(itemField.columnName)
        }).map(itemField => {
          return itemField.name
        })

        if (!isEmptyValue(emptyFields)) {
          showMessage({
            message: language.t('notifications.mandatoryFieldMissing') + emptyFields,
            type: 'info'
          })
          return
        }

        if (isEmptyValue(recordUuid) || recordUuid === 'create-new') {
          recordUuid = getters.getUuidOfContainer(field.containerUuid)
        }

        dispatch('flushPersistenceQueue', {
          containerUuid,
          tableName: field.tabTableName,
          recordUuid
        })
          .then(response => {
            resolve(response)
          })
          .catch(error => reject(error))
      })
    },

    flushPersistenceQueue({ getters }, {
      containerUuid,
      tableName,
      recordUuid
    }) {
      return new Promise((resolve, reject) => {
        let attributesList = getters.getPersistenceAttributes(containerUuid)
          .filter(itemField => {
            // omit send to server (to create or update) columns manage by backend
            return itemField.isAlwaysUpdateable ||
              !LOG_COLUMNS_NAME_LIST.includes(itemField.columnName)
          })

        if (!isEmptyValue(attributesList)) {
          if (!isEmptyValue(recordUuid)) {
            // Update existing entity
            updateEntity({
              tableName,
              recordUuid,
              attributesList
            })
              .then(response => {
                // TODO: Get list record log
                showMessage({
                  message: language.t('recordManager.updatedRecord'),
                  type: 'success'
                })
                resolve(response)
              })
              .catch(error => reject(error))
          } else {
            attributesList = attributesList.filter(itemAttribute => !isEmptyValue(itemAttribute.value))

            // Create new entity
            createEntity({
              tableName,
              attributesList
            })
              .then(response => {
                showMessage({
                  message: language.t('data.createRecordSuccessful'),
                  type: 'success'
                })
                response.type = 'createEntity'
                resolve(response)
              })
              .catch(error => reject(error))
          }
        }
      })
    }
  },

  getters: {
    getPersistenceMap: (state) => (tableName) => {
      return state.persistence[tableName]
    },
    getPersistenceAttributes: (state) => (containerUuid) => {
      const attributesMap = state.persistence[containerUuid]
      if (!isEmptyValue(attributesMap)) {
        return [
          ...attributesMap.values()
        ]
      }
      return undefined
    }
  }
}

export default persistence
