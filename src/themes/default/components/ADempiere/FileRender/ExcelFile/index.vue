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
  <div class="content-excel" style="height: -webkit-fill-available;">
    <el-container class="sub-content-excel" style="height: -webkit-fill-available;">
      <el-main style="padding: 0;">
        <download-file
          :format="format"
          :name="name"
          :mime-type="mimeType"
          :stream="stream"
        />

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
            :label="item"
          >
            <template slot-scope="scope">
              {{ scope.row[item] }} {{ item }}
            </template>
          </el-table-column>
        </el-table>

      </el-main>
    </el-container>
  </div>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'

// components and mixins
import { read, utils } from 'xlsx'
import DownloadFile from '@theme/components/ADempiere/FileRender/downloadFile.vue'

// utils and helper methods
import { buildBlobAndValues } from '@/utils/ADempiere/resource'

export default defineComponent({
  name: 'ExcelFile',

  components: {
    DownloadFile
  },

  props: {
    format: {
      type: String,
      default: 'xlsx'
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

  setup(props) {
    const excelData = ref({})

    function getHeaderRow(sheet) {
      const headers = []
      const range = utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        const cell = sheet[utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) {
          hdr = utils.format_cell(cell)
        }
        headers.push(hdr)
      }
      return headers
    }

    function generateReaderData() {
      const { blobFile, dataValues } = buildBlobAndValues({
        mimeType: props.mimeType,
        outputStream: props.stream
      })

      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const workbook = read(dataValues, {
            type: 'array'
          })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const header = getHeaderRow(worksheet)
          const results = utils.sheet_to_json(worksheet)

          // value to render
          excelData.value = {
            header,
            results
          }

          resolve()
        }
        reader.readAsArrayBuffer(blobFile)
      })
    }

    generateReaderData()

    return {
      excelData
    }
  }

})
</script>
