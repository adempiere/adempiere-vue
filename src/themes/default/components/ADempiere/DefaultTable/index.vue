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
  <el-main class="default-table">
    <el-row>
      <el-col v-if="isShowSearch" :span="24">
        <el-input
          v-model="valueToSearch"
          clearable
          size="mini"
          class="input-search"
          @change="filterRecord"
          @input="handleChangeSearch"
        >
          <i
            slot="prefix"
            class="el-icon-search el-input__icon"
          />
        </el-input>
      </el-col>
    </el-row>

    <el-table
      ref="multipleTable"
      v-loading="isLoadingDataTale"
      style="width: 100%; height: 88% !important;"
      border
      height="90% !important"
      :row-key="keyColumn"
      reserve-selection
      highlight-current-row
      :data="recordsWithFilter"
      :element-loading-text="$t('notifications.loading')"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDblClick"
      @select="handleSelection"
      @select-all="handleSelectionAll"
    >
      <!-- column with the checkbox -->
      <el-table-column
        v-if="isTableSelection"
        type="selection"
        :prop="keyColumn"
        fixed
        min-width="50"
      />

      <template v-for="(fieldAttributes, key) in headerList">
        <el-table-column
          :key="key"
          :label="headerLabel(fieldAttributes)"
          :column-key="fieldAttributes.columnName"
          :prop="fieldAttributes.columnName"
          sortable
          min-width="210"
          :fixed="fieldAttributes.isFixedTableColumn"
        >
          <template slot-scope="scope">
            <!-- formatted displayed value -->
            <cell-info
              :container-uuid="containerUuid"
              :field-attributes="fieldAttributes"
              :container-manager="containerManager"
              :scope="scope"
              :data-row="scope.row"
            />
          </template>
        </el-table-column>
      </template>
      <el-table-column
        fixed="right"
        width="50"
      >
        <template slot="header">
          <columns-display-option
            :option="currentOption"
          />
        </template>
      </el-table-column>
    </el-table>

    <!-- pagination table, set custom or use default change page method -->
    <custom-pagination
      :total="recordsLength"
      :current-page="1"
      :selection="selectionsLength"
      :handle-change-page="handleChangePage"
    />
  </el-main>
</template>

<script>
import { defineComponent, computed, onMounted, ref } from '@vue/composition-api'

// components and mixins
import CellInfo from './CellInfo.vue'
import ColumnsDisplayOption from './ColumnsDisplayOption'
import CustomPagination from './CustomPagination.vue'

// utils and helper methods
import { isLookup } from '@/utils/ADempiere/references'
import { tableColumnDataType } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'DefaultTable',

  components: {
    CellInfo,
    ColumnsDisplayOption,
    CustomPagination
  },

  props: {
    parentUuid: {
      type: String,
      default: undefined
    },
    containerUuid: {
      type: String,
      required: true
    },
    containerManager: {
      type: Object,
      required: true
    },
    panelMetadata: {
      type: Object,
      required: true
    },
    // get the table header
    header: {
      type: Array,
      required: true,
      default: () => []
    },
    dataTable: {
      type: Array,
      required: true,
      default: () => []
    },
    // Show check column from selection row
    isTableSelection: {
      type: Boolean,
      default: true
    },
    isShowSearch: {
      type: Boolean,
      default: true
    }
  },

  setup(props, { root, refs }) {
    const valueToSearch = ref('')

    const isLoadingDataTale = computed(() => {
      return root.isEmptyValue(props.dataTable)
    })

    const currentOption = computed(() => {
      return root.$store.getters.getTableOption
    })

    const keyColumn = computed(() => {
      if (props.panelMetadata) {
        return props.panelMetadata.keyColumn
      }
      return undefined
    })

    const headerList = computed(() => {
      return props.header.filter(fieldItem => {
        return isDisplayed(fieldItem) &&
          // fieldItem.isShowedTableFromUser &&
          tableColumnDataType(fieldItem, currentOption.value)
      })
    })

    const sizeOption = computed(() => {
      if (props.isShowSearch) {
        return 1
      }
      return 24
    })

    const styleOption = computed(() => {
      if (props.isShowSearch) {
        return ''
      }
      return 'text-align: end; padding-right: 5px;'
    })

    const selectionsLength = computed(() => {
      return props.containerManager.getSelection({
        containerUuid: props.containerUuid
      }).length
    })
    const recordsLength = computed(() => {
      return props.dataTable.length
    })

    /**
     * Selection columns to be taken into account during the search
     */
    const selectionColumns = computed(() => {
      const displayColumnsName = []
      const columnsName = props.header
        .filter(fieldItem => {
          return fieldItem.isSelectionColumn && fieldItem.valueType === 'STRING'
        }).map(fieldItem => {
          if (isLookup(fieldItem.diplayType)) {
            displayColumnsName.push(fieldItem.displayColumnName)
          }
          return fieldItem.columnName
        })
      return columnsName.concat(displayColumnsName)
    })

    function handleRowClick(row, column, event) {
      props.containerManager.seekRecord({
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid,
        row
      })

      /*
      if (!row.isEditRow) {
        row.isEditRow = true
      }
      if (!row.isSelectedRow) {
        row.isEditRow = false
      }
      */
    }

    /**
     * To confirm edit record row
     */
    function handleRowDblClick(row, column, event) {
      row.isEditRow = false
    }

    function headerLabel(field) {
      if (field.isMandatory || field.isMandatoryFromLogic) {
        return '* ' + field.name
      }

      return field.name
    }

    /**
     * Verify is displayed column/field in table
     */
    function isDisplayed(field) {
      // validate with container manager
      return props.containerManager.isDisplayedColumn(field)
    }

    /**
     * custom method to handle change page
     */
    function handleChangePage(pageNumber) {
      props.containerManager.setPage({
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid,
        pageNumber
      })
    }
    const timeOut = ref(() => {})
    function handleChangeSearch(value) {
      clearTimeout(timeOut.value)
      timeOut.value = setTimeout(() => {
        // get records
        this.filterRecord(value)
      }, 1000)
    }

    // get table data
    const recordsWithFilter = computed(() => {
      return props.dataTable
    })

    let isLoadFilter = ref(false)
    function filterRecord(selections) {
      isLoadFilter = true
      const params = []
      selectionColumns.value.forEach(filter => {
        params.push({
          column_name: filter,
          operator: 'LIKE',
          value: '%' + selections + '%'
        })
      })
      root.$store.dispatch('getEntities', {
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid,
        filters: params
      })
        .then(() => {
          isLoadFilter = false
          clearTimeout(timeOut.value)
          return
        })
    }

    function handleSelection(selections, rowSelected) {
      rowSelected.isSelectedRow = !rowSelected.isSelectedRow
      rowSelected.isEditRow = rowSelected.isSelectedRow // edit record if is selected

      props.containerManager.setSelection({
        containerUuid: props.containerUuid,
        recordsSelected: selections
      })
    }

    function handleSelectionAll(selections) {
      props.containerManager.setSelection({
        containerUuid: props.containerUuid,
        recordsSelected: selections
      })
    }

    /**
     * Select or unselect rows
     * USE ONLY MOUNTED
     */
    function toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        refs.multipleTable.clearSelection()
      }
    }

    onMounted(() => {
      if (props.isTableSelection) {
        const selectionsList = props.containerManager.getSelection({
          containerUuid: props.containerUuid
        })

        toggleSelection(selectionsList)
      }
    })

    return {
      // data
      valueToSearch,
      isLoadFilter,
      // computeds
      headerList,
      isLoadingDataTale,
      sizeOption,
      styleOption,
      recordsWithFilter,
      currentOption,
      keyColumn,
      recordsLength,
      selectionsLength,
      // methods
      filterRecord,
      handleChangeSearch,
      headerLabel,
      handleChangePage,
      handleRowClick,
      handleRowDblClick,
      handleSelection,
      handleSelectionAll,
      isDisplayed
    }
  }
})
</script>

<style lang="scss">
.default-table {
  padding: 0px !important;
  display: contents;
  height: 50% !important;
  overflow: hidden;

  .input-search {
    width: 100%;
    padding-right: 20px;
    margin-right: 20px;
    margin-left: 10px;
    margin-bottom: 10px;
  }

  .el-table__cell {
    // height table row
    padding: 0px !important;
  }

  .el-table--scrollable-y .el-table__body-wrapper {
    overflow-y: auto;
    height: 90% !important;
  }
}
</style>
