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
  <el-col :span="$store.getters.getCopyShippingAddress ? 24 : 12">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>{{ $t('form.pos.order.BusinessPartnerCreate.billingAddress') }}</span>
      </div>
      <div class="text item">
        <template
          v-for="(field) in fieldsList"
        >
          <field-definition
            :key="field.columnName"
            :ref="field.columnName"
            :metadata-field="{
              ...field,
              size: { 'xs': fieldSize, 'sm': fieldSize, 'md': fieldSize, 'lg': fieldSize, 'xl': fieldSize },
              isReadOnly: disabled
            }"
          />
        </template>
      </div>
      <br>
      <br>
    </el-card>
  </el-col>
</template>

<script>
import formMixin from '@/components/ADempiere/Form/formMixin.js'
import fieldsList from './fieldListBillingAddress.js'
import BParterMixin from './mixinBusinessPartner.js'
export default {
  name: 'BillingAddress',
  mixins: [
    formMixin,
    BParterMixin
  ],
  props: {
    metadata: {
      type: Object,
      default: () => {
        return {
          uuid: 'Billing-Address',
          containerUuid: 'Billing-Address',
          fieldsList
        }
      }
    },
    epale: {
      type: Object,
      default: () => {}
    },
    showField: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      input: '',
      businessPartnerRecord: {},
      isLoadingRecord: false,
      fieldsList,
      checked: true,
      isCustomForm: true,
      unsubscribe: () => {}
    }
  },
  computed: {
    fieldSize() {
      return !this.$store.getters.getCopyShippingAddress ? 24 : 12
    },
    fieldsListLocationBillingAddress() {
      if (!this.isEmptyValue(this.$store.getters.getFieldLocation)) {
        return this.$store.getters.getFieldLocation
      }
      if (!this.isEmptyValue(this.$store.getters.getFieldLocation)) {
        return this.$store.getters.getFieldLocation
      }
      return this.fieldsList.map(billing => {
        if (!this.$store.getters.getCopyShippingAddress) {
          return {
            ...billing,
            size: { 'xs': 12, 'sm': 12, 'md': 12, 'lg': 12, 'xl': 12 }
          }
        }
        return billing
      })
    },
    adviserPin() {
      const value = this.$store.getters.getValueOfField({
        containerUuid: this.containerUuid,
        columnName: 'Value'
      })
      const name = this.$store.getters.getValueOfField({
        containerUuid: this.containerUuid,
        columnName: 'Name'
      })
      const isSeller = this.$store.getters.posAttributes.currentPointOfSales.isAisleSeller
      if (!this.isEmptyValue(value) && !this.isEmptyValue(name) && isSeller) {
        return isSeller
      }
      return false
    },
    currentPointOfSales() {
      return this.$store.getters.posAttributes.currentPointOfSales
    },
    popoverCreateBusinessParnet() {
      return this.$store.getters.getPopoverCreateBusinessParnet
    }
  },
  beforeDestroy() {
    this.unsubscribe()
  },
  methods: {
    notSubmitForm(event) {
      event.preventDefault()
      return false
    }
  }
}
</script>

<style scoped lang="scss">
  .create-bp {
    .el-form-item {
        margin-bottom: 0px !important;
    }
  }
  .scroll-address {
    max-height: 450px;
  }
  .custom-button-create-bp {
    float: right;
    margin-right: 10px;
  }
</style>
