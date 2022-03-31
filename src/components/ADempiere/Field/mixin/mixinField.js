// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
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

export default {
  name: 'MixinField',

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
    metadata: {
      type: Object,
      required: true
    }
  },

  computed: {
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    isDisabled() {
      return Boolean(this.metadata.readonly || this.metadata.disabled)
    },
    cssClassStyle() {
      let styleClass = ''
      if (this.isEmptyRequired) {
        styleClass += ' field-empty-required '
      }

      if (!this.isEmptyValue(this.metadata.cssClassName)) {
        styleClass = this.metadata.cssClassName
      }

      return styleClass
    },
    isEmptyRequired() {
      return this.isEmptyValue(this.value) && this.metadata.required
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

        // main panel values
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

        this.$store.commit('updateValueOfField', {
          parentUuid: this.metadata.parentUuid,
          containerUuid,
          columnName,
          value
        })
      }
    }
  },

  async created() {
    if (this.metadata.isGetServerValue && this.isEmptyValue(this.value)) {
      let value
      let displayedValue
      const stoedValues = this.$store.getters.getStoredDefaultValue({
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        contextColumnNames: this.metadata.contextColumnNames,
        //
        uuid: this.metadata.uuid,
        id: this.metadata.id
      })

      if (this.isEmptyValue(stoedValues)) {
        // get from server
        const {
          value: valueOfServer,
          displayedValue: displayedValueOfServer
        } = await this.getDefaultValueFromServer()
        value = valueOfServer
        displayedValue = displayedValueOfServer
      } else {
        value = stoedValues.value
        displayedValue = stoedValues.value
      }

      if (this.metadata.componentPath === 'FieldSelect') {
        this.displayedValue = displayedValue
      }

      // set value into component and fieldValue store
      this.value = this.parseValue(value)

      // set value and change into store
      this.preHandleChange(value)
    }
  },

  mounted() {
    if (this.metadata.handleRequestFocus) {
      this.requestFocus()
    }
  },

  methods: {
    /**
     * Parse the value to a new value if required for element-ui component
     * compatibility where this method is overwritten
     * @param {mixed} value
     */
    parseValue(value) {
      return value
    },

    /**
     * Get default value from server
     * @returns promisse with object = { value, defaultValue, uuid, id }
     */
    getDefaultValueFromServer() {
      if (this.containerManager && this.containerManager.getDefaultValue) {
        return this.containerManager.getDefaultValue({
          parentUuid: this.metadata.parentUuid,
          containerUuid: this.metadata.containerUuid,
          contextColumnNames: this.metadata.contextColumnNames,
          //
          uuid: this.metadata.uuid,
          id: this.metadata.id,
          columnName: this.metadata.columnName
        })
      }

      return this.$store.dispatch('getDefaultValueFromServer', {
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        columnName: this.metadata.columnName,
        query: this.metadata.defaultValue
      })
    },

    /**
     * Set focus if handle focus attribute is true
     */
    requestFocus() {
      if (this.$refs[this.metadata.columnName]) {
        this.$refs[this.metadata.columnName].focus()
      }
    },
    /**
     * Overwrite component method if necessary
     * validate values before send values to store or server
     * @param {mixed} value
     */
    preHandleChange(value) {
      this.handleFieldChange({ value })
    },
    focusGained(value) {
      if (this.metadata.handleContentSelection) {
        // select all the content inside the text box
        if (!this.isEmptyValue(value.target.selectionStart) &&
          !this.isEmptyValue(value.target.selectionStart)) {
          value.target.selectionStart = 0
          value.target.selectionEnd = value.target.value.length
        }
      }
      if (this.metadata.handleFocusGained) {
        this.$store.dispatch('notifyFocusGained', {
          containerUuid: this.metadata.containerUuid,
          columnName: this.metadata.columnName,
          value: this.value
        })
      }
    },
    focusLost(value) {
      if (this.metadata.handleFocusLost) {
        this.$store.dispatch('notifyFocusLost', {
          containerUuid: this.metadata.containerUuid,
          columnName: this.metadata.columnName,
          value: this.value
        })
      }
    },
    keyPressed(value) {
      if (this.metadata.handleKeyPressed) {
        this.$store.dispatch('notifyKeyPressed', {
          containerUuid: this.metadata.containerUuid,
          columnName: this.metadata.columnName,
          value: value.key,
          keyCode: value.keyCode
        })
      }
    },
    actionKeyPerformed(value) {
      if (this.metadata.handleActionKeyPerformed) {
        this.$store.dispatch('notifyActionKeyPerformed', {
          containerUuid: this.metadata.containerUuid,
          columnName: this.metadata.columnName,
          value: value.target.value,
          keyCode: value.keyCode
        })
      }
    },
    keyReleased(value) {
      if (this.metadata.handleKeyReleased) {
        this.$store.dispatch('notifyKeyReleased', {
          containerUuid: this.metadata.containerUuid,
          columnName: this.metadata.columnName,
          value: value.key,
          keyCode: value.keyCode
        })
      }
    },
    /**
     * @param {mixed} value, main value in component
     * @param {mixed} valueTo, used in end value in range
     * @param {string} displayedValue, or displayColumnName to show in select
     */
    handleFieldChange({
      value,
      valueTo,
      displayedValue
    }) {
      // Global Action performed
      if (this.metadata.handleActionPerformed) {
        this.$store.dispatch('notifyActionPerformed', {
          containerUuid: this.metadata.containerUuid,
          columnName: this.metadata.columnName,
          value
        })
      }

      // if is custom field, set custom handle change value
      if (this.metadata.isCustomField) {
        if (this.metadata.isActiveLogics) {
          let fieldsList = []
          if (this.containerManager.getFieldsList) {
            fieldsList = this.containerManager.getFieldsList({
              parentUuid: this.metadata.parentUuid,
              containerUuid: this.metadata.containerUuid,
              root: this
            })
          }
          this.$store.dispatch('changeDependentFieldsList', {
            field: this.metadata,
            fieldsList
          })
        }
        return
      }

      this.$store.dispatch('notifyFieldChange', {
        containerUuid: this.metadata.containerUuid,
        containerManager: this.containerManager,
        field: this.metadata,
        columnName: this.metadata.columnName
      })
    }
  }
}
