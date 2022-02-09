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
      :total="recordCount"
      :current-page="1"
      :selection="0"
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
    recordCount: {
      type: Number,
      default: 0
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

    /**
     * Selection columns to be taken into account during the search
     */
    const selectionColumns = computed(() => {
      const displayColumnsName = []
      const columnsName = props.header
        .filter(fieldItem => {
          return fieldItem.isSelectionColumn
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
        row,
        tableName: props.panelMetadata.tableName
      })

      if (!row.isEditRow) {
        row.isEditRow = true
      }
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

    // get table data
    const recordsWithFilter = computed(() => {
      if (!root.isEmptyValue(valueToSearch.value)) {
        return props.dataTable.filter(row => {
          return selectionColumns.value.some(columnName => {
            const value = !root.isEmptyValue(row[columnName]) ? row[columnName].toString() : ''
            const search = valueToSearch.value
            if (value) {
              return value
                .trim()
                .toLowerCase()
                .includes(
                  search
                    .trim()
                    .toLowerCase()
                )
            }
          })
        })
      }
      return props.dataTable
    })

    function handleSelection(selections, rowSelected) {
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
      // computeds
      headerList,
      sizeOption,
      styleOption,
      recordsWithFilter,
      currentOption,
      keyColumn,
      // methods
      headerLabel,
      handleChangePage,
      handleRowClick,
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
