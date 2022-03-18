<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Leonel Matos lmatos@erpya.com www.erpya.com
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
  <div v-if="isLoading" key="report-viewer-loaded" style="min-height: inherit;">
    <el-row type="flex" style="min-height: inherit;">
      <el-col :span="24">
        <action-menu
          :container-manager="containerManager"
          :parent-uuid="reportUuid"
          :container-uuid="reportUuid"
          :actions-manager="actionsManager"
          :relations-manager="relationsManager"
        />
        <br>
        <div class="content">
          <title-and-help
            style="margin: 0 !important;"
            :name="storedReportDefinition.name"
            :help="storedReportDefinition.help"
          />

          <file-render
            :format="reportFormat"
            :content="reportContent"
            :src="link.href"
            :mime-type="getStoredReportOutput.mimeType"
            :name="getStoredReportOutput.name"
            :stream="getStoredReportOutput.outputStream"
          />
        </div>
      </el-col>
    </el-row>

    <modal-dialog
      :container-manager="containerManager"
      :container-uuid="reportUuid"
    />
  </div>

  <loading-view
    v-else
    key="report-viewer-loading"
  />
</template>

<script>
import { defineComponent, computed, onMounted, ref } from '@vue/composition-api'

import lang from '@/lang'
import router from '@/router'
import store from '@/store'

// components and mixins
import ActionMenu from '@/components/ADempiere/ActionMenu/index.vue'
import FileRender from '@/components/ADempiere/FileRender/index.vue'
import LoadingView from '@/components/ADempiere/LoadingView/index.vue'
import mixinReport from '@/views/ADempiere/Report/mixinReport.js'
import ModalDialog from '@/components/ADempiere/ModalDialog/index.vue'
import TitleAndHelp from '@/components/ADempiere/TitleAndHelp/index.vue'

// utils and helper methods
import { convertObjectToKeyValue } from '@/utils/ADempiere/valueFormat.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { showNotification } from '@/utils/ADempiere/notification.js'

export default defineComponent({
  name: 'ReportViewer',

  components: {
    FileRender,
    LoadingView,
    ActionMenu,
    ModalDialog,
    TitleAndHelp
  },

  setup(props, { root }) {
    const reportUuid = root.$route.params.reportUuid
    const { containerManager, actionsManager, storedReportDefinition } = mixinReport(reportUuid)
    const isLoading = ref(false)
    const reportFormat = ref('html')
    const reportContent = ref('')

    const getStoredReportOutput = computed(() => {
      return store.getters.getReportOutput(root.$route.params.instanceUuid)
    })

    const link = computed(() => {
      return getStoredReportOutput.value.link
    })

    function displayReport(reportOutput) {
      if (!reportOutput.isError) {
        const { output, reportType } = reportOutput

        reportFormat.value = reportType
        reportContent.value = output

        isLoading.value = true
      }

      // update name in tag view
      store.dispatch('tagsView/updateVisitedView', {
        ...root.$route,
        title: `${lang.t('route.reportViewer')}: ${reportOutput.name}`
      })
    }

    // get report from vuex store or request from server
    function getReport() {
      if (!isEmptyValue(storedReportDefinition.value)) {
        getCachedReport()
        return
      }

      store.dispatch('getReportDefinitionFromServer', {
        uuid: reportUuid
      }).then(() => {
        getCachedReport()
      })
    }

    function getCachedReport() {
      if (isEmptyValue(getStoredReportOutput.value)) {
        const pageSize = undefined
        const pageToken = undefined
        store.dispatch('getSessionProcessFromServer', {
          pageSize,
          pageToken
        })
          .then(runsList => {
            const fileName = root.$route.params.fileName
            const instanceUuid = root.$route.params.instanceUuid
            const currentReportLog = runsList.find(runReport => {
              return runReport.uuid === reportUuid
            })

            // empty report log
            if (isEmptyValue(currentReportLog)) {
              showNotification({
                type: 'error',
                title: 'error',
                message: 'requestError'
              })

              store.dispatch('tagsView/delView', root.$route)
                .then(() => {
                  router.push('/', () => {})
                })
              return
            }

            const { output } = currentReportLog
            // empty output in report log
            if (isEmptyValue(output.outputStream)) {
              const storedReportOutput = store.getters.getReportOutput(instanceUuid)
              if (isEmptyValue(storedReportOutput)) {
                const { parameters } = currentReportLog
                const parametersList = convertObjectToKeyValue({
                  object: parameters
                })

                const reportType = fileName.split('.').pop()
                store.dispatch('getReportOutputFromServer', {
                  uuid: reportUuid,
                  reportType,
                  reportName: fileName,
                  tableName: root.$route.params.tableName,
                  parametersList,
                  instanceUuid
                }).then(reportOutput => {
                  displayReport(reportOutput)
                })
              } else {
                // add output to list
                // currentReportLog.output = storedReportOutput
              }
            }
          })
      } else {
        displayReport(getStoredReportOutput.value)
      }
    }

    const relationsManager = ref({
      menuParentUuid: root.$route.meta.parentUuid
    })

    onMounted(() => {
      getReport()
      root.$route.meta.reportFormat = reportFormat.value
    })

    return {
      reportUuid,
      isLoading,
      reportFormat,
      reportContent,
      actionsManager,
      relationsManager,
      // computeds
      containerManager,
      link,
      storedReportDefinition,
      getStoredReportOutput
    }
  }
})
</script>

<style lang="scss" scoped>
	.content {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0%;
  }
  .el-table__body-wrapper {
    position: relative;
    height: 100%;
    overflow-y: 'auto';
  }
</style>
