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

// api request methods
import { requestBrowserSearch } from '@/api/ADempiere/browser'

// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { getContext } from '@/utils/ADempiere/contextUtils'
import { showMessage } from '@/utils/ADempiere/notification'

const browserControl = {
  actions: {
    browserActionPerformed({ dispatch, getters }, {
      containerUuid,
      field,
      value,
      valueTo
    }) {
      const fieldsList = getters.getFieldsListFromPanel(containerUuid)

      const fieldsEmpty = getters.getFieldsListEmptyMandatory({
        containerUuid,
        fieldsList
      })
      if (!isEmptyValue(fieldsEmpty)) {
        showMessage({
          message: language.t('notifications.mandatoryFieldMissing') + fieldsEmpty,
          type: 'info'
        })
        return
      }

      // Validate if a field is called and visible
      if (isEmptyValue(field.dependentFieldsList)) {
        dispatch('getBrowserSearch', {
          containerUuid,
          isClearSelection: true
        })
      }
    },

    // Search with query criteria
    getBrowserSearch({ commit, dispatch, rootGetters }, {
      containerUuid,
      isClearSelection = false
    }) {
      showMessage({
        title: language.t('notifications.loading'),
        message: language.t('notifications.searching'),
        type: 'info'
      })

      const { fieldsList, contextColumnNames } = rootGetters.getStoredBrowser(containerUuid)

      // parameters isQueryCriteria
      const parametersList = rootGetters.getBrowserQueryCriteria({
        containerUuid,
        fieldsList
      })

      const contextAttriburesList = []
      if (!isEmptyValue(contextColumnNames)) {
        contextColumnNames.forEach(columnName => {
          const value = getContext({
            containerUuid,
            columnName
          })
          contextAttriburesList.push({
            value,
            columnName
          })
        })
      }

      return requestBrowserSearch({
        uuid: containerUuid,
        contextAttriburesList,
        parametersList
      })
        .then(browserSearchResponse => {
          const recordsList = browserSearchResponse.recordsList.map(itemRecord => {
            const values = itemRecord.attributes

            return {
              ...values,
              // datatables attributes
              isNew: false,
              isEdit: false,
              isReadOnlyFromRow: false
            }
          })

          // let selection = allData.selection
          // if (isClearSelection) {
          //   selection = []
          // }

          let token = browserSearchResponse.nextPageToken
          if (token !== undefined) {
            token = token.slice(0, -2)
          }

          showMessage({
            title: language.t('notifications.succesful'),
            message: language.t('notifications.succcessSearch'),
            type: 'success'
          })
          return recordsList
        })
        .catch(error => {
          // Set default registry values so that the table does not say loading,
          // there was already a response from the server
          // dispatch('setRecordSelection', {
          //   containerUuid,
          //   panelType: 'browser'
          // })

          showMessage({
            title: language.t('notifications.error'),
            message: language.t('notifications.errorSearch'),
            summary: error.message,
            type: 'error'
          })
          console.warn(`Error getting browser search: ${error.message}. Code: ${error.code}.`)
        })
    }
  }
}

export default browserControl
