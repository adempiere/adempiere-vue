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
      <b style="text-align: center;"> Historico de Cambios </b>
      <el-descriptions :column="1">
        <el-descriptions-item label="Ventana" label-style="{ color: #606266; font-weight: bold; }">
          <span style="color: #606266; font-weight: bold;">
            {{ allTabsList[currentTabLogs].name }}
            <svg-icon icon-class="tab" />
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="Registro" label-style="{ color: #606266; font-weight: bold; }">
          <span style="color: #606266; font-weight: bold;">
            {{ currentRecordLogs.Name }}
            <svg-icon icon-class="documentation" />
          </span>
        </el-descriptions-item>
      </el-descriptions>
    </el-header>
    <el-main style="padding:0px">
      <hr>
      <el-timeline v-if="listLogs.recordCount > 0">
        <el-timeline-item
          v-for="(listLogs, keys) in listLogs.entityLogs"
          :key="listLogs.logId"
          :type="listLogs.type"
          :color="'#0bbd87'"
          :timestamp="listLogs.logDate"
          placement="top"
        >
          <el-card shadow="hover" class="clearfix" style="padding: 2%">
            <div>
              <span style="color: #606266; font-weight: bold;">
                Actualizado Por <b>:</b> {{ listLogs.userName }} <i class="el-icon-user-solid" />
              </span>
              <el-link
                type="primary"
                style="float: right;"
                @click="showkey(keys)"
              >
                {{ $t('window.containerInfo.changeDetail') }}
              </el-link>
            </div>
            <el-collapse-transition>
              <div v-show="(currentKey === keys)">
                <span v-for="(list, index) in listLogs.changeLogsList" :key="index">
                  <p v-if="validate(list)">
                    <b> {{ list.displayColumnName }} :2</b>
                    <strike>
                      <document-status-tag
                        :value="list.oldValue"
                        :displayed-value="list.oldDisplayValue"
                      />
                    </strike>
                    <document-status-tag
                      :value="list.newValue"
                      :displayed-value="list.newDisplayValue"
                    />
                  </p>
                  <el-descriptions v-else class="margin-top" :column="1">
                    <el-descriptions-item label="Nombre" label-style="{ color: #606266; font-weight: bold; }">
                      <span style="color: #606266; font-weight: bold;"> {{ list.displayColumnName }} </span>
                    </el-descriptions-item>
                    <el-descriptions-item label="Nuevo vvalidater" label-style="{ color: #606266; font-weight: bold; }">
                      <el-link type="success">
                        {{ list.newDisplayValue }}
                      </el-link>
                    </el-descriptions-item>
                    <el-descriptions-item label="Vvalidater antiguo" label-style="{ color: #606266; font-weight: bold; }">
                      <strike>
                        <el-link type="danger">
                          {{ list.oldDisplayValue }}
                        </el-link>
                      </strike>
                    </el-descriptions-item>
                    <el-descriptions-item label="Columna" label-style="{ color: #606266; font-weight: bold; }">
                      <span style="color: #606266; font-weight: bold;"> {{ list.columnName }} </span>
                    </el-descriptions-item>
                  </el-descriptions>
                </span>
              </div>
            </el-collapse-transition>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <div v-else>
        <el-empty />
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { defineComponent, computed, watch, ref } from '@vue/composition-api'

import store from '@/store'

// components and mixins
import { DOCUMENT_STATUS_COLUMNS_LIST } from '@/utils/ADempiere/constants/systemColumns'
import DocumentStatusTag from '@/components/ADempiere/ContainerOptions/DocumentStatusTag/index.vue'

// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

export default defineComponent({
  name: 'RecordLogs',

  components: {
    DocumentStatusTag
  },

  props: {
    allTabsList: {
      type: Array,
      default: () => []
    }
  },

  setup(props, { root }) {
    const currentRecordLogs = ref({ name: 'nada' })
    const listLogs = ref({})
    const currentKey = ref(0)
    const typeAction = ref(0)
    const currentTabLogs = ref('0')

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

    watch(currentRecordLogs, (newValue, oldValue) => {
      if (!isEmptyValue(newValue)) {
        findListRecordLogs(newValue)
      }
    })
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
    /**
     * findListRecordLogs
      */
    const findListRecordLogs = (record) => {
      store.dispatch('listRecordLogs', {
        tableName: props.allTabsList[parseInt(currentTabLogs.value)].tableName,
        recordId: record[props.allTabsList[parseInt(currentTabLogs.value)].tableName],
        recordUuid: record.UUID
      })
        .then(response => {
          listLogs.value = response
        })
        .catch(error => {
          console.warn(`Error getting List Record Logs: ${error.message}. Code: ${error.code}.`)
        })
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
    const openRecordLogs = () => {
      drawer.value = !drawer.value
      if (drawer.value) {
        findRecordLogs(props.allTabsList[parseInt(currentTabLogs.value)])
      }
    }
    const drawer = ref(false)

    return {
      currentTabLogs,
      drawer,
      currentRecordLogs,
      currentKey,
      isLoadLogs,
      listLogs,
      // methods
      validate,
      findListRecordLogs,
      showkey,
      findRecordLogs,
      handleClickLogs,
      openRecordLogs
    }
  }

})
</script>
