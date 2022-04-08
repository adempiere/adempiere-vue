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
  <el-input
    :ref="metadata.columnName"
    v-model="value"
    :pattern="pattern"
    :rows="rows"
    :class="cssClassStyle"
    :type="typeTextBox"
    :placeholder="metadata.placeholder"
    :readonly="Boolean(metadata.readonly)"
    :disabled="isDisabled"
    :maxlength="maxLength"
    :show-password="Boolean(metadata.isEncrypted)"
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
  />
</template>

<script>
// components and mixins
import FieldMixin from '@theme/components/ADempiere/Field/mixin/mixinField.js'
import FieldMixinText from '@theme/components/ADempiere/Field/mixin/mixinFieldText.js'

// constants
import { TEXT } from '@/utils/ADempiere/references'

export default {
  name: 'FieldText',

  mixins: [
    FieldMixin,
    FieldMixinText
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
      patternFileName: '[A-Za-zñÑ0-9-_]{1,}',
      patternFilePath: '[A-Za-zñÑ0-9-_/.]{1,}'
    }
  },

  computed: {
    cssClassStyle() {
      const { cssClassName, displayType, inTable } = this.metadata
      let styleClass = ''
      if (!this.isEmptyValue(cssClassName)) {
        styleClass += cssClassName
      }

      if (displayType === TEXT.id) {
        styleClass += ' custom-field-textarea '
      } else {
        styleClass += ' custom-field-text '
      }

      if (inTable) {
        styleClass += ' field-in-table '
      }

      if (this.isEmptyRequired) {
        styleClass += ' field-empty-required '
      }
      return styleClass
    },
    // Only used when input type='TextArea'
    rows() {
      if (this.metadata.inTable) {
        return 1
      }
      return 4
    },
    typeTextBox() {
      // String, Url, FileName...
      let typeInput = 'text'
      // Display Type 'Text' (14)
      if (this.metadata.displayType === TEXT.id) {
        typeInput = 'textarea'
      }
      if (this.metadata.isEncrypted) {
        typeInput = 'password'
      }
      return typeInput
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

  // indicates if the textarea is adjustable
  .el-textarea__inner {
    &.field-in-table {
      resize: none !important;
    }
  }
</style>
