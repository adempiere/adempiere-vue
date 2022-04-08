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
  <div class="html-content">
    <download-file
      :format="format"
      :name="name"
      :mime-type="mimeType"
      :stream="stream"
    />

    <el-container class="sub-content-html">
      <el-main style="padding: 0;">
        <div
          class="el-table--striped el-table--border el-table--scrollable-y el-table--scrollable-x"
          v-html="content"
        />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

// components and mixins
import DownloadFile from '@theme/components/ADempiere/FileRender/downloadFile.vue'

export default defineComponent({
  name: 'HTML-TXT-File',

  components: {
    DownloadFile
  },

  props: {
    content: {
      type: [Object, String],
      required: true
    },
    format: {
      type: String,
      default: 'html'
    },
    mimeType: {
      type: String,
      default: undefined
    },
    name: {
      type: String,
      default: undefined
    },
    stream: {
      type: [Object, Array],
      required: true
    }
  }

})
</script>

<style lang="scss" scoped>
.html-content {
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

}
</style>
