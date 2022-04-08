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
  <el-popover
    v-if="!metadata.pos"
    key="standard"
    ref="locationAddress"
    v-model="isShowedLocationForm"
    class="popover-location"
    placement="left-end"
    width="350"
    trigger="manual"
  >
    <location-address-form
      v-if="isShowedLocationForm"
      class="location-form"
      :values="localValues"
      :parent-metadata="metadata"
      :parent-uuid="parentUuid"
      :container-uuid="containerUuid"
      :container-manager="containerManager"
    />

    <el-button
      slot="reference"
      class="button-location-show"
      type="text"
      @click="isShowedLocationForm = true"
    >
      <el-input
        v-model="displayedValue"
        :class="cssClassStyle"
        readonly
      >
        <i slot="prefix" class="el-icon-location-information el-input__icon" />
      </el-input>
    </el-button>
  </el-popover>

  <location-address-form
    v-else
    key="point-of-sales"
    class="location-form"
    :values="localValues"
    :parent-metadata="metadata"
    :parent-uuid="parentUuid"
    :container-uuid="containerUuid"
    :container-manager="containerManager"
  />
</template>

<script>
// mixins
import fieldMixin from '@theme/components/ADempiere/Field/mixin/mixinField.js'
import mixinLocation, { LOCATION_ADDRESS_FORM } from './mixinLocation.js'

// components
import LocationAddressForm from './locationAddressForm.vue'

export default {
  name: 'FieldLocation',

  components: {
    LocationAddressForm
  },

  mixins: [
    fieldMixin,
    mixinLocation
  ],

  props: {
    parentUuid: {
      type: String,
      default: undefined
    },
    containerUuid: {
      type: String,
      required: true
    }
  },

  computed: {
    cssClassStyle() {
      let styleClass = ' custom-field-location '
      if (!this.isEmptyValue(this.metadata.cssClassName)) {
        styleClass += this.metadata.cssClassName
      }

      if (this.isEmptyRequired) {
        styleClass += ' field-empty-required '
      }

      return styleClass
    },
    displayedValue: {
      get() {
        /**
         * TODO: Add DisplayColumnName (to locator's and location's fields) in entities
         * list response, to set value or empty value in fieldValue state when
         * change records with dataTable.
         */
        if (this.isEmptyValue(this.value)) {
          return undefined
        }

        return this.$store.getters.getValueOfFieldOnContainer({
          parentUuid: this.metadata.parentUuid,
          containerUuid: this.metadata.containerUuid,
          // DisplayColumn_'ColumnName'
          columnName: this.metadata.displayColumnName
        })
      },
      set(value) {
        this.$store.commit('updateValueOfField', {
          parentUuid: this.metadata.parentUuid,
          containerUuid: this.metadata.containerUuid,
          // DisplayColumn_'ColumnName'
          columnName: this.metadata.displayColumnName,
          value
        })
      }
    },
    popoverPlacement() {
      return this.metadata.popoverPlacement || 'top'
    }
  },

  watch: {
    value(newValue, oldValue) {
      if (this.isEmptyValue(newValue)) {
        this.displayedValue = undefined
      } else {
        if (newValue !== oldValue) {
          this.displayedValue = undefined
          this.getLocation()
        }
      }
    }
  },

  mounted() {
    if (!this.metadata.isAdvancedQuery) {
      this.getLocation()
    }
  },

  methods: {
    /**
     * Request location entity
     */
    getLocation() {
      if (this.isGettingLocation) {
        return
      }

      if (!this.isEmptyValue(this.displayedValue)) {
        return
      }

      const value = this.value
      if (this.isEmptyValue(value)) {
        return
      }

      this.isGettingLocation = true
      this.getLocationAddress({
        id: value
      })
        .then(responseLocation => {
          const { attributes } = responseLocation
          this.localValues = attributes

          // TODO: Get Display_ColumnName from server request
          this.displayedValue = this.getDisplayedValue(attributes) || value

          this.$store.commit('updateValuesOfContainer', {
            // parentUuid,
            containerUuid: LOCATION_ADDRESS_FORM,
            attributes
          })
        })
        .catch(error => {
          console.warn(`Get Location Address Form, Field Location - Error ${error.code}: ${error.message}.`)
        })
        .finally(() => {
          this.isGettingLocation = false
        })
    }
  }
}
</script>

<style lang="scss">
/**
 * span tag as button and label text
 */
.button-location-show {
  padding-top: 0px !important;
}
</style>
