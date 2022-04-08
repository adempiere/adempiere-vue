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
  <div class="field-definition">
    <component
      :is="componentRender"
      v-if="inTable"
      :id="field.panelType !== 'form' ? field.columnName : ''"
      key="is-table-template"
      :class="classField"
      :parent-uuid="parentUuid"
      :container-uuid="containerUuid"
      :container-manager="containerManager"
      :metadata="fieldAttributes"
      :in-table="true"
    />

    <el-col
      v-else-if="!inTable && isDisplayedField"
      key="is-panel-template"
      :xs="sizeField.xs"
      :sm="sizeField.sm"
      :md="sizeField.md"
      :lg="sizeField.lg"
      :xl="sizeField.xl"
      :class="classField"
    >
      <el-form-item :class="classFrom">
        <template slot="label">
          <field-options
            :metadata="fieldAttributes"
            :container-manager="containerManager"
            :record-uuid="recordUuid"
          />
        </template>

        <component
          :is="componentRender"
          :id="field.panelType !== 'form' ? field.columnName : ''"
          :ref="field.columnName"
          :parent-uuid="parentUuid"
          :container-uuid="containerUuid"
          :container-manager="containerManager"
          :metadata="fieldAttributes"
        />
      </el-form-item>
    </el-col>
  </div>
</template>

<script>
// components and mixins
import FieldOptions from '@theme/components/ADempiere/Field/FieldOptions/index.vue'

// constants
import { UUID } from '@/utils/ADempiere/constants/systemColumns'
import { TEXT } from '@/utils/ADempiere/references'

// utils and helper methods
import { evalutateTypeField } from '@/utils/ADempiere/dictionaryUtils'

/**
 * This is the base component for linking the components according to the
 * reference (or type of visualization) of each field
 */
export default {
  name: 'FieldDefinition',

  components: {
    FieldOptions
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
    // receives the property that is an object with all the attributes
    metadataField: {
      type: Object,
      default: () => ({})
    },
    inGroup: {
      type: Boolean,
      default: false
    },
    inTable: {
      type: Boolean,
      default: false
    },
    isAdvancedQuery: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      field: {}
    }
  },

  computed: {
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    classFrom() {
      if (['FieldTextLong', 'FieldImage'].includes(this.field.componentPath)) {
        return 'field-text-long'
      }
      if ([TEXT.id].includes(this.field.displayType)) {
        return 'field-text-area'
      }
      return 'field-standard'
    },
    sizeField() {
      if (this.isEmptyValue(this.field.size)) {
        return {
          xs: 24,
          sm: 24,
          md: 24,
          lg: 24,
          xl: 24
        }
      }
      return {
        xs: this.field.size.xs,
        sm: this.field.size.sm,
        md: this.field.size.md,
        lg: this.field.size.lg,
        xl: this.field.size.xl
      }
    },
    // load the component that is indicated in the attributes of received property
    componentRender() {
      if (this.isEmptyValue(this.field.componentPath || !this.field.isSupported)) {
        return () => import('@theme/components/ADempiere/Field/FieldText')
      }
      if (this.isSelectCreated) {
        return () => import('@theme/components/ADempiere/Field/FieldSelectMultiple')
      }
      let field
      switch (this.field.componentPath) {
        case 'FieldAutocomplete':
          field = () => import('@theme/components/ADempiere/Field/FieldAutocomplete')
          break
        case 'FieldBinary':
          field = () => import('@theme/components/ADempiere/Field/FieldBinary')
          break
        case 'FieldButton':
          field = () => import('@theme/components/ADempiere/Field/FieldButton')
          break
        case 'FieldColor':
          field = () => import('@theme/components/ADempiere/Field/FieldColor')
          break
        case 'FieldDate':
          field = () => import('@theme/components/ADempiere/Field/FieldDate')
          break
        case 'FieldImage':
          field = () => import('@theme/components/ADempiere/Field/FieldImage')
          break
        case 'FieldLocation':
          field = () => import('@theme/components/ADempiere/Field/FieldLocation')
          break
        case 'FieldLocator':
          field = () => import('@theme/components/ADempiere/Field/FieldLocator')
          break
        case 'FieldNumber':
          field = () => import('@theme/components/ADempiere/Field/FieldNumber')
          break
        case 'FieldSelect':
          field = () => import('@theme/components/ADempiere/Field/FieldSelect')
          break
        case 'FieldText':
          field = () => import('@theme/components/ADempiere/Field/FieldText')
          break
        case 'FieldTextLong':
          field = () => import('@theme/components/ADempiere/Field/FieldTextLong')
          break
        case 'FieldTime':
          field = () => import('@theme/components/ADempiere/Field/FieldTime')
          break
        case 'FieldYesNo':
          field = () => import('@theme/components/ADempiere/Field/FieldYesNo')
          break
      }
      return field
    },
    fieldAttributes() {
      return {
        ...this.field,
        inTable: this.inTable,
        isAdvancedQuery: this.isAdvancedQuery,
        // DOM properties
        required: this.isMandatoryField,
        readonly: this.isReadOnlyField,
        displayed: this.isDisplayedField,
        disabled: !this.field.isActive,
        isSelectCreated: this.isSelectCreated,
        placeholder: this.field.help ? this.field.help.slice(0, 40) + '...' : ''
      }
    },

    isDisplayedField() {
      // validate with container manager
      return this.inTable || (
        this.containerManager.isDisplayedField(this.field) &&
        (this.isMandatoryField || this.field.isShowedFromUser)
      )
    },

    /**
     * Idicate if field is read only
     */
    isReadOnlyField() {
      if (this.inTable) {
        // table manage with isReadOnlyColumn method
        // if rendered the component is editable
        return false
      }

      // validate with container manager
      return this.containerManager.isReadOnlyField(this.field)
    },
    isMandatoryField() {
      // validate with container manager
      return this.containerManager.isMandatoryField(this.field)
    },

    recordUuid() {
      // is active record
      return this.$store.getters.getValueOfFieldOnContainer({
        parentUuid: this.parentUuid,
        containerUuid: this.containerUuid,
        columnName: UUID
      })
    },

    isSelectCreated() {
      return this.isAdvancedQuery &&
        ['IN', 'NOT_IN'].includes(this.field.operator) &&
        !['FieldBinary', 'FieldDate', 'FieldSelect', 'FieldYesNo'].includes(this.field.componentPath)
    },
    getWidth() {
      return this.$store.getters.getWidthLayout
    },
    classField() {
      if (this.inTable) {
        return 'in-table'
      }
      return ''
    }
  },

  watch: {
    metadataField(value) {
      this.field = value
    }
  },

  created() {
    // assined field with prop
    this.field = this.metadataField
    if (this.field.isCustomField && !this.field.componentPath) {
      let componentReference = evalutateTypeField(this.field.displayType)
      if (this.isEmptyValue(componentReference)) {
        componentReference = {
          componentPath: 'FieldText'
        }
      }
      this.field = {
        ...this.metadataField,
        isActive: true,
        isDisplayed: true,
        isDisplayedFromLogic: true,
        isShowedFromUser: true,
        //
        componentPath: componentReference.componentPath
      }
    }
  },

  methods: {
    focusField() {
      if (this.field.handleRequestFocus || (this.field.displayed && !this.field.readonly)) {
        this.$refs[this.field.columnName].requestFocus()
      }
    }
  }
}
</script>

<style lang="scss">
.field-definition {
  /**
   * Separation between elements (item) of the form
   */
  .from-text-long {
    max-height: 300px;
    min-height: 250px;
  }
  .from-field {
    max-height: 65px;
  }
  .el-form-item {
    margin-bottom: 12px !important;
    margin-left: 10px;
    margin-right: 10px;
  }
  .field-text-long {
    max-height: 300px;
    min-height: 250px;
  }

  /**
   * Maximum height to avoid distorting the field list
   */
  .field-standard {
    &:not(.in-table) {
      max-height: 79px;
    }

    .el-form-item__content {
      max-height: 36px !important;
    }
  }

  /*
  .in-table {
    margin-bottom: 0px !important;
    margin-left: 0px;
    margin-right: 0px;
  }
  */

  /**
   * Min height all text area, not into table
   */
  .el-textarea__inner:not(.in-table) {
    min-height: 36px !important;
    // height: 36px auto !important;
    // max-height: 54.2333px !important;
  }

  /**
   * Reduce the spacing between the form element and its label
   */
  .el-form-item__label {
    padding-bottom: 0px;
  }

  /*
  .pre-formatted {
    white-space: pre;
  }
  */

  /**
   * Red border in empty mandatory field
   */
  .field-empty-required {
    .el-input__inner,
    .tui-editor-defaultUI,
    .el-textarea__inner {
      border-color: #f55 !important;
    }
  }
}
</style>
