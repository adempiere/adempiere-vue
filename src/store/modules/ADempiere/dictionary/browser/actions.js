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

import { requestBrowserMetadata } from '@/api/ADempiere/dictionary/smart-browser.js'
import { generatePanelAndFields } from '@/components/ADempiere/PanelDefinition/panelUtils'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

export default {
  getBrowserDefinitionFromServer({ commit, dispatch }, uuid) {
    return new Promise(resolve => {
      requestBrowserMetadata({
        uuid
      })
        .then(browserResponse => {
          const browserDefinition = generatePanelAndFields({
            containerUuid: uuid,
            panelMetadata: browserResponse,
            isAddFieldsRange: true,
            fieldOverwrite: {
              isShowedFromUser: false
            }
          })
          commit('addBrowserToList', browserDefinition)

          dispatch('setBrowserDefaultValues', {
            containerUuid: browserDefinition.uuid,
            fieldsList: browserDefinition.fieldsList
          })

          resolve(browserDefinition)
        })
    })
  },

  /**
   * Set default values to panel
   * @param {string}  parentUuid
   * @param {string}  containerUuid
   */
  setBrowserDefaultValues({ dispatch, getters }, {
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

  /**
   * Used by components/fields/filterFields
   */
  changeBrowserFieldShowedFromUser({ commit, getters }, {
    containerUuid,
    groupField,
    fieldsShowed,
    fieldsList = []
  }) {
    if (isEmptyValue(fieldsList)) {
      fieldsList = getters.getStoredFieldsFromBrowser(containerUuid)
    }

    fieldsList.forEach(itemField => {
      if (groupField === itemField.groupAssigned) {
        let isShowedFromUser = false
        if (fieldsShowed.includes(itemField.columnName)) {
          isShowedFromUser = true
        }

        commit('changeBrowserFieldAttribute', {
          field: itemField,
          attributeName: 'isShowedFromUser',
          attributeValue: isShowedFromUser
        })
      }
    })
  }

}
