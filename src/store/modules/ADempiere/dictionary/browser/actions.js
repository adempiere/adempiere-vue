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
import { requestBrowserMetadata } from '@/api/ADempiere/dictionary/smart-browser.js'

// constants
import {
  exportRecordsSelected,
  sharedLink
} from '@/utils/ADempiere/constants/actionsMenuList'

// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { generatePanelAndFields } from '@/utils/ADempiere/dictionary/panel.js'
import {
  isDisplayedField, isMandatoryField,
  refreshBrowserSearh, runProcessOfBrowser,
  zoomWindow
} from '@/utils/ADempiere/dictionary/browser.js'

export default {
  getBrowserDefinitionFromServer({ commit, dispatch }, uuid) {
    return new Promise(resolve => {
      requestBrowserMetadata({
        uuid
      })
        .then(browserResponse => {
          const browserDefinition = generatePanelAndFields({
            containerUuid: uuid,
            panelMetadata: {
              ...browserResponse,
              isShowedCriteria: true
            },
            isAddFieldsRange: true,
            fieldOverwrite: {
              isShowedFromUser: false
            }
          })
          commit('addBrowserToList', browserDefinition)

          dispatch('setBrowserActionsMenu', {
            containerUuid: browserDefinition.uuid
          })

          // set default values into fields
          dispatch('setBrowserDefaultValues', {
            containerUuid: browserDefinition.uuid,
            fieldsList: browserDefinition.fieldsList
          })

          resolve(browserDefinition)
        })
    })
  },

  /**
   * Set actions menu to browser
   * @param {string} containerUuid
   */
  setBrowserActionsMenu({ commit, getters }, {
    containerUuid
  }) {
    const browserDefinition = getters.getStoredBrowser(containerUuid)

    const actionsList = []

    // process associated
    if (!isEmptyValue(browserDefinition.process)) {
      const { uuid, name, description } = browserDefinition.process
      const actionProcess = {
        ...runProcessOfBrowser,
        uuid,
        name,
        description
      }

      actionsList.push(actionProcess)
    }

    // export selected records
    actionsList.push(exportRecordsSelected)

    // action refresh browser search
    actionsList.push(refreshBrowserSearh)

    // destruct to avoid deleting the reference to the original variable and to avoid mutating
    let actionZoomWindow = { ...zoomWindow }
    if (!isEmptyValue(browserDefinition.window)) {
      const { uuid, name, description } = browserDefinition.window
      actionZoomWindow = {
        ...actionZoomWindow,
        uuid,
        name: `${zoomWindow.name}: ${name}`,
        description
      }
    }
    // add action zoom window
    actionsList.push(actionZoomWindow)

    // action shared link
    actionsList.push(sharedLink)

    commit('setActionMenu', {
      containerUuid: browserDefinition.uuid,
      actionsList
    })
  },

  /**
   * Set default values to panel
   * @param {string}  containerUuid
   * @param {array} fieldsList
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
   * @param {string} containerUuid
   * @param {array} fieldsShowed fields to displayed
   * @param {array} fieldsList all fields list in container
   */
  changeBrowserFieldShowedFromUser({ commit, dispatch, getters, rootGetters }, {
    containerUuid,
    fieldsShowed,
    fieldsList = []
  }) {
    if (isEmptyValue(fieldsList)) {
      fieldsList = getters.getStoredFieldsFromBrowser(containerUuid)
    }

    let isChangedDisplayedWithValue = false

    fieldsList.forEach(itemField => {
      const { isShowedFromUser: isShowedOriginal, columnName } = itemField

      let isShowedFromUser = false
      if (fieldsShowed.includes(columnName)) {
        isShowedFromUser = true
      }

      // not query criteria or mandatory (user display is not affected)
      if (isShowedOriginal === isShowedFromUser ||
        !isDisplayedField(itemField) || isMandatoryField(itemField)) {
        return
      }

      commit('changeBrowserFieldAttribute', {
        field: itemField,
        attributeName: 'isShowedFromUser',
        attributeValue: isShowedFromUser
      })

      if (!isChangedDisplayedWithValue) {
        const value = rootGetters.getValueOfField({
          containerUuid,
          columnName
        })
        // if isShowedFromUser was changed with value, the SmartBrowser
        // must send the parameters to update the search result
        if (!isEmptyValue(value)) {
          isChangedDisplayedWithValue = true
        }
      }
    })

    if (isChangedDisplayedWithValue) {
      dispatch('getBrowserSearch', {
        containerUuid,
        isClearSelection: true
      })
    }
  }

}
