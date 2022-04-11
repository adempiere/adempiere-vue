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
  <el-select
    v-model="value"
    v-bind="commonsProperties"
    multiple
    filterable
    allow-create
    @change="preHandleChange"
  >
    <el-option
      v-for="(option, key) in value"
      :key="key"
      :value="option"
    />
  </el-select>
</template>

<script>
// components and mixins
import fieldMixin from '@/components/ADempiere/Field/mixin/mixinField.js'

/**
 * This component is a list type field, for IN and NOT IN search with advanced query
 */
export default {
  name: 'FieldSelectMultiple',

  mixins: [
    fieldMixin
  ],

  computed: {
    cssClassStyle() {
      let styleClass = ' custom-field-select custom-field-select-multiple '

      if (!this.isEmptyValue(this.metadata.cssClassName)) {
        styleClass += this.metadata.cssClassName
      }

      return styleClass
    }
  }
}
</script>
