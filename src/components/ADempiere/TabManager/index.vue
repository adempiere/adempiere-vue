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
      v-if="isShowRecords"
      :label="tabsList[currentTab].name"
    >
      <record-navigation
        style="height: 100% !important;"
        :parent-uuid="parentUuid"
        :container-uuid="tabUuid"
        :container-manager="containerManagerTab"
        :current-tab="tabsList[currentTab]"
      />
    </auxiliary-panel>

    <el-tabs
      v-model="currentTab"
      type="border-card"
      style="height: 100% !important;"
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
        <lock-record
          slot="label"
          :tab-position="isParentTabs ? key : 1"
          :tab-uuid="tabAttributes.uuid"
          :table-name="tabAttributes.tableName"
          :tab-name="tabAttributes.name"
        >
          <el-button
            v-if="currentTab == key"
            slot="prefix"
            type="text"
            @click="openContainer"
          >
            <i class="el-icon-s-fold" style="font-size: 15px; color: black;" />
          </el-button>
        </lock-record>

        <!-- records in table to multi records -->
        <default-table
          v-if="!isParentTabs"
          v-show="!isParentTabs && isShowMultiRecords"
          key="default-table"
          :parent-uuid="parentUuid"
          :container-uuid="tabAttributes.uuid"
          :container-manager="containerManagerTab"
          :header="tableHeaders"
          :data-table="recordsList"
          :panel-metadata="tabAttributes"
        />
        <!-- fields in panel to single record -->
        <panel-definition
          v-show="isParentTabs || (!isParentTabs && !isShowMultiRecords)"
          key="panel-definition"
          :parent-uuid="parentUuid"
          :container-uuid="tabAttributes.uuid"
          :container-manager="containerManager"
          :panel-metadata="tabAttributes"
          :group-tab="tabAttributes.tabGroup"
        />

      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

import AuxiliaryPanel from '@/components/ADempiere/AuxiliaryPanel'
import DefaultTable from '@/components/ADempiere/DefaultTable'
import LockRecord from '@/components/ADempiere/ContainerOptions/LockRecord'
import PanelDefinition from '@/components/ADempiere/PanelDefinition'
import RecordNavigation from '@/components/ADempiere/RecordNavigation'

export default defineComponent({
  name: 'TabManager',

  components: {
    AuxiliaryPanel,
    DefaultTable,
    LockRecord,
    PanelDefinition,
    RecordNavigation
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
      // height in card
      return {
        height: '75vh',
        overflow: 'auto'
      }
    })

    const isShowRecords = computed(() => {
      return root.$store.getters.getExternalContainer
    })

    const isShowMultiRecords = ref(true)

    const isCreateNew = computed(() => {
      return Boolean(root.$route.query.action === 'create-new')
    })

    const isDisabledTab = (key) => {
      return key > 0 && isCreateNew.value
    }

    const setCurrentTab = () => {
      // TODO: Add store current tab
    }

    const containerManagerTab = computed(() => {
      return {
        ...props.containerManager,

        vuexStore: () => 'dataManager'
      }
    })

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
      if (tabUuid.value !== tabuuid) {
        tabUuid.value = tabuuid
        setCurrentTab()
      }
      setTabNumber(tabindex)
    }

    const setTabNumber = (tabNumber = '0') => {
      if (root.isEmptyValue(tabNumber)) {
        tabNumber = '0'
      }
      if (tabNumber !== currentTab.value) {
        currentTab.value = tabNumber
      }

      root.$router.push({
        query: {
          ...root.$route.query,
          [queryProperty]: currentTab.value
        },
        params: {
          ...root.$route.params
        }
      }, () => {})
      const containerManager = props.containerManager
      if (containerManager !== undefined) {
        // console.log(containerManager)
        // containerManager.seekTab({
        //   tabNumber,
        //   currentTab
        // }).then(() => {})
      }
      return tabNumber
    }

    // get records list
    const recordsList = computed(() => {
      const data = root.$store.getters['dataManager/getContainerData']({
        containerUuid: props.containerUuid
      })
      if (data && data.recordsList) {
        return data.recordsList
      }
      return []
    })

    const getData = () => {
      // TODO: Add support to load data in dependent childs
      if (!props.isParentTabs) {
        return
      }
      // TODO: Add store get data from tab
      root.$store.dispatch('dataManager/getEntities', {
        parentUuid: props.parentUuid,
        containerUuid: tabUuid.value,
        ...props.tabsList[currentTab.value]
      }).then(responseData => {
        if (!isCreateNew.value && !root.isEmptyValue(responseData)) {
          let row = responseData[0]
          // uuid into action query
          if (!root.isEmptyValue(root.$route.query.action)) {
            row = responseData.find(rowData => {
              return rowData.UUID === root.$route.query.action
            })
          }

          const tableName = props.tabsList[currentTab.value].tableName
          // set values in panel
          props.containerManager.seekRecord({
            parentUuid: props.parentUuid,
            containerUuid: tabUuid.value,
            row,
            tableName
          })
        }
      })
    }

    const openContainer = () => {
      if (props.isParentTabs) {
        // TODO: Add tab manager store
        root.$store.commit('setExternalContainer', true)
        return
      }
      isShowMultiRecords.value = !isShowMultiRecords.value
    }

    getData()

    setTabNumber(currentTab.value)

    return {
      tabUuid,
      currentTab,
      isShowMultiRecords,
      tableHeaders,
      recordsList,
      // computed
      containerManagerTab,
      isShowRecords,
      tabStyle,
      // methods
      handleClick,
      openContainer,
      isDisabledTab
    }
  }

})
</script>
