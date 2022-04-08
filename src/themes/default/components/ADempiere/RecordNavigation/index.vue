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
  <el-container class="record-navigation">
    <!-- records in table -->
    <default-table
      :parent-uuid="parentUuid"
      :container-uuid="containerUuid"
      :container-manager="containerManager"
      :panel-metadata="panelMetadata"
      :header="tableheaders"
      :data-table="listDataTabla"
    />
    <!-- <div class="infinite-list-wrapper" style="overflow:auto;max-height: 200px;">
      <ul
        class="list"
        v-infinite-scroll="epale"
        infinite-scroll-disabled="disabled"
      >
        <li v-for="(i, key) in count" :key="key" class="list-item">{{ i }}</li>
      </ul>
      <p v-if="loading">Loading...</p>
      <p v-if="noMore">No more</p>
    </div> -->

  </el-container>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

import DefaultTable from '@theme/components/ADempiere/DefaultTable'
import PanelDefinition from '@theme/components/ADempiere/PanelDefinition'

export default defineComponent({
  name: 'RecordNavigation',

  components: {
    DefaultTable,
    PanelDefinition
  },

  props: {
    parentUuid: {
      type: String,
      default: undefined
    },
    containerUuid: {
      type: String,
      required: true
    },
    containerManager: {
      type: Object,
      required: true
    },
    currentTab: {
      type: Object,
      required: true
    }
  },

  setup(props, { root }) {
    const activeName = ref([])
    const listDataTabla = ref([])
    const timeOut = ref(() => {})
    const loading = ref(false)
    // TODO: Manage attribute with vuex store in window module
    if (root.$route.query.action && root.$route.query.action === 'advancedQuery') {
      activeName.value.push('PanelAdvancedQuery')
    }

    const shorcutKey = computed(() => {
      return {
        f6: ['f6'],
        ctrlf: ['ctrl', 'f']
      }
    })

    const isLoadedPanel = computed(() => {
      const panelMetadata = root.$store.getters.getPanel('table_' + props.containerUuid)
      if (!root.isEmptyValue(panelMetadata)) {
        return true
      }
      return false
    })

    const panelMetadata = computed(() => {
      return props.currentTab
    })

    // create the table header
    const tableheaders = computed(() => {
      const panel = panelMetadata.value
      if (panel && panel.fieldsList) {
        return panel.fieldsList
      }
      return []
    })

    const tabData = computed(() => {
      return root.$store.getters.getTabData({
        containerUuid: props.containerUuid
      })
    })

    // get records list
    const recordsList = computed(() => {
      return tabData.value.recordsList
    })

    function load(value) {
      clearTimeout(timeOut.value)
      timeOut.value = setTimeout(() => {
        console.log(listDataTabla.value)
        listDataTabla.value = tabData.value.recordsList
      }, 1)
    }

    load()

    const actionAdvancedQuery = () => {
      const activeNames = []
      if (!activeName.value.length) {
        activeNames.push('PanelAdvancedQuery')
      }
      activeName.value = activeNames
    }

    return {
      activeName,
      timeOut,
      listDataTabla,
      loading,
      // computeds
      recordsList,
      isLoadedPanel,
      panelMetadata,
      tableheaders,
      shorcutKey,
      // methods
      load,
      actionAdvancedQuery
    }
  }
})
</script>

<style>
.record-navigation {
  background-color: #fff;
  height: 100%;
  max-height: 200px;
  display: contents;
}
</style>
