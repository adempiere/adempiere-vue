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
  <el-input
    v-model="value"
    v-bind="commonsProperties"
    :pattern="pattern"
    :maxlength="maxLength"
    :autofocus="metadata.inTable"
    :size="inputSize"
    show-word-limit
    @change="preHandleChange"
    @blur="focusLost"
    @focus="focusGained"
    @keydown.native="keyPressed"
    @keyup.native="keyReleased"
    @keyup.native.enter="actionKeyPerformed"
    @submit="false"
  >
    <i
      slot="prefix"
      class="el-icon-link el-input__icon"
    />
  </el-input>
</template>

<script>
// components and mixins
import fieldMixin from '@/components/ADempiere/Field/mixin/mixinField.js'
import fieldMixinText from '@/components/ADempiere/Field/mixin/mixinFieldText.js'

export default {
  name: 'FieldUrl',

  mixins: [
    fieldMixin,
    fieldMixinText
  ],

  props: {
    inTable: {
      type: Boolean,
      default: false
    },
    pattern: {
      type: String,
      default: undefined
    }
  },

  data() {
    return {
      // url pattern
      patternValidate: '((ht|f)tp(s?)\:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)'
    }
  },

  computed: {
    cssClassStyle() {
      const { cssClassName, inTable } = this.metadata
      let styleClass = ' custom-field-text '
      if (!this.isEmptyValue(cssClassName)) {
        styleClass += cssClassName
      }

      if (inTable) {
        styleClass += ' field-in-table '
      }

      if (this.isEmptyRequired) {
        styleClass += ' field-empty-required '
      }
      return styleClass
    },

    validText() {
      if (this.isEmptyValue(this.value)) {
        return true
      }
      if (this.isEmptyValue(this.patternValidate)) {
        return true
      }
      return (new RegExp(this.patternValidate)).test(this.value)
    },

    inputSize() {
      if (this.isEmptyValue(this.metadata.inputSize)) {
        return 'medium'
      }
      return this.metadata.inputSize
    },
    maxLength() {
      if (!this.isEmptyValue(this.metadata.fieldLength) && this.metadata.fieldLength > 0) {
        return Number(this.metadata.fieldLength)
      }
      return undefined
    }
  }
}
</script>

<style lang="scss">
  .custom-field-text {
    max-height: 36px;
  }
</style>
