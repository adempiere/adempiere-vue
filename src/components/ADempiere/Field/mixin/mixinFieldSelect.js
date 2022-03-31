// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com www.erpya.com
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

// utils and helper methods
import { convertBooleanToString } from '@/utils/ADempiere/formatValue/booleanFormat.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

export default {
  name: 'MixinFieldSelect',

  data() {
    return {
      isLoading: false,
      optionsList: [],
      blankValues: [null, undefined, -1, '-1']
    }
  },

  computed: {
    isSelectMultiple() {
      return ['IN', 'NOT_IN'].includes(this.metadata.operator) && this.metadata.isAdvancedQuery
    },

    blankOption() {
      let value
      if (Number(this.metadata.defaultValue) === -1) {
        value = this.metadata.defaultValue
      }

      return {
        // label with '' value is assumed to be undefined non-existent
        label: ' ',
        id: undefined,
        uuid: undefined,
        value
      }
    },
    getLookupList() {
      if (!this.metadata.displayed) {
        return [this.blankOption]
      }
      return this.$store.getters.getStoredLookupList({
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        contextColumnNames: this.metadata.reference.contextColumnNames,
        uuid: this.metadata.uuid,
        id: this.metadata.id,
        //
        tableName: this.metadata.reference.tableName,
        columnName: this.metadata.columnName
      })
    },
    getLookupAll() {
      const allOptions = this.$store.getters.getStoredLookupAll({
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        contextColumnNames: this.metadata.reference.contextColumnNames,
        uuid: this.metadata.uuid,
        id: this.metadata.id,
        //
        tableName: this.metadata.reference.tableName,
        columnName: this.metadata.columnName,
        value: this.value
      })

      // sets the value to blank when the lookupList or lookupItem have no
      // values, or if only lookupItem does have a value
      if (isEmptyValue(allOptions) || (allOptions.length &&
        // (!this.blankValues.includes(allOptions[0].id)))) {
        (!this.blankValues.includes(allOptions[0].value)))) {
        allOptions.unshift(this.blankOption)
      }
      return allOptions
    }
  },

  methods: {
    /**
     @overwride
     */
    parseValue(value) {
      if (typeof value === 'boolean') {
        // value ? 'Y' : 'N'
        value = convertBooleanToString(value)
      }
      return value
    }
  }

}
