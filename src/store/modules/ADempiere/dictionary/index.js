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

/**
 * For window, process and smart browser
 */

import windowState from './window/state.js'
import windowActions from './window/actions.js'
import windowMutations from './window/mutations.js'
import windowGetters from './window/getters.js'
import processState from './process/state.js'
import processActions from './process/actions.js'
import processMutations from './process/mutations.js'
import processGetters from './process/getters.js'
import browserState from './browser/state.js'
import browserActions from './browser/actions.js'
import browserMutations from './browser/mutations.js'
import browserGetters from './browser/getters.js'

const dictionary = {
  state: {
    ...windowState,
    ...processState,
    ...browserState
  },
  mutations: {
    ...windowMutations,
    ...processMutations,
    ...browserMutations
  },
  actions: {
    ...windowActions,
    ...processActions,
    ...browserActions
  },
  getters: {
    ...windowGetters,
    ...processGetters,
    ...browserGetters
  }
}

export default dictionary
