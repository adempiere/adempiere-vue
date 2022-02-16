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
          :parent-uuid="$route.params.reportUuid"
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

    <!--
    <modal-dialog
      :metadata="storedReportDefinition"
      :parent-uuid="$route.params.reportUuid"
      :report-export-type="reportFormat"
      :panel-type="panelType"
    />
    -->
  </div>

  <loading-view
    v-else
    key="report-viewer-loading"
  />
</template>

<script>
import { defineComponent, computed, onMounted, ref } from '@vue/composition-api'

// components and mixins
import ActionMenu from '@/components/ADempiere/ActionMenu/index.vue'
import FileRender from '@/components/ADempiere/FileRender/index.vue'
import LoadingView from '@/components/ADempiere/LoadingView/index.vue'
// import ModalDialog from '@/components/ADempiere/Dialog/index.vue'
import TitleAndHelp from '@/components/ADempiere/TitleAndHelp/index.vue'

// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { showNotification } from '@/utils/ADempiere/notification'

export default defineComponent({
  name: 'ReportViewer',

  components: {
    FileRender,
    LoadingView,
    ActionMenu,
    // ModalDialog,
    TitleAndHelp
  },

  setup(props, { root }) {
    const isLoading = ref(false)
    const reportFormat = ref('html')
    const reportContent = ref('')
    const reportResult = ref({})

    const storedReportDefinition = computed(() => {
      return root.$store.getters.getStoredReport(root.$route.params.reportUuid)
    })

    const getStoredReportOutput = computed(() => {
      return root.$store.getters.getReportOutput(root.$route.params.instanceUuid)
    })

    const link = computed(() => {
      return getStoredReportOutput.value.link
    })

    function displayReport(reportResult) {
      if (!reportResult.isError) {
        const { output } = reportResult
        reportFormat.value = isEmptyValue(output.reportType)
          ? reportResult.reportType
          : output.reportType

        reportContent.value = isEmptyValue(output.output)
          ? reportResult.output
          : output.output

        isLoading.value = true
      }
    }

    function getCachedReport() {
      reportResult.value = getStoredReportOutput.value
      if (reportResult.value === undefined) {
        const pageSize = undefined
        const pageToken = undefined
        root.$store.dispatch('getSessionProcessFromServer', {
          pageSize,
          pageToken
        })
          .then(() => {
            reportResult.value = getStoredReportOutput.value
            if (isEmptyValue(reportResult.value)) {
              showNotification({
                type: 'error',
                title: 'error',
                message: 'requestError'
              })

              root.$store.dispatch('tagsView/delView', root.$route)
                .then(() => {
                  root.$router.push('/', () => {})
                })
              return
            }
            displayReport(reportResult.value)
          })
      } else {
        displayReport(reportResult.value)
      }
    }
    const actionsManager = ref({
      containerUuid: root.$route.params.reportUuid,

      defaultActionName: root.$t('actionMenu.generateReport'),

      getActionList: () => root.$store.getters.getStoredActionsMenu({
        containerUuid: root.$route.params.reportUuid
      })
    })

    const relationsManager = ref({
      menuParentUuid: root.$route.meta.parentUuid
    })
    onMounted(() => {
      getCachedReport()
      root.$route.meta.reportFormat = reportFormat.value
    })

    return {
      isLoading,
      reportFormat,
      reportContent,
      actionsManager,
      relationsManager,
      // computeds
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
