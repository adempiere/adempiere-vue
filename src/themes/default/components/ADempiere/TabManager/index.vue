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
  <div style="height: 100% !important;">
    <auxiliary-panel
      v-if="isParentTabs && isShowedTableRecords"
      :parent-uuid="parentUuid"
      :container-uuid="tabUuid"
      :label="tabsList[currentTab].name"
    >
      <record-navigation
        :parent-uuid="parentUuid"
        :container-uuid="tabUuid"
        :container-manager="containerManager"
        :current-tab="tabsList[currentTab]"
      />
    </auxiliary-panel>
    <div style="display: flex;">
      <el-tabs
        v-model="currentTab"
        type="border-card"
        style="width: 99%"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-for="(tabAttributes, key) in tabsList"
          :key="key"
          :label="tabAttributes.name"
          :name="String(key)"
          :tabuuid="tabAttributes.uuid"
          :tabindex="String(key)"
          lazy
          :disabled="isDisabledTab(key)"
          :style="tabStyle"
        >
          <tab-label
            slot="label"
            :is-active-tab="tabAttributes.uuid === tabUuid"
            :parent-uuid="parentUuid"
            :container-uuid="tabAttributes.uuid"
          />

          <div v-if="isShowedTabs">
            <!-- records in table to multi records -->
            <default-table
              v-if="!isParentTabs"
              v-show="!isParentTabs && isShowedTableRecords"
              key="default-table"
              :parent-uuid="parentUuid"
              :container-uuid="tabAttributes.uuid"
              :container-manager="containerManager"
              :header="tableHeaders"
              :data-table="recordsList"
              :panel-metadata="tabAttributes"
            />
            <!-- Close table when clicking on group of fields -->
            <div @click="closeRecordNavigation()">
              <!-- fields in panel to single record -->
              <panel-definition
                v-show="isParentTabs || (!isParentTabs && !isShowedTableRecords)"
                key="panel-definition"
                :parent-uuid="parentUuid"
                :container-uuid="tabAttributes.uuid"
                :container-manager="containerManager"
                :group-tab="tabAttributes.tabGroup"
              />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div style="width: 1%;height: 100%;position: fixed;right: 1%;top: 50%;">
        <el-button type="primary" size="mini" circle @click="openRecordLogs">
          <svg-icon icon-class="tree-table" />
        </el-button>
      </div>
    </div>
    <el-drawer
      :visible.sync="drawer"
      :with-header="false"
      :before-close="openRecordLogs"
      :size="'50%'"
    >
      <panel-info
        :all-tabs-list="allTabsList"
        :container-manager="containerManager"
        :current-record="currentRecordLogs"
      />
    </el-drawer>
  </div>
</template>

<script>
import { defineComponent, computed, watch, ref } from '@vue/composition-api'

import router from '@/router'
import store from '@/store'

// components and mixins
import AuxiliaryPanel from '@theme/components/ADempiere/AuxiliaryPanel/index.vue'
import DefaultTable from '@theme/components/ADempiere/DefaultTable/index.vue'
import PanelDefinition from '@theme/components/ADempiere/PanelDefinition/index.vue'
import RecordNavigation from '@theme/components/ADempiere/RecordNavigation/index.vue'
import TabLabel from '@theme/components/ADempiere/TabManager/TabLabel.vue'
import PanelInfo from '../PanelInfo/index.vue'

// constants
import { UUID } from '@/utils/ADempiere/constants/systemColumns.js'

// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

export default defineComponent({
  name: 'TabManager',

  components: {
    AuxiliaryPanel,
    DefaultTable,
    PanelDefinition,
    RecordNavigation,
    PanelInfo,
    TabLabel
  },

  props: {
    parentUuid: {
      type: String,
      required: true
    },
    containerManager: {
      type: Object,
      required: true
    },
    allTabsList: {
      type: Array,
      required: false
    },
    tabsList: {
      type: Array,
      default: () => []
    },
    isParentTabs: {
      type: Boolean,
      default: true
    }
  },

  setup(props, { root }) {
    let queryProperty = 'tab'
    if (!props.isParentTabs) {
      queryProperty = 'tabChild'
    }
    // if tabParent is present in path set this
    const tabNo = root.$route.query[queryProperty] || '0'
    const currentTab = ref(tabNo)

    const tabUuid = ref(props.tabsList[tabNo].uuid)

    const tabStyle = computed(() => {
      // height tab content
      return {
        // height: '75vh',
        height: 'auto',
        overflow: 'auto'
      }
    })

    // Panel Info

    const currentRecordLogs = ref({})
    const drawer = ref(false)

    // use getter to reactive properties
    const currentTabMetadata = computed(() => {
      return store.getters.getStoredTab(props.parentUuid, tabUuid.value)
    })

    const isShowedTabs = computed(() => {
      const storedWindow = store.getters.getStoredWindow(props.parentUuid)
      if (props.isParentTabs) {
        return storedWindow.isShowedTabsParent
      }
      return storedWindow.isShowedTabsChildren
    })

    const isShowedTableRecords = computed(() => {
      return currentTabMetadata.value.isShowedTableRecords
    })

    const isCreateNew = computed(() => {
      return Boolean(root.$route.query.action === 'create-new')
    })

    function isDisabledTab(key) {
      return (key > 0 || !props.isParentTabs) &&
        (isCreateNew.value || isEmptyValue(recordUuidTabParent.value))
    }

    function setCurrentTab() {
      let tabMutation = 'setCurrentTab'
      if (!props.isParentTabs) {
        tabMutation = 'setCurrentTabChild'
      }
      store.commit(tabMutation, {
        parentUuid: props.parentUuid,
        tab: props.tabsList[currentTab.value]
      })
    }

    // create the table header
    const tableHeaders = computed(() => {
      const panel = props.tabsList[tabNo]
      if (panel && panel.fieldsList) {
        return panel.fieldsList
      }
      return []
    })

    /**
     * @param {object} tabHTML DOM HTML the tab clicked
     */
    const handleClick = (tabHTML) => {
      const { tabuuid, tabindex } = tabHTML.$attrs
      findRecordLogs(props.allTabsList[0])
      setTabNumber(tabindex)

      // set metadata tab
      if (tabUuid.value !== tabuuid) {
        tabUuid.value = tabuuid
        setCurrentTab()
      }
    }

    const setTabNumber = (tabNumber = '0') => {
      if (isEmptyValue(tabNumber)) {
        tabNumber = '0'
      }
      if (tabNumber !== currentTab.value) {
        currentTab.value = tabNumber
      }

      router.push({
        query: {
          ...root.$route.query,
          [queryProperty]: currentTab.value
        },
        params: {
          ...root.$route.params
        }
      }, () => {})

      return tabNumber
    }

    const tabData = computed(() => {
      return store.getters.getTabData({
        containerUuid: currentTabMetadata.value.uuid
      })
    })

    // get records list
    const recordsList = computed(() => {
      if (!props.isParentTabs && isEmptyValue(recordUuidTabParent.value)) {
        return []
      }
      return tabData.value.recordsList
    })

    const isLoadedParentRecords = computed(() => {
      return store.getters.getTabData({
        containerUuid: currentTabMetadata.value.firstTabUuid
      }).isLoaded
    })

    const isReadyFromGetData = computed(() => {
      if (props.isParentTabs) {
        return !tabData.value.isLoaded
      }
      // TODO: add is loaded context columns
      return isLoadedParentRecords.value && !tabData.value.isLoaded
    })

    const recordUuidTabParent = computed(() => {
      return store.getters.getValueOfFieldOnContainer({
        parentUuid: props.parentUuid,
        containerUuid: currentTabMetadata.value.firstTabUuid,
        columnName: UUID
      })
    })

    const getData = () => {
      const containerUuid = tabUuid.value
      store.dispatch('getEntities', {
        parentUuid: props.parentUuid,
        containerUuid
      }).then(responseData => {
        const tab = store.getters.getStoredTab(props.parentUuid, containerUuid)
        if (isCreateNew.value || isEmptyValue(responseData)) {
          // set values in panel
          props.containerManager.seekRecord({
            parentUuid: props.parentUuid,
            containerUuid,
            row: {}
          })
          return
        }

        let row = {}
        const { action } = root.$route.query
        // uuid into action query
        if (!isEmptyValue(action) && action !== 'create-new') {
          if (tab.isParentTab) {
            if (action === 'zoomIn') {
              const { columnName, value } = root.$route.query
              row = responseData.find(rowData => {
                return rowData[columnName] === value
              })
            } else {
              row = responseData.find(rowData => {
                return rowData.UUID === action
              })
            }
          } else {
            /*
            // search link value
            const { linkColumnName } = tab
            const value = store.getters.getValueOfField({
              parentUuid: props.parentUuid,
              columnName: linkColumnName
            })
            if (linkColumnName && !isEmptyValue(value)) {
              row = responseData.find(rowData => {
                return rowData[linkColumnName] === value
              })
            }
            */
          }
        }

        // set first record
        if (isEmptyValue(row)) {
          row = responseData[0]
        }

        // set values in panel
        props.containerManager.seekRecord({
          parentUuid: props.parentUuid,
          containerUuid,
          row
        })
      })
    }

    /**
     * Close table when clicking on group of fields
     */
    const closeRecordNavigation = () => {
      store.dispatch('changeTabAttribute', {
        parentUuid: props.parentUuid,
        containerUuid: tabUuid.value,
        attributeName: 'isShowedTableRecords',
        attributeValue: false
      })
    }

    if (props.isParentTabs) {
      if (isReadyFromGetData.value) {
        getData()
      }
      // if changed tab and not records in stored, get records from server
      watch(tabUuid, (newValue, oldValue) => {
        if (newValue !== oldValue && !isEmptyValue(recordUuidTabParent.value) && !tabData.value.isLoaded) {
          getData()
        }
      })
    } else {
      watch(isReadyFromGetData, (newValue, oldValue) => {
        if (newValue) {
          getData()
        }
      })

      // if changed record in parent tab, reload tab child
      watch(recordUuidTabParent, (newValue, oldValue) => {
        if (newValue !== oldValue && !isEmptyValue(newValue)) {
          getData()
        }
      })
    }

    /**
     * Listar Historico de cambios
     */
    const openRecordLogs = (a) => {
      findRecordLogs(props.allTabsList[0])
      drawer.value = !drawer.value
      if (drawer.value) {
        props.containerManager.getRecordLogs({
          tableName: props.allTabsList[0].tableName,
          recordId: currentRecordLogs.value[props.allTabsList[parseInt(currentTab.value)].tableName + '_ID'],
          recordUuid: currentRecordLogs.value.UUID
        })
      }
      // store.commit('setShowRecordLogs', newValue)
    }

    /**
     * Current Record
     */
    const findRecordLogs = (tab) => {
      currentRecordLogs.value = root.$store.getters.getValuesView({
        parentUuid: tab.parentUuid,
        containerUuid: tab.containerUuid,
        format: 'object'
      })
    }
    findRecordLogs(props.allTabsList[0])
    setTabNumber(currentTab.value)

    return {
      tabUuid,
      currentTab,
      tableHeaders,
      recordsList,
      drawer,
      currentRecordLogs,
      // computed
      isShowedTabs,
      isShowedTableRecords,
      tabStyle,
      // methods
      handleClick,
      findRecordLogs,
      openRecordLogs,
      closeRecordNavigation,
      isDisabledTab
    }
  }

})
</script>
