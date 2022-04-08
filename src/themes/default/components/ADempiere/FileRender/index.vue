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
  <component
    :is="componentRender"
    :format="format"
    :src="src"
    :content="content"
    :name="name"
    :mime-type="mimeType"
    :stream="stream"
  />
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

export default defineComponent({
  name: 'FileRender',

  props: {
    format: {
      type: String,
      required: true
    },
    content: {
      type: [Object, Array, String, Number],
      default: ''
    },
    src: {
      type: [Object, Array, String],
      default: ''
    },
    name: {
      type: String,
      default: undefined
    },
    mimeType: {
      type: String,
      default: undefined
    },
    stream: {
      type: [Object, Array],
      default: undefined
    }
  },

  setup(props) {
    const componentRender = computed(() => {
      let viewer
      switch (props.format) {
        case 'html':
          viewer = () => import('@theme/components/ADempiere/FileRender/HtmlFile')
          break
        case 'pdf':
          viewer = () => import('@theme/components/ADempiere/FileRender/PdfFile')
          break
        case 'csv':
        case 'ssv':
        case 'xls':
        case 'xlsx':
        case 'txt':
          viewer = () => import('@theme/components/ADempiere/FileRender/ExcelFile')
          break
        case 'xml':
          viewer = () => import('@theme/components/ADempiere/FileRender/XmlFile')
          break
        default:
          viewer = () => import('@theme/components/ADempiere/FileRender/EmptyFile')
          break
      }
      return viewer
    })

    return {
      componentRender
    }
  }
})
</script>
