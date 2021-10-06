import {
  createEntity,
  updateEntity
} from '@/api/ADempiere/common/persistence.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { LOG_COLUMNS_NAME_LIST } from '@/utils/ADempiere/constants/systemColumns'
import language from '@/lang'
import { showMessage } from '@/utils/ADempiere/notification.js'
import router from '@/router'

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

        // TODO: Add dictonary getter
        const fieldsList = getters.getStoredFieldsFromTab(parentUuid, containerUuid)

        const emptyFields = getters.getFieldsListEmptyMandatory({
          containerUuid,
          formatReturn: false,
          fieldsList
        }).filter(itemField => {
          return !LOG_COLUMNS_NAME_LIST.includes(itemField.columnName)
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
        const route = router.app._route
        recordUuid = route.query.action === 'create-new'
          ? getters.getUuidOfContainer(field.containerUuid)
          : route.query.action

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

    flushPersistenceQueue({ getters, dispatch }, {
      containerUuid,
      tableName,
      recordUuid
    }) {
      return new Promise((resolve, reject) => {
        let attributesList = getters.getPersistenceAttributes(containerUuid)
          .filter(itemField => {
            // omit send to server (to create or update) columns manage by backend
            return !LOG_COLUMNS_NAME_LIST.includes(itemField.columnName)
          })
        if (attributesList) {
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
