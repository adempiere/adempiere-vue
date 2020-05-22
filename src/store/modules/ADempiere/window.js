import { createEntity, updateEntity, deleteEntity, rollbackEntity } from '@/api/ADempiere/persistence'
import { getReferencesList } from '@/api/ADempiere/values'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { fieldIsDisplayed } from '@/utils/ADempiere/dictionaryUtils'
import { parseContext } from '@/utils/ADempiere/contextUtils'
import { showMessage } from '@/utils/ADempiere/notification'
import language from '@/lang'
import router from '@/router'

const initStateWindowControl = {
  inCreate: [],
  references: [],
  windowOldRoute: {
    path: '',
    fullPath: '',
    query: {}
  },
  dataLog: {}, // { containerUuid, recordId, tableName, eventType }
  tabSequenceRecord: [],
  totalResponse: 0,
  totalRequest: 0
}

const windowControl = {
  state: initStateWindowControl,
  mutations: {
    addInCreate(state, payload) {
      state.inCreate.push(payload)
    },
    deleteInCreate(state, payload) {
      state.inCreate = state.inCreate.filter(item => item.containerUuid !== payload.containerUuid)
    },
    addReferencesList(state, payload) {
      state.references.push(payload)
    },
    setDataLog(state, payload) {
      state.dataLog = payload
    },
    setWindowOldRoute(state, payload) {
      state.windowOldRoute = payload
    },
    setTabSequenceRecord(state, payload) {
      state.tabSequenceRecord = payload
    },
    setTotalResponse(state, payload) {
      state.totalResponse = payload
    },
    setTotalRequest(state, payload) {
      state.totalRequest = payload
    },
    resetStateWindowControl(state) {
      state = initStateWindowControl
    }
  },
  actions: {
    tableActionPerformed({ dispatch, getters }, {
      field,
      value
    }) {
      // console.log({
      //   field,
      //   value
      // })
    },
    windowActionPerformed({ dispatch, commit, getters }, {
      field,
      value
    }) {
      //  get value from store
      if (!value) {
        value = getters.getValueOfField({
          containerUuid: field.containerUuid,
          columnName: field.columnName
        })
      }
      return new Promise((resolve, reject) => {
        // request callouts
        dispatch('runCallout', {
          parentUuid: field.parentUuid,
          containerUuid: field.containerUuid,
          tableName: field.tableName,
          columnName: field.columnName,
          callout: field.callout,
          oldValue: field.oldValue,
          valueType: field.valueType,
          value
        })
          .then(response => {
            //  Context Info
            dispatch('reloadContextInfo', {
              field
            })
            //  Apply actions for server
            dispatch('runServerAction', {
              field,
              value
            })
              .then(response => resolve(response))
              .catch(error => reject(error))
          })
      })
    },
    runServerAction({ dispatch, getters, commit }, {
      field,
      value
    }) {
      return new Promise((resolve, reject) => {
        // For change options
        if (fieldIsDisplayed(field)) {
          commit('addChangeToPersistenceQueue', {
            ...field,
            value
          })
          const emptyFields = getters.getFieldListEmptyMandatory({
            containerUuid: field.containerUuid
          })
          if (!isEmptyValue(emptyFields)) {
            showMessage({
              message: language.t('notifications.mandatoryFieldMissing') + emptyFields,
              type: 'info'
            })
          } else {
            dispatch('flushPersistenceQueue', {
              tableName: field.tableName,
              recordUuid: getters.getUuidOfContainer(field.containerUuid)
            })
              .then(response => resolve(response))
              .catch(error => reject(error))
          }
        }
      })
    },
    reloadContextInfo({ dispatch, getters }, {
      field
    }) {
      //  get value from store
      const value = getters.getValueOfField({
        containerUuid: field.containerUuid,
        columnName: field.columnName
      })
      // request context info field
      if (!isEmptyValue(value) && !isEmptyValue(field.contextInfo) && !isEmptyValue(field.contextInfo.sqlStatement)) {
        let isSQL = false
        let sqlStatement = field.contextInfo.sqlStatement
        if (sqlStatement.includes('@')) {
          if (sqlStatement.includes('@SQL=')) {
            isSQL = true
          }
          sqlStatement = parseContext({
            parentUuid: field.parentUuid,
            containerUuid: field.containerUuid,
            columnName: field.columnName,
            value: sqlStatement,
            isSQL
          }).value
          if (isSQL && String(sqlStatement) === '[object Object]') {
            sqlStatement = sqlStatement.query
          }
        }
        const contextInfo = dispatch('getContextInfoValueFromServer', {
          parentUuid: field.parentUuid,
          containerUuid: field.containerUuid,
          contextInfoUuid: field.contextInfo.uuid,
          columnName: field.columnName,
          sqlStatement
        })
        if (!isEmptyValue(contextInfo) && !isEmptyValue(contextInfo.messageText)) {
          field.contextInfo.isActive = true
          field.contextInfo.messageText.msgText = contextInfo.messageText
          field.contextInfo.messageText.msgTip = contextInfo.messageTip
        }
      }
    },
    undoPanelToNew({ dispatch, rootGetters }, { containerUuid }) {
      const oldAttributes = rootGetters.getColumnNamesAndValues({
        containerUuid,
        propertyName: 'oldValue',
        isObjectReturn: true,
        isAddDisplayColumn: true
      })
      dispatch('notifyPanelChange', {
        containerUuid,
        newValues: oldAttributes
      })
    },
    // createNewEntity({ commit, dispatch, getters, rootGetters }, {
    //   parentUuid,
    //   containerUuid
    // }) {
    //   return new Promise((resolve, reject) => {
    //     // exists some call to create new record with container uuid
    //     if (getters.getInCreate(containerUuid)) {
    //       return reject({
    //         error: 0,
    //         message: `In this panel (${containerUuid}) is a create new record in progress`
    //       })
    //     }
    //
    //     const { tableName, fieldList } = rootGetters.getPanel(containerUuid)
    //     // delete key from attributes
    //     const attributesList = rootGetters.getColumnNamesAndValues({
    //       containerUuid,
    //       propertyName: 'value',
    //       isEvaluateValues: true,
    //       isAddDisplayColumn: false
    //     })
    //     console.log(attributesList)
    //     commit('addInCreate', {
    //       containerUuid,
    //       tableName,
    //       attributesList
    //     })
    //     createEntity({
    //       tableName,
    //       attributesList
    //     })
    //       .then(createEntityResponse => {
    //         const newValues = createEntityResponse.values
    //         attributesList.forEach(element => {
    //           if (element.columnName.includes('DisplayColumn')) {
    //             newValues[element.columnName] = element.value
    //           }
    //         })
    //
    //         showMessage({
    //           message: language.t('data.createRecordSuccessful'),
    //           type: 'success'
    //         })
    //
    //         // update fields with new values
    //         dispatch('notifyPanelChange', {
    //           parentUuid,
    //           containerUuid,
    //           newValues,
    //           isSendToServer: false
    //         })
    //         dispatch('addNewRow', {
    //           parentUuid,
    //           containerUuid,
    //           isPanelValues: true,
    //           isEdit: false
    //         })
    //
    //         // set data log to undo action
    //         const fieldId = fieldList.find(itemField => itemField.isKey)
    //         dispatch('setDataLog', {
    //           containerUuid,
    //           tableName,
    //           recordId: fieldId.value, // TODO: Verify performance with tableName_ID
    //           recordUuid: newValues.UUID,
    //           eventType: 'INSERT'
    //         })
    //
    //         const oldRoute = router.app._route
    //         router.push({
    //           name: oldRoute.name,
    //           params: {
    //             ...oldRoute.params
    //           },
    //           query: {
    //             ...oldRoute.query,
    //             action: createEntityResponse.uuid
    //           }
    //         })
    //         dispatch('tagsView/delView', oldRoute, true)
    //
    //         resolve({
    //           data: newValues,
    //           recordUuid: createEntityResponse.uuid,
    //           recordId: createEntityResponse.id,
    //           tableName: createEntityResponse.tableName
    //         })
    //       })
    //       .catch(error => {
    //         showMessage({
    //           message: error.message,
    //           type: 'error'
    //         })
    //         console.warn(`Create Entity error: ${error.message}.`)
    //         reject(error)
    //       })
    //       .finally(() => {
    //         commit('deleteInCreate', {
    //           containerUuid,
    //           tableName,
    //           attributesList
    //         })
    //       })
    //   })
    // },
    createEntityFromTable({ commit, dispatch, getters, rootGetters }, {
      parentUuid,
      containerUuid,
      row
    }) {
      // exists some call to create new record with container uuid
      if (getters.getInCreate(containerUuid)) {
        return {
          error: 0,
          message: `In this panel (${containerUuid}) is a create new record in progress.`
        }
      }
      const { tableName, isParentTab } = rootGetters.getPanel(containerUuid)

      // TODO: Add support to Binary columns (BinaryData)
      const columnsToDontSend = ['BinaryData', 'isEdit', 'isNew', 'isSendServer']

      // TODO: Evaluate peformance without filter using delete(prop) before convert object to array
      // attributes or fields
      const fieldsList = getters.getFieldsListFromPanel(containerUuid)
      const attributesList = []
      fieldsList.forEach(itemAttribute => {
        if (columnsToDontSend.includes(itemAttribute.columnName) || itemAttribute.columnName.includes('DisplayColumn')) {
          return false
        }
        if (isEmptyValue(row[itemAttribute.columnName])) {
          return false
        }

        attributesList.push({
          value: row[itemAttribute.columnName],
          columnName: itemAttribute.columnName,
          valueType: itemAttribute.valueType
        })
      })

      commit('addInCreate', {
        containerUuid,
        tableName,
        attributesList
      })

      let isError = false
      return createEntity({
        tableName,
        attributesList
      })
        .then(createEntityResponse => {
          showMessage({
            message: language.t('data.createRecordSuccessful'),
            type: 'success'
          })
          if (isParentTab) {
            // redirect to create new record
            const oldRoute = router.app._route
            router.push({
              name: oldRoute.name,
              params: {
                ...oldRoute.params
              },
              query: {
                ...oldRoute.query,
                action: createEntityResponse.recordUuid
              }
            })
          }
          return {
            data: createEntityResponse.values,
            ...createEntityResponse
          }
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'error'
          })
          console.warn(`Create Entity Table Error ${error.code}: ${error.message}.`)
          isError = true
        })
        .finally(() => {
          if (isError) {
            dispatch('addNewRow', {
              containerUuid,
              row
            })
          } else {
            // refresh record list
            dispatch('getDataListTab', {
              parentUuid,
              containerUuid
            })
              .catch(error => {
                console.warn(`Error getting data list tab. Message: ${error.message}, code ${error.code}.`)
              })
          }
          commit('deleteInCreate', {
            containerUuid,
            tableName,
            attributesList
          })
        })
    },
    // updateCurrentEntity({ dispatch, rootGetters }, {
    //   containerUuid,
    //   recordUuid = null
    // }) {
    //   const panel = rootGetters.getPanel(containerUuid)
    //   if (!recordUuid) {
    //     recordUuid = rootGetters.getUuid(containerUuid)
    //   }
    //
    //   // TODO: Add support to Binary columns (BinaryData)
    //   const columnsToDontSend = ['Account_Acct']
    //
    //   // attributes or fields
    //   let finalAttributes = rootGetters.getColumnNamesAndValues({
    //     containerUuid: containerUuid,
    //     isEvaluatedChangedValue: true
    //   })
    //
    //   finalAttributes = finalAttributes.filter(itemAttribute => {
    //     if (columnsToDontSend.includes(itemAttribute.columnName) || itemAttribute.columnName.includes('DisplayColumn')) {
    //       return false
    //     }
    //     const field = panel.fieldList.find(itemField => itemField.columnName === itemAttribute.columnName)
    //     if (!field || !field.isUpdateable || !field.isDisplayed) {
    //       return false
    //     }
    //     return true
    //   })
    //   return updateEntity({
    //     tableName: panel.tableName,
    //     recordUuid,
    //     attributesList: finalAttributes
    //   })
    //     .then(updateEntityResponse => {
    //       const newValues = updateEntityResponse.values
    //       // set data log to undo action
    //       // TODO: Verify performance with tableName_ID
    //       let recordId = updateEntityResponse.id
    //       if (isEmptyValue(recordId)) {
    //         recordId = newValues[`${panel.tableName}_ID`]
    //       }
    //       if (isEmptyValue(recordId)) {
    //         const fieldId = panel.fieldList.find(itemField => itemField.isKey)
    //         recordId = fieldId.value
    //       }
    //
    //       if (isEmptyValue(recordUuid)) {
    //         recordUuid = updateEntityResponse.uuid
    //       }
    //       if (isEmptyValue(recordUuid)) {
    //         recordUuid = newValues.UUID
    //       }
    //
    //       dispatch('setDataLog', {
    //         containerUuid,
    //         tableName: panel.tableName,
    //         recordId,
    //         recordUuid,
    //         eventType: 'UPDATE'
    //       })
    //       if (rootGetters.getShowContainerInfo) {
    //         dispatch('listRecordLogs', {
    //           tableName: panel.tableName,
    //           recordId
    //         })
    //       }
    //       return newValues
    //     })
    //     .catch(error => {
    //       showMessage({
    //         message: error.message,
    //         type: 'error'
    //       })
    //       console.warn(`Update Entity Error ${error.code}: ${error.message}`)
    //     })
    // },
    // updateCurrentEntityFromTable({ rootGetters }, {
    //   containerUuid,
    //   row
    // }) {
    //   const { tableName, fieldList } = rootGetters.getPanel(containerUuid)
    //
    //   // TODO: Add support to Binary columns (BinaryData)
    //   const columnsToDontSend = ['BinaryData', 'isEdit', 'isNew', 'isSendServer']
    //
    //   // TODO: Evaluate peformance without filter using delete(prop) before convert object to array
    //   // attributes or fields
    //   let finalAttributes = convertObjectToKeyValue({ object: row })
    //   finalAttributes = finalAttributes.filter(itemAttribute => {
    //     if (columnsToDontSend.includes(itemAttribute.columnName) || itemAttribute.columnName.includes('DisplayColumn')) {
    //       return false
    //     }
    //     const field = fieldList.find(itemField => itemField.columnName === itemAttribute.columnName)
    //     if (!field || !field.isUpdateable || !field.isDisplayed) {
    //       return false
    //     }
    //     return true
    //   })
    //
    //   return updateEntity({
    //     tableName,
    //     recordUuid: row.UUID,
    //     attributesList: finalAttributes
    //   })
    //     .then(response => {
    //       return response
    //     })
    //     .catch(error => {
    //       showMessage({
    //         message: error.message,
    //         type: 'error'
    //       })
    //       console.warn(`Update Entity Table Error ${error.code}: ${error.message}.`)
    //     })
    // },
    /**
     * Update record after run process associated with window
     * @param {string} parentUuid
     * @param {string} containerUuid
     * @param {object} tab
     */
    updateRecordAfterRunProcess({ dispatch, rootGetters }, {
      parentUuid,
      containerUuid,
      tab
    }) {
      const recordUuid = rootGetters.getUuid(containerUuid)
      // get new values
      dispatch('getEntity', {
        parentUuid,
        containerUuid,
        tableName: tab.tableName,
        recordUuid
      })
        .then(response => {
          // update panel
          if (tab.isParentTab) {
            dispatch('notifyPanelChange', {
              parentUuid,
              containerUuid,
              newValues: response,
              isSendCallout: false,
              isSendToServer: false
            })
          }
          // update row in table
          dispatch('notifyRowTableChange', {
            parentUuid,
            containerUuid,
            row: response,
            isEdit: false
          })
        })
    },
    deleteEntity({ dispatch, rootGetters }, {
      parentUuid,
      containerUuid,
      recordUuid,
      recordId,
      row
    }) {
      return new Promise(resolve => {
        const panel = rootGetters.getPanel(containerUuid)
        if (!isEmptyValue(row)) {
          recordUuid = row.UUID
          recordId = row[`${panel.tableName}_ID`]
        }

        deleteEntity({
          tableName: panel.tableName,
          recordUuid,
          recordId
        })
          .then(responseDeleteEntity => {
            // refresh record list
            dispatch('getDataListTab', {
              parentUuid,
              containerUuid
            })
              .then(responseDataList => {
                if (panel.isParentTab) {
                  // if response is void, go to new record
                  if (responseDataList.length <= 0) {
                    dispatch('resetPanelToNew', {
                      parentUuid,
                      containerUuid,
                      panelType: 'window',
                      isNewRecord: true
                    })
                  } else {
                    const oldRoute = router.app._route
                    // else display first record of table in panel
                    router.push({
                      name: oldRoute.name,
                      params: {
                        ...oldRoute.params
                      },
                      query: {
                        ...oldRoute.query,
                        action: responseDataList[0].UUID
                      }
                    })
                  }
                }
              })
              .catch(error => {
                console.warn(`Error getting data list tab. Message: ${error.message}, code ${error.code}.`)
              })
            showMessage({
              message: language.t('data.deleteRecordSuccessful'),
              type: 'success'
            })

            if (isEmptyValue(recordId)) {
              // TODO: Verify performance with tableName_ID
              const fieldId = panel.fieldList.find(itemField => itemField.isKey)
              recordId = fieldId.value
            }
            // set data log to undo action
            dispatch('setDataLog', {
              containerUuid,
              tableName: panel.tableName,
              recordId,
              recordUuid,
              eventType: 'DELETE'
            })

            resolve(responseDeleteEntity)
          })
          .catch(error => {
            showMessage({
              message: language.t('data.deleteRecordError'),
              type: 'error'
            })
            console.warn(`Delete Entity - Error ${error.message}, Code: ${error.code}.`)
          })
      })
    },
    /**
     * Delete selection records in table
     * @param {string} parentUuid
     * @param {string} containerUuid
     * @param {string} tableName
     * @param {boolean} isParentTab
     */
    deleteSelectionDataList({ dispatch, rootGetters }, {
      parentUuid,
      containerUuid,
      tableName,
      isParentTab
    }) {
      if (isEmptyValue(tableName) || isEmptyValue(isParentTab)) {
        const tab = rootGetters.getTab(parentUuid, containerUuid)
        tableName = tab.tableName
        isParentTab = tab.isParentTab
      }
      const allData = rootGetters.getDataRecordAndSelection(containerUuid)
      let selectionLength = allData.selection.length

      allData.selection.forEach((record, index) => {
        // validate if the registry row has no uuid before sending to the server
        if (isEmptyValue(record.UUID)) {
          selectionLength = selectionLength - 1
          console.warn(`This row does not contain a record with UUID`, record)
          // refresh record list
          dispatch('getDataListTab', {
            parentUuid,
            containerUuid
          })
            .catch(error => {
              console.warn(`Error getting data list tab. Message: ${error.message}, code ${error.code}.`)
            })
          return
        }
        deleteEntity({
          tableName,
          recordUuid: record.UUID
        })
          .then(() => {
            if (isParentTab) {
              // redirect to create new record
              const oldRoute = router.app._route
              if (record.UUID === oldRoute.query.action) {
                router.push({
                  name: oldRoute.name,
                  params: {
                    ...oldRoute.params
                  },
                  query: {
                    ...oldRoute.query,
                    action: 'create-new'
                  }
                })
                // clear fields with default values
                dispatch('resetPanelToNew', {
                  parentUuid,
                  containerUuid
                })
                // delete view with uuid record delete
                dispatch('tagsView/delView', oldRoute, true)
              }
            }

            if ((index + 1) >= selectionLength) {
              // refresh record list
              dispatch('getDataListTab', {
                parentUuid,
                containerUuid
              })
                .catch(error => {
                  console.warn(`Error getting data list tab. Message: ${error.message}, code ${error.code}.`)
                })
              showMessage({
                message: language.t('data.deleteRecordSuccessful'),
                type: 'success'
              })
            }
          })
      })
    },
    undoModifyData({ getters }, {
      containerUuid,
      recordUuid
    }) {
      return rollbackEntity(getters.getDataLog(containerUuid, recordUuid))
        .then(response => {
          return response
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'error'
          })
          console.warn(`Rollback Entity error: ${error.message}. Code: ${error.code}.`)
        })
    },
    setDataLog({ commit }, {
      containerUuid,
      tableName,
      recordId,
      recordUuid,
      eventType
    }) {
      commit('setDataLog', {
        containerUuid,
        tableName,
        recordId,
        recordUuid,
        eventType
      })
    },
    /**
     * Get data to table in tab
     * @param {string}  parentUuid, window to search record data
     * @param {string}  containerUuid, tab to search record data
     * @param {string}  recordUuid, uuid to search
     * @param {boolean} isRefreshPanel, if main panel is updated with new response data
     * @param {boolean} isLoadAllRecords, if main panel is updated with new response data
     */
    getDataListTab({ dispatch, rootGetters }, {
      parentUuid,
      containerUuid,
      recordUuid,
      referenceWhereClause = '',
      columnName,
      value,
      criteria,
      isAddRecord = false,
      isLoadAllRecords = false,
      isRefreshPanel = false,
      isReference = false,
      isShowNotification = true
    }) {
      const tab = rootGetters.getTab(parentUuid, containerUuid)

      let parsedQuery = tab.query
      if (!isEmptyValue(parsedQuery) && parsedQuery.includes('@')) {
        parsedQuery = parseContext({
          parentUuid,
          containerUuid,
          value: tab.query,
          isBooleanToString: true
        }).value
      }

      let parsedWhereClause = tab.whereClause
      if (!isEmptyValue(parsedWhereClause) && parsedWhereClause.includes('@')) {
        parsedWhereClause = parseContext({
          parentUuid,
          containerUuid,
          value: tab.whereClause,
          isBooleanToString: true
        }).value
      }

      if (isReference) {
        if (!isEmptyValue(parsedWhereClause)) {
          parsedWhereClause += ` AND ${referenceWhereClause}`
        } else {
          parsedWhereClause += referenceWhereClause
        }
      }

      if (!isEmptyValue(criteria)) {
        if (!isEmptyValue(parsedWhereClause)) {
          parsedWhereClause += ` AND ${criteria.whereClause}`
        } else {
          parsedWhereClause += criteria.whereClause
        }
      }

      const conditionsList = []
      // TODO: evaluate if overwrite values to conditions
      if (!isLoadAllRecords && tab.isParentTab && !isEmptyValue(tab.tableName) && !isEmptyValue(value)) {
        conditionsList.push({
          columnName,
          value
        })
      }
      return dispatch('getObjectListFromCriteria', {
        parentUuid,
        containerUuid,
        tableName: tab.tableName,
        query: parsedQuery,
        whereClause: parsedWhereClause,
        orderByClause: tab.orderByClause,
        conditionsList,
        isParentTab: tab.isParentTab,
        isAddRecord,
        isShowNotification
      })
        .then(response => {
          if (isRefreshPanel && !isEmptyValue(recordUuid) && recordUuid !== 'create-new') {
            const newValues = response.find(itemData => itemData.UUID === recordUuid)
            if (newValues) {
              // update fields with values obtained from the server
              dispatch('notifyPanelChange', {
                parentUuid,
                containerUuid,
                newValues,
                isSendCallout: false,
                isSendToServer: false
              })
            } else {
              // this record is missing (Deleted or the query does not include it)
              dispatch('resetPanelToNew', {
                parentUuid,
                containerUuid
              })
            }
          }
          return response
        })
        .catch(error => {
          return error
        })
        .finally(() => {
          const currentData = rootGetters.getDataRecordAndSelection(containerUuid)
          const { originalNextPageToken, pageNumber, recordCount } = currentData
          let nextPage = pageNumber
          const isAdd = isAddRecord
          if (originalNextPageToken && isAddRecord) {
            const pageInToken = originalNextPageToken.substring(originalNextPageToken.length - 2)
            if (pageInToken === '-1') {
              isAddRecord = false
            }
            if (pageNumber === 1 && recordCount > 50) {
              nextPage = nextPage + 1
              isAddRecord = true
            }
          } else {
            isAddRecord = false
          }
          if (recordCount <= 50) {
            isAddRecord = false
          }

          if (isAddRecord) {
            dispatch('setPageNumber', {
              parentUuid,
              containerUuid,
              pageNumber: nextPage,
              panelType: 'window',
              isAddRecord,
              isShowNotification: false
            })
          }
          if (isAdd && isAdd !== isAddRecord) {
            if (tab.isSortTab) {
              const record = rootGetters.getDataRecordsList(containerUuid)
              const recordToTab = record
                .map(itemRecord => {
                  return {
                    ...itemRecord
                  }
                })
                .sort((itemA, itemB) => {
                  return itemA[tab.sortOrderColumnName] - itemB[tab.sortOrderColumnName]
                })
              dispatch('setTabSequenceRecord', recordToTab)
            }
          }
        })
    },
    /**
     * Get references asociate to record
     * @param {string} parentUuid as windowUuid
     * @param {string} containerUuid
     * @param {string} tableName
     * @param {string} recordUuid
     */
    getReferencesListFromServer({ commit, rootGetters }, {
      parentUuid: windowUuid,
      containerUuid,
      tableName,
      recordUuid
    }) {
      if (isEmptyValue(tableName)) {
        tableName = rootGetters.getTab(windowUuid, containerUuid).tableName
      }
      return new Promise(resolve => {
        getReferencesList({
          windowUuid,
          tableName,
          recordUuid
        })
          .then(referenceResponse => {
            const referencesList = referenceResponse.referencesList.map(item => {
              return {
                ...item,
                recordUuid,
                type: 'reference'
              }
            })
            const references = {
              ...referenceResponse,
              windowUuid,
              recordUuid,
              referencesList
            }
            commit('addReferencesList', references)
            resolve(referenceResponse)
          })
          .catch(error => {
            console.warn(`References Load Error ${error.code}: ${error.message}.`)
          })
      })
    },
    setWindowOldRoute({ commit }, oldPath = { path: '', fullPath: '', query: {}}) {
      commit('setWindowOldRoute', oldPath)
    },
    setTabSequenceRecord({ commit }, record) {
      commit('setTabSequenceRecord', record)
    },
    /**
     * Update records in tab sort
     * @param {string} containerUuid
     * @param {string} parentUuid
     */
    updateSequence({ state, commit, dispatch, getters, rootGetters }, {
      parentUuid,
      containerUuid
    }) {
      const { tableName, sortOrderColumnName, sortYesNoColumnName, tabAssociatedUuid } = rootGetters.getTab(parentUuid, containerUuid)
      const listSequenceToSet = getters.getTabSequenceRecord
      const recordData = rootGetters.getDataRecordsList(containerUuid)

      // scrolls through the logs and checks if there is a change to be sent to server
      recordData.forEach(itemData => {
        const dataSequence = listSequenceToSet.find(item => item.UUID === itemData.UUID)
        if (itemData[sortOrderColumnName] === dataSequence[sortOrderColumnName]) {
          return
        }
        const valuesToSend = [{
          columnName: sortOrderColumnName,
          value: dataSequence[sortOrderColumnName]
        }]

        if (itemData[sortYesNoColumnName] !== dataSequence[sortYesNoColumnName]) {
          valuesToSend.push({
            columnName: sortYesNoColumnName,
            value: dataSequence[sortYesNoColumnName]
          })
        }

        const countRequest = state.totalRequest + 1
        commit('setTotalRequest', countRequest)

        updateEntity({
          tableName,
          recordUuid: itemData.UUID,
          attributesList: valuesToSend
        })
          .catch(error => {
            showMessage({
              message: error.message,
              type: 'error'
            })
            console.warn(`Update Entity Table Error ${error.code}: ${error.message}`)
          })
          .finally(() => {
            const countResponse = state.totalResponse + 1
            commit('setTotalResponse', countResponse)
            if (state.totalResponse === state.totalRequest) {
              showMessage({
                message: language.t('notifications.updateSuccessfully'),
                type: 'success'
              })
              dispatch('setShowDialog', {
                type: 'window',
                action: undefined
              })
              commit('setTotalRequest', 0)
              commit('setTotalResponse', 0)

              dispatch('setRecordSelection', {
                parentUuid,
                containerUuid,
                isLoaded: false
              })
              dispatch('setTabSequenceRecord', [])

              // refresh record list in table source
              dispatch('getDataListTab', {
                parentUuid,
                containerUuid: tabAssociatedUuid
              })
                .catch(error => {
                  console.warn(`Error getting data list tab. Message: ${error.message}, code ${error.code}.`)
                })
            }
          })
      })
    }
  },
  getters: {
    getInCreate: (state) => (containerUuid) => {
      return state.inCreate.find(item => item.containerUuid === containerUuid)
    },
    getReferencesList: (state) => (windowUuid, recordUuid) => {
      return state.references.find(item => item.windowUuid === windowUuid && item.recordUuid === recordUuid)
    },
    getReferencesInfo: (state, getters) => ({ windowUuid, recordUuid, referenceUuid }) => {
      const references = getters.getReferencesList(windowUuid, recordUuid)
      return references.referencesList.find(item => item.uuid === referenceUuid)
    },
    getTabSequenceRecord: (state) => {
      return state.tabSequenceRecord
    },
    getDataLog: (state) => (containerUuid, recordUuid) => {
      const current = state.dataLog
      if (current.containerUuid === containerUuid &&
        ((current.recordUuid === recordUuid) ||
        (current.eventType === 'DELETE' && recordUuid === 'create-new'))) {
        return current
      }
      return undefined
    }
  }
}

export default windowControl
