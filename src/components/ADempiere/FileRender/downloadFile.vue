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
  <el-dropdown
    style="margin:0 0 10px 20px;"
    :hide-on-click="true"
    size="mini"
    split-button
    type="primary"
    trigger="click"
    @command="handleDownload"
    @click="handleDownload()"
  >
    <i class="el-icon-download" />
    {{ $t('components.contextMenuDownload') }} ({{ format }})

    <el-dropdown-menu slot="dropdown" size="mini">
      <el-dropdown-item
        v-for="(format, index) in formatList"
        :key="index"
        :command="format.type"
        size="mini"
        :divided="true"
      >
        <div class="contents">
          <div>
            <span class="contents">
              <b class="label">
                {{ format.name }}
              </b>
            </span>
          </div>
        </div>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { buildLinkHref } from '@/utils/ADempiere/resource'

export default defineComponent({
  name: 'DownloadFile',

  props: {
    mimeType: {
      type: String,
      default: undefined
    },
    format: {
      type: String,
      default: 'xlsx'
    },
    name: {
      type: String,
      default: undefined
    },
    stream: {
      type: [Object, Array],
      required: true
    }
  },

  setup(props, { root }) {
    const formatList = computed(() => {
      return root.$store.getters.getStoredReportExportTypes(root.$route.params.reportUuid)
    })

    const getStoredReportOutput = computed(() => {
      return root.$store.getters.getReportOutput(root.$route.params.instanceUuid)
    })

    /**
     * Generate report by cache from vuex stored
     */
    function downloadCurrentFile() {
      if (!isEmptyValue(getStoredReportOutput.value)) {
        getStoredReportOutput.value.link.click()
        return
      }

      // if not report output regenerate binary file
      buildLinkHref({
        fileName: `${props.name}.${props.format}`,
        mimeType: props.mimeType,
        outputStream: props.stream,
        isDownload: true
      })
    }

    /**
     * Regenerate report from server
     * @param {string} fromat Extension to generate report
     */
    function downloadOtherFile(format) {
      root.$store.dispatch('downloadReport', {
        containerUuid: root.$route.params.reportUuid,
        reportFormat: format
      })
    }

    function handleDownload(format = '') {
      if (isEmptyValue(format) || format === props.format) {
        downloadCurrentFile()
        return
      }

      downloadOtherFile(format)
    }

    return {
      // computeds
      formatList,
      // mehtods
      handleDownload
    }
  }

})
</script>
