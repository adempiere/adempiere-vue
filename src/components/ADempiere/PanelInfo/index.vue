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
 validateng with this program.  If not, see <https:www.gnu.org/licenses/>.
-->

<template>
  <el-container>
    <el-header
      style="height: 20%;text-align: center;padding-top: 1%;"
    >
      <el-descriptions :column="1">
        <el-descriptions-item label="Ventana" label-style="{ color: #606266; font-weight: bold; }">
          <span style="color: #606266; font-weight: bold;">
            {{ allTabsList[0].name }}
            <svg-icon icon-class="tab" />
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="Registro" label-style="{ color: #606266; font-weight: bold; }">
          <span style="color: #606266; font-weight: bold;">
            {{ currentRecord.Name }}
            <svg-icon icon-class="documentation" />
          </span>
        </el-descriptions-item>
      </el-descriptions>
    </el-header>
    <el-main style="padding:0px">
      <hr>
      <el-tabs
        v-model="nameTab"
        type="border-card"
        @tab-click="handleClick"
      >
        <el-tab-pane name="getRecordLogs">
          <span slot="label">
            <svg-icon icon-class="tree-table" />
            Historico de Cambios
          </span>
          <record-logs />
        </el-tab-pane>
        <el-tab-pane name="getAttachment">
          <span slot="label">
            <i class="el-icon-paperclip" />
            {{ $t('window.containerInfo.attachment.label') }}
          </span>
          <attachment
            :is-active-tab="'getAttachment' === nameTab"
            :table-name="allTabsList[0].tableName"
            :record-id="currentRecord[allTabsList[0].tableName + '_ID']"
            :record-uuid="currentRecord.UUID"
          />
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import { defineComponent, computed, watch, ref } from '@vue/composition-api'

import store from '@/store'

// components and mixins
import { DOCUMENT_STATUS_COLUMNS_LIST } from '@/utils/ADempiere/constants/systemColumns'
import Attachment from './Component/Attachment/index.vue'
import RecordLogs from './Component/RecordLogs/index.vue'

export default defineComponent({
  name: 'ContainerInfo',

  components: {
    RecordLogs,
    Attachment
  },

  props: {
    allTabsList: {
      type: Array,
      default: () => []
    },
    containerManager: {
      type: Object,
      required: true
    },
    currentRecord: {
      type: Object,
      required: true
    }
  },

  setup(props, { root }) {
    const currentRecordLogs = ref({ name: 'nada' })
    const listLogs = ref({})
    const currentKey = ref(0)
    const typeAction = ref(0)
    const currentTabLogs = ref('0')
    const nameTab = ref('getRecordLogs')

    // // use getter to reactive properties
    const isLoadLogs = computed(() => {
      return store.state.utils.showRecordLogs
    })
    /**
     * Record
     */
    const findRecordLogs = (tab) => {
      currentRecordLogs.value = root.$store.getters.getValuesView({
        parentUuid: tab.parentUuid,
        containerUuid: tab.containerUuid,
        format: 'object'
      })
    }

    watch(isLoadLogs, (newValue, oldValue) => {
      if (newValue) {
        findRecordLogs(props.allTabsList[parseInt(currentTabLogs.value)])
      }
    })

    findRecordLogs(props.allTabsList[parseInt(currentTabLogs.value)])

    /**
     * showkey
     */
    const showkey = (key, index) => {
      if (key === currentKey.value && index === typeAction.value) {
        currentKey.value = 1000
      } else {
        currentKey.value = key
        typeAction.value = index
      }
    }
    const handleClickLogs = (tabHTML) => {
      findRecordLogs(props.allTabsList[parseInt(currentTabLogs.value)])
    }
    const validate = (list) => {
      return DOCUMENT_STATUS_COLUMNS_LIST.includes(list.columnName)
    }
    /**
     * Listar Historico de cambios
     */
    const openRecordLogs = (a) => {
      drawer.value = !drawer.value
    }
    const handleClick = (tab, event) => {
      nameTab.value = tab.name
      props.containerManager[tab.name]({
        tableName: props.allTabsList[0].tableName,
        recordId: props.currentRecord[props.allTabsList[0].tableName + '_ID'],
        recordUuid: props.currentRecord.UUID
      })
    }
    const drawer = ref(false)

    return {
      currentTabLogs,
      drawer,
      nameTab,
      currentRecordLogs,
      currentKey,
      isLoadLogs,
      listLogs,
      // methods
      validate,
      showkey,
      findRecordLogs,
      handleClick,
      handleClickLogs,
      openRecordLogs
    }
  }

})
</script>
