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
    <context-menu
      v-if="showContextMenu"
      :container-uuid="reportResult.processUuid"
      :panel-type="panelType"
      :is-report="true"
      :last-parameter="reportResult.processUuid"
      :report-format="reportFormat"
    />

    <el-row type="flex" style="min-height: inherit;">
      <el-col :span="24">
        <div class="content">
          <title-and-help
            style="margin: 0 !important;"
            :name="processMetadata.name"
            :help="processMetadata.help"
          />
          <div
            v-if="!isEmptyValue(excelData)"
            key="report-content-excel"
            class="content-txt"
          >
            <el-container class="sub-content-excel">
              <el-main style="padding: 0;">
                <el-button style="margin:0 0 20px 20px;" type="primary" icon="el-icon-download" @click="handleDownload">
                  {{ $t('components.contextMenuDownload') }}
                </el-button>
                <el-table
                  :data="excelData.results"
                  border
                  highlight-current-row
                  style="width: 100%;height: 85% !important;"
                  height="90% !important"
                >
                  <el-table-column
                    v-for="item of excelData.header"
                    :key="item"
                    :prop="item"
                    :label="item"
                  />
                </el-table>
              </el-main>
            </el-container>
          </div>
          <iframe
            v-if="reportFormat === 'pdf'"
            key="report-content-pdf"
            class="content-api"
            :src="url"
            width="100%"
            height="100%"
          />
          <div
            v-else-if="['html', 'txt'].includes(reportFormat)"
            key="report-content-html"
            class="content-txt"
          >
            <el-container class="sub-content-html">
              <el-main style="padding: 0;">
                <div
                  class="el-table--striped el-table--border el-table--scrollable-y el-table--scrollable-x"
                  v-html="reportContent"
                />
              </el-main>
            </el-container>
          </div>
          <div
            v-else-if="reportFormatsList.includes(reportFormat)"
            key="report-content-all"
            class="content-api"
            :src="url"
          />
        </div>
      </el-col>
    </el-row>

    <modal-dialog
      :metadata="processMetadata"
      :parent-uuid="reportResult.processUuid"
      :report-export-type="reportFormat"
      :panel-type="panelType"
    />
  </div>

  <div
    v-else
    key="report-viewer-loading"
    v-loading="!isLoading"
    :element-loading-text="$t('notifications.loading')"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)"
    class="view-loading"
  />
</template>

<script>
import ContextMenu from '@/components/ADempiere/ContextMenu'
import ModalDialog from '@/components/ADempiere/Dialog'
import TitleAndHelp from '@/components/ADempiere/TitleAndHelp'
import { showNotification } from '@/utils/ADempiere/notification'
import { reportFormatsList } from '@/utils/ADempiere/exportUtil.js'
import XLSX from 'xlsx'

export default {
  name: 'ReportViewer',
  components: {
    ContextMenu,
    ModalDialog,
    TitleAndHelp
  },
  data() {
    return {
      panelType: 'process',
      processMetadata: {},
      reportFormat: '',
      reportFormatsList,
      reportContent: '',
      isLoading: false,
      reportResult: {},
      excelData: {},
      supportedExcelFormats: ['csv', 'xlsx', 'xls']
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
    },
    reportObject() {
      return Object.values(this.getterCachedReport.output.outputStream)
    }
  },
  created() {
    this.processMetadata = this.getterProcess
  },
  mounted() {
    this.getCachedReport()
    if (this.supportedExcelFormats.includes(this.reportFormat)) {
      this.readerData()
    }
    this.$route.meta.reportFormat = this.reportFormat
  },
  methods: {
    readerData() {
      const blob = new Blob([Uint8Array.from(this.reportObject)], {
        type: this.getterCachedReport.output.mimeType
      })
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = e => {
          const data = this.reportObject
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const header = this.getHeaderRow(worksheet)
          const results = XLSX.utils.sheet_to_json(worksheet)
          this.generateData({ header, results })
          resolve()
        }
        reader.readAsArrayBuffer(blob)
      })
    },
    generateData({ header, results }) {
      this.excelData = {
        header,
        results
      }
    },
    getHeaderRow(sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    },
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
    },
    handleDownload() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = this.excelData.header
        const filterVal = this.excelData.header
        const list = this.excelData.results
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.getterCachedReport.name,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(row => {
        return filterVal.map(column => {
          return row[column]
        })
      })
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
	.content-html {
		width: 100%;
    height: 100%;
    padding: 10px;
	}
  .content-api {
		width: 100%;
    height: 90%;
    padding-right: 10px;
	}
  .content-txt {
		width: 100%;
		height: inherit;
    padding-left: 10px;
    padding-right: 10px;

    .sub-content-html {
      min-height: inherit;
      height: inherit;
      max-height: -webkit-max-content;
      max-height: -moz-max-content;
      max-height: max-content;
      width: 100%;
      padding-bottom: 4%;
    }
    .sub-content-excel {
      min-height: inherit;
      height: inherit;
      max-height: -webkit-max-content;
      max-height: -moz-max-content;
      max-height: max-content;
      width: 100%;
      padding-bottom: 4%;
    }
	}
  .content-excel {
    width: 100%;
    margin-top:20px;
  }
  .container {
    width: 200%;
    /* left: 50%; */
  }
  .container-report {
    width: 100%;
  }
  .el-table__body-wrapper {
    position: relative;
    height: 100%;
    overflow-y: 'auto';
  }
</style>
