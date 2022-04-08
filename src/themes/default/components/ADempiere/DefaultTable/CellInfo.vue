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
  <span v-if="isRowCanBeEdited(dataRow)" key="field-component">
    <field-definition
      key="field-definition"
      :container-uuid="containerUuid"
      :container-manager="containerManager"
      :is-data-table="true"
      :is-show-label="false"
      :in-table="true"
      :metadata-field="{
        ...fieldAttributes,
        rowIndex: scope.$index,
        recordUuid: dataRow.UUID
      }"
      size="mini"
    />
  </span>

  <span v-else key="info-value">
    <document-status-tag
      v-if="fieldAttributes.isColumnDocumentStatus"
      key="document-status"
      size="small"
      :value="fieldValue"
      :displayed-value="displayedValue"
    />

    <p
      v-else-if="!isEmptyValue(displayedValue) && displayedValue.length >= 23"
      key="display-column"
      style="max-height: 40px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
    >
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

    <p v-else key="only-value" :class="cellCssClass">
      {{ displayedValue }}
    </p>
  </span>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

// components and mixins
import DocumentStatusTag from '@theme/components/ADempiere/ContainerOptions/DocumentStatusTag/index.vue'
import FieldDefinition from '@theme/components/ADempiere/Field/index.vue'

// utils and helpers methods
import { typeValue } from '@/utils/ADempiere/valueUtils.js'
import {
  formatField, formatPrice, formatQuantity
} from '@/utils/ADempiere/valueFormat.js'
import { convertBooleanToTranslationLang } from '@/utils/ADempiere/formatValue/booleanFormat.js'

// constants
import { FIELDS_CURRENCY } from '@/utils/ADempiere/references.js'

export default defineComponent({
  name: 'CellInfo',

  components: {
    DocumentStatusTag,
    FieldDefinition
  },

  props: {
    containerUuid: {
      type: String,
      required: true
    },
    fieldAttributes: {
      type: Object,
      required: true
    },
    containerManager: {
      type: Object,
      required: true
    },
    scope: {
      type: Object,
      default: () => {}
    },
    dataRow: {
      type: Object,
      default: () => {}
    }
  },

  setup(props, { root }) {
    const { columnName } = props.fieldAttributes

    const fieldValue = computed(() => {
      return props.dataRow[columnName]
    })

    const displayedValue = computed(() => {
      return formatValue(props.dataRow, props.fieldAttributes)
    })

    const isReadOnly = computed(() => {
      return props.containerManager.isReadOnlyColumn({
        field: props.fieldAttributes,
        row: props.dataRow
      })
    })

    /**
     * Css class style
     */
    const cellCssClass = computed(() => {
      let classCss = ''
      if (isReadOnly.value) {
        classCss += ' cell-no-edit '
      }
      if (props.fieldAttributes.componentPath === 'FieldNumber') {
        classCss += ' cell-align-right '
      }
      // return 'cell-edit'
      return classCss
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
          let cell = fieldValue.value
          if (typeValue(cell) === 'DATE') {
            cell = cell.getTime()
          }
          // replace number timestamp value for date
          valueToShow = formatField(cell, displayType)
          break
        }

        case 'FieldNumber':
          if (root.isEmptyValue(fieldValue.value)) {
            valueToShow = undefined
            break
          }
          valueToShow = formatNumber({
            displayType,
            value: fieldValue.value
          })
          break

        case 'FieldSelect':
          valueToShow = row[displayColumnName]
          if (root.isEmptyValue(valueToShow) && fieldValue.value === 0) {
            valueToShow = field.defaultValue
            break
          }
          break

        case 'FieldYesNo':
          // replace boolean true-false value for 'Yes' or 'Not' ('Si' or 'No' for spanish)
          valueToShow = convertBooleanToTranslationLang(fieldValue.value)
          break

        default:
          valueToShow = fieldValue.value
          break
      }

      return valueToShow
    }

    function isRowCanBeEdited(record) {
      if (!record.isSelectedRow) {
        return false
      }
      if (!isReadOnly.value && record.isEditRow) {
        return true
      }
      return false
    }

    return {
      // computeds
      cellCssClass,
      fieldValue,
      displayedValue,
      // methods
      isRowCanBeEdited
    }
  }
})
</script>

<style lang="scss">
// used in cell type number
.cell-align-right {
  text-align: right !important;
}

// style in cursor if cell is no edit
.cell-no-edit {
  cursor: not-allowed !important;
}
</style>
