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

import Filters from '@/utils/ADempiere/filters'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

const initState = {
  linkOpened: '',
  fullPath: '',
  containerUuid: '',
  filters: {},
  parsedFilters: {},
  isReadFilters: false
}

const permantLink = {
  namespaced: true,

  state: initState,

  mutations: {
    setLinkOpened(state, link) {
      state.linkOpened = link
    },
    setFullPath(state, path) {
      state.fullPath = path
    },
    setFilters(state, filters) {
      state.filters = filters
    },
    setContainerUuid(state, containerUuid) {
      state.containerUuid = containerUuid
    },
    setParsedFilters(state, parsedFilters) {
      state.parsedFilters = parsedFilters
    },
    setIsReadFilters(state) {
      state.isReadFilters = true
    },
    resetStatePermantLink(state) {
      state = initState
    }
  },

  actions: {
    setLinkOpened({ commit }, {
      fullPath,
      query
    }) {
      commit('setLinkOpened', window.location.href)
      commit('setFullPath', fullPath)

      const { containerUuid, filters } = query
      commit('setContainerUuid', containerUuid)
      commit('setFilters', filters)

      const readFilters = Filters.newInstance().convertFilters(filters)
      commit('setParsedFilters', readFilters)

      if (isEmptyValue(filters)) {
        commit('setIsReadFilters')
      }
    }
  },

  getters: {
    getLinkContainerUuid: (state) => {
      return state.containerUuid
    },
    isReadFilters: (state) => {
      return state.isReadFilters
    },
    getLinkOpened: (state) => {
      return state.linkOpened
    },
    getFilters: (state) => {
      return state.filters
    },
    getParsedFilters: (state) => {
      return state.parsedFilters || {}
    }
  }
}

export default permantLink
