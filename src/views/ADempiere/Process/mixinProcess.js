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

import { computed, ref } from '@vue/composition-api'

import store from '@/store'
import lang from '@/lang'

// utils and helper methods
import {
  isDisplayedField,
  isMandatoryField,
  isReadOnlyField
} from '@/utils/ADempiere/dictionary/process.js'

export default (processUuid) => {
  const storedProcessDefinition = computed(() => {
    return store.getters.getStoredProcess(processUuid)
  })

  const containerManager = {
    getPanel({ containerUuid }) {
      return store.getters.getStoredProcess(containerUuid)
    },
    getFieldsList({ containerUuid }) {
      return store.getters.getStoredFieldsFromProcess(containerUuid)
    },

    actionPerformed: ({ field, value }) => {
      // store.dispatch('processActionPerformed', {
      //   field,
      //   value
      // })
    },

    setDefaultValues: ({ containerUuid }) => {
      store.dispatch('setProcessDefaultValues', {
        containerUuid
      })
    },

    isDisplayedField,

    isReadOnlyField,

    isMandatoryField,

    changeFieldShowedFromUser({ containerUuid, fieldsShowed }) {
      store.dispatch('changeProcessFieldShowedFromUser', {
        containerUuid,
        fieldsShowed
      })
    }
  }

  const actionsList = computed(() => {
    return store.getters.getStoredActionsMenu({
      containerUuid: processUuid
    })
  })

  const actionsManager = ref({
    containerUuid: processUuid,

    defaultActionName: lang.t('actionMenu.runProcess'),

    getActionList: () => actionsList.value
  })

  const relationsManager = ref({
    // menuParentUuid: getCurrentInstance().$route.meta.parentUuid
  })

  return {
    containerManager,
    actionsManager,
    relationsManager,
    storedProcessDefinition
  }
}
