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
    :ref="metadata.columnName"
    v-model="value"
    :filterable="!isMobile"
    :placeholder="metadata.placeholder"
    :loading="isLoading"
    value-key="value"
    :class="cssClassStyle"
    clearable
    :multiple="isSelectMultiple"
    :allow-create="metadata.isSelectCreated"
    :collapse-tags="!isSelectMultiple"
    :disabled="isDisabled"
    @change="preHandleChange"
    @visible-change="getDataLookupList"
    @clear="clearLookup"
  >
    <el-option
      v-for="(option, key) in optionsList"
      :key="key"
      :value="option.value"
      :label="option.label"
    />
  </el-select>
</template>

<script>
// components and mixins
import FieldMixin from '@/components/ADempiere/Field/mixin/mixinField.js'

// utils and helper methods
import { convertBooleanToString } from '@/utils/ADempiere/formatValue/booleanFormat.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

/**
 * This component is a lookup type field, use as a replacement for fields:
 * - Reference List
 * - Table List
 * - Table Direct
 *
 * TODO: String values add single quotation marks 'value'
 * TODO: Add support to valuesList filter on proxy-api
 * TODO: No blanck option enabled if is mandatory field
 * TODO: ALL: Although in the future these will have different components, and
 * are currently not supported is also displayed as a substitute for fields:
 * - Search Field
 */
export default {
  name: 'FieldSelect',

  mixins: [
    FieldMixin
  ],

  data() {
    // label with '' value is assumed to be undefined non-existent
    const label = ' '
    const blankOption = {
      label,
      value: undefined,
      uuid: undefined
    }

    return {
      isLoading: false,
      optionsList: [blankOption],
      blankValues: [null, undefined, -1, '-1'],
      blankOption
    }
  },

  computed: {
    isSelectMultiple() {
      return ['IN', 'NOT_IN'].includes(this.metadata.operator) && this.metadata.isAdvancedQuery
    },
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
    getLookupList() {
      if (!this.metadata.displayed) {
        return [this.blankOption]
      }
      return this.$store.getters.getStoredLookupList({
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        uuid: this.metadata.uuid,
        tableName: this.metadata.reference.tableName,
        columnName: this.metadata.columnName
      })
    },
    getLookupAll() {
      const allOptions = this.$store.getters.getStoredLookupAll({
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        uuid: this.metadata.uuid,
        tableName: this.metadata.reference.tableName,
        query: this.metadata.reference.query,
        validationCode: this.metadata.reference.validationCode,
        directQuery: this.metadata.reference.directQuery,
        value: this.value
      })

      // sets the value to blank when the lookupList or lookupItem have no
      // values, or if only lookupItem does have a value
      if (this.isEmptyValue(allOptions) || (allOptions.length &&
        (!this.blankValues.includes(allOptions[0].value)))) {
        allOptions.unshift(this.blankOption)
      }
      return allOptions
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
      if (!option.label) {
        const label = this.displayedValue
        if (!isEmptyValue(label)) {
          this.optionsList.push({
            value: newValue,
            uuid: option.uuid,
            label
          })
        } else {
          // request lookup
          this.getDataLookupItem()
        }
      }
    }
  },

  created() {
    this.changeBlankOption()
  },

  beforeMount() {
    if (this.metadata.displayed) {
      this.optionsList = this.getLookupAll
      const value = this.value
      if (!this.isEmptyValue(value) && !this.metadata.isAdvancedQuery) {
        const option = this.findOption(value)
        if (option.label) {
          this.displayedValue = option.label
          this.uuidValue = option.uuid
        } else {
          if (!this.isEmptyValue(this.displayedValue)) {
            // verify if exists to add (in table)
            this.optionsList.push({
              value,
              uuid: option.uuid,
              label: this.displayedValue
            })
          } else {
            // request lookup
            this.getDataLookupItem()
          }
        }
      }
    }
  },

  methods: {
    parseValue(value) {
      if (typeof value === 'boolean') {
        // value ? 'Y' : 'N'
        value = convertBooleanToString(value)
      }
      return value
    },
    changeBlankOption() {
      if (Number(this.metadata.defaultValue) === -1) {
        this.blankOption.value = this.metadata.defaultValue
      }
    },
    preHandleChange(value) {
      const { label } = this.findOption(value)
      this.displayedValue = label
      this.handleFieldChange({
        value,
        label
      })
    },
    findOption(value) {
      const option = this.optionsList.find(item => item.value === value)
      if (option && option.label) {
        return option
      }
      return {
        label: undefined,
        value: undefined,
        uuid: undefined
      }
    },
    async getDataLookupItem() {
      if (this.isEmptyValue(this.metadata.reference.directQuery) ||
        (this.metadata.isAdvancedQuery && this.isSelectMultiple)) {
        return
      }
      this.isLoading = true
      this.$store.dispatch('getLookupItemFromServer', {
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        tableName: this.metadata.reference.tableName,
        directQuery: this.metadata.reference.directQuery,
        value: this.value
      })
        .then(responseLookupItem => {
          // with value response update local component list
          if (!this.isEmptyValue(responseLookupItem)) {
            this.displayedValue = responseLookupItem.label
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
        uuid: this.metadata.uuid,
        //
        columnName: this.metadata.columnName,
        tableName: this.metadata.reference.tableName,
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
      this.$store.dispatch('deleteLookupList', {
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        uuid: this.metadata.uuid,
        tableName: this.metadata.reference.tableName,
        query: this.metadata.reference.query,
        directQuery: this.metadata.reference.directQuery,
        validationCode: this.metadata.reference.validationCode,
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
