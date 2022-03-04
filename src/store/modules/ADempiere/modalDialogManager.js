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

// api request methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

const initState = {
  modalDialogManager: {}
}

const modalDialogManager = {
  state: initState,

  mutations: {
    setModalDialog(state, {
      containerUuid,
      componentPath,
      cancelMethod,
      doneMethod,
      title,
      isShowed
    }) {
      Vue.set(state.modalDialogManager, containerUuid, {
        containerUuid,
        componentPath,
        doneMethod,
        cancelMethod,
        title,
        isShowed
      })
    },

    setShowedModalDialog(state, {
      containerUuid,
      isShowed = false
    }) {
      Vue.set(state.modalDialogManager, containerUuid, {
        ...state.modalDialogManager[containerUuid] || {},
        isShowed
      })
    },

    resetStateModalDialogManager(state) {
      state = initState
    }
  },

  actions: {
    setModalDialog({ commit }, {
      containerUuid,
      componentPath,
      doneMethod = function() {},
      cancelMethod = function() {},
      title,
      isShowed = false
    }) {
      commit('setModalDialog', {
        containerUuid,
        componentPath,
        doneMethod,
        cancelMethod,
        title,
        isShowed
      })
    }
  },

  getters: {
    getModalDialogManager: (state) => ({ containerUuid }) => {
      return state.modalDialogManager[containerUuid]
    },

    getShowedModalDialog: (state) => ({ containerUuid }) => {
      const modalDialog = state.modalDialogManager[containerUuid]
      if (isEmptyValue(modalDialog)) {
        return false
      }
      return Boolean(modalDialog.isShowed)
    }
  }
}

export default modalDialogManager
