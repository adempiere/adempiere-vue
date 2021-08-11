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
  requestListReportsViews,
  requestListPrintFormats,
  requestListDrillTables,
  requestGetReportOutput
} from '@/api/ADempiere/report'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

const initStateReportControl = {
  reportFormatsList: [],
  reportViewsList: [],
  drillTablesList: [],
  reportOutput: {}
}

const reportControl = {
  state: initStateReportControl,
  mutations: {
    setReportFormatsList(state, payload) {
      state.reportFormatsList.push(payload)
    },
    setReportViewsList(state, payload) {
      state.reportViewsList.push(payload)
    },
    setDrillTablesList(state, payload) {
      state.drillTablesList.push(payload)
    },
    setNewReportOutput(state, payload) {
      state.reportOutput = payload
    },
    resetReportControl(state) {
      state = initStateReportControl
    }
  },
  actions: {
    reportActionPerformed({ commit }, {
      containerUuid,
      field,
      value
    }) {

    },

    getListPrintFormats({ commit }, {
      processId,
      processUuid,
      instanceUuid
    }) {
      return new Promise(resolve => {
        requestListPrintFormats({ processUuid })
          .then(printFormatResponse => {
            const printFormatList = printFormatResponse.records.map(printFormatItem => {
              return {
                ...printFormatItem,
                type: 'updateReport',
                option: 'printFormat',
                instanceUuid,
                processUuid,
                processId
              }
            })
            commit('setReportFormatsList', {
              containerUuid: processUuid,
              printFormatList
            })

            resolve(printFormatList)
          })
          .catch(error => {
            console.warn(`Error getting print formats: ${error.message}. Code: ${error.code}.`)
          })
      })
    },

    getReportViewsFromServer({ commit }, {
      processId,
      processUuid,
      instanceUuid,
      printFormatUuid,
      tableName
    }) {
      return new Promise(resolve => {
        requestListReportsViews({ processUuid, tableName })
          .then(reportViewResponse => {
            const reportViewList = reportViewResponse.reportViewsList.map(reportViewItem => {
              return {
                ...reportViewItem,
                type: 'updateReport',
                option: 'reportView',
                instanceUuid,
                printFormatUuid,
                processUuid,
                processId
              }
            })
            commit('setReportViewsList', {
              containerUuid: processUuid,
              viewList: reportViewList
            })

            resolve(reportViewList)
          })
          .catch(error => {
            console.warn(`Error getting report views: ${error.message}. Code: ${error.code}.`)
          })
      })
    },

    getDrillTablesFromServer({ commit }, {
      processId,
      processUuid,
      instanceUuid,
      printFormatUuid,
      tableName,
      reportViewUuid
    }) {
      return new Promise(resolve => {
        requestListDrillTables({ tableName })
          .then(responseDrillTables => {
            const drillTablesList = responseDrillTables.drillTablesList.map(drillTableItem => {
              return {
                ...drillTableItem,
                name: drillTableItem.printName,
                type: 'updateReport',
                option: 'drillTable',
                instanceUuid,
                printFormatUuid,
                reportViewUuid,
                processUuid,
                processId
              }
            })

            commit('setDrillTablesList', {
              containerUuid: processUuid,
              drillTablesList
            })

            resolve(drillTablesList)
          })
          .catch(error => {
            console.warn(`Error getting drill tables: ${error.message}. Code: ${error.code}.`)
          })
      })
    },

    getReportOutputFromServer({ state, commit, getters, rootGetters }, {
      tableName,
      printFormatUuid,
      reportViewUuid,
      isSummary,
      reportName,
      reportType,
      processUuid,
      processId,
      instanceUuid,
      option
    }) {
      return new Promise(resolve => {
        if (isEmptyValue(printFormatUuid)) {
          const printFormat = getters.getDefaultPrintFormat(processUuid)
          if (!isEmptyValue(printFormat)) {
            printFormatUuid = printFormat.printFormatUuid
          }
        }

        const parametersList = rootGetters.getParametersToServer({
          containerUuid: processUuid
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
              processId,
              processUuid,
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
    getPrintFormatList: (state) => (containerUuid) => {
      const printFormatList = state.reportFormatsList.find(list => list.containerUuid === containerUuid)
      if (printFormatList) {
        return printFormatList.printFormatList
      }
      return []
    },
    getDefaultPrintFormat: (state, getters) => (containerUuid) => {
      return getters.getPrintFormatList(containerUuid).find(printFormat => printFormat.isDefault)
    },
    getReportViewList: (state) => (containerUuid) => {
      const reportViewList = state.reportViewsList.find(list => list.containerUuid === containerUuid)
      if (reportViewList) {
        return reportViewList.viewList
      }
      return []
    },
    getDrillTablesList: (state) => (containerUuid) => {
      const drillTablesList = state.drillTablesList.find(list => list.containerUuid === containerUuid)
      if (drillTablesList) {
        return drillTablesList.viewList
      }
      return []
    }
  }
}

export default reportControl
