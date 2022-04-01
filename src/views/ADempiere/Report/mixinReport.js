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

export default (reportUuid) => {
  const storedReportDefinition = computed(() => {
    return store.getters.getStoredReport(reportUuid)
  })

  const containerManager = {
    getPanel({ containerUuid }) {
      return store.getters.getStoredReport(containerUuid)
    },
    getFieldsList({ containerUuid }) {
      return store.getters.getStoredFieldsFromReport(containerUuid)
    },

    actionPerformed: ({ field, value }) => {
      // store.dispatch('reportActionPerformed', {
      //   field,
      //   value
      // })
    },

    setDefaultValues: ({ containerUuid }) => {
      store.dispatch('setReportDefaultValues', {
        containerUuid
      })
    },

    isDisplayedField,

    isReadOnlyField,

    isMandatoryField,

    changeFieldShowedFromUser({ containerUuid, fieldsShowed }) {
      store.dispatch('changeReportFieldShowedFromUser', {
        containerUuid,
        fieldsShowed
      })
    },

    /**
     * @returns Promisse with value and displayedValue
     */
    getDefaultValue({ parentUuid, containerUuid, uuid, id, contextColumnNames, columnName }) {
      return store.dispatch('getDefaultValueFromServer', {
        parentUuid,
        containerUuid,
        contextColumnNames,
        processParameterUuid: uuid,
        id,
        //
        columnName
      })
    },
    getLookupList({ parentUuid, containerUuid, contextColumnNames, uuid }) {
      return store.dispatch('getLookupListFromServer', {
        parentUuid,
        containerUuid,
        contextColumnNames,
        processParameterUuid: uuid
      })
    }
  }

  const actionsList = computed(() => {
    return store.getters.getStoredActionsMenu({
      containerUuid: reportUuid
    })
  })

  const actionsManager = ref({
    containerUuid: reportUuid,

    defaultActionName: lang.t('actionMenu.generateReport'),

    getActionList: () => actionsList.value
  })

  const relationsManager = ref({
    // menuParentUuid: getCurrentInstance().$route.meta.parentUuid
  })

  return {
    containerManager,
    actionsManager,
    relationsManager,
    storedReportDefinition
  }
}
