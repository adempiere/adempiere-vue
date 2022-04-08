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
  <span>
    <lock-record
      slot="label"
      :is-active-tab="isActiveTab"
      :parent-uuid="parentUuid"
      :container-uuid="tabMetadata.uuid"
      :table-name="tabMetadata.tableName"
      :tab-name="tabMetadata.name"
    />

    <el-tooltip
      :content="$t('window.gridToggle')"
      placement="top"
    >
      <el-button
        v-if="isActiveTab"
        type="text"
        style="margin-left: 0px;"
        :disabled="isDisbaledTable"
        @click="changeShowedRecords "
      >
        <i class="el-icon-s-fold" style="font-size: 15px; color: black;" />
      </el-button>
    </el-tooltip>

    <el-tooltip
      :content="$t('window.toggleTabContentVisibility')"
      placement="top"
    >
      <el-button
        v-if="isActiveTab"
        type="text"
        style="margin-left: 0px;"
        @click="changeShowedTab"
      >
        <svg-icon icon-class="eye-open" style="font-size: 15px; color: black;" />
      </el-button>
    </el-tooltip>
  </span>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

// components and mixins
import LockRecord from '@theme/components/ADempiere/ContainerOptions/LockRecord/index.vue'

export default defineComponent({
  name: 'TabLabel',

  components: {
    LockRecord
  },

  props: {
    parentUuid: {
      type: String,
      required: false
    },
    containerUuid: {
      type: String,
      required: false
    },
    isActiveTab: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { root }) {
    const tabMetadata = computed(() => {
      return root.$store.getters.getStoredTab(
        props.parentUuid,
        props.containerUuid
      )
    })

    const windowMetadata = computed(() => {
      return root.$store.getters.getStoredWindow(
        props.parentUuid
      )
    })

    const isDisbaledTable = computed(() => {
      if (props.isParentTabs) {
        return false
      }
      return !root.$store.getters.getStoredWindow(props.parentUuid).isShowedTabsChildren
    })

    function changeShowedRecords() {
      if (tabMetadata.value.isParentTab) {
        root.$store.dispatch('changeTabAttribute', {
          parentUuid: props.parentUuid,
          containerUuid: props.containerUuid,
          attributeName: 'isShowedTableRecords',
          attributeValue: true
        })
        return
      }

      root.$store.dispatch('changeTabAttribute', {
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid,
        attributeName: 'isShowedTableRecords',
        attributeValue: !tabMetadata.value.isShowedTableRecords
      })
    }

    /**
     * Change if tabsList is collapse
     */
    function changeShowedTab() {
      if (tabMetadata.value.isParentTab) {
        root.$store.commit('changeWindowAttribute', {
          uuid: props.parentUuid,
          attributeName: 'isShowedTabsParent',
          attributeValue: !windowMetadata.value.isShowedTabsParent
        })
        return
      }

      root.$store.commit('changeWindowAttribute', {
        uuid: props.parentUuid,
        attributeName: 'isShowedTabsChildren',
        attributeValue: !windowMetadata.value.isShowedTabsChildren
      })
    }

    return {
      tabMetadata,
      isDisbaledTable,
      // methods
      changeShowedTab,
      changeShowedRecords
    }
  }
})
</script>
