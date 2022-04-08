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
  <div class="xml-content">
    <download-file
      :format="format"
      :name="name"
      :mime-type="mimeType"
      :stream="stream"
    />

    <br>
    <span style="margin:0 0 10px 20px; color: gray;">
      {{ xmlComment }}
    </span>

    <XmlViewer :xml="xmlParsed" style="margin:0 0 10px 20px;" />
  </div>
</template>

<script>
import { defineComponent, computed, ref, onMounted } from '@vue/composition-api'

// components and mixins
import XmlViewer from 'vue-xml-viewer'
import DownloadFile from '@theme/components/ADempiere/FileRender/downloadFile.vue'

export default defineComponent({
  name: 'XML-File',

  components: {
    DownloadFile,
    XmlViewer
  },

  props: {
    format: {
      type: String,
      required: true
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
  },

  setup(props, { root }) {
    const xmlParsed = ref('')
    const xmlComment = ref('')
    const htmlCommentPattern = /<\!--.*?-->/g

    const getStoredReportOutput = computed(() => {
      return root.$store.getters.getReportOutput(root.$route.params.instanceUuid)
    })

    onMounted(() => {
      // eslint-disable-next-line new-cap
      const xmlDocument = new Buffer.from(getStoredReportOutput.value.outputStream_asB64, 'base64')
      const xmlAsString = xmlDocument.toString()

      xmlComment.value = xmlAsString.match(htmlCommentPattern).toString()
      xmlParsed.value = xmlAsString.replace(htmlCommentPattern, '')
    })

    return {
      xmlParsed,
      xmlComment
    }
  }

})
</script>

<style lang="scss" scoped>
.xml-content {
  width: 100%;
  height: inherit;
  padding-right: 10px;
}
</style>
