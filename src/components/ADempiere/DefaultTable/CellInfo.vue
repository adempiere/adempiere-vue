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
  <el-tag
    v-if="isDocumentStatus"
    key="document-status"
    :type="documentStatus"
    disable-transitions
  >
    {{ displayedValue }}
  </el-tag>

  <span v-else key="info-value">
    <p v-if="!isEmptyValue(displayedValue) && displayedValue.length >= 23" style="max-height: 40px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
      <el-popover
        placement="top-start"
        width="300"
        trigger="hover"
        :open-delay="400"
      >
        <el-row>
          <el-col :span="24" style="word-break: normal;padding: 5%">
            {{ displayedValue }}
          </el-col>
        </el-row>
        <el-row slot="reference">
          <el-col :span="24" style="max-height: 40px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
            {{ displayedValue }}
          </el-col>
        </el-row>
      </el-popover>
    </p>

    <p v-else>
      {{ displayedValue }}
    </p>
  </span>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

// utils and helpers methods
import { FIELDS_CURRENCY } from '@/utils/ADempiere/references.js'
import { typeValue } from '@/utils/ADempiere/valueUtils.js'
import {
  formatField, formatPrice, formatQuantity
} from '@/utils/ADempiere/valueFormat.js'
import { convertBooleanToTranslationLang } from '@/utils/ADempiere/formatValue/booleanFormat.js'

// constants
import { DOCUMENT_STATUS_COLUMNS_LIST } from '@/utils/ADempiere/constants/systemColumns.js'

export default defineComponent({
  name: 'CellInfo',

  props: {
    fieldAttributes: {
      type: Object,
      required: true
    },
    dataRow: {
      type: Object,
      default: () => {}
    }
  },

  setup(props, { root }) {
    const { columnName, elementColumnName } = props.fieldAttributes
    const fieldValue = props.dataRow[columnName]

    const isDocumentStatus = computed(() => {
      return DOCUMENT_STATUS_COLUMNS_LIST.includes(columnName) ||
        DOCUMENT_STATUS_COLUMNS_LIST.includes(elementColumnName)
    })

    const displayedValue = computed(() => {
      return formatValue(props.dataRow, props.fieldAttributes)
    })

    const documentStatus = computed(() => {
      return root.tagStatus(fieldValue)
    })

    const formatNumber = ({ displayType, value }) => {
      if (root.isEmptyValue(value)) {
        value = 0
      }
      // Amount, Costs+Prices
      if (FIELDS_CURRENCY.includes(displayType)) {
        return formatPrice(value)
      }
      return formatQuantity(value)
    }

    /**
     * @param {object} row, row data
     * @param {object} field, field with attributes
     */
    const formatValue = (row, field) => {
      const { componentPath, displayColumnName, displayType } = field

      let valueToShow
      switch (componentPath) {
        case 'FieldDate':
        case 'FieldTime': {
          let cell = fieldValue
          if (typeValue(cell) === 'DATE') {
            cell = cell.getTime()
          }
          // replace number timestamp value for date
          valueToShow = formatField(cell, displayType)
          break
        }

        case 'FieldNumber':
          if (root.isEmptyValue(fieldValue)) {
            valueToShow = undefined
            break
          }
          valueToShow = formatNumber({
            displayType,
            value: fieldValue
          })
          break

        case 'FieldSelect':
          valueToShow = row[displayColumnName]
          if (root.isEmptyValue(valueToShow) && fieldValue === 0) {
            valueToShow = field.defaultValue
            break
          }
          break

        case 'FieldYesNo':
          // replace boolean true-false value for 'Yes' or 'Not' ('Si' or 'No' for spanish)
          valueToShow = convertBooleanToTranslationLang(fieldValue)
          break

        default:
          valueToShow = fieldValue
          break
      }

      return valueToShow
    }

    return {
      // computeds
      isDocumentStatus,
      documentStatus,
      displayedValue
    }
  }
})
</script>
