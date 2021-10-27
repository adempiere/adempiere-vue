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

import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

/**
 * Dictionary Window Getters
 */
export default {
  getStoredWindows: (state) => {
    return state.storedWindows
  },

  getStoredWindow: (state) => (windowUuid) => {
    return state.storedWindows[windowUuid]
  },

  getStoredTabs: (state) => (windowUuid) => {
    return state.storedWindows[windowUuid].tabsList
  },

  getStoredTab: (state) => (windowUuid, tabUuid) => {
    return state.storedWindows[windowUuid].tabsList.find(tab => {
      return tab.uuid === tabUuid
    })
  },

  getTableName: (state, getters) => (windowUuid, tabUuid) => {
    const tab = getters.getStoredTab(windowUuid, tabUuid)
    if (!isEmptyValue(tab)) {
      return tab.tableName
    }
    return undefined
  },

  getStoredFieldsFromTab: (state, getters) => (windowUuid, tabUuid) => {
    const tab = getters.getStoredTab(windowUuid, tabUuid)
    if (!isEmptyValue(tab)) {
      return tab.fieldsList
    }
    return undefined
  },

  getCurrentTab: (state, getters) => (windowUuid) => {
    const window = getters.getStoredWindow(windowUuid)

    return window.currentTab
  },

  getCurrentTabChild: (state, getters) => (windowUuid) => {
    const window = getters.getStoredWindow(windowUuid)

    return window.currentTabChild
  }
}
