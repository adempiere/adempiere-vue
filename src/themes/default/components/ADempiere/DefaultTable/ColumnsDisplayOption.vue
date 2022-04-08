<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Elsio Sanchez elsiosanches@gmail.com www.erpya.com
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
  <el-dropdown trigger="click" class="column-option" @command="handleCommand">
    <span class="el-dropdown-link">
      <svg-icon icon-class="list" />
    </span>

    <el-dropdown-menu slot="dropdown" style="max-width: 300px;">
      <el-dropdown-item
        :command="$t('table.dataTable.showAllColumns')"
      >
        <svg-icon :icon-class="optionIcon($t('table.dataTable.showAllColumns'))" />
        {{ $t('table.dataTable.showAllColumns') }}
      </el-dropdown-item>
      <el-dropdown-item
        :command="$t('table.dataTable.showOnlyMandatoryColumns')"
      >
        <svg-icon :icon-class="optionIcon($t('table.dataTable.showOnlyMandatoryColumns'))" />
        {{ $t('table.dataTable.showOnlyMandatoryColumns') }}
      </el-dropdown-item>
      <el-dropdown-item
        :command="$t('table.dataTable.showTableColumnsOnly')"
      >
        <svg-icon :icon-class="optionIcon($t('table.dataTable.showTableColumnsOnly'))" />
        {{ $t('table.dataTable.showTableColumnsOnly') }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'ColumnsDisplayOption',

  props: {
    option: {
      type: String,
      required: true,
      default: () => ''
    }
  },

  setup(props, { root }) {
    const optionIcon = (icon) => {
      if (icon === props.option) {
        return 'eye-open'
      }
      return 'eye'
    }

    const handleCommand = (command) => {
      root.$store.dispatch('selectOption', command)
    }

    return {
      // methods
      handleCommand,
      optionIcon
    }
  }
})
</script>

<style scoped>
  .column-option {
    display: inline-block;
    position: relative;
    color: #606266;
    font-size: 16px;
    /* float: right; */
  }
</style>
