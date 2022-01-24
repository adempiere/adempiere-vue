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
      :references-manager="referencesManager"
      :actions-manager="actionsManager"
      :relations-manager="relationsManager"
    />

    <tab-manager
      :parent-uuid="windowMetadata.uuid"
      :container-manager="containerManager"
      :tabs-list="windowMetadata.tabsListParent"
    />

    <tab-manager
      v-if="isWithChildsTab"
      :parent-uuid="windowMetadata.uuid"
      :container-manager="containerManager"
      :tabs-list="windowMetadata.tabsListChild"
      :is-parent-tabs="false"
    />
  </div>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

// components
import ActionMenu from '@/components/ADempiere/ActionMenu/index.vue'
import TabManager from '@/components/ADempiere/TabManager'

// utils and helpers methods
import { convertObjectToKeyValue } from '@/utils/ADempiere/valueFormat.js'
import { createNewRecord, deleteRecord, sharedLink, refreshRecords } from '@/utils/ADempiere/constants/actionsMenuList'

export default defineComponent({
  name: 'MultiTabWindow',

  components: {
    ActionMenu,
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
      return !root.isEmptyValue(props.windowMetadata.tabsListChild)
    })

    const containerManager = {
      ...props.windowManager,

      actionPerformed: ({ field, value }) => {
        return root.$store.dispatch('actionPerformed', {
          field,
          value
        })
          .then(response => {
            if (response.type === 'createEntity') {
              root.$router.push({
                name: root.$route.name,
                query: {
                  ...root.$route.query,
                  action: response.uuid
                },
                params: {
                  ...root.$router.params,
                  recordId: response.id
                }
              }, () => {})
            }
          })
      },

      seekRecord: ({ row, tableName, parentUuid, containerUuid }) => {
        if (root.isEmptyValue(row)) {
          root.$store.dispatch('setTabDefaultValues', {
            parentUuid,
            containerUuid
          })
          return
        }
        const tab = root.$store.getters.getStoredTab(parentUuid, containerUuid)
        if (tab.isParentTab) {
          root.$router.push({
            name: root.$route.name,
            query: {
              ...root.$route.query,
              action: row.UUID
            },
            params: {
              ...root.$router.params,
              tableName,
              recordId: row[`${tableName}_ID`]
            }
          }, () => {})
        }

        const fieldsList = root.$store.getters.getStoredFieldsFromTab(parentUuid, containerUuid)
        const defaultValues = root.$store.getters.getParsedDefaultValues({
          parentUuid,
          containerUuid,
          isSOTrxMenu: root.$route.meta.isSalesTransaction,
          fieldsList,
          formatToReturn: 'object'
        })

        const attributes = convertObjectToKeyValue({
          object: Object.assign(defaultValues, row)
        })

        root.$store.dispatch('notifyPanelChange', {
          parentUuid,
          containerUuid,
          attributes,
          isOverWriteParent: true
        })

        // active logics with set records values
        fieldsList.forEach(field => {
          // change Dependents
          root.$store.dispatch('changeDependentFieldsList', {
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
        root.$store.dispatch('getEntities', {
          parentUuid,
          containerUuid,
          pageNumber
        })
      }
    }

    const actionsManager = ref({
      parentUuid: props.windowMetadata.uuid,
      containerUuid: props.windowMetadata.currentTabUuid,

      defaultActionName: root.$t('actionMenu.createNewRecord'),

      getActionList: () => [
        createNewRecord,
        refreshRecords,
        deleteRecord,
        sharedLink
      ]
    })

    const referencesManager = ref({
      getTableName: () => {
        const tabUuid = props.windowMetadata.currentTabUuid
        const windowUuid = props.windowMetadata.uuid

        return root.$store.getters.getTableName(windowUuid, tabUuid)
      }
    })

    const relationsManager = ref({
      menuParentUuid: root.$route.meta.parentUuid
    })

    return {
      actionsManager,
      referencesManager,
      relationsManager,
      isWithChildsTab,
      containerManager
    }
  }

})
</script>
