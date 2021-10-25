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

import Vue from 'vue'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

/**
 * Browser Mutations
 * All related to global store of Dictionary Browser
 */
export default {
  addBrowserToList(state, browser) {
    Vue.set(state.storedBrowsers, browser.uuid, browser)
  },

  changeBrowserAttribute(state, {
    uuid,
    attributeName,
    attributeValue,
    attributeNameControl
  }) {
    let value = attributeValue
    if (!isEmptyValue(attributeNameControl)) {
      value = state.storedBrowsers[uuid][attributeNameControl]
    }

    Vue.set(state.storedBrowsers[uuid], attributeName, value)
  },

  /**
   * Change field browser attribute
   * @param {object} field
   * @param {string} attributeName
   * @param {mixed} attributeValue
   */
  changeBrowserFieldAttribute(state, payload) {
    const { attributeName, attributeValue } = payload

    payload.field[attributeName] = attributeValue
  }

}
