<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com www.erpya.com
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <https:www.gnu.org/licenses/>.
-->

<template>
  <div>
    <!-- // TODO: Add header window component for auxiliary menu and worflow status -->
    <action-menu
      :parent-uuid="windowMetadata.uuid"
      :container-uuid="currentTabUuid"
      :container-manager="containerManager"
      :references-manager="referencesManager"
      :actions-manager="actionsManager"
      :relations-manager="relationsManager"
    />

    <embedded
      :visible="showRecordAccess"
    >
      <record-access />
    </embedded>
    <tab-manager
      :parent-uuid="windowMetadata.uuid"
      :container-manager="containerManager"
      :tabs-list="windowMetadata.tabsListParent"
      :all-tabs-list="allTabsList"
    />

    <tab-manager
      v-if="isWithChildsTab"
      :parent-uuid="windowMetadata.uuid"
      :container-manager="containerManager"
      :tabs-list="windowMetadata.tabsListChild"
      :all-tabs-list="allTabsList"
      :is-parent-tabs="false"
    />
  </div>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'
import lang from '@/lang'
import router from '@/router'
import store from '@/store'

// components and mixins
import ActionMenu from '@theme/components/ADempiere/ActionMenu/index.vue'
import TabManager from '@theme/components/ADempiere/TabManager/index.vue'
import Embedded from '@theme/components/ADempiere/Dialog/embedded'
import RecordAccess from '@theme/components/ADempiere/RecordAccess'

// utils and helpers methods
import { convertObjectToKeyValue } from '@/utils/ADempiere/valueFormat.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

export default defineComponent({
  name: 'MultiTabWindow',

  components: {
    ActionMenu,
    RecordAccess,
    Embedded,
    TabManager
  },

  props: {
    windowMetadata: {
      type: Object,
      required: true
    },
    windowManager: {
      type: Object,
      required: true
    }
  },

  setup(props, { root }) {
    const isWithChildsTab = computed(() => {
      return !isEmptyValue(props.windowMetadata.tabsListChild)
    })

    const allTabsList = ref([])

    const showRecordAccess = computed(() => {
      return store.getters.getShowPanelRecordAccess
    })

    const containerManager = {
      ...props.windowManager,

      actionPerformed: ({ field, value }) => {
        return store.dispatch('actionPerformed', {
          field,
          value
        })
          .then(response => {
            if (response.type === 'createEntity') {
              router.push({
                name: root.$route.name,
                query: {
                  ...root.$route.query,
                  action: response.uuid
                },
                params: {
                  ...root.$route.params,
                  recordId: response.id
                }
              }, () => {})
            }

            const { parentUuid, containerUuid } = field
            const tab = store.getters.getStoredTab(parentUuid, containerUuid)

            // set response values
            store.dispatch('updateValuesOfContainer', {
              parentUuid,
              containerUuid,
              isOverWriteParent: tab.isParentTab,
              attributes: response.attributes
            })
          })
      },

      seekRecord: ({ row, parentUuid, containerUuid }) => {
        if (isEmptyValue(row)) {
          store.dispatch('setTabDefaultValues', {
            parentUuid,
            containerUuid
          })
          return
        }
        const tab = store.getters.getStoredTab(parentUuid, containerUuid)
        if (tab.isParentTab) {
          router.push({
            name: root.$route.name,
            query: {
              ...root.$route.query,
              action: row.UUID
            },
            params: {
              ...root.$route.params,
              tableName: tab.tableName,
              recordId: row[`${tab.tableName}_ID`]
            }
          }, () => {})
        }

        const fieldsList = store.getters.getStoredFieldsFromTab(parentUuid, containerUuid)
        const defaultValues = store.getters.getParsedDefaultValues({
          parentUuid,
          containerUuid,
          isSOTrxMenu: root.$route.meta.isSalesTransaction,
          fieldsList,
          formatToReturn: 'object'
        })

        const attributes = convertObjectToKeyValue({
          object: Object.assign(defaultValues, row)
        })

        store.dispatch('notifyPanelChange', {
          parentUuid,
          containerUuid,
          attributes,
          isOverWriteParent: tab.isParentTab
        })

        // active logics with set records values
        fieldsList.forEach(field => {
          // change Dependents
          store.dispatch('changeDependentFieldsList', {
            field,
            fieldsList
          })
        })
      },

      seekTab: function(eventInfo) {
        console.log('seekTab: ', eventInfo)
        return new Promise()
      },

      // To Default Table
      setPage: ({
        parentUuid,
        containerUuid,
        pageNumber = 0
      }) => {
        store.dispatch('getEntities', {
          parentUuid,
          containerUuid,
          pageNumber
        })
      }
    }

    const actionsManager = ref({
      parentUuid: props.windowMetadata.uuid,
      containerUuid: props.windowMetadata.currentTabUuid,

      defaultActionName: lang.t('actionMenu.createNewRecord'),
      tableName: store.getters.getTableName(props.windowMetadata.uuid, props.windowMetadata.currentTabUuid),
      getActionList: () => {
        return store.getters.getStoredActionsMenu({
          containerUuid: props.windowMetadata.currentTabUuid
        })
      }
    })

    const referencesManager = ref({
      getTableName: () => {
        const tabUuid = props.windowMetadata.currentTabUuid
        const windowUuid = props.windowMetadata.uuid

        return store.getters.getTableName(windowUuid, tabUuid)
      }
    })

    const relationsManager = ref({
      menuParentUuid: root.$route.meta.parentUuid
    })
    if (props.windowMetadata.tabsList) {
      allTabsList.value = props.windowMetadata.tabsList
    }

    return {
      currentTabUuid: props.windowMetadata.currentTabUuid,
      actionsManager,
      allTabsList,
      referencesManager,
      showRecordAccess,
      relationsManager,
      isWithChildsTab,
      containerManager
    }
  }

})
</script>
