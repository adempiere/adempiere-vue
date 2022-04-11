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
    :filterable="!isMobile"
    :loading="isLoading"
    value-key="value"
    clearable
    :multiple="isSelectMultiple"
    :allow-create="metadata.isSelectCreated"
    :collapse-tags="!isSelectMultiple"
    @change="preHandleChange"
    @visible-change="getDataLookupList"
    @clear="clearLookup"
  >
    <el-option
      v-for="(option, key) in optionsList"
      :key="key"
      :value="option.value"
      :label="option.displayedValue"
    />
  </el-select>
</template>

<script>
// components and mixins
import fieldMixin from '@theme/components/ADempiere/Field/mixin/mixinField.js'
import selectMixin from '@theme/components/ADempiere/Field/mixin/mixinFieldSelect.js'

// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

/**
 * This component is a lookup type field, use as a replacement for fields:
 * - Reference List
 * - Table List
 * - Table Direct
 *
 * TODO: String values add single quotation marks 'value'
 * TODO: No blanck option enabled if is mandatory field
 * TODO: ALL: Although in the future these will have different components, and
 * are currently not supported is also displayed as a substitute for fields:
 * - Search Field
 */
export default {
  name: 'FieldSelect',

  mixins: [
    fieldMixin,
    selectMixin
  ],

  computed: {
    cssClassStyle() {
      let styleClass = ' custom-field-select '
      if (this.isSelectMultiple) {
        styleClass += ' custom-field-select-multiple '
      }

      if (this.isEmptyRequired) {
        styleClass += ' field-empty-required '
      }

      if (!this.isEmptyValue(this.metadata.cssClassName)) {
        styleClass += this.metadata.cssClassName
      }

      return styleClass
    },

    value: {
      get() {
        const { columnName, containerUuid, inTable } = this.metadata
        // table records values
        if (inTable) {
          // implement container manager row
          if (this.containerManager && this.containerManager.getCell) {
            return this.containerManager.getCell({
              containerUuid,
              rowIndex: this.metadata.rowIndex,
              columnName
            })
          }
        }

        return this.$store.getters.getValueOfFieldOnContainer({
          parentUuid: this.metadata.parentUuid,
          containerUuid,
          columnName
        })
      },
      set(value) {
        const { columnName, containerUuid, inTable } = this.metadata

        // table records values
        if (inTable) {
          // implement container manager row
          if (this.containerManager && this.containerManager.setCell) {
            return this.containerManager.setCell({
              containerUuid,
              rowIndex: this.metadata.rowIndex,
              columnName,
              value
            })
          }
        }

        const option = this.findOption(value)
        // always update uuid
        this.uuidValue = option.uuid

        this.$store.commit('updateValueOfField', {
          parentUuid: this.metadata.parentUuid,
          containerUuid,
          columnName,
          value
        })
      }
    },
    uuidValue: {
      get() {
        if (this.metadata.inTable) {
          return undefined
        }
        return this.$store.getters.getValueOfFieldOnContainer({
          parentUuid: this.metadata.parentUuid,
          containerUuid: this.metadata.containerUuid,
          // 'ColumnName'_UUID
          columnName: this.metadata.columnName + '_UUID'
        })
      },
      set(value) {
        if (this.metadata.inTable) {
          return undefined
        }
        this.$store.commit('updateValueOfField', {
          parentUuid: this.metadata.parentUuid,
          containerUuid: this.metadata.containerUuid,
          // 'ColumnName'_UUID
          columnName: this.metadata.columnName + '_UUID',
          value
        })
      }
    },
    displayedValue: {
      get() {
        // DisplayColumn_'ColumnName'
        const { displayColumnName: columnName, containerUuid, inTable } = this.metadata
        // table records values
        if (inTable) {
          // implement container manager row
          if (this.containerManager && this.containerManager.getCell) {
            return this.containerManager.getCell({
              containerUuid,
              rowIndex: this.metadata.rowIndex,
              columnName
            })
          }
        }

        return this.$store.getters.getValueOfFieldOnContainer({
          parentUuid: this.metadata.parentUuid,
          containerUuid,
          columnName
        })
      },
      set(value) {
        const { displayColumnName, containerUuid, inTable } = this.metadata

        // table records values
        if (inTable) {
          // implement container manager row
          if (this.containerManager && this.containerManager.setCell) {
            return this.containerManager.setCell({
              containerUuid,
              rowIndex: this.metadata.rowIndex,
              columnName: displayColumnName,
              value
            })
          }
        }

        this.$store.commit('updateValueOfField', {
          parentUuid: this.metadata.parentUuid,
          containerUuid,
          // DisplayColumn_'ColumnName'
          columnName: this.metadata.displayColumnName,
          value
        })
      }
    }
  },

  watch: {
    isSelectMultiple(isMultiple) {
      let value = this.value
      if (isMultiple) {
        const valueInArray = []
        if (!this.isEmptyValue(value)) {
          valueInArray.push(value)
        }
        value = valueInArray
      } else {
        if (Array.isArray(value)) {
          if (value.length) {
            // set first value
            value = value[0]
          } else {
            value = this.blankOption.value
          }
        }
      }
      this.value = value
    },
    'metadata.displayed'(value) {
      if (value) {
        // if is field showed, search into store all options to list
        this.optionsList = this.getLookupAll
      }
    },
    value(newValue) {
      if (isEmptyValue(newValue)) {
        this.displayedValue = undefined
        this.uuidValue = undefined
        return
      }

      const option = this.findOption(newValue)
      if (!option.displayedValue) {
        const displayedValue = this.displayedValue
        if (!isEmptyValue(displayedValue)) {
          this.optionsList.push({
            value: newValue,
            uuid: option.uuid,
            displayedValue
          })
        } else {
          // request lookup
          this.getValueOfLookup()
        }
      }
    }
  },

  beforeMount() {
    if (this.metadata.displayed) {
      this.optionsList = this.getLookupAll
      const value = this.value
      if (!this.isEmptyValue(value) && !this.metadata.isAdvancedQuery) {
        const option = this.findOption(value)
        if (option.displayedValue) {
          this.displayedValue = option.displayedValue
          this.uuidValue = option.uuid
        } else {
          if (!this.isEmptyValue(this.displayedValue)) {
            // verify if exists to add (in table)
            this.optionsList.push({
              value,
              uuid: option.uuid,
              displayedValue: this.displayedValue
            })
          } else {
            // request lookup
            this.getValueOfLookup()
          }
        }
      }
    }
  },

  methods: {
    preHandleChange(value) {
      const { displayedValue } = this.findOption(value)
      this.displayedValue = displayedValue
      this.handleFieldChange({
        value,
        displayedValue
      })
    },
    findOption(value) {
      const option = this.optionsList.find(item => item.value === value)
      if (option && option.displayedValue) {
        return option
      }
      return {
        displayedValue: undefined,
        value: undefined,
        uuid: undefined
      }
    },
    getValueOfLookup() {
      if (this.metadata.isAdvancedQuery && this.isSelectMultiple) {
        return
      }
      this.isLoading = true

      this.getDefaultValueFromServer({
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        contextColumnNames: this.metadata.contextColumnNames,
        uuid: this.metadata.uuid,
        id: this.metadata.id,
        //
        columnName: this.metadata.columnName
      })
        .then(responseLookupItem => {
          // with value response update local component list
          if (!this.isEmptyValue(responseLookupItem)) {
            this.value = responseLookupItem.value
            this.displayedValue = responseLookupItem.displayedValue
            this.uuidValue = responseLookupItem.uuid
            this.$nextTick(() => {
              this.optionsList = this.getLookupAll
            })
          }
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    /**
     * @param {boolean} isShowList triggers when the pull-down menu appears or disappears
     */
    getDataLookupList(isShowList) {
      if (isShowList) {
        // get stored list values
        const list = this.getLookupList
        // refresh local list component
        this.optionsList = list
        if (this.isEmptyValue(list) || (list.length === 1 &&
          this.blankValues.includes(list[0].value))) {
          this.remoteMethod()
        }
      }
    },
    remoteMethod() {
      this.isLoading = true

      this.containerManager.getLookupList({
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        contextColumnNames: this.metadata.contextColumnNames,
        uuid: this.metadata.uuid,
        //
        tableName: this.metadata.reference.tableName,
        columnName: this.metadata.columnName,
        // app attributes
        isAddBlankValue: true,
        blankValue: this.blankOption.value
      })
        .then(responseLookupList => {
          if (!this.isEmptyValue(responseLookupList)) {
            this.optionsList = responseLookupList
          } else {
            this.optionsList = this.getLookupAll
          }
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    clearLookup() {
      this.$store.dispatch('deleteLookup', {
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        contextColumnNames: this.metadata.contextColumnNames,
        uuid: this.metadata.uuid,
        //
        tableName: this.metadata.reference.tableName,
        columnName: this.metadata.columnName,
        value: this.value
      })
        .then(() => {
          // set empty list and empty option
          this.optionsList = [
            this.blankOption
          ]

          // set empty value
          this.value = this.blankOption.value
        })
    }
  }

}
</script>

<style lang="scss" scoped>
  .custom-field-select {
    width: 100%;
  }

  .custom-field-select-multiple {
    overflow: auto;
    max-height: 100px;
    .el-select__tags {
      max-height: 100px;
    }
  }
</style>
