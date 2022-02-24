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
      // let action = 'reportActionPerformed'
      // if (field.isReport) {
      //   action = 'reportActionPerformed'
      // }
      // root.$store.dispatch(action, {
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

    isReadOnlyField({
      field
    }) {
      return isReadOnlyField(field)
    },

    isMandatoryField,

    changeFieldShowedFromUser({ containerUuid, fieldsShowed }) {
      store.dispatch('changeReportFieldShowedFromUser', {
        containerUuid,
        fieldsShowed
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
