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

import router from '@/router'

// api request methods
import { requestProcessMetadata as requestReportMetadata } from '@/api/ADempiere/dictionary/process.js'

// constants
import {
  runReport,
  runReportAs,
  sharedLink
} from '@/utils/ADempiere/constants/actionsMenuList'

// utils and helper methods
import { generateProcess as generateReport } from '@/utils/ADempiere/dictionary/process.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default {
  addReportToList({ commit }, reportResponse) {
    return new Promise(resolve => {
      commit('addReportToList', reportResponse)

      resolve(reportResponse)
    })
  },

  /**
   * Get report dictionary definition
   * @param {string} uuid of dictionary
   */
  getReportDefinitionFromServer({ dispatch }, {
    uuid
  }) {
    return new Promise((resolve, reject) => {
      requestReportMetadata({
        uuid
      })
        .then(reportResponse => {
          const { processDefinition: reportDefinition } = generateReport({
            processToGenerate: reportResponse
          })

          dispatch('setReportDefaultValues', {
            containerUuid: reportDefinition.uuid,
            fieldsList: reportDefinition.fieldsList
          })

          dispatch('addReportToList', reportDefinition)
          dispatch('setReportActionsMenu', {
            containerUuid: uuid
          })
          resolve(reportDefinition)

          dispatch('getListPrintFormats', {
            uuid,
            id: reportDefinition.id
          })
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  /**
   * Set actions menu to report
   * @param {string} containerUuid
   */
  setReportActionsMenu({ commit, getters }, {
    containerUuid
  }) {
    const reportDefinition = getters.getStoredReport(containerUuid)

    const actionsList = []
    actionsList.push(runReport)

    if (!isEmptyValue(reportDefinition.reportExportTypes)) {
      const runTypeChilds = []
      reportDefinition.reportExportTypes.forEach(reportType => {
        // push values
        runTypeChilds.push({
          ...reportType,
          icon: 'el-icon-document',
          enabled: true,
          svg: false,
          actionName: 'runReportAs',
          uuid: null,
          runReportAs: ({ root, containerUuid }) => {
            root.$store.dispatch('startReport', {
              containerUuid,
              reportFormat: reportType.type
            })
          }
        })
      })

      runReportAs.childs = runTypeChilds
      actionsList.push(runReportAs)
    }

    // action shared link
    actionsList.push(sharedLink)

    commit('setActionMenu', {
      containerUuid: reportDefinition.uuid,
      actionsList
    })
  },

  /**
   * Used by components/fields/filterFields
   * @param {string} containerUuid
   * @param {string} groupField
   * @param {array} fieldsShowed
   * @param {array} fieldsList
   */
  changeReportFieldShowedFromUser({ commit, getters }, {
    containerUuid,
    groupField,
    fieldsShowed = [],
    fieldsList = []
  }) {
    if (isEmptyValue(fieldsList)) {
      fieldsList = getters.getStoredFieldsFromReport(containerUuid)
    }

    fieldsList.forEach(itemField => {
      if (groupField === itemField.groupAssigned) {
        let isShowedFromUser = false
        if (fieldsShowed.includes(itemField.columnName)) {
          isShowedFromUser = true
        }

        commit('changeReportFieldAttribute', {
          field: itemField,
          attributeName: 'isShowedFromUser',
          attributeValue: isShowedFromUser
        })
      }
    })
  },

  /**
   * Set default values to panel
   * @param {string}  containerUuid
   * @param {array}  fieldsList
   */
  setReportDefaultValues({ dispatch, getters }, {
    containerUuid,
    fieldsList = []
  }) {
    return new Promise(resolve => {
      if (isEmptyValue(fieldsList)) {
        fieldsList = getters.getStoredFieldsFromReport(containerUuid)
      }

      const currentRoute = router.app._route
      const defaultAttributes = getters.getParsedDefaultValues({
        containerUuid,
        isSOTrxMenu: currentRoute.meta.isSalesTransaction,
        fieldsList
      })

      dispatch('updateValuesOfContainer', {
        containerUuid,
        isOverWriteParent: true,
        attributes: defaultAttributes
      })

      resolve(defaultAttributes)
    })
  }

}
