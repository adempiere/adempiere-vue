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
  <div class="wrapper">
    <el-form
      v-shortkey="{ closeForm: ['esc'] }"
      label-position="top"
      size="small"
      class="location-address"
      @shortkey.native="keyAction"
    >
      <el-row :gutter="0">
        <template v-if="isLoaded">
          <el-col v-for="(field) in fieldsListLocation" :key="field.columnName" :span="12">
            <field-definition
              :parent-uuid="parentUuid"
              :container-uuid="containerUuid"
              :container-manager="{
                ...containerManager,
                getLookupList,
                isDisplayedField,
                isMandatoryField,
                isReadOnlyField,
                changeFieldShowedFromUser
              }"
              :metadata-field="field"
            />
          </el-col>
        </template>

        <div
          v-else
          key="form-loading"
          v-loading="!isLoaded"
          :element-loading-text="$t('notifications.loading')"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255, 255, 255, 0.8)"
          style="min-height: calc(50vh - 84px)"
          class="loading-panel"
        />
      </el-row>
    </el-form>
  </div>
</template>

<script>
// components and mixins
import formMixin from '@theme/components/ADempiere/Form/formMixin.js'
import mixinLocation from './mixinLocation.js'

// constants
import FieldsList from './fieldsList.js'

// api request methods
import {
  createLocationAddress,
  updateLocationAddress
} from '@/api/ADempiere/field/location.js'

// utils and helper methods
import { showNotification } from '@/utils/ADempiere/notification.js'
import { getSequenceAsList } from '@/utils/ADempiere/location'

/**
 * Location Address form to field
 */
export default {
  name: 'LocationAdressFrom',

  mixins: [
    formMixin,
    mixinLocation
  ],

  props: {
    parentUuid: {
      type: String,
      default: undefined
    },
    metadata: {
      type: Object,
      default: () => {
        return {
          // TODO: Add container uuid parent
          uuid: 'Shipping-Address',
          containerUuid: 'Shipping-Address',
          isSetDefaultValues: false
        }
      }
    },
    parentMetadata: {
      type: Object,
      default: () => {}
    },
    // TODO: Not working props
    values: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      fieldsList: FieldsList,
      isCustomForm: true
    }
  },

  computed: {
    containerManagerLocation() {
      return {
        ...this.containerManager,

        getFieldsList({ containerUuid, root }) {
          return root.$store.getters.getFieldLocation
        }
      }
    },
    fieldsListLocation() {
      if (!this.isEmptyValue(this.$store.getters.getFieldsListLocationShipping)) {
        return this.$store.getters.getFieldsListLocationShipping
      }
      return this.fieldsList
    },
    locationId() {
      return this.$store.getters.getValueOfField({
        parentUuid: this.parentMetadata.parentUuid,
        containerUuid: this.parentMetadata.containerUuid,
        columnName: this.parentMetadata.columnName
      })
    }
  },

  created() {
    this.unsubscribe = this.subscribeChanges()

    if (!this.isEmptyValue(this.values)) {
      this.setValues({
        values: this.values
      })
    }
  },

  mounted() {
    if (this.parentMetadata.pos) {
      this.fieldsList.forEach(element => {
        element.containerUuid = this.parentMetadata.containerUuid
      })
    }
    this.getLocation()
  },

  methods: {
    keyAction(event) {
      if (event.srcKey === 'closeForm') {
        this.toggleShowedLocationForm()
      }
    },
    cancelChanges() {
      // TODO: Set old values
      this.isShowedLocationForm = false
    },
    sortSequence(itemA, itemB) {
      return itemA.index - itemB.index
    },
    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        // when first load country field with value
        if (
          mutation.type === 'setLookupItem' &&
          mutation.payload.containerUuid === this.metadata.containerUuid &&
          mutation.payload.tableName === 'C_Country'
        ) {
          this.changeCaptureSequence(mutation.payload.value)
        }

        // if changed country field
        if (
          mutation.type === 'updateValueOfField' &&
          mutation.payload.containerUuid === this.metadata.containerUuid &&
          mutation.payload.columnName === 'C_Country_ID'
        ) {
          const withOutColumnNames = ['C_Country_ID', 'DisplayColumn_C_Country_ID', 'C_Location_ID']
          // Get country definition to sequence fields and displayed value
          this.changeCaptureSequence(mutation.payload.value)

          // clear values
          const values = []
          FieldsList.forEach(item => {
            if (!withOutColumnNames.includes(item.columnName)) {
              values.push({
                columnName: item.columnName,
                value: undefined
              })
            }
            if (!withOutColumnNames.includes(item.displayColumnName)) {
              values.push({
                columnName: item.displayColumnName,
                value: undefined
              })
            }
          })

          this.setValues({
            values,
            withOutColumnNames
          })
        }
      })
    },

    /**
     * Change fields order
     * @param {number} countryId
     */
    changeCaptureSequence(countryId) {
      this.$store.dispatch('getCountryDefinition', {
        id: countryId
      })
        .then(responseCountry => {
          // capture sequence by form fields
          const newSequence = getSequenceAsList(responseCountry.captureSequence)
          const newFieldsList = this.fieldsListLocation.map(item => {
            if (newSequence.includes(item.sequenceFields)) {
              return {
                ...item,
                isDisplayed: true,
                index: newSequence.indexOf(item.sequenceFields)
              }
            }
            return {
              ...item,
              isDisplayed: false
            }
          }).sort((itemA, itemB) => {
            return itemA.index - itemB.index
          })

          this.$store.dispatch('changeSequenceShipping', newFieldsList)
        })
        .catch(error => {
          this.$message({
            message: error.message,
            isShowClose: true,
            type: 'error'
          })
          console.warn(`Error getting Country Definition: ${error.message}. Code: ${error.code}.`)
        })
    },

    /**
     * set context values to parent continer
     * @param {object} values
     */
    setParentValues(values) {
      const {
        parentUuid,
        containerUuid,
        columnName, // 'C_Location_ID' by default
        displayColumnName
      } = this.parentMetadata

      this.$store.commit('updateValueOfField', {
        parentUuid,
        containerUuid,
        columnName,
        value: values[columnName]
      })

      this.$store.commit('updateValueOfField', {
        parentUuid,
        containerUuid,
        // DisplayColumn_'ColumnName'
        columnName: displayColumnName,
        value: this.getDisplayedValue(values)
      })
    },

    /**
     * Get attributes list to server
     * @returns {array} attributesToServer
     */
    getAttributesToServer(attributesList) {
      const attributesToServer = attributesList
        .filter(attributeItem => {
          const { columnName } = attributeItem
          if (columnName.includes('DisplayColumn_') || columnName === 'C_Location_ID') {
            return false
          }
          return true
        })

      const cityName = this.$store.getters.getValueOfField({
        containerUuid: this.containerUuid,
        columnName: 'DisplayColumn_C_City_ID'
      })
      if (!this.isEmptyValue(cityName)) {
        attributesToServer.push({
          columnName: 'City',
          value: cityName
        })
      }

      const regionName = this.$store.getters.getValueOfField({
        containerUuid: this.containerUuid,
        columnName: 'DisplayColumn_C_Region_ID'
      })
      if (!this.isEmptyValue(cityName)) {
        attributesToServer.push({
          columnName: 'RegionName',
          value: regionName
        })
      }

      return attributesToServer
    },

    sendValuesToServer() {
      const emptyMandatoryFields = this.$store.getters.getFieldsListEmptyMandatory({
        containerUuid: this.containerUuid,
        formatReturn: 'name'
      })

      if (!this.isEmptyValue(emptyMandatoryFields)) {
        showNotification({
          type: 'warning',
          title: this.$t('notifications.emptyValues'),
          name: '<b>' + emptyMandatoryFields + '.</b> ',
          message: this.$t('notifications.fieldMandatory'),
          isRedirect: false
        })
        return
      }

      const attributes = this.$store.getters.getValuesView({
        containerUuid: this.containerUuid
      })
      const attributesToServer = this.getAttributesToServer(attributes)

      const updateLocation = (responseLocation) => {
        // set form values
        this.setValues({
          values: responseLocation.attributes
        })

        // set field parent values
        this.setParentValues(responseLocation.attributes)
        this.isShowedLocationForm = false

        // set context values to form continer
        this.$store.dispatch('updateValuesOfContainer', {
          parentUuid: this.parentUuid,
          containerUuid: this.containerUuid,
          attributes
        })

        return responseLocation.attributes
      }

      const locationId = this.locationId
      if (this.isEmptyValue(locationId) || locationId === 0) {
        createLocationAddress({
          attributesList: attributesToServer
        })
          .then(updateLocation)
          .then(responseCreate => {
            const {
              parentUuid,
              containerUuid,
              columnName // 'C_Location_ID' by default
            } = this.parentMetadata

            const recordUuid = this.$store.getters.getValueOfField({
              parentUuid,
              containerUuid,
              columnName: 'UUID'
            })

            this.containerManager.actionPerformed({
              containerUuid,
              field: this.parentMetadata,
              value: responseCreate[columnName],
              recordUuid
            })
          })
          .catch(error => {
            this.$message({
              message: error.message,
              isShowClose: true,
              type: 'error'
            })
            console.warn(`Error create Location Address: ${error.message}. Code: ${error.code}.`)
          })
        // break to only create
        return
      }
      updateLocationAddress({
        id: locationId,
        attributesList: attributesToServer
      })
        .then(updateLocation)
        .catch(error => {
          this.$message({
            message: error.message,
            isShowClose: true,
            type: 'error'
          })
          console.warn(`Error update Location Address: ${error.message}. Code: ${error.code}.`)
        })
    },
    /**
     * TODO: Manage with vuex module
     */
    getLocation() {
      if (this.isGettingLocation) {
        return
      }

      if (!this.isEmptyValue(this.values)) {
        this.setValues({
          values: this.values
        })
        return
      }

      const id = this.locationId
      if (this.isEmptyValue(id)) {
        return
      }

      this.isGettingLocation = true
      this.getLocationAddress({
        id
      })
        .then(responseLocation => {
          const { values } = responseLocation

          this.setValues({
            values
          })
        })
        .catch(error => {
          console.warn(`Get Location Address, Form Location - Error ${error.code}: ${error.message}.`)
        })
        .finally(() => {
          this.isGettingLocation = false
        })
    }
  }
}
</script>

<style scoped lang="scss">
  .location-address {
    .el-form-item {
        margin-bottom: 0px !important;
    }

    .custom-button-address-location {
      float: right;
      margin-right: 10px;
    }
  }
</style>
<style lang="scss">
.location-address {
  .el-form-item--small .el-form-item__label {
    line-height: 22px !important;
  }
  .el-form-item--small.el-form-item {
    margin-bottom: 5px !important;
  }
}
</style>
