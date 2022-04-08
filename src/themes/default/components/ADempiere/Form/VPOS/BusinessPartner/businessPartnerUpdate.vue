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
    v-shortkey="showCustomer ? { close: ['esc'], enter: ['enter'] } : {}"
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
                v-for="(field) in fieldsList"
                :ref="field.columnName"
                :key="field.columnName"
                :metadata-field="{
                  ...field,
                  isReadOnly: validateCustomerTemplate
                }"
                :container-uuid="'Business-Partner-Update'"
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
      <el-row :gutter="12">
        <el-scrollbar wrap-class="scroll-child">
          <el-col v-for="(address) in currentCustomer.addresses" :key="address.uuid" :span="8">
            <el-card
              :body-style="{ padding: '10px' }"
              shadow="never"
              :style="(currentAddressSelect === address.first_name) ? 'border: 2px solid #36a3f7;min-height: 300px;max-height: 300px;padding: 20px;' : 'min-height: 300px;max-height: 300px;padding: 10px;'"
            >
              <div slot="header" class="clearfix">
                <span style="font-size: 16px;font-weight: bold;">{{ address.first_name }}</span>
                <el-button
                  style="float: right; padding: 3px 0"
                  type="text"
                  @click="openEditAddress(address)"
                >
                  Editar
                </el-button>
              </div>
              <el-scrollbar wrap-class="scroll-customer-description">
                <el-descriptions class="margin-top" :title="$t('form.pos.order.BusinessPartnerCreate.address.managementDescription')" :column="1">
                  <el-descriptions-item :label="$t('form.pos.order.BusinessPartnerCreate.address.addressType')">
                    <el-tag size="small" :type="typeTag(address)">
                      {{ labelDirecction(address) }}
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item :label="$t('form.pos.order.BusinessPartnerCreate.address.region')">
                    {{ labelAddress(address.region) }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$t('form.pos.order.BusinessPartnerCreate.address.city')">
                    {{ labelAddress(address.city) }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$t('form.pos.order.BusinessPartnerCreate.address.address')">
                    {{ address.address_1 }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$t('form.pos.order.BusinessPartnerCreate.address.postCode')">
                    {{ address.postal_code }}
                  </el-descriptions-item>
                </el-descriptions>
              </el-scrollbar>
            </el-card>
          </el-col>
        </el-scrollbar>
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
    <el-dialog
      :title="$t('form.pos.order.BusinessPartnerCreate.address.editAddress')"
      :visible.sync="showAddressUpdate"
      :modal="false"
      :before-close="handleClose"
    >
      <add-address
        :is-updated-address="showAddressUpdate"
        :address-to-update="addressUpdate"
        :shows-popovers="showAddressUpdate"
      />
    </el-dialog>
  </el-main>
</template>

<script>
import { updateCustomer, customer } from '@/api/ADempiere/form/point-of-sales.js'
import formMixin from '@theme/components/ADempiere/Form/formMixin.js'
import fieldsList from './fieldListUpdate.js'
import BParterMixin from './mixinBusinessPartner.js'
import AddAddress from './addAddress.vue'
import { requestGetCountryDefinition } from '@/api/ADempiere/system-core.js'
import {
  getLookupList,
  isDisplayedField,
  isMandatoryField,
  isReadOnlyField,
  changeFieldShowedFromUser
} from '@theme/components/ADempiere/Form/VPOS/containerManagerPos.js'

export default {
  name: 'BusinessPartnerUpdate',
  components: {
    AddAddress
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
    containerManager: {
      type: Object,
      default: () => ({
        actionPerformed: () => {},
        getFieldsLit: () => {},
        setDefaultValues: () => {}
      })
    },
    showsPopovers: {
      type: Boolean,
      default: false
    },
    currentAddressSelect: {
      type: String,
      default: ''
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
      isShowModal: false,
      isShowEditAddress: false,
      addressUpdate: {},
      currentCustomer: {},
      shipping: {
        uuid: ''
      },
      billing: {
        uuid: ''
      },
      region: {
        id: '',
        uuid: '',
        name: ''
      }
    }
  },
  computed: {
    showAddNewAddress: {
      get() {
        return this.$store.getters.getShowAddNewAddress
      },
      set(value) {
        this.$store.commit('setShowAddNewAddress', value)
        return value
      }
    },
    showAddressUpdate: {
      get() {
        return this.$store.getters.getShowAddressUpdate
      },
      set(value) {
        this.$store.commit('setShowAddNewAddress', value)
        return value
      }
    },
    showPanelAddress: {
      get() {
        return this.$store.getters.getShowPanelAddress
      },
      set(value) {
        this.$store.commit('setShowPanelAddress', value)
        return value
      }
    },
    fieldsListLocation() {
      if (!this.isEmptyValue(this.$store.getters.getFieldLocation)) {
        return this.$store.getters.getFieldLocation
      }
      return this.fieldsList.filter(field => field.tabindex > 4)
    },
    datos() {
      return this.fieldsList.filter(field => field.tabindex <= 4)
    },
    recordsBusinessPartners() {
      return this.$store.getters.getBusinessPartnersList
    },
    currentBusinessPartner() {
      const customer = this.$store.getters.posAttributes.currentPointOfSales.currentOrder
      const searchCustomer = this.$store.getters.getValueOfField({
        containerUuid: this.$route.meta.uuid,
        columnName: 'C_BPartner_ID' // this.parentMetadata.columnName
      })
      if (this.isEmptyValue(customer.businessPartner)) {
        const templateBusinessPartners = this.recordsBusinessPartners.find(businessPartners => businessPartners.id === searchCustomer)
        if (this.isEmptyValue(templateBusinessPartners)) {
          return ''
        }
        return templateBusinessPartners
      }
      return customer.businessPartner
    },
    isTemplateOfCustomer() {
      const currentOrder = this.$store.getters.posAttributes.currentPointOfSales.currentOrder
      if (!this.isEmptyValue(currentOrder.listPayments.payments)) {
        return !this.isEmptyValue(currentOrder.listPayments.payments)
      }
      return currentOrder.businessPartner.id === this.$store.getters.posAttributes.currentPointOfSales.templateCustomer.id
    },
    showCustomer() {
      return this.$store.getters.getShowUpdateCustomer
    },
    showUpdate() {
      return this.$store.getters.getShowUpdateCustomer
    },
    copyShippingAddress() {
      return this.$store.getters.getCopyShippingAddress
    },
    validateCustomerTemplate() {
      const templateCustomer = this.$store.getters.posAttributes.currentPointOfSales.templateCustomer
      if (this.isEmptyValue(templateCustomer) || this.isEmptyValue(this.currentBusinessPartner)) {
        return false
      }
      return templateCustomer.value === this.currentBusinessPartner.value
    }
  },
  watch: {
    showCustomer(value) {
      this.getCustomer()
    }
  },
  methods: {
    getLookupList,
    isDisplayedField,
    isMandatoryField,
    isReadOnlyField,
    changeFieldShowedFromUser,
    requestGetCountryDefinition,
    handleClose() {
      this.$store.commit('setShowAddNewAddress', false)
    },
    closePanelAddress() {
      this.isShowModal = false
      this.showPanelAddress = false
    },
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
      const values = this.datesForm(this.$store.getters.getValuesView({
        containerUuid: 'Business-Partner-Update',
        format: 'object'
      }))
      this.shippingAddress.uuid = this.isEmptyValue(this.shipping) ? '' : this.shipping.uuid
      this.billingAddress.uuid = this.isEmptyValue(this.billing) ? '' : this.billing.uuid
      this.billingAddress.email = values.email
      this.billingAddress.phone = values.phone
      this.shippingAddress.email = values.email
      this.shippingAddress.phone = values.phone
      values.addresses = [this.billingAddress, this.shippingAddress]
      values.uuid = this.$store.getters.getValueOfField({
        containerUuid: this.$route.meta.uuid,
        columnName: 'C_BPartner_ID_UUID' // this.parentMetadata.columnName
      })
      values.taxId = values.value
      values.additionalAttributes = [
        {
          key: 'IsTaxpayer',
          value: this.$store.getters.getValueOfField({
            containerUuid: 'Business-Partner-Update',
            columnName: 'IsTaxpayer'
          })
        },
        {
          key: 'PersonType',
          value: this.$store.getters.getValueOfField({
            containerUuid: 'Business-Partner-Update',
            columnName: 'PersonType'
          })
        }
      ]
      values.posUuid = this.$store.getters.posAttributes.currentPointOfSales.uuid
      updateCustomer(values)
        .then(response => {
          this.$store.dispatch('changeShowUpdateCustomer', false)
        })
    },
    getCustomer() {
      this.$store.dispatch('changeCopyShippingAddress', false)
      const displayCustomer = this.$store.getters.getValueOfField({
        containerUuid: this.$route.meta.uuid,
        columnName: 'DisplayColumn_C_BPartner_ID' // this.parentMetadata.columnName
      }).split(['-'])
      const searchValue = this.isEmptyValue(this.currentBusinessPartner.value) ? displayCustomer[0] : this.currentBusinessPartner.value
      customer({
        searchValue
      })
        .then(response => {
          this.billing = response.addresses.find(address => address.is_default_billing)
          this.shipping = response.addresses.find(address => address.is_default_shipping)
          this.loadAddresses(this.shipping, 'Shipping-Address')
          this.loadAddresses(this.billing, 'Billing-Address')
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
          value: address.first_name
        }, {
          columnName: 'Description',
          value: address.description
        }, {
          columnName: 'Phone',
          value: address.phone
        }, {
          columnName: 'EMail',
          value: address.email
        }, {
          columnName: 'ContactName',
          value: this.empty(address.contact_name)
        }, {
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
    loadDataCustomer(customer, containerUuid) {
      this.$store.commit('updateValuesOfContainer', {
        containerUuid,
        attributes: [{
          columnName: 'Name',
          value: customer.name
        }, {
          columnName: 'Name2',
          value: customer.lastName
        }, {
          columnName: 'EMail',
          value: this.isEmptyValue(customer.addresses) ? '' : customer.addresses[0].email
        }, {
          columnName: 'Phone',
          value: this.isEmptyValue(customer.addresses) ? '' : this.isEmptyValue(customer.addresses[0].phone) ? (this.isEmptyValue(customer.addresses[1]) ? '' : customer.addresses[1].phone) : customer.addresses[0].phone
        }, {
          columnName: 'Value',
          value: customer.value
        }, {
          columnName: 'TaxID',
          value: customer.value
        }, {
          columnName: 'PersonType_ID',
          value: this.isEmptyValue(customer.additionalAttributes) ? '' : customer.additionalAttributes.PersonType
        }, {
          columnName: 'PersonType',
          value: this.isEmptyValue(customer.additionalAttributes) ? '' : customer.additionalAttributes.PersonType
        }, {
          columnName: 'IsTaxpayer',
          value: this.isEmptyValue(customer.additionalAttributes) ? false : customer.additionalAttributes.IsTaxpayer
        }]
      })
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
    },
    labelDirecction(value) {
      if (value.is_default_billing) {
        return this.$t('form.pos.order.BusinessPartnerCreate.billingAddress')
      } else if (value.is_default_shipping) {
        return this.$t('form.pos.order.BusinessPartnerCreate.shippingAddress')
      }
      return this.$t('form.pos.order.BusinessPartnerCreate.withoutSetting')
    },
    typeTag(value) {
      if (value.is_default_billing) {
        return 'success'
      } else if (value.is_default_shipping) {
        return ''
      }
      return 'warning'
    },
    labelAddress(address) {
      if (!this.isEmptyValue(address) && !this.isEmptyValue(address.name)) {
        return address.name
      }
      return ''
    },
    openEditAddress(address) {
      this.showPanelAddress = true
      this.isShowModal = true
      this.$store.commit('setShowAddressUpdate', true)
      this.$store.commit('setShowPanelAddress', true)
      this.addressUpdate = address
      this.loadAddresses(address, 'Add-Location-Address')
      this.$store.commit('updateValueOfField', {
        containerUuid: 'Add-Location-Address',
        columnName: 'C_Country_ID',
        value: address.country_id
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
  .custom-button-create-bp {
    float: right;
    margin-right: 10px;
  }
  .scroll-customer-description {
    max-height: 150px;
  }
</style>
