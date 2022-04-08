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
  <el-container style="max-height: 450px; border: 1px solid #eee; border: 0px">
    <el-main
      v-shortkey="popoverCreateBusinessParnet ? {close: ['esc'], enter: ['enter']} : {}"
      style="height: -webkit-fill-available;overflow: hidden;"
      @shortkey.native="actionCreate"
    >
      <el-form
        label-position="top"
        size="small"
        class="create-bp"
      >
        <el-row :gutter="24">
          <el-col :span="24">
            <el-card class="box-card" shadow="never">
              <div slot="header" class="clearfix">
                <span>
                  {{ $t('form.pos.order.BusinessPartnerCreate.customerData') }}
                </span>
              </div>
              <div class="text item">
                <field-definition
                  v-for="(field) in metaDataFromList"
                  :ref="field.columnName"
                  :key="field.columnName"
                  :metadata-field="field"
                  :container-uuid="'Business-Partner-Create'"
                  :container-manager="{
                    ...containerManager,
                    getLookupList,
                    isDisplayedField,
                    isMandatoryField,
                    isReadOnlyField,
                    changeFieldShowedFromUser
                  }"
                />
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row v-show="isVisibleAddress" :gutter="24">
          <el-scrollbar v-if="isVisibleAddress" wrap-class="scroll-child">
            <billing-address />
            <shipping-address v-if="!copyShippingAddress" />
          </el-scrollbar>
        </el-row>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
// constants
import fieldsList from './fieldsListCreate.js'

// components and mixins
import formMixin from '@theme/components/ADempiere/Form/formMixin.js'
import BillingAddress from './billingAddress.vue'
import ShippingAddress from './shippingAddress.vue'
import BParterMixin from './mixinBusinessPartner.js'

// api request methods
import { createCustomer, customer } from '@/api/ADempiere/form/point-of-sales.js'
import {
  getLookupList,
  isDisplayedField,
  isMandatoryField,
  isReadOnlyField,
  changeFieldShowedFromUser
} from '@theme/components/ADempiere/Form/VPOS/containerManagerPos.js'

export default {
  name: 'BusinessPartnerCreate',

  components: {
    ShippingAddress,
    BillingAddress
  },

  mixins: [
    formMixin,
    BParterMixin
  ],

  props: {
    metadata: {
      type: Object,
      default: () => {
        return {
          uuid: 'Business-Partner-Create',
          containerUuid: 'Business-Partner-Create',
          fieldsList
        }
      }
    },
    containerManager: {
      type: Object,
      default: () => ({
        actionPerformed: () => {},
        getFieldsLit: () => {},
        setDefaultValues: () => {}
      })
    },
    showField: {
      type: Boolean,
      default: false
    },
    isVisibleAddress: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      businessPartnerRecord: {},
      isLoadingRecord: false,
      fieldsList,
      checked: true,
      isCustomForm: true,
      isExistingCustomer: false,
      unsubscribe: () => {}
    }
  },

  computed: {
    fieldsListLocation() {
      if (!this.isEmptyValue(this.$store.getters.getFieldLocation)) {
        return this.$store.getters.getFieldLocation
      }
      return this.fieldsList.filter(field => field.tabindex > 2)
    },
    metaDataFromList() {
      return this.fieldsList
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
    currentCustomerTemplatePointOfSales() {
      return this.$store.getters.posAttributes.currentPointOfSales.templateCustomer
    },
    popoverCreateBusinessParnet() {
      return this.$store.getters.getPopoverCreateBusinessParnet
    },
    copyShippingAddress: {
      get() {
        return this.$store.getters.getCopyShippingAddress
      },
      set(value) {
        this.$store.dispatch('changeCopyShippingAddress', value)
      }
    },
    getCodigo() {
      return this.$store.getters.getValueOfField({
        containerUuid: 'Business-Partner-Create',
        columnName: 'Value'
      })
    }
  },

  watch: {
    showField(value) {
      if (value) {
        setTimeout(() => {
          this.focusValue()
          this.defaultTemplateAddress(this.currentCustomerTemplatePointOfSales)
        }, 1500)
      }
    },
    getCodigo(value) {
      if (!this.isEmptyValue(value)) {
        this.$store.commit('updateValueOfField', {
          containerUuid: 'Business-Partner-Create',
          columnName: 'TaxID',
          value
        })
      }
    },
    copyShippingAddress(value) {
      this.checked = value
    }
  },

  methods: {
    getLookupList,
    isDisplayedField,
    isMandatoryField,
    isReadOnlyField,
    changeFieldShowedFromUser,
    actionCreate(commands) {
      if (commands.srcKey) {
        switch (commands.srcKey) {
          case 'enter':
            this.createBusinessParter()
            break
          case 'close':
            this.clearValues()
            break
        }
      }
    },
    focusValue() {
      this.$refs.Value[0].$children[0].$children[0].$children[1].$children[0].focus()
    },
    defaultTemplateAddress(customer) {
      if (this.isEmptyValue(customer)) {
        return
      }
      this.loadAddresses(customer.addresses[0], 'Shipping-Address')
      this.loadAddresses(customer.addresses[0], 'Billing-Address')
    },
    loadAddresses(address, containerUuid) {
      if (this.isEmptyValue(address)) {
        return
      }
      this.$store.commit('updateValuesOfContainer', {
        containerUuid,
        attributes: [{
          columnName: 'C_Country_ID_UUID',
          value: undefined
        }, {
          columnName: 'Postal',
          value: this.empty(address.postal_code)
        }, {
          columnName: 'C_Region_ID',
          value: !this.isEmptyValue(address.region) ? this.empty(address.region.id) : ''
        }, {
          columnName: 'C_Region_ID_UUID',
          value: !this.isEmptyValue(address.region) ? this.empty(address.region.uuid) : ''
        }, {
          columnName: 'DisplayColumn_C_Region_ID',
          value: !this.isEmptyValue(address.region) ? this.empty(address.region.name) : ''
        }, {
          columnName: 'C_City_ID',
          value: this.empty(address.city.id)
        }, {
          columnName: 'C_City_ID_UUID',
          value: this.empty(address.city.uuid)
        }, {
          columnName: 'DisplayColumn_C_City_ID',
          value: this.empty(address.city.name)
        }, {
          columnName: 'Address1',
          value: address.address_1
        }, {
          columnName: 'Address2',
          value: address.address_2
        }, {
          columnName: 'Address3',
          value: address.address_3
        }, {
          columnName: 'Address4',
          value: address.address_4
        }]
      })
    },
    empty(value) {
      if (this.isEmptyValue(value)) {
        return ''
      }
      return value
    },
    // TODO: Get locations values.
    createBusinessParter() {
      const values = this.datesForm(this.$store.getters.getValuesView({
        containerUuid: 'Business-Partner-Create',
        format: 'object'
      }))
      const billingAddress = this.billingAddress
      if (this.isEmptyValue(billingAddress.first_name)) {
        const region = this.$store.getters.getValueOfField({
          containerUuid: 'Billing-Address',
          columnName: 'DisplayColumn_C_Region_ID'
        })
        const city = this.$store.getters.getValueOfField({
          containerUuid: 'Billing-Address',
          columnName: 'DisplayColumn_C_City_ID'
        })
        billingAddress.first_name = region + '/' + city
      }
      const validateValueCustomer = this.$store.getters.getValueOfField({
        containerUuid: 'Business-Partner-Create',
        columnName: 'Value'
      })
      this.billingAddress.email = values.email
      this.billingAddress.phone = values.phone
      this.shippingAddress.phone = values.phone
      this.shippingAddress.email = values.email
      if (this.isEmptyValue(validateValueCustomer)) {
        this.$store.commit('updateValueOfField', {
          containerUuid: 'Business-Partner-Create',
          columnName: 'Value',
          value: values.taxId
        })
        values.value = values.taxId
      }
      values.additionalAttributes = [
        {
          key: 'IsTaxpayer',
          value: this.$store.getters.getValueOfField({
            containerUuid: 'Business-Partner-Create',
            columnName: 'IsTaxpayer'
          })
        },
        {
          key: 'PersonType',
          value: this.$store.getters.getValueOfField({
            containerUuid: 'Business-Partner-Create',
            columnName: 'PersonType'
          })
        }
      ]
      const createBillingAddress = this.addressForm(this.$store.getters.getValuesView({
        containerUuid: 'Billing-Address',
        format: 'object'
      }))

      let createShippingAddress = this.addressForm(this.$store.getters.getValuesView({
        containerUuid: 'Shipping-Address',
        format: 'object'
      }))
      if (this.copyShippingAddress) {
        createShippingAddress = {
          ...createBillingAddress
        }
      }
      values.addresses = [createBillingAddress, createShippingAddress]
      const emptyMandatoryFields = this.$store.getters.getFieldsListEmptyMandatory({
        containerUuid: this.containerUuid,
        formatReturn: 'name'
      })
      if (this.isEmptyValue(emptyMandatoryFields)) {
        this.isLoadingRecord = true
        const { value, taxId, duns, naics, name, lastName, description, addresses, additionalAttributes, phone, posUuid } = values
        createCustomer(
          value,
          taxId,
          duns,
          naics,
          name,
          lastName,
          description,
          addresses,
          additionalAttributes,
          phone,
          posUuid
        )
          .then(responseBPartner => {
            this.$store.commit('customer', responseBPartner)
            this.setBusinessPartner(responseBPartner)
            this.clearValues()
            this.$message({
              type: 'success',
              message: this.$t('form.pos.order.BusinessPartnerCreate.businessPartner'),
              duration: 1500,
              showClose: true
            })
          })
          .catch(error => {
            this.showsPopovers.isShowCreate = true
            this.$message({
              type: 'warning',
              message: error.message + 'Name',
              duration: 1500,
              showClose: true
            })
            console.warn(`Error create Business Partner. Message: ${error.message}, code ${error.code}.`)
          })
          .finally(() => {
            this.isLoadingRecord = false
          })
      } else {
        this.$message({
          type: 'warn',
          message: this.$t('notifications.mandatoryFieldMissing') + emptyMandatoryFields,
          duration: 1500,
          showClose: true
        })
      }
    },
    clearValues() {
      this.$store.dispatch('changePopover', false)
      this.showsPopovers.isShowCreate = false

      this.$store.dispatch('setDefaultValues', {
        containerUuid: this.containerUuid,
        panelType: this.panelType
      })
      this.clearAddresses('Location-Address-Create')
      this.clearAddresses('Shipping-Address')
      this.clearDataCustomer(this.containerUuid)
    },
    datesForm(values) {
      const valuesToSend = {}
      Object.keys(values).forEach(key => {
        const value = values[key]
        if (this.isEmptyValue(value)) {
          return
        }
        switch (key) {
          case 'Value':
            valuesToSend['value'] = value
            break
          case 'Name':
            valuesToSend['name'] = value
            break
          case 'Name2':
            valuesToSend['lastName'] = value
            break
          case 'TaxID':
            valuesToSend['taxId'] = value
            break
          case 'Phone':
            valuesToSend['phone'] = value
            break
          case 'EMail':
            valuesToSend['email'] = value
            break
        }
      })
      valuesToSend['posUuid'] = this.$store.getters.posAttributes.currentPointOfSales.uuid
      return valuesToSend
    },
    changeShipping(value) {
      this.$store.dispatch('changeCopyShippingAddress', value)
    },
    loadDataCustomer(customer, containerUuid) {
      this.$store.commit('updateValuesOfContainer', {
        containerUuid,
        attributes: [{
          columnName: 'Name',
          value: customer.name
        }, {
          columnName: 'Value',
          value: customer.value
        }, {
          columnName: 'TaxID',
          value: customer.value
        }]
      })
    },
    getCustomer(searchValue) {
      customer({
        searchValue
      })
        .then(response => {
          if (!this.isEmptyValue(response.uuid)) {
            this.billing = response.addresses.find(address => address.is_default_billing)
            this.shipping = response.addresses.find(address => address.is_default_shipping)
            this.loadAddresses(this.shipping, 'Shipping-Address')
            this.loadAddresses(this.billing, 'Location-Address-Create')
            this.loadDataCustomer(response, this.containerUuid)
            this.isExistingCustomer = true
            this.currentCustomer = response
            this.loading = false
          }
        })
        .catch(error => {
          console.warn(error)
          this.isExistingCustomer = false
        })
    },
    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'addFocusLost' && mutation.payload.columnName === 'Value' && !this.isEmptyValue(this.getCodigo) && mutation.payload.containerUuid === 'Business-Partner-Create') {
          this.getCustomer(this.getCodigo)
        }
      })
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
  .scroll-customer-create {
    max-height: 250px;
    max-width: 1000px;
  }
  .custom-button-create-bp {
    float: right;
    margin-right: 10px;
  }
</style>
