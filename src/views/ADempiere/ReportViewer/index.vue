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
    <!-- TODO: Add action menu -->

    <el-row type="flex" style="min-height: inherit;">
      <el-col :span="24">
        <div class="content">
          <title-and-help
            style="margin: 0 !important;"
            :name="processMetadata.name"
            :help="processMetadata.help"
          />
          <file-render
            :format="reportFormat"
            :content="reportContent"
            :src="url"
            :mime-type="getterCachedReport.output.mimeType"
            :name="getterCachedReport.name"
            :stream="getterCachedReport.output.outputStream"
          />
        </div></el-col>
    </el-row>

    <modal-dialog
      :metadata="processMetadata"
      :parent-uuid="reportResult.processUuid"
      :report-export-type="reportFormat"
      :panel-type="panelType"
    />
  </div>

  <loading-view
    v-else
    key="report-viewer-loading"
  />
</template>

<script>
// components and mixins
import FileRender from '@/components/ADempiere/FileRender'
import LoadingView from '@/components/ADempiere/LoadingView/index.vue'
import ModalDialog from '@/components/ADempiere/Dialog/index.vue'
import TitleAndHelp from '@/components/ADempiere/TitleAndHelp'

// utils and helper methods
import { showNotification } from '@/utils/ADempiere/notification'

export default {
  name: 'ReportViewer',

  components: {
    FileRender,
    LoadingView,
    ModalDialog,
    TitleAndHelp
  },

  data() {
    return {
      panelType: 'process',
      processMetadata: {},
      reportFormat: '',
      reportContent: '',
      isLoading: false,
      reportResult: {}
    }
  },

  computed: {
    // TODO: Add get metadata from server to open report view from link
    showContextMenu() {
      return this.$store.state.settings.showContextMenu
    },
    getterProcess() {
      return this.$store.getters.getProcessById(this.$route.params.processId)
    },
    url() {
      return this.$store.getters.getProcessResult.url
    },
    getterCachedReport() {
      return this.$store.getters.getCachedReport(this.$route.params.instanceUuid)
    }
  },

  created() {
    this.processMetadata = this.getterProcess
  },

  mounted() {
    this.getCachedReport()
    this.$route.meta.reportFormat = this.reportFormat
  },

  methods: {
    showNotification,
    displayReport(reportResult) {
      if (!reportResult.isError) {
        const { output } = reportResult
        this.reportFormat = this.isEmptyValue(output.reportType)
          ? reportResult.reportType
          : output.reportType
        this.reportContent = this.isEmptyValue(output.output)
          ? reportResult.output
          : output.output

        this.isLoading = true
      }
    },
    getCachedReport() {
      this.reportResult = this.getterCachedReport
      if (this.reportResult === undefined) {
        const pageSize = undefined
        const pageToken = undefined
        this.$store.dispatch('getSessionProcessFromServer', {
          pageSize,
          pageToken
        })
          .then(response => {
            this.reportResult = this.getterCachedReport
            if (this.reportResult === undefined) {
              this.showNotification({
                type: 'error',
                title: 'error',
                message: 'requestError'
              })

              this.$store.dispatch('tagsView/delView', this.$route)
                .then(() => {
                  this.$router.push('/', () => {})
                })
              return
            }
            this.displayReport(this.reportResult)
          })
      } else {
        this.displayReport(this.reportResult)
      }
    }
  }
}
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
