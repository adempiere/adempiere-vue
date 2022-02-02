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
  requestRunProcess
} from '@/api/ADempiere/process'

// utils and helper methods
import { getToken } from '@/utils/auth'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { showNotification } from '@/utils/ADempiere/notification'

const initState = {
  printFormatList: {}
}

const processManager = {
  state: initState,

  mutations: {
    setPrintFormatsList(state, { containerUuid, printFormatList }) {
      Vue.set(state.printFormatList, containerUuid, printFormatList)
    },
    resetStateProcessManager(state) {
      state = initState
    }
  },

  actions: {
    startProcess({ dispatch, rootGetters }, {
      containerUuid
    }) {
      return new Promise(resolve => {
        const processDefinition = rootGetters.getStoredProcess(containerUuid)

        const parametersList = rootGetters.getProcessParameters({
          containerUuid: processDefinition.uuid
        })

        const isSession = !isEmptyValue(getToken())
        let procesingNotification = {
          close: () => false
        }
        if (isSession) {
          procesingNotification = showNotification({
            title: language.t('notifications.processing'),
            message: processDefinition.name,
            summary: processDefinition.description,
            type: 'info'
          })
        }

        let isProcessedError = false
        let summary = ''
        requestRunProcess({
          uuid: containerUuid,
          parametersList
        })
          .then(runProcessRepsonse => {
            isProcessedError = runProcessRepsonse.isError
            summary = runProcessRepsonse.summary

            resolve(runProcessRepsonse)
          })
          .catch(error => {
            isProcessedError = true
            console.warn(`Error getting print formats: ${error.message}. Code: ${error.code}.`)
          })
          .finally(() => {
            const currentRoute = router.app._route
            // close view if is process or report panel
            router.push({
              path: '/dashboard'
            }, () => {})
            dispatch('tagsView/delView', currentRoute)

            dispatch('finishProcess', {
              summary,
              name: processDefinition.name,
              isError: isProcessedError
            })
              .then(() => {
                // close runing process notification
                if (!isEmptyValue(procesingNotification)) {
                  setTimeout(() => {
                    procesingNotification.close()
                  }, 1000)
                }
              })
          })
      })
    },

    finishProcess({ commit }, {
      name,
      summary,
      isError
    }) {
      let processMessage = {
        name,
        title: language.t('notifications.succesful'),
        message: language.t('notifications.processExecuted'),
        type: 'success',
        summary
      }

      if (isError) {
        const errorMessage = !isEmptyValue(summary)
          ? summary
          : language.t('notifications.error')

        processMessage = {
          name,
          title: language.t('notifications.error'),
          message: errorMessage,
          type: 'error'
        }
      }

      const isSession = !isEmptyValue(getToken())
      if (isSession) {
        showNotification(processMessage)
      }
    }
  },

  getters: {
  }
}

export default processManager
