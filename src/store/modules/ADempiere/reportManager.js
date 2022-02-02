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

import {
  requestListPrintFormats
} from '@/api/ADempiere/report'

const initState = {
  printFormatList: {}
}

const reportManager = {
  state: initState,

  mutations: {
    setPrintFormatsList(state, { containerUuid, printFormatList }) {
      Vue.set(state.printFormatList, containerUuid, printFormatList)
    },
    resetStateReportManager(state) {
      state = initState
    }
  },

  actions: {
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
                // type: 'updateReport',
                // option: 'printFormat',
                instanceUuid,
                processUuid,
                processId
              }
            })

            commit('setPrintFormatsList', {
              containerUuid: processUuid,
              printFormatList
            })

            resolve(printFormatList)
          })
          .catch(error => {
            console.warn(`Error getting print formats: ${error.message}. Code: ${error.code}.`)
          })
      })
    }
  },

  getters: {
    getPrintFormatList: (state) => (containerUuid) => {
      return state.printFormatList[containerUuid] || []
    },
    getReportManager: (state) => {
      return state.reportManager
    }
  }
}

export default reportManager
