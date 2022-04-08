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
  <el-col :span="24">
    <el-card class="box-card" shadow="never" style="height: 400px;">
      <div slot="header" class="clearfix">
        <span>
          {{ $t('form.pos.order.BusinessPartnerCreate.address.addNewAddress') }}
        </span>
      </div>
      <div class="text item">
        <el-row>
          <field-location
            :ref="fieldsList[0].columnName"
            :metadata="fieldsList[0]"
            :value-model="fieldsList[0].value"
            :container-uuid="'New-Address'"
            :container-manager="{
              ...containerManager,
              getLookupList,
              isDisplayedField,
              isMandatoryField,
              isReadOnlyField,
              changeFieldShowedFromUser
            }"
          />
        </el-row>
      </div>
    </el-card>
    <el-row :gutter="24">
      <el-col :span="12" style="padding-left: 12px;padding-right: 12px;padding-bottom: 15px;">
        <samp style="padding-right: 10px;">
          <el-checkbox v-model="isBillingAddress">
            {{ $t('form.pos.order.BusinessPartnerCreate.address.billingAddress') }}
          </el-checkbox>
        </samp>
      </el-col>
      <el-col :span="12" style="padding-left: 12px;padding-right: 12px;padding-bottom: 15px;">
        <samp style="padding-right: 10px;">
          <el-checkbox v-model="isShippingAddress">
            {{ $t('form.pos.order.BusinessPartnerCreate.address.shippingAddress') }}
          </el-checkbox>
        </samp>
      </el-col>
      <el-col :span="24">
        <samp style="float: right; padding-right: 10px;">
          <el-button
            type="primary"
            class="custom-button-create-bp"
            icon="el-icon-check"
            @click="addNewAddress()"
          />
          <el-button
            type="danger"
            class="custom-button-create-bp"
            icon="el-icon-close"
            @click="close()"
          />
        </samp>
      </el-col>
    </el-row>
  </el-col>
</template>

<script>
// constants
import fieldsList from '@theme/components/ADempiere/Field/FieldLocation/fieldsList.js'

// components and mixins
import formMixin from '@theme/components/ADempiere/Form/formMixin.js'
import BParterMixin from './mixinBusinessPartner.js'
import FieldLocation from './AddNewFieldLocation'

// api request methods
import { updateCustomer, customer } from '@/api/ADempiere/form/point-of-sales.js'
import {
  getLookupList,
  isDisplayedField,
  isMandatoryField,
  isReadOnlyField,
  changeFieldShowedFromUser
} from '@theme/components/ADempiere/Form/VPOS/containerManagerPos.js'

export default {
  name: 'AddAddress',
  components: {
    FieldLocation
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
          uuid: 'New-Address',
          containerUuid: 'New-Address',
          fieldsList
        }
      }
    },
    showField: {
      type: Boolean,
      default: false
    },
    isUpdatedAddress: {
      type: Boolean,
      default: false
    },
    addressToUpdate: {
      type: Object,
      default: () => {}
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showsPopovers: {
      type: Boolean,
      default: false
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
      businessPartnerRecord: {},
      isLoadingRecord: false,
      fieldsList,
      checked: true,
      currentCustomer: {},
      isShippingAddress: false,
      isBillingAddress: false,
      isCustomForm: true
    }
  },
  computed: {
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
    getCodigo() {
      return this.$store.getters.getValueOfField({
        containerUuid: 'Business-Partner-Create',
        columnName: 'Value'
      })
    }
  },
  watch: {
    showCustomer(value) {
      this.getCustomer()
    },
    showsPopovers(value) {
      const templateCustomer = this.$store.getters.posAttributes.currentPointOfSales.templateCustomer
      if (value && this.isEmptyValue(this.addressToUpdate) && !this.isEmptyValue(templateCustomer)) {
        this.clearAddresses()
        this.loadAddresses(templateCustomer.addresses[0])
      } else if (value && !this.isEmptyValue(this.addressToUpdate)) {
        this.loadAddresses(this.addressToUpdate)
      }
    },
    isUpdatedAddress(value) {
      if (value && !this.isEmptyValue(this.addressToUpdate)) {
        this.loadAddresses(this.addressToUpdate)
      }
    }
  },
  // beforeDestroy() {
  //   this.unsubscribe()
  // },
  methods: {
    getLookupList,
    isDisplayedField,
    isMandatoryField,
    isReadOnlyField,
    changeFieldShowedFromUser,
    getCustomer() {
      this.$store.dispatch('changeCopyShippingAddress', false)
      customer({
        searchValue: this.getCodigo
      })
        .then(response => {
          this.currentCustomer = response
        })
    },
    loadAddresses(address) {
      this.$store.commit('updateValuesOfContainer', {
        containerUuid: 'Add-Location-Address',
        attributes: [{
          columnName: 'C_Country_ID',
          value: address.country_id
        }, {
          columnName: 'C_Country_ID_UUID',
          value: address.country_uuid
        }, {
          columnName: 'C_Region_ID',
          value: !this.isEmptyValue(address.region) ? address.region.id : ''
        }, {
          columnName: 'C_Region_ID_UUID',
          value: !this.isEmptyValue(address.region) ? address.region.uuid : ''
        }, {
          columnName: 'DisplayColumn_C_Region_ID',
          value: !this.isEmptyValue(address.region) ? address.region.name : ''
        }, {
          columnName: 'C_City_ID',
          value: this.isEmptyValue(address.city.id) ? '' : address.city.id
        }, {
          columnName: 'C_City_ID_UUID',
          value: this.isEmptyValue(address.city.uuid) ? '' : address.city.uuid
        }, {
          columnName: 'DisplayColumn_C_City_ID',
          value: this.isEmptyValue(address.city.name) ? '' : address.city.name
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
        }, {
          columnName: 'Postal',
          value: address.postal_code
        }, {
          columnName: 'Name',
          value: address.first_name
        }]
      })
    },
    clearAddresses() {
      this.$store.commit('updateValuesOfContainer', {
        containerUuid: 'Add-Location-Address',
        attributes: [{
          columnName: 'C_Country_ID',
          value: undefined
        }, {
          columnName: 'C_Region_ID',
          value: undefined
        }, {
          columnName: 'C_City_ID',
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
        }, {
          columnName: 'Postal',
          value: undefined
        }, {
          columnName: 'Name',
          value: undefined
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
            valuesToSend['country_uuid'] = value
            break
          case 'DisplayColumn_C_Country_ID':
            valuesToSend['country_name'] = value
            break
          case 'C_Region_ID_UUID':
            valuesToSend['region_uuid'] = value
            break
          case 'DisplayColumn_C_Region_ID':
            valuesToSend['region_name'] = value
            break
          case 'C_City_ID_UUID':
            valuesToSend['city_uuid'] = value
            break
          case 'DisplayColumn_C_City_ID':
            valuesToSend['city_name'] = value
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
            valuesToSend['postal_code'] = value
            break
        }
      })
      return valuesToSend
    },
    addNewAddress() {
      const values = this.addressForm(this.$store.getters.getValuesView({
        containerUuid: 'Add-Location-Address',
        format: 'object'
      }))
      let addresses
      const customer = this.$store.getters.posAttributes.currentPointOfSales.currentOrder.businessPartner
      if (this.isBillingAddress && this.isShippingAddress) {
        addresses = [
          {
            ...values,
            uuid: this.isEmptyValue(this.addressToUpdate) ? '' : this.addressToUpdate.uuid,
            is_default_billing: false,
            is_default_shipping: this.isShippingAddress
          },
          {
            ...values,
            is_default_billing: this.isBillingAddress,
            is_default_shipping: false
          }
        ]
      } else {
        addresses = [
          {
            ...values,
            uuid: this.isEmptyValue(this.addressToUpdate) ? '' : this.addressToUpdate.uuid,
            is_default_billing: this.isBillingAddress,
            is_default_shipping: this.isShippingAddress
          }
        ]
      }
      const newAddress = { uuid: customer.uuid, taxId: customer.taxId, name: customer.name, addresses, posUuid: this.$store.getters.posAttributes.currentPointOfSales.uuid }
      newAddress.uuid = this.isEmptyValue(customer.uuid) ? this.$store.getters.getValueOfField({ containerUuid: this.$route.meta.uuid, columnName: 'C_BPartner_ID_UUID' }) : customer.uuid
      newAddress.value = this.isEmptyValue(this.$store.getters.getNewCustomer.value) ? customer.value : this.$store.getters.getNewCustomer.value
      newAddress.name = customer.name
      updateCustomer(newAddress)
        .then(response => {
          const orderUuid = this.$store.getters.posAttributes.currentPointOfSales.currentOrder.uuid
          this.$store.dispatch('reloadOrder', { orderUuid })
          this.$message({
            type: 'success',
            showClose: true,
            message: this.$t('form.pos.order.BusinessPartnerCreate.address.saveAddress')
          })
        })
        .catch(error => {
          this.$message({
            type: 'error',
            showClose: true,
            message: error
          })
        })
        .finally(() => {
          this.close()
        })
    },
    close() {
      this.clearAddresses()
      this.$store.commit('setShowAddressUpdate', false)
      this.$store.dispatch('changeShowUpdateCustomer', false)
      this.$store.commit('setShowAddNewAddress', false)
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
