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

import router from '@/router'

// api request methods
import { requestProcessMetadata } from '@/api/ADempiere/dictionary/process.js'

// utils and helper methods
import { generateProcess } from '@/utils/ADempiere/dictionary/process.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default {
  addProcessToList({ commit }, processResponse) {
    return new Promise(resolve => {
      commit('addProcessToList', processResponse)

      resolve(processResponse)
    })
  },

  /**
   * Get process dictionary definition
   * @param {string} uuid of dictionary
   */
  getProcessDefinitionFromServer({ dispatch }, {
    uuid
  }) {
    return new Promise((resolve, reject) => {
      requestProcessMetadata({
        uuid
      })
        .then(processResponse => {
          const { processDefinition } = generateProcess({
            processToGenerate: processResponse
          })

          dispatch('setProcessDefaultValues', {
            containerUuid: processDefinition.uuid,
            fieldsList: processDefinition.fieldsList
          })

          dispatch('addProcessToList', processDefinition)
          resolve(processDefinition)

          if (processDefinition.isReport) {
            dispatch('getListPrintFormats', {
              processUuid: uuid,
              processId: processDefinition.id
            })
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  /**
   * Used by components/fields/filterFields
   */
  changeProcessFieldShowedFromUser({ commit, getters }, {
    containerUuid,
    groupField,
    fieldsShowed,
    fieldsList = []
  }) {
    if (isEmptyValue(fieldsList)) {
      fieldsList = getters.getStoredFieldsFromProcess(containerUuid)
    }

    fieldsList.forEach(itemField => {
      if (groupField === itemField.groupAssigned) {
        let isShowedFromUser = false
        if (fieldsShowed.includes(itemField.columnName)) {
          isShowedFromUser = true
        }

        commit('changeProcessFieldAttribute', {
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
  setProcessDefaultValues({ dispatch, getters }, {
    containerUuid,
    fieldsList = []
  }) {
    return new Promise(resolve => {
      if (isEmptyValue(fieldsList)) {
        fieldsList = getters.getStoredFieldsFromProcess(containerUuid)
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
  },
  setReportDefaultValues({ dispatch }, {
    containerUuid,
    fieldsList = []
  }) {
    dispatch('setProcessDefaultValues', {
      containerUuid,
      fieldsList
    })
  }

}
