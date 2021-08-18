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
