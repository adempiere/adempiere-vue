<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
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
  <el-tooltip
    v-model="isShowed"
    manual
    :content="valueToDisplay"
    placement="top"
    effect="light"
  >
    <el-input-number
      v-if="isFocus"
      key="number-input-focus"
      :ref="metadata.columnName"
      v-model="value"
      type="number"
      :min="minValue"
      :max="maxValue"
      :placeholder="metadata.placeholder"
      :disabled="isDisabled"
      :precision="precision"
      :controls="isShowControls"
      :controls-position="controlsPosition"
      :class="cssClassStyle"
      style="text-align-last: end !important"
      autofocus
      @change="preHandleChange"
      @focus="focusGained"
      @blur="customFocusLost"
      @keydown.native="keyPressed"
      @keyup.native="keyReleased"
      @keyup.native.enter="select"
    />

    <el-input
      v-else
      key="number-displayed-blur"
      :ref="metadata.columnName"
      v-model="displayedValue"
      :placeholder="metadata.placeholder"
      :disabled="isDisabled"
      :class="cssClassStyle"
      readonly
      autofocus
      style="text-align-last: end !important"
      @focus="customFocusGained"
    />
  </el-tooltip>
</template>

<script>
// components and mixins
import FieldMixin from '@theme/components/ADempiere/Field/mixin/mixinField.js'

// utils and helper methods
import { isDecimalField } from '@/utils/ADempiere/references.js'
import { calculationValue, formatNumber, INPUT_NUMBER_PATTERN } from '@/utils/ADempiere/formatValue/numberFormat.js'

export default {
  name: 'FieldNumber',

  mixins: [
    FieldMixin
  ],

  data() {
    return {
      showControls: true,
      isFocus: false,
      operation: '',
      valueToDisplay: '',
      isShowed: false
    }
  },

  computed: {
    cssClassStyle() {
      let styleClass = ' custom-field-number '
      if (!this.isEmptyValue(this.metadata.cssClassName)) {
        styleClass += this.metadata.cssClassName
      }

      if (this.isEmptyRequired) {
        styleClass += ' field-empty-required '
      }

      return styleClass
    },
    maxValue() {
      if (this.isEmptyValue(this.metadata.valueMax)) {
        return Infinity
      }
      return Number(this.metadata.valueMax)
    },
    minValue() {
      if (this.isEmptyValue(this.metadata.valueMin)) {
        return -Infinity
      }
      return Number(this.metadata.valueMin)
    },
    precision() {
      // Amount, Costs+Prices, Number, Quantity
      if (isDecimalField(this.metadata.displayType)) {
        return this.$store.getters.getStandardPrecision
      }
      return undefined
    },
    isShowControls() {
      if (!this.isEmptyValue(this.metadata.showControl)) {
        if (this.metadata.showControl === 0) {
          return false
        }
      }
      return true
    },
    controlsPosition() {
      if (!this.isEmptyValue(this.metadata.showControl)) {
        // show side controls
        if (this.metadata.showControl === 1) {
          return undefined
        }
      }
      // show right controls
      return 'right'
    },
    displayedValue() {
      return formatNumber({
        value: this.value,
        displayType: this.metadata.displayType,
        currency: this.currencyCode
      })
    },
    currencyCode() {
      const currencyIsoCode = this.$store.getters.getCurrencyCode
      if (!this.isEmptyValue(this.metadata.labelCurrency)) {
        if (this.metadata.labelCurrency !== currencyIsoCode) {
          return this.metadata.labelCurrency
        }
      }
      return currencyIsoCode
    }
  },

  methods: {
    parseValue(value) {
      if (this.isEmptyValue(value)) {
        return undefined
      }
      return Number(value)
    },
    customFocusGained(event) {
      if (this.metadata.readonly) {
        this.isFocus = false
        return
      }
      this.isFocus = true
      // this.focusGained(event)
      this.$nextTick(() => {
        // this.$refs[this.metadata.columnName].focus()
        this.$refs[this.metadata.columnName].select()
      })
    },
    select() {
      this.$nextTick(() => {
        this.$refs[this.metadata.columnName].select()
      })
    },
    customFocusLost(event) {
      this.isFocus = false
      // this.focusLost(event)
    },
    calculateDisplayedValue(event) {
      const isAllowed = event.key.match(INPUT_NUMBER_PATTERN)
      if (isAllowed) {
        const result = calculationValue(this.value, event)
        if (!this.isEmptyValue(result)) {
          this.valueToDisplay = result
          this.isShowed = true
        } else {
          this.valueToDisplay = '...'
          this.isShowed = true
        }
      } else if (!isAllowed && event.key === 'Backspace') {
        if (String(this.value).slice(0, -1) > 0) {
          event.preventDefault()
          const newValue = String(this.value).slice(0, -1)
          const result = calculationValue(newValue, event)
          if (!this.isEmptyValue(result)) {
            this.value = this.parseValue(result)
            this.valueToDisplay = result
            this.isShowed = true
          } else {
            this.valueToDisplay = '...'
            this.isShowed = true
          }
        }
      } else if (!isAllowed && event.key === 'Delete') {
        if (String(this.value).slice(-1) > 0) {
          event.preventDefault()
          const newValue = String(this.value).slice(-1)
          const result = calculationValue(newValue, event)
          if (!this.isEmptyValue(result)) {
            this.value = this.parseValue(result)
            this.valueToDisplay = result
            this.isShowed = true
          } else {
            this.valueToDisplay = '...'
            this.isShowed = true
          }
        }
      } else {
        event.preventDefault()
      }
    },
    calculateValue(event) {
      const result = calculationValue(this.value, event)
      if (!this.isEmptyValue(result)) {
        this.valueToDisplay = result
      } else {
        this.valueToDisplay = '...'
      }
      this.isShowed = true

      /**
      const isAllowed = event.key.match(oeprationPattern)
      if (isAllowed) {
        const result = this.calculationValue(this.value, event)
        if (!this.isEmptyValue(result)) {
          this.valueToDisplay = result
        } else {
          this.valueToDisplay = '...'
        }
        this.isShowed = true
      } else {
        const { selectionStart, selectionEnd } = event.target
        if (event.key === 'Backspace') {
          const newValue = this.deleteChar({ value: this.value, selectionStart, selectionEnd })
          if (newValue > 0) {
            event.preventDefault()
            const result = this.calculationValue(newValue, event)
            if (!this.isEmptyValue(result)) {
              this.value = this.validateValue(result)
              this.valueToDisplay = result
            } else {
              this.valueToDisplay = '...'
            }
            this.isShowed = true
          }
        } else if (event.key === 'Delete') {
          const newValue = this.deleteChar({ value: this.value, selectionStart, selectionEnd, isReverse: false })
          if (String(this.value).slice(-1) > 0) {
            event.preventDefault()
            const newValue = String(this.value).slice(-1)
            const result = this.calculationValue(newValue, event)
            if (!this.isEmptyValue(result)) {
              this.value = this.validateValue(result)
              this.valueToDisplay = result
            } else {
              this.valueToDisplay = '...'
            }
            this.isShowed = true
          }
        } else {
          event.preventDefault()
        }
      }
      */
    },
    validateInput(event) {
      const value = String(event.target.value)
        .replace(INPUT_NUMBER_PATTERN, '')
      this.value = value
    },
    changeValue() {
      if (!this.isEmptyValue(this.valueToDisplay) && this.valueToDisplay !== '...') {
        const result = this.parseValue(this.valueToDisplay)
        this.preHandleChange(result)
      }

      this.isShowed = false
    }
  }
}
</script>
<style lang="scss" scoped>
  /* Show input width 100% in container */
  .el-input-number, .el-input {
    width: 100% !important; /* ADempiere Custom */
  }
</style>
