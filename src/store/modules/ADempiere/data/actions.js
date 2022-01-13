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

import language from '@/lang'

// constants
import { TABLE, TABLE_DIRECT } from '@/utils/ADempiere/references'

// api request methods
import {
  requestGetContextInfoValue
} from '@/api/ADempiere/window'

// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { convertArrayKeyValueToObject } from '@/utils/ADempiere/valueFormat.js'
import { typeValue } from '@/utils/ADempiere/valueUtils.js'
import {
  getPreference
} from '@/utils/ADempiere/contextUtils'
import { showMessage } from '@/utils/ADempiere/notification'

const actions = {

  /**
   * Insert new row bottom list table, used only from window
   * @param {string}  parentUuid
   * @param {string}  containerUuid
   * @param {boolean} isPanelValues, define if used values form panel
   * @param {boolean} isEdit, define if used values form panel
   */
  async addNewRow({ commit, getters, rootGetters, dispatch }, {
    parentUuid,
    containerUuid,
    isPanelValues = false,
    isEdit = true,
    isNew = true,
    fieldsList,
    row
  }) {
    const dataStore = getters.getDataRecordsList(containerUuid)
    let values = {}
    const currentNewRow = dataStore.find(itemData => {
      return isEmptyValue(itemData.UUID) && itemData.isNew
    })

    if (!isEmptyValue(currentNewRow)) {
      values = currentNewRow
      return values
    }

    if (isEmptyValue(row)) {
      const tabPanel = rootGetters.getPanel(containerUuid)

      if (isEmptyValue(fieldsList)) {
        fieldsList = tabPanel.fieldsList
      }
      // add row with default values to create new record
      if (isPanelValues) {
        // add row with values used from record in panel
        values = rootGetters.getColumnNamesAndValues({
          containerUuid,
          propertyName: 'value',
          isObjectReturn: true,
          isAddDisplayColumn: true,
          fieldsList
        })
      } else {
        values = rootGetters.getParsedDefaultValues({
          parentUuid,
          containerUuid,
          fieldsList,
          formatToReturn: 'object'
        })
      }
      values.isNew = isNew
      values.isEdit = isEdit
      values.isSendServer = false

      // get the link column name from the tab
      let linkColumnName = tabPanel.linkColumnName
      if (isEmptyValue(linkColumnName)) {
        // get the link column name from field list
        linkColumnName = tabPanel.fieldLinkColumnName
      }

      let valueLink
      // get context value if link column exists and does not exist in row
      if (!isEmptyValue(linkColumnName)) {
        valueLink = getPreference({
          parentUuid,
          containerUuid,
          columnName: linkColumnName
        })
        if (!isEmptyValue(valueLink)) {
          valueLink = parseInt(valueLink, 10)
        }
      }

      // get display column and/or sql value
      if (fieldsList.length) {
        fieldsList
          // TODO: Evaluate if is field is read only and FieldSelect
          .filter(itemField => {
            return itemField.componentPath === 'FieldSelect' ||
              typeValue(values[itemField.columnName]) === 'OBJECT' ||
              itemField.isSQLValue
          })
          .map(async itemField => {
            const { columnName, componentPath } = itemField
            let valueGetDisplayColumn = values[columnName]

            if (typeValue(values[columnName]) === 'OBJECT') {
              if (componentPath === 'FieldSelect') {
                values[columnName] = ' '
                values[itemField.displayColumnName] = ' '
              } else if (componentPath === 'FieldNumber') {
                values[columnName] = 0
              }
            }
            // overwrite value with column link
            if (!isEmptyValue(linkColumnName) && linkColumnName === columnName) {
              valueGetDisplayColumn = valueLink
              if (isEmptyValue(values[columnName])) {
                values[columnName] = valueGetDisplayColumn
              }
            }

            // break this itineration if is empty
            if (isEmptyValue(valueGetDisplayColumn)) {
              return
            }
            // always the values for these types of fields are integers
            // Table (18) or Table Direct (19)
            if ([TABLE.id, TABLE_DIRECT.id].includes(itemField.diplayType)) {
              valueGetDisplayColumn = parseInt(valueGetDisplayColumn, 10)
            } else {
              if (!isNaN(valueGetDisplayColumn)) {
                valueGetDisplayColumn = parseInt(valueGetDisplayColumn, 10)
              }
            }

            if (!isEmptyValue(valueGetDisplayColumn) &&
              typeValue(valueGetDisplayColumn) === 'OBJECT' &&
              valueGetDisplayColumn.isSQL) {
              // get value from Query
              valueGetDisplayColumn = await dispatch('getDefaultValue', {
                parentUuid,
                containerUuid,
                query: itemField.defaultValue
              })
              values[columnName] = valueGetDisplayColumn
            }

            // break to next itineration if not select field
            if (componentPath !== 'FieldSelect') {
              return
            }

            // get label (DisplayColumn) from vuex store
            const options = rootGetters.getLookupAll({
              parentUuid,
              containerUuid,
              tableName: itemField.reference.tableName,
              query: itemField.reference.query,
              directQuery: itemField.reference.directQuery,
              value: valueGetDisplayColumn
            })

            const option = options.find(itemOption => itemOption.key === valueGetDisplayColumn)
            // if there is a lookup option, assign the display column with the label
            if (option) {
              values[itemField.displayColumnName] = option.label
              // if (isEmptyValue(option.label) && !itemField.isMandatory) {
              //   values[columnName] = undefined
              // }
              return
            }
            if (linkColumnName === columnName) {
              // get context value if link column exists and does not exist in row
              const nameParent = getPreference({
                parentUuid,
                containerUuid,
                columnName: 'Name'
              })
              if (!isEmptyValue(nameParent)) {
                values[itemField.displayColumnName] = nameParent
                return
              }
            }
            // get value to displayed from server
            const { label } = await dispatch('getLookupItemFromServer', {
              parentUuid,
              containerUuid,
              columnName: itemField.columnName,
              tableName: itemField.reference.tableName,
              directQuery: itemField.reference.directQuery,
              value: valueGetDisplayColumn
            })
            values[itemField.displayColumnName] = label
          })
      }

      // overwrite value with column link
      if (isEmptyValue(values[linkColumnName])) {
        values[linkColumnName] = valueLink
      }
    } else {
      values = row
    }

    commit('addNewRow', {
      values,
      data: dataStore
    })
  },

  /**
   * Delete record result in container
   * @param {string}  viewUuid // As parentUuid in window
   * @param {array}   withOut
   * @param {boolean} isNew
   */
  deleteRecordContainer({ commit, state, dispatch }, {
    viewUuid,
    withOut = [],
    isNew = false
  }) {
    const setNews = []
    const record = state.recordSelection.filter(itemRecord => {
      // ignore this uuid
      if (withOut.includes(itemRecord.containerUuid)) {
        return true
      }
      // remove window and tabs data
      if (itemRecord.parentUuid) {
        if (isNew) {
          setNews.push(itemRecord.containerUuid)
        }
        return itemRecord.parentUuid !== viewUuid
      }
      // remove browser data
      return itemRecord.containerUuid !== viewUuid
    })
    commit('deleteRecordContainer', record)
    dispatch('setTabSequenceRecord', [])

    if (setNews.length) {
      setNews.forEach(uuid => {
        dispatch('setRecordSelection', {
          parentUuid: viewUuid,
          containerUuid: uuid
        })
      })
    }
  },

  /**
   * TODO: Add support to tab children
   * @param {string} parentUuid
   * @param {string} containerUuid
   * @param {boolean}  isEdit, if the row displayed to edit mode
   * @param {boolean}  isNew, if insert data to new row
   * @param {objec}  row, new data to change
   */
  notifyRowTableChange({ commit, getters, rootGetters }, {
    parentUuid,
    containerUuid,
    isEdit = true,
    isNew,
    row
  }) {
    let values = {}
    if (row) {
      values = row
    } else {
      values = rootGetters.getColumnNamesAndValues({
        parentUuid,
        containerUuid,
        propertyName: 'value',
        isObjectReturn: true,
        isAddDisplayColumn: true
      })
    }
    if (Array.isArray(values)) {
      values = convertArrayKeyValueToObject({
        arrayToConvert: values
      })
    }

    const currentRow = getters.getRowData({
      containerUuid,
      recordUuid: values.UUID
    })

    const newRow = {
      ...values,
      isEdit
    }

    commit('notifyRowTableChange', {
      isNew,
      newRow,
      row: currentRow
    })
  },
  notifyCellTableChange({ commit, state, dispatch, rootGetters }, {
    parentUuid,
    containerUuid,
    field,
    columnName,
    rowKey,
    keyColumn,
    panelType = 'window',
    isSendToServer = true,
    isSendCallout = true,
    newValue,
    displayColumnName,
    withOutColumnNames = []
  }) {
    // dispatch('setPreferenceContext', {
    //   parentUuid,
    //   containerUuid,
    //   columnName,
    //   value: newValue
    // })
    const recordSelection = state.recordSelection.find(recordItem => {
      return recordItem.containerUuid === containerUuid
    })
    let row = {}
    if (!isEmptyValue(field.tableIndex)) {
      row = recordSelection.record[field.tableIndex]
    } else {
      row = recordSelection.record.find(itemRecord => {
        return itemRecord[keyColumn] === rowKey
      })
    }

    // the field has not changed, then the action is broken
    if (row[columnName] === newValue) {
      return
    }
    commit('notifyCellTableChange', {
      row,
      value: newValue,
      columnName,
      displayColumnName
    })

    if (panelType === 'browser') {
      const rowSelection = recordSelection.selection.find(itemRecord => {
        return itemRecord[keyColumn] === rowKey
      })
      commit('notifyCellSelectionChange', {
        row: rowSelection,
        value: newValue,
        columnName,
        displayColumnName
      })
    } else if (panelType === 'window') {
      // request callouts
      if (isSendCallout && !withOutColumnNames.includes(field.columnName) &&
        !isEmptyValue(newValue) && !isEmptyValue(field.callout)) {
        withOutColumnNames.push(field.columnName)
        dispatch('runCallout', {
          parentUuid,
          containerUuid,
          tableName: field.tableName,
          columnName: field.columnName,
          callout: field.callout,
          value: newValue,
          valueType: field.valueType,
          withOutColumnNames,
          row,
          inTable: true
        })
      }

      if (isSendToServer) {
        const fieldNotReady = rootGetters.isNotReadyForSubmit(containerUuid, row)
        if (!fieldNotReady) {
          if (!isEmptyValue(row.UUID)) {
            dispatch('updateCurrentEntityFromTable', {
              parentUuid,
              containerUuid,
              row
            })
          } else {
            dispatch('createEntityFromTable', {
              parentUuid,
              containerUuid,
              row
            })
          }
        } else {
          const fieldsEmpty = rootGetters.getFieldsListEmptyMandatory({
            containerUuid,
            row
          })
          showMessage({
            message: language.t('notifications.mandatoryFieldMissing') + fieldsEmpty,
            type: 'info'
          })
        }
      }
    }
  },
  getContextInfoValueFromServer({ commit, getters }, {
    contextInfoId,
    contextInfoUuid,
    sqlStatement
  }) {
    // const contextInforField = getters.getContextInfoField(contextInfoUuid, sqlStatement)
    // if (contextInforField) {
    //   return contextInforField
    // }
    return requestGetContextInfoValue({
      id: contextInfoId,
      uuid: contextInfoUuid,
      query: sqlStatement
    })
      .then(contextInfoResponse => {
        commit('setContextInfoField', {
          contextInfoUuid,
          sqlStatement,
          ...contextInfoResponse
        })
        return contextInfoResponse
      })
      .catch(error => {
        console.warn(`Error ${error.code} getting context info value for field ${error.message}.`)
      })
  },

  resetStateBusinessData({ commit }) {
    commit('resetStateContainerInfo')
    commit('setInitialContext', {})
    commit('resetStateTranslations')
    commit('resetStateBusinessData')
    commit('resetContextMenu')
    commit('resetStateTranslations')
    commit('resetStateLookup')
    commit('resetStateProcessControl')
    commit('resetStateUtils')
    commit('resetStateWindowControl')
  }
}

export default actions
