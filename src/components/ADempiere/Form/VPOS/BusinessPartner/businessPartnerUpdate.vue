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
  <el-main
    v-loading="loading"
    v-shortkey="showCustomer ? {close: ['esc'], enter: ['enter']} : {}"
    @shortkey.native="actionUpdate"
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
                v-for="(field) in datos"
                :ref="field.columnName"
                :key="field.columnName"
                :metadata-field="field"
              />
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <billing-address />
        <shipping-address />
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <samp style="float: right; padding-right: 10px;">
            <el-button
              type="primary"
              class="custom-button-create-bp"
              icon="el-icon-check"
              @click="update"
            />
            <el-button
              type="danger"
              class="custom-button-create-bp"
              icon="el-icon-close"
              @click="clearValues"
            />
          </samp>
        </el-col>
      </el-row>
    </el-form>
  </el-main>
</template>

<script>
import { updateCustomer, customer } from '@/api/ADempiere/form/point-of-sales.js'
import formMixin from '@/components/ADempiere/Form/formMixin.js'
import fieldsList from './fieldListUpdate.js'
import BParterMixin from './mixinBusinessPartner.js'
import BillingAddress from './billingAddress.vue'
import ShippingAddress from './shippingAddress.vue'
// import { getSequenceAsList } from '@/utils/ADempiere/location'
import { requestGetCountryDefinition } from '@/api/ADempiere/system-core.js'

export default {
  name: 'BusinessPartnerUpdate',
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
          uuid: 'Business-Partner-Update',
          containerUuid: 'Business-Partner-Update',
          fieldsList
        }
      }
    },
    showsPopovers: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      businessPartnerRecord: {},
      isLoadingRecord: false,
      fieldsList,
      isCustomForm: true,
      loading: true,
      index: 0,
      currentCustomer: {},
      region: {
        id: '',
        uuid: '',
        name: ''
      },
      unsubscribe: () => {}
    }
  },
  computed: {
    fieldsListLocation() {
      if (!this.isEmptyValue(this.$store.getters.getFieldLocation)) {
        return this.$store.getters.getFieldLocation
      }
      return this.fieldsList.filter(field => field.tabindex > 4)
    },
    datos() {
      return this.fieldsList.filter(field => field.tabindex <= 4)
    },
    currentBusinessPartner() {
      return this.$store.getters.posAttributes.currentPointOfSales.currentOrder.businessPartner
    },
    isTemplateOfCustomer() {
      return this.$store.getters.posAttributes.currentPointOfSales.currentOrder.businessPartner.id === this.$store.getters.posAttributes.currentPointOfSales.templateBusinessPartner.id
    },
    showCustomer() {
      return this.$store.getters.getShowUpdateCustomer
    },
    copyShippingAddress() {
      return this.$store.getters.getCopyShippingAddress
    }
  },
  watch: {
    showCustomer(value) {
      this.getCustomer()
    }
  },
  beforeDestroy() {
    this.unsubscribe()
  },
  methods: {
    requestGetCountryDefinition,
    actionUpdate(commands) {
      if (commands.srcKey) {
        switch (commands.srcKey) {
          case 'enter':
            this.update()
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
    update() {
      const values = this.$store.getters.getValuesView({
        containerUuid: 'Business-Partner-Update',
        format: 'object'
      })
      values.addresses = [this.billingAddress, this.shippingAddress]
      values.uuid = this.currentBusinessPartner.uuid
      values.posUuid = this.$store.getters.posAttributes.currentPointOfSales.uuid
      updateCustomer(values)
        .then(response => {
          this.$store.dispatch('changeShowUpdateCustomer', false)
        })
    },
    getCustomer() {
      this.$store.dispatch('changeCopyShippingAddress', false)
      customer({
        searchValue: this.currentBusinessPartner.value
      })
        .then(response => {
          const billing = response.addresses.find(address => address.is_default_billing)
          const shipping = response.addresses.find(address => address.is_default_shipping)
          this.loadAddresses(shipping, 'Shipping-Address')
          this.loadAddresses(billing, 'Billing-Address')
          this.loadDataCustomer(response, this.containerUuid)
          this.currentCustomer = response
          this.loading = false
        })
    },
    clearValues() {
      if (this.showsPopovers) {
        this.$store.dispatch('changeShowUpdateCustomer', false)
      }
      this.$store.dispatch('setDefaultValues', {
        containerUuid: this.containerUuid,
        panelType: this.panelType
      })
      this.clearAddresses('Billing-Address')
      this.clearAddresses('Shipping-Address')
      this.clearDataCustomer(this.containerUuid)
    },
    loadAddresses(address, containerUuid) {
      if (this.isEmptyValue(address)) {
        return
      }
      this.$store.commit('updateValuesOfContainer', {
        containerUuid,
        attributes: [{
          columnName: 'Name',
          value: address.last_name
        }, {
          columnName: 'Description',
          value: address.description
        }, {
          columnName: 'Name2',
          value: address.first_name
        }, {
          columnName: 'Phone',
          value: address.phone
        }, {
          columnName: 'EMail',
          value: address.email
        }, {
          columnName: 'ContactName',
          value: address.contact_name
        }, {
          columnName: 'C_Country_ID_UUID',
          value: undefined
        }, {
          columnName: 'Postal',
          value: address.postal_code
        }, {
          columnName: 'C_Region_ID',
          value: address.region.id
        }, {
          columnName: 'C_Region_ID_UUID',
          value: address.region.uuid
        }, {
          columnName: 'DisplayColumn_C_Region_ID',
          value: address.region.name
        }, {
          columnName: 'C_City_ID',
          value: address.city.id
        }, {
          columnName: 'C_City_ID_UUID',
          value: address.city.uuid
        }, {
          columnName: 'DisplayColumn_C_City_ID',
          value: address.city.name
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
        }, {
          columnName: 'Name2',
          value: customer.last_name
        }]
      })
    },
    addressForm(values) {
      const valuesToSend = {}
      Object.keys(values).forEach(key => {
        const value = values[key]
        if (this.isEmptyValue(value)) {
          return
        }
        switch (key) {
          case 'Name':
            valuesToSend['last_name'] = value
            break
          case 'Name2':
            valuesToSend['first_name'] = value
            break
          case 'Description':
            valuesToSend['description'] = value
            break
          case 'EMail':
            valuesToSend['email'] = value
            break
          case 'Phone':
            valuesToSend['phone'] = value
            break
          case 'ContactName':
            valuesToSend['contact_name'] = value
            break
          case 'C_Country_ID_UUID':
            valuesToSend['countryUuid'] = value
            break
          case 'C_Region_ID_UUID':
            valuesToSend['regionUuid'] = value
            break
          case 'DisplayColumn_C_Region_ID':
            valuesToSend['regionName'] = value
            break
          case 'C_City_ID_UUID':
            valuesToSend['cityUuid'] = value
            break
          case 'DisplayColumn_C_City_ID':
            valuesToSend['cityName'] = value
            break
          case 'Address1':
            valuesToSend['address1'] = value
            break
          case 'Address2':
            valuesToSend['address2'] = value
            break
          case 'Address3':
            valuesToSend['address3'] = value
            break
          case 'Address4':
            valuesToSend['address4'] = value
            break
          case 'Postal':
            valuesToSend['postalCode'] = value
            break
        }
      })
      return valuesToSend
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
        }
      })
      valuesToSend['posUuid'] = this.$store.getters.posAttributes.currentPointOfSales.uuid
      return valuesToSend
    },
    clearLocationValues() {
      this.$store.commit('updateValuesOfContainer', {
        containerUuid: this.containerUuid,
        attributes: [{
          columnName: 'C_Location_ID',
          value: undefined
        }, {
          columnName: 'DisplayColumn_C_Location_ID',
          value: undefined
        }, {
          columnName: 'C_Country_ID',
          value: undefined
        }, {
          columnName: 'C_Country_ID_UUID',
          value: undefined
        }, {
          columnName: 'DisplayColumn_C_Country_ID',
          value: undefined
        }, {
          columnName: 'C_Region_ID',
          value: undefined
        }, {
          columnName: 'C_Region_ID_UUID',
          value: undefined
        }, {
          columnName: 'DisplayColumn_C_Region_ID',
          value: undefined
        }, {
          columnName: 'C_City_ID',
          value: undefined
        }, {
          columnName: 'C_City_ID_UUID',
          value: undefined
        }, {
          columnName: 'DisplayColumn_C_City_ID',
          value: undefined
        }, {
          columnName: 'Address1',
          value: undefined
        }, {
          columnName: 'Address2',
          value: undefined
        }, {
          columnName: 'Address3',
          value: undefined
        }, {
          columnName: 'Address4',
          value: undefined
        }]
      })
      this.$store.dispatch('changeShowUpdateCustomer', false)
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
  .custom-button-create-bp {
    float: right;
    margin-right: 10px;
  }
</style>
