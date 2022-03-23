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
  <el-card class="field-option-card calculator-option">
    <div slot="header">
      <span>
        {{ $t('fieldOptions.field') }}:
        <b> {{ fieldAttributes.name }} </b>
      </span>
    </div>

    <el-form
      ref="formCalculator"
      class="calculator-form"
      label-position="top"
      label-width="120px"
      @submit.native.prevent="notSubmitForm"
    >
      <el-form-item>
        <template slot="label">
          {{ $t('fieldOptions.value') }}: {{ valueToDisplay }}
        </template>

        <el-input
          ref="calculatorInput"
          v-model="calcValue"
          class="calculator-input"
          size="mini"
          readonly
          clearable
          @input="validateInput"
          @keydown.native="calculateDisplayedValue"
          @keyup.enter.native="changeValue"
        />
      </el-form-item>
    </el-form>

    <el-table
      ref="calculator"
      :data="tableButtons"
      style="width: 100%"
      border
      size="mini"
      :show-header="false"
      :span-method="spanMethod"
      class="calculator-table"
      @cell-click="clickValue"
    >
      <el-table-column
        align="center"
        prop="row1"
        :height="columnHeight"
        :width="columnWidth"
      >
        <template slot-scope="{ row, column }">
          <el-button type="text" :disabled="isDisabled(row, column)">
            {{ row.row1.dispayed || row.row1.value }}
          </el-button>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="row2"
        :height="columnHeight"
        :width="columnWidth"
      >
        <template slot-scope="{ row, column }">
          <el-button type="text" :disabled="isDisabled(row, column)">
            {{ row.row2.dispayed || row.row2.value }}
          </el-button>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="row3"
        :height="columnHeight"
        :width="columnWidth"
      >
        <template slot-scope="{ row, column }">
          <el-button type="text" :disabled="isDisabled(row, column)">
            {{ row.row3.dispayed || row.row3.value }}
          </el-button>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="row4"
        :height="columnHeight"
        :width="columnWidth"
      >
        <template slot-scope="{ row, column }">
          <el-button type="text" :disabled="isDisabled(row, column)">
            {{ row.row4.dispayed || row.row4.value }}
          </el-button>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="row5"
        :height="columnHeight"
        :width="columnWidth"
      >
        <template slot-scope="{ row, column }">
          <el-button type="text" :disabled="isDisabled(row, column)">
            {{ row.row5.dispayed || row.row5.value }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
// utils and helper methods
import { calculationValue, INPUT_NUMBER_PATTERN } from '@/utils/ADempiere/formatValue/numberFormat.js'
import { isIntegerField } from '@/utils/ADempiere/references'

// constants
import buttons from './buttons.js'

export default {
  name: 'CalculatorField',

  props: {
    fieldAttributes: {
      type: Object,
      required: true
    },
    containerManager: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      columnHeight: 15,
      columnWidth: 35,
      calcValue: this.value,
      valueToDisplay: this.value
    }
  },

  computed: {
    value() {
      const { columnName, containerUuid, inTable } = this.fieldAttributes

      // table records values
      if (inTable) {
        return this.containerManager.getCell({
          containerUuid: this.metadata.containerUuid,
          rowIndex: this.metadata.rowIndex,
          columnName
        })
      }

      // main panel values
      return this.$store.getters.getValueOfFieldOnContainer({
        parentUuid: this.fieldAttributes.parentUuid,
        containerUuid,
        columnName
      })
    },
    tableButtons() {
      return buttons
    },
    // Integer or ID
    isInteger() {
      return isIntegerField(this.fieldAttributes.displayType)
    }
  },

  watch: {
    value(newValue) {
      this.calcValue = newValue
    }
  },

  created() {
    // focus calculator
    this.$nextTick(() => {
      this.focusCalc(true)
    })
  },

  methods: {
    clickValue(row, column) {
      const isAcceptedType = ['result', 'clear'].includes(row[column.property].type)
      if (!isAcceptedType && !this.isDisabled(row, column)) {
        if (this.isEmptyValue(this.calcValue)) {
          this.calcValue = row[column.property].value
        } else {
          const { selectionStart, selectionEnd } = this.$refs.calculatorInput.$refs.input
          let text = row[column.property].value // char clicked
          // separate positions
          const firstText = String(this.calcValue).slice(0, selectionStart)
          const secondText = String(this.calcValue).slice(selectionEnd)
          text = firstText.concat(text).concat(secondText) // insert char clicked
          this.calcValue = text
        }
        const result = calculationValue(this.calcValue, event)
        if (!this.isEmptyValue(result)) {
          this.valueToDisplay = result
        } else {
          this.valueToDisplay = '...'
        }
      }
      if (row[column.property].type === 'clear') {
        if (row[column.property].value === 'C') {
          let { selectionStart, selectionEnd } = this.$refs.calculatorInput.$refs.input
          if (selectionStart === String(this.calcValue).length) {
            // cursor in end line, without selection
            selectionStart = 0
            selectionEnd = -1
            this.calcValue = String(this.calcValue).slice(selectionStart, selectionEnd)
          } else if (selectionStart === selectionEnd) {
            // cursor into line without selection
            selectionStart--
            const firstText = String(this.calcValue).slice(0, selectionStart)
            const secondText = String(this.calcValue).slice(selectionEnd)
            this.calcValue = firstText.concat(secondText)
          } else {
            // cursor with selection
            const firstText = String(this.calcValue).slice(0, selectionStart)
            const secondText = String(this.calcValue).slice(selectionEnd)
            this.calcValue = firstText.concat(secondText)
          }
          this.valueToDisplay = this.calcValue
        } else if (row[column.property].value === 'AC') {
          this.calcValue = ''
          this.valueToDisplay = ''
        }
      }
      if (row[column.property].value === '=') {
        this.changeValue()
      }
    },
    sendValue2(row, column) {
      const button = row[column.property]
      const { value, type } = button
      const isAcceptedType = ['result', 'clear'].includes(type)
      if (!isAcceptedType && !this.isDisabled(row, column)) {
        this.isEmptyValue(this.calcValue)
          ? this.calcValue = value
          : this.calcValue += value
        const result = calculationValue(this.calcValue, event)
        if (!this.isEmptyValue(result)) {
          this.valueToDisplay = result
        } else {
          this.valueToDisplay = '...'
        }
      }
      if (type === 'clear') {
        if (value === 'C') {
          this.calcValue = this.calcValue.slice(0, -1)
        } else if (value === 'AC') {
          this.calcValue = ''
          this.valueToDisplay = ''
        }
      }
      if (value === '=') {
        this.changeValue()
      }

      this.focusInputCalculator()
    },
    validateInput(value) {
      this.calcValue = String(value)
        .replace(INPUT_NUMBER_PATTERN, '')
    },
    changeValue() {
      if (this.fieldAttributes.readonly) {
        return
      }

      let newValue
      if (!this.isEmptyValue(this.valueToDisplay)) {
        newValue = Number(this.valueToDisplay)
      }

      this.$store.commit('updateValueOfField', {
        parentUuid: this.fieldAttributes.parentUuid,
        containerUuid: this.fieldAttributes.containerUuid,
        columnName: this.fieldAttributes.columnName,
        value: newValue
      })
      this.$store.dispatch('notifyFieldChange', {
        parentUuid: this.fieldAttributes.parentUuid,
        containerUuid: this.fieldAttributes.containerUuid,
        containerManager: this.containerManager,
        field: this.fieldAttributes,
        columnName: this.fieldAttributes.columnName,
        value: newValue
      })
        .finally(() => {
          // hidden calc dropdown
          // this.$children[0].visible = false

          // this.$store.commit('changeShowRigthPanel', false)
          // this.$store.commit('changeShowOptionField', false)
        })
    },
    spanMethod({ row, column }) {
      const button = row[column.property]
      const { value } = button
      if (this.isEmptyValue(value)) {
        return {
          rowspan: 0,
          colspan: 0
        }
      }
      if (['+', '='].includes(value)) {
        return {
          rowspan: 2,
          colspan: 1
        }
      }
      if (value === '0') {
        return {
          rowspan: 1,
          colspan: 2
        }
      }

      return {
        rowspan: 1,
        colspan: 1
      }
    },
    isDisabled(row, column) {
      const { value } = row[column.property]
      // dont set value or change value
      if (this.fieldAttributes.readonly && value === '=') {
        return true
      }
      if (this.isInteger && value === ',') {
        return true
      }
      return false
    },
    calculateDisplayedValue(event) {
      let result = calculationValue(this.value, event)
      if (this.isEmptyValue(result)) {
        result = '...'
      }

      this.valueToDisplay = result
    },
    focusCalc(isShowed) {
      if (isShowed) {
        this.calcValue = this.value
        this.valueToDisplay = this.calcValue
        this.focusInputCalculator()
      }
    },
    focusInputCalculator() {
      this.$refs.calculatorInput.focus()
    }
  }

}
</script>

<style lang="scss" src="../common-style.scss">
</style>
<style lang="scss">
.calculator-option {
  .el-card__header {
    padding: 10px;
  }

  .calculator-form {
    .el-form-item {
      margin-bottom: 5px;
    }
    .el-form-item__label {
      padding: 0px;
    }
  }

  .el-card__body {
    padding: 12px;
    padding-top: 0px;
  }

  .calculator-input > .el-input__inner,
  .calculator-input .el-input__inner {
    border-radius: 0px !important;
  }

  .calculator-input {
    width: 202px;
    font-size: 16px;
    padding-left: 4px;
  }

  /* row color with hover */
	.el-table--enable-row-hover .el-table__body tr:hover > td {
		background-color: #ffffff !important;
	}

  .calculator-table .el-table__body-wrapper > table {
    border-spacing: 5px;
  }

  /* Button shadow and border */
  .calculator-table .el-table__body tr > td {
    box-shadow: 0px 0px 2px 0px rgba(0,0,0,0.5);
    border-radius: 5px;
    cursor: pointer;
  }

  .calculator-table th, .calculator-table td,
  .calculator-table > th, .calculator-table > td {
    padding: 0px !important;
    height: 0px !important;
    padding-left: 0px !important;
  }

  .calculator-table .el-table .cell {
    padding-right: 5px !important;
    padding-left: 5px !important;
  }
  .calculator-table .el-table > .cell, .calculator-table .el-table .cell {
    padding-left: 0px !important;
  }
  .calculator-table .el-table th.is-leaf, .el-table td {
    border-bottom: 0px solid #dfe6ec !important;
  }
}
</style>
