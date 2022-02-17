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
import language from '@/lang'

// api request methods
import {
  requestRunProcess as requestRunReport
} from '@/api/ADempiere/process.js'
import {
  requestListPrintFormats,
  requestListReportsViews,
  requestListDrillTables,
  requestGetReportOutput
} from '@/api/ADempiere/report'

// constants
import { viewerSupportedFormats } from '@/utils/ADempiere/dictionary/report.js'

// utils and helper methods
import { getToken } from '@/utils/auth'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import {
  buildLinkHref
} from '@/utils/ADempiere/resource.js'
import { showNotification } from '@/utils/ADempiere/notification.js'

const initState = {
  printFormatList: {},
  reportFormatsList: {},
  reportViewsList: {},
  drillTablesList: {},
  reportOutput: {},
  reportsOutput: {}
}

const reportManager = {
  state: initState,

  mutations: {
    setPrintFormatsList(state, { containerUuid, printFormatList }) {
      Vue.set(state.printFormatList, containerUuid, printFormatList)
    },
    setReportFormatsList(state, { containerUuid, reportFormatsList }) {
      Vue.set(state.reportFormatsList, containerUuid, reportFormatsList)
    },
    setReportViewsList(state, { containerUuid, reportViewsList }) {
      Vue.set(state.reportViewsList, containerUuid, reportViewsList)
    },
    setDrillTablesList(state, { containerUuid, drillTablesList }) {
      Vue.set(state.drillTablesList, containerUuid, drillTablesList)
    },
    setNewReportOutput(state, reportOutput) {
      state.reportOutput = reportOutput
    },
    setReportOutput(state, reportOutput) {
      Vue.set(state.reportsOutput, reportOutput.instanceUuid, reportOutput)
    },
    resetStateReportManager(state) {
      state = initState
    }
  },

  actions: {
    startReport({ commit, dispatch, rootGetters }, {
      containerUuid,
      reportFormat = 'html',
      printFormatUuid
    }) {
      return new Promise(resolve => {
        const reportDefinition = rootGetters.getStoredReport(containerUuid)

        const parametersList = rootGetters.getReportParameters({
          containerUuid
        })

        let reportingNotification = {
          close: () => false
        }
        const isSession = !isEmptyValue(getToken())
        if (isSession) {
          reportingNotification = showNotification({
            title: language.t('notifications.processing'),
            message: reportDefinition.name,
            summary: reportDefinition.description,
            type: 'info'
          })
        }

        requestRunReport({
          uuid: containerUuid,
          reportType: reportFormat,
          printFormatUuid,
          parametersList
        })
          .then(runReportRepsonse => {
            const { instanceUuid, output } = runReportRepsonse

            let link = {
              href: undefined,
              download: undefined
            }
            if (output && output.outputStream) {
              link = buildLinkHref({
                fileName: output.fileName,
                outputStream: output.outputStream,
                type: output.mimeType
              })

              // donwloaded not support render report
              if (!viewerSupportedFormats.includes(reportFormat)) {
                link.click()
              }

              const currentRoute = router.app._route
              // close view if is report panel
              dispatch('tagsView/delView', currentRoute)

              router.push({
                name: 'Report Viewer',
                params: {
                  reportUuid: reportDefinition.uuid,
                  instanceUuid,
                  fileName: output.fileName,
                  // menuParentUuid,
                  name: output.name,
                  tableName: output.tableName
                }
              }, () => {})
            }

            commit('setReportOutput', {
              ...output,
              instanceUuid,
              reportUuid: containerUuid,
              link,
              url: link.href,
              download: link.download
            })

            resolve(runReportRepsonse)
          })
          .catch(error => {
            console.warn(`Error getting print formats: ${error.message}. Code: ${error.code}.`)
          })
          .finally(() => {
            // close runing report notification
            if (!isEmptyValue(reportingNotification)) {
              setTimeout(() => {
                reportingNotification.close()
              }, 1000)
            }
          })
      })
    },

    downloadReport({ commit, rootGetters }, {
      containerUuid,
      reportFormat = 'html'
    }) {
      return new Promise(resolve => {
        const reportDefinition = rootGetters.getStoredReport(containerUuid)

        const parametersList = rootGetters.getReportParameters({
          containerUuid
        })

        let reportingNotification = {
          close: () => false
        }
        const isSession = !isEmptyValue(getToken())
        if (isSession) {
          reportingNotification = showNotification({
            title: language.t('notifications.processing'),
            message: reportDefinition.name,
            summary: reportDefinition.description,
            type: 'info'
          })
        }

        requestRunReport({
          uuid: containerUuid,
          reportType: reportFormat,
          parametersList
        })
          .then(runReportRepsonse => {
            const { instanceUuid, output } = runReportRepsonse

            let link = {
              href: undefined,
              download: undefined
            }
            if (output && output.outputStream) {
              link = buildLinkHref({
                fileName: output.fileName,
                outputStream: output.outputStream,
                type: output.mimeType
              })

              // donwload report file
              link.click()
            }

            commit('setReportOutput', {
              ...output,
              instanceUuid,
              reportUuid: containerUuid,
              link,
              url: link.href,
              download: link.download
            })

            resolve(runReportRepsonse)
          })
          .catch(error => {
            console.warn(`Error getting print formats: ${error.message}. Code: ${error.code}.`)
          })
          .finally(() => {
            // close runing report notification
            if (!isEmptyValue(reportingNotification)) {
              setTimeout(() => {
                reportingNotification.close()
              }, 1000)
            }
          })
      })
    },

    /**
     * Get list prints formats
     * @param {number} id report identifier
     * @param {string} uuid report universal unique identifier
     * @returns
     */
    getListPrintFormats({ commit, dispatch }, {
      id,
      uuid
    }) {
      return new Promise(resolve => {
        requestListPrintFormats({ uuid })
          .then(printFormatResponse => {
            const printFormatList = printFormatResponse.records
              .map(printFormatItem => {
                dispatch('getReportViewsFromServer', {
                  uuid,
                  id,
                  tableName: printFormatItem.tableName
                })
                dispatch('getDrillTablesFromServer', {
                  uuid,
                  id,
                  tableName: printFormatItem.tableName
                })

                return {
                  ...printFormatItem,
                  // type: 'updateReport',
                  // option: 'printFormat',
                  reportUuid: uuid,
                  reportId: id
                }
              })

            commit('setPrintFormatsList', {
              containerUuid: uuid,
              printFormatList
            })

            resolve(printFormatList)
          })
          .catch(error => {
            console.warn(`Error getting print formats: ${error.message}. Code: ${error.code}.`)
          })
      })
    },

    /**
     * Get list report views
     * @param {number} id report identifier
     * @param {string} uuid report universal unique identifier
     * @returns
     */
    getReportViewsFromServer({ commit }, {
      id,
      uuid,
      tableName
    }) {
      return new Promise(resolve => {
        requestListReportsViews({ uuid, tableName })
          .then(reportViewResponse => {
            const reportViewList = reportViewResponse.reportViewsList.map(reportViewItem => {
              return {
                ...reportViewItem,
                // type: 'updateReport',
                // option: 'reportView',
                reportUuid: uuid,
                reportId: id
              }
            })
            commit('setReportViewsList', {
              containerUuid: uuid,
              viewList: reportViewList
            })

            resolve(reportViewList)
          })
          .catch(error => {
            console.warn(`Error getting report views: ${error.message}. Code: ${error.code}.`)
          })
      })
    },

    /**
     * Get list drill tables
     * @param {number} id report identifier
     * @param {string} uuid report universal unique identifier
     * @returns
     */
    getDrillTablesFromServer({ commit }, {
      id,
      uuid,
      tableName
    }) {
      return new Promise(resolve => {
        requestListDrillTables({ tableName })
          .then(responseDrillTables => {
            const drillTablesList = responseDrillTables.drillTablesList.map(drillTableItem => {
              return {
                ...drillTableItem,
                name: drillTableItem.printName,
                // type: 'updateReport',
                // option: 'drillTable',
                reportUuid: uuid,
                reportId: id
              }
            })

            commit('setDrillTablesList', {
              containerUuid: uuid,
              drillTablesList
            })

            resolve(drillTablesList)
          })
          .catch(error => {
            console.warn(`Error getting drill tables: ${error.message}. Code: ${error.code}.`)
          })
      })
    },

    /**
     * Get report output
     * @param {number} id report identifier
     * @param {string} uuid report universal unique identifier
     * @returns
     */
    getReportOutputFromServer({ commit, getters, rootGetters }, {
      uuid,
      id,
      instanceUuid,
      tableName,
      printFormatUuid,
      reportViewUuid,
      isSummary,
      reportName,
      reportType,
      option
    }) {
      return new Promise(resolve => {
        if (isEmptyValue(printFormatUuid)) {
          const printFormat = getters.getDefaultPrintFormat(uuid)
          if (!isEmptyValue(printFormat)) {
            printFormatUuid = printFormat.printFormatUuid
          }
        }

        const parametersList = rootGetters.getParametersToServer({
          containerUuid: uuid
        })
        requestGetReportOutput({
          parametersList,
          printFormatUuid,
          reportViewUuid,
          isSummary,
          reportName,
          reportType,
          tableName
        })
          .then(response => {
            const reportOutput = {
              ...response,
              processId: id,
              processUuid: uuid,
              isError: false,
              instanceUuid,
              isReport: true,
              option
            }
            commit('setNewReportOutput', reportOutput)

            resolve(reportOutput)
          })
          .catch(error => {
            console.warn(`Error getting report output: ${error.message}. Code: ${error.code}.`)
          })
      })
    }
  },

  getters: {
    getReportOutput: (state) => (instanceUuid) => {
      return state.reportsOutput[instanceUuid]
    },

    getPrintFormatList: (state) => (containerUuid) => {
      return state.printFormatList[containerUuid] || []
    },

    getDefaultPrintFormat: (state, getters) => (containerUuid) => {
      const printFormats = getters.getPrintFormatList(containerUuid)

      if (isEmptyValue(printFormats)) {
        return undefined
      }
      const defaultPrintFormat = printFormats.find(printFormat => printFormat.isDefault)
      return defaultPrintFormat || printFormats[0]
    },

    getReportViewList: (state) => (containerUuid) => {
      return state.reportViewsList[containerUuid] || []
    },

    getDrillTablesList: (state) => (containerUuid) => {
      return state.drillTablesList[containerUuid] || []
    }
  }
}

export default reportManager
