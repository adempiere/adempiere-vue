<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Elsio Sanchez esanchez@erpya.com www.erpya.com
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
    <el-row
      v-if="!isEmptyValue(metadataList) && isLoadedField"
    >
      <template
        v-for="(field, index) in metadataList"
      >
        <el-col :key="index" :span="8">
          <el-form label-position="top" label-width="10px" @submit.native.prevent="notSubmitForm">
            <field-definition
              v-if="field.columnName === 'PriceEntered'"
              :key="field.columnName"
              :ref="field.columnName"
              :metadata-field="{
                ...field,
                labelCurrency: currencyPointOfSales.iSOCode,
              }"
              :container-uuid="'line'"
              :container-manager="{
                ...containerManager,
                getLookupList,
                isDisplayedField,
                isMandatoryField,
                isReadOnlyField,
                changeFieldShowedFromUser
              }"
            />
            <field-definition
              v-if="field.columnName === 'QtyEntered'"
              :key="field.columnName"
              :metadata-field="field"
              :container-uuid="'line'"
              :container-manager="{
                ...containerManager,
                getLookupList,
                isDisplayedField,
                isMandatoryField,
                isReadOnlyField,
                changeFieldShowedFromUser
              }"
            />
            <field-definition
              v-if="field.columnName === 'Discount'"
              :ref="field.columnName"
              :key="field.columnName"
              :metadata-field="field"
              :container-uuid="'line'"
              :container-manager="{
                ...containerManager,
                getLookupList,
                isDisplayedField,
                isMandatoryField,
                isReadOnlyField,
                changeFieldShowedFromUser
              }"
            />
          </el-form>
        </el-col>
      </template>
    </el-row>
    <div
      v-else
      key="form-loading"
      v-loading="isEmptyValue(metadataList)"
      :element-loading-text="$t('notifications.loading')"
      :element-loading-spinner="'el-icon-loading'"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      class="view-loading"
    />
  </div>
</template>

<script>
// constants
import fieldsListLine from './fieldsListLine.js'

// components and mixins
import FieldDefinition from '@theme/components/ADempiere/Field/index.vue'

// api request methods
import { validatePin } from '@/api/ADempiere/form/point-of-sales.js'

// utils and helper methods
import {
  createFieldFromDictionary
} from '@/utils/ADempiere/lookupFactory'
import {
  getLookupList,
  isDisplayedField,
  isMandatoryField,
  isReadOnlyField,
  changeFieldShowedFromUser
} from '@theme/components/ADempiere/Form/VPOS/containerManagerPos.js'

export default {
  name: 'FieldLine',

  components: {
    FieldDefinition
  },

  props: {
    dataLine: {
      type: Object,
      default: () => {}
    },
    showField: {
      type: Boolean,
      default: false
    },
    currentLine: {
      type: Object,
      default: () => {}
    },
    containerManager: {
      type: Object,
      default: () => ({
        actionPerformed: () => {},
        getFieldsLit: () => {},
        setDefaultValues: () => {}
      })
    }
  },

  data() {
    return {
      metadataList: [],
      panelMetadata: {},
      isLoaded: false,
      isLoadedField: false,
      panelType: 'custom',
      fieldsListLine,
      fieldsList: []
    }
  },

  computed: {
    isModifyPrice() {
      const pos = this.$store.getters.posAttributes.currentPointOfSales
      if (!this.isEmptyValue(pos.isModifyPrice)) {
        return pos.isModifyPrice
      }
      return false
    },
    isPosRequiredPin() {
      const pos = this.$store.getters.posAttributes.currentPointOfSales
      if (!this.isEmptyValue(pos.isPosRequiredPin) && !this.validatePin) {
        return pos.isPosRequiredPin
      }
      return false
    },
    currentPointOfSales() {
      return this.$store.getters.posAttributes.currentPointOfSales
    },
    validatePin() {
      return this.$store.state['pointOfSales/orderLine/index'].validatePin
    },
    currencyPointOfSales() {
      if (!this.isEmptyValue(this.currentPointOfSales)) {
        return this.currentPointOfSales.priceList.currency
      }
      return ''
    },
    isDisplayTaxAmount() {
      return this.currentPointOfSales.isDisplayTaxAmount
    },
    isDisplayDiscount() {
      return this.currentPointOfSales.isDisplayDiscount
    }
  },

  watch: {
    showField(value) {
      this.visible = false
      if (value && this.isEmptyValue(this.metadataList) && (this.dataLine.uuid === this.$store.state['pointOfSales/orderLine/index'].line.uuid)) {
        this.metadataList = this.setFieldsList()
        this.isLoadedField = true
      }
      if (value) {
        let price
        if (this.currentPointOfSales.isDisplayTaxAmount && !this.currentPointOfSales.isDisplayDiscount) {
          price = this.currentLine.price
        }
        if (!this.currentPointOfSales.isDisplayTaxAmount && !this.currentPointOfSales.isDisplayDiscount) {
          price = this.currentLine.priceListWithTax
        }
        if (!this.currentPointOfSales.isDisplayTaxAmount && this.currentPointOfSales.isDisplayDiscount) {
          price = this.currentLine.priceList
        }
        if (this.currentPointOfSales.isDisplayTaxAmount && this.currentPointOfSales.isDisplayDiscount) {
          price = this.currentLine.price
        }
        this.fillOrderLineQuantities({
          currentPrice: price,
          quantityOrdered: this.currentLine.quantity,
          discount: this.currentLine.discount
        })
        this.isLoadedField = true
      }
    }
  },

  beforeMount() {
    this.unsubscribe = this.subscribeChanges()
  },

  beforeDestroy() {
    this.unsubscribe()
  },

  methods: {
    getLookupList,
    isDisplayedField,
    isMandatoryField,
    isReadOnlyField,
    changeFieldShowedFromUser,
    createFieldFromDictionary,
    setFieldsList() {
      const fieldsList = []
      // Product Code
      this.fieldsListLine.forEach(element => {
        this.createFieldFromDictionary(element)
          .then(metadata => {
            const data = metadata
            fieldsList.push({
              ...data,
              containerUuid: 'line'
            })
          }).catch(error => {
            console.warn(`LookupFactory: Get Field From Server (State) - Error ${error.code}: ${error.message}.`)
          })
      })
      return fieldsList
    },
    fillOrderLineQuantities({
      currentPrice,
      quantityOrdered,
      discount
    }) {
      const containerUuid = 'line'
      // Editable fields
      if (!this.isEmptyValue(quantityOrdered)) {
        this.$store.commit('updateValueOfField', {
          containerUuid: 'line',
          columnName: 'QtyEntered',
          value: quantityOrdered
        })
      }
      if (!this.isEmptyValue(currentPrice)) {
        this.$store.commit('updateValueOfField', {
          containerUuid,
          columnName: 'PriceEntered',
          value: currentPrice
        })
      }
      if (!this.isEmptyValue(discount)) {
        this.$store.commit('updateValueOfField', {
          containerUuid,
          columnName: 'Discount',
          value: discount
        })
      }
    },
    closePing() {
      this.$refs.ping[this.$refs.ping.length - 1].showPopper = false
      this.visible = false
    },
    checkclosePin(pin) {
      validatePin({
        posUuid: this.currentPointOfSales.uuid,
        pin
      })
        .then(response => {
          this.$store.commit('pin', true)
          this.pin = ''
        })
        .catch(error => {
          console.error(error.message)
          this.$message({
            type: 'error',
            message: error.message,
            showClose: true
          })
          this.pin = ''
        })
      this.closePing()
    },
    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'addFocusGained' && this.isPosRequiredPin && (mutation.payload.columnName === 'PriceEntered' || mutation.payload.columnName === 'Discount')) {
          this.columnNameVisible = mutation.payload.columnName
          this.visible = true
        }
      })
    }
  }
}
</script>
