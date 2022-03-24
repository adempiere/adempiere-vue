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
  <el-container
    v-if="isLoadedMetadata"
    key="report-loaded"
    class="view-base report-view"
    style="height: 84vh;"
  >
    <el-header
      v-if="showContextMenu"
      style="height: 30px;"
    >
      <action-menu
        :container-manager="containerManager"
        :parent-uuid="reportUuid"
        :container-uuid="reportUuid"
        :actions-manager="actionsManager"
        :relations-manager="relationsManager"
      />
    </el-header>

    <el-main>
      <el-card class="content-collapse card-report">
        <title-and-help
          :name="reportMetadata.name"
          :help="reportMetadata.help"
        />

        <panel-definition
          :container-uuid="reportUuid"
          :panel-metadata="reportMetadata"
          :container-manager="containerManager"
        />
      </el-card>
    </el-main>
  </el-container>

  <loading-view
    v-else
    key="report-loading"
  />
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

import store from '@/store'

// components and mixins
import ActionMenu from '@/components/ADempiere/ActionMenu/index.vue'
import LoadingView from '@/components/ADempiere/LoadingView/index.vue'
import mixinReport from '@/views/ADempiere/Report/mixinReport.js'
import PanelDefinition from '@/components/ADempiere/PanelDefinition/index.vue'
import TitleAndHelp from '@/components/ADempiere/TitleAndHelp/index.vue'

import { convertProcess as convertReport } from '@/utils/ADempiere/apiConverts/dictionary.js'
import { generateProcess as generateReport } from '@/utils/ADempiere/dictionary/process.js'

export default defineComponent({
  name: 'ReportView',

  components: {
    ActionMenu,
    LoadingView,
    PanelDefinition,
    TitleAndHelp
  },

  props: {
    // implement by test view
    uuid: {
      type: String,
      default: ''
    }
  },

  setup(props, { root }) {
    const isLoadedMetadata = ref(false)
    const reportMetadata = ref({})

    let reportUuid = root.$route.meta.uuid
    // set uuid from test
    if (!root.isEmptyValue(props.uuid)) {
      reportUuid = props.uuid
    }

    const { containerManager, actionsManager, storedReportDefinition } = mixinReport(reportUuid)

    const showContextMenu = computed(() => {
      return store.state.settings.showContextMenu
    })

    store.dispatch('settings/changeSetting', {
      key: 'showContextMenu',
      value: true
    })

    // get report from vuex store or request from server
    const getReport = async() => {
      let report = storedReportDefinition.value
      if (report) {
        reportMetadata.value = report
        isLoadedMetadata.value = true
        return
      }

      // metadata props use for test
      if (!root.isEmptyValue(props.metadata)) {
        // from server response
        report = convertReport(props.metadata)
        // add apps properties
        report = generateReport(report)
        // add into store
        return store.dispatch('addReport', report)
          .then(reportResponse => {
            // to obtain the load effect
            setTimeout(() => {
              reportMetadata.value = reportResponse
              isLoadedMetadata.value = true
            }, 1000)
          })
      }

      store.dispatch('getReportDefinitionFromServer', {
        uuid: reportUuid
      })
        .then(reportResponse => {
          reportMetadata.value = reportResponse
        }).catch(error => {
          console.warn(error)
        }).finally(() => {
          isLoadedMetadata.value = true
        })
    }

    const relationsManager = ref({
      menuParentUuid: root.$route.meta.parentUuid
    })

    getReport()

    return {
      reportUuid,
      isLoadedMetadata,
      reportMetadata,
      containerManager,
      actionsManager,
      relationsManager,
      // computeds
      showContextMenu
    }
  }
})
</script>

<style lang="scss">
.report-view {
  .card-report {
    >.el-card__body {
      padding-top: 0px;
      padding-right: 20px;
      padding-bottom: 20px;
      padding-left: 20px;
      height: 100%;
    }
  }
}
</style>
<style scoped >
  .el-card {
    width: 100% !important;
    height: 100% !important;
  }
</style>
