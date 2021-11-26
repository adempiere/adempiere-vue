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

// api request methods
import { requestWindowMetadata } from '@/api/ADempiere/dictionary/window.js'

// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { generateWindow } from '@/utils/ADempiere/dictionary/window.js'

export default {
  addWindow({ commit }, windowResponse) {
    return new Promise(resolve => {
      commit('addWindowToList', windowResponse)

      resolve(windowResponse)
    })
  },

  getWindowDefinitionFromServer({ dispatch }, {
    uuid
  }) {
    return new Promise(resolve => {
      requestWindowMetadata({
        uuid
      })
        .then(async windowResponse => {
          const window = generateWindow(windowResponse)
          dispatch('addWindow', window)

          resolve(window)
        })
    })
  },

  /**
   * Used by components/fields/filterFields
   */
  changeTabFieldShowedFromUser({ commit, getters }, {
    parentUuid,
    containerUuid,
    groupField,
    fieldsShowed,
    fieldsList = []
  }) {
    if (isEmptyValue(fieldsList)) {
      fieldsList = getters.getStoredFieldsFromTab(parentUuid, containerUuid)
    }

    fieldsList.forEach(itemField => {
      if (groupField === itemField.groupAssigned) {
        let isShowedFromUser = false
        if (fieldsShowed.includes(itemField.columnName)) {
          isShowedFromUser = true
        }

        commit('changeTabFieldAttribute', {
          field: itemField,
          attributeName: 'isShowedFromUser',
          attributeValue: isShowedFromUser
        })
      }
    })
  },

  changeTabAttribute({ commit, getters }, {
    parentUuid,
    containerUuid,
    attributeName,
    attributeNameControl,
    attributeValue
  }) {
    const tab = getters.getStoredTab(parentUuid, containerUuid)

    commit('changeTabAttribute', {
      tab,
      attributeName,
      attributeValue,
      attributeNameControl
    })

    if (tab.isParentTab) {
      // set value into current parent tab
      const currentTab = getters.getCurrentTab(parentUuid)
      if (currentTab.uuid === containerUuid) {
        commit('changeWindowAttribute', {
          uuid: parentUuid,
          attributeName: 'currentTab',
          attributeValue: tab
        })
      }
    } else {
      // set value into current child tab
      const currentTabChild = getters.getCurrentTabChild(parentUuid)
      if (currentTabChild.uuid === containerUuid) {
        commit('changeWindowAttribute', {
          uuid: parentUuid,
          attributeName: 'currentTabChild',
          attributeValue: tab
        })
      }
    }
  }
}
