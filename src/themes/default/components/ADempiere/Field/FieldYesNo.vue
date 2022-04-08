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
  <el-switch
    :ref="metadata.columnName"
    v-model="value"
    :active-text="$t('components.switchActiveText')"
    :inactive-text="$t('components.switchInactiveText')"
    :class="cssClassStyle"
    :disabled="isDisabled"
    @change="preHandleChange"
    @blur="focusLost"
    @focus="focusGained"
  />
</template>

<script>
import fieldMixin from '@theme/components/ADempiere/Field/mixin/mixinField.js'

import { convertStringToBoolean } from '@/utils/ADempiere/formatValue/booleanFormat.js'

export default {
  name: 'FieldYesNo',

  mixins: [
    fieldMixin
  ],

  computed: {
    cssClassStyle() {
      let styleClass = ' custom-field-yes-no '
      if (!this.isEmptyValue(this.metadata.cssClassName)) {
        styleClass += this.metadata.cssClassName
      }
      return styleClass
    }
  },

  mounted() {
    this.isReadOnlyForm(this.value)
  },

  methods: {
    parseValue(value) {
      return convertStringToBoolean(value)
    },
    preHandleChange(value) {
      this.metadata.value = value
      this.handleFieldChange({ value })

      this.isReadOnlyForm(this.value)
    },

    /**
     * Set is read only form
     * IsActive, Processed, Processing
     * @param {boolean|string} value
     */
    isReadOnlyForm(value) {
      if (this.metadata.inTable ||
        !this.metadata.isColumnReadOnlyForm ||
        !this.metadata.displayed) {
        return
      }

      const fieldsExcludes = []
      // if isChangedAllForm it does not exclude anything, otherwise it excludes this columnName
      if (!this.metadata.isChangedAllForm) {
        fieldsExcludes.push(this.metadata.columnName)
      }

      this.$store.dispatch('changeFieldAttributesBoolean', {
        containerUuid: this.metadata.containerUuid,
        fieldsIncludes: [],
        attribute: 'isReadOnlyFromForm',
        valueAttribute: Boolean(this.metadata.valueIsReadOnlyForm !== value),
        fieldsExcludes,
        currenValue: value
      })
    }
  }

}
</script>

<style scoped>
  .custom-field-yes-no {
    max-height: 34px;
  }
</style>
