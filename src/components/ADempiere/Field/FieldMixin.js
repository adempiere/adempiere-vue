
export const fieldMixin = {
  props: {
    metadata: {
      type: Object,
      required: true
    },
    // value received from data result
    valueModel: {
      type: [String, Number, Boolean, Date, Array, Object],
      default: null
    }
  },
  data() {
    // value render
    let value1 = this.metadata.value
    if (this.metadata.inTable) {
      value1 = this.valueModel
    }
    return {
      value1
    }
  },
  computed: {
    isDisabled() {
      return Boolean(this.metadata.readonly || this.metadata.disabled)
    },
    value: {
      get() {
        // console.log(this.$store)
        return this.$store.getters.getValueOfField({
          containerUuid: this.metadata.containerUuid,
          columnName: this.metadata.columnName
        })
      },
      set(value) {
        // console.log(value)
        this.$store.commit('updateValueOfField', {
          parentUuid: this.metadata.parentUuid,
          containerUuid: this.metadata.containerUuid,
          columnName: this.metadata.columnName,
          value: value
        })
      }
    }
  },
  async created() {
    if (this.metadata.isSQLValue && (this.isEmptyValue(this.metadata.value) || this.metadata.value.isSQL || isNaN(this.metadata.value))) {
      const value = await this.$store.dispatch('getValueBySQL', {
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        query: this.metadata.defaultValue
      })
      this.preHandleChange(value)
    }
  },
  mounted() {
    if (this.metadata.handleRequestFocus) {
      this.requestFocus()
    }
  },
  watch: {
    valueModel(value) {
      if (this.metadata.inTable) {
        this.value = this.parseValue(value)
      }
    },
    'metadata.value'(value) {
      if (!this.metadata.inTable) {
        this.value = this.parseValue(value)
      }
    }
  },
  methods: {
    parseValue(value) {
      return value
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
      this.handleChange(value)
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
     * @param {string} label, or displayColumn to show in select
     */
    handleChange(value, valueTo = undefined, label = undefined) {
      // Global Action performed
      if (this.metadata.handleActionPerformed) {
        this.$store.dispatch('notifyActionPerformed', {
          containerUuid: this.metadata.containerUuid,
          columnName: this.metadata.columnName,
          value: value
        })
      }

      // if is custom field, set custom handle change value
      if (this.metadata.isCustomField) {
        return
      }
      this.$store.dispatch('notifyFieldChange', {
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        panelType: this.metadata.panelType,
        columnName: this.metadata.columnName,
        field: this.metadata
      })
    }
  }
}
