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
  <el-form-item>
    <template slot="label">
      {{ $t('form.pos.order.BusinessPartnerCreate.businessPartner') }}
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <svg-icon icon-class="tree-table" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <el-popover
              v-model="popoverCreateBusinessParnet"
              placement="left-start"
              width="900"
              trigger="click"
              style="padding: 0px"
            >
              <el-scrollbar wrap-class="scroll-child">
                <business-partner-create
                  :parent-metadata="parentMetadata"
                  :show-field="popoverCreateBusinessParnet"
                  :is-visible-address="isVisibleAddress"
                />
              </el-scrollbar>
              <br>
              <el-row :gutter="24">
                <el-col :span="24" style="padding-left: 12px;padding-right: 12px;padding-bottom: 15px;">
                  <samp style="float: right; padding-right: 10px;">
                    <el-checkbox v-model="isVisibleAddress">
                      {{ $t('form.pos.order.BusinessPartnerCreate.addBillingAddress') }}
                    </el-checkbox>
                    <el-checkbox v-model="copyShippingAddress" @change="changeShipping">
                      {{ $t('form.byInvoice.copyShippingAddress') }}
                    </el-checkbox>
                  </samp>
                </el-col>
                <el-col :span="24">
                  <samp style="float: right; padding-right: 10px;">
                    <el-button
                      type="danger"
                      class="custom-button-create-bp"
                      icon="el-icon-close"
                      @click="clearValues()"
                    />
                    <el-button
                      type="primary"
                      class="custom-button-create-bp"
                      icon="el-icon-check"
                      @click="createBusinessParter"
                    />
                  </samp>
                </el-col>
              </el-row>
              <el-button
                slot="reference"
                type="text"
                :disabled="isDisabled"
              >
                <i
                  class="el-icon-plus"
                  style="font-size: 20px"
                />
                Crear Nuevo Socio de Negocio
              </el-button>
            </el-popover>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-popover
              v-model="popoverListBusinessParnet"
              placement="left-start"
              width="900"
              trigger="click"
            >
              <business-partners-list
                :parent-metadata="parentMetadata"
                :shows-popovers="showsPopovers"
                :show-field="popoverListBusinessParnet"
                :is-disabled="isDisabled"
              />
              <el-button
                slot="reference"
                type="text"
              >
                <i
                  class="el-icon-search"
                  style="font-size: 20px"
                />
                Listar Socio de Negocio
              </el-button>
            </el-popover>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-popover
              v-if="!isEmptyValue(this.$store.getters.posAttributes.currentPointOfSales.currentOrder.uuid)"
              v-model="showUpdate"
              placement="left-start"
              width="950"
              trigger="click"
              style="padding: 0px; margin: 0px"
            >
              <business-partner-update
                :shows-popovers="showUpdate"
                :current-address-select="selectAddress.first_name"
              />
              <el-button
                slot="reference"
                type="text"
                :disabled="isDisabled"
              >
                <i
                  class="el-icon-edit"
                  style="font-size: 22px"
                />
                Actualizar Socio de Negocio
              </el-button>
            </el-popover>
          </el-dropdown-item>
          <el-dropdown-item v-show="!isEmptyValue(this.$store.getters.posAttributes.currentPointOfSales.currentOrder.uuid)">
            <el-popover
              v-model="showAddNewAddress"
              placement="left-start"
              width="900"
              trigger="click"
            >
              <el-row>
                <el-col :span="24">
                  <add-address
                    v-if="showAddNewAddress"
                    :shows-popovers="showAddNewAddress"
                    :address-to-update="selectCustomerValue"
                  />
                </el-col>
              </el-row>
              <el-button
                slot="reference"
                type="text"
                :disabled="isDisabled"
              >
                <i
                  class="el-icon-add-location"
                  style="font-size: 22px"
                />
                {{ $t('form.pos.order.BusinessPartnerCreate.address.addNewAddress') }}
              </el-button>
            </el-popover>
          </el-dropdown-item>
          <el-dropdown-item v-show="!isEmptyValue(listAddressCustomer)" style="padding-bottom: 10px;padding-top: 10px;">
            <el-dropdown trigger="click" @command="handleCommandAddress">
              <span class="el-dropdown-link" style="color: #46A6FF;padding-bottom: 10px;padding-top: 10px;">
                <i
                  class="el-icon-location-information"
                  style="font-size: 22px"
                />
                {{ $t('form.pos.order.BusinessPartnerCreate.address.selectAddress') }}
                <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(item, index) in listAddressCustomer" :key="index" :command="item" style="color: #46A6FF">
                  <i
                    class="el-icon-map-location"
                    style="font-size: 22px"
                  />
                  {{ item.first_name }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </template>

    <el-autocomplete
      ref="displayBPartner"
      v-model="displayedValue"
      :placeholder="$t('quickAccess.searchWithEnter')"
      :fetch-suggestions="localSearch"
      value-key="name"
      style="width: 100%;"
      popper-class="custom-field-bpartner-info"
      :disabled="isDisabled"
      :trigger-on-focus="false"
      :select-when-unmatched="false"
      @clear="setBusinessPartner(blankBPartner, false)"
      @keyup.enter.native="getBPartnerWithEnter"
      @select="handleSelect"
      @focus="setNewDisplayedValue"
      @blur="setOldDisplayedValue"
    >
      <template
        slot="prefix"
      >
        <i
          class="el-icon-user-solid el-input__icon"
        />
      </template>

      <template slot-scope="props">
        <div class="header">
          <b>{{ props.item.name }} </b>
        </div>
        <span class="info">
          {{ props.item.value }}
        </span>
      </template>
    </el-autocomplete>
  </el-form-item>
</template>

<script>
/**
 * This component is made to be the prototype of the Business Partner search field
 * TODO: Before creating you must make a search for all the filled fields.
 */
import { requestGetBusinessPartner } from '@/api/ADempiere/system-core.js'
import BusinessPartnerCreate from './businessPartnerCreate.vue'
import BusinessPartnerUpdate from './businessPartnerUpdate'
import { createCustomer } from '@/api/ADempiere/form/point-of-sales.js'
import AddAddress from './addAddress'
// import FieldListBusinessPartner from './fieldBusinessPartners/index'
import BusinessPartnersList from './businessPartnersList'
import BParterMixin from './mixinBusinessPartner.js'

// api request methods

// utils and helper methods
const { setBusinessPartner } = BParterMixin.methods
const { searchBPartnerList } = BusinessPartnersList.methods
import { trimPercentage } from '@/utils/ADempiere/valueFormat.js'

/**
 * This component is made to be the prototype of the Business Partner search field
 * TODO: Before creating you must make a search for all the filled fields.
 */
export default {
  name: 'FieldBusinessPartner',

  components: {
    BusinessPartnerCreate,
    BusinessPartnersList,
    BusinessPartnerUpdate,
    AddAddress
    // FieldListBusinessPartner
  },
  mixins: [
    BParterMixin
  ],
  props: {
    parentMetadata: {
      type: Object,
      default: () => {}
    },
    showsPopovers: {
      type: Object,
      default: () => {
        return {
          isShowCreate: false,
          isShowList: false
        }
      }
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      controlDisplayed: this.displayedValue,
      timeOut: null,
      showFieldCreate: false,
      showFieldList: false,
      showCreate: false,
      visible: false,
      selectAddress: {},
      labelAddress: '',
      visibleAddress: false,
      customerValue: '',
      oldValueCustomer: '',
      visibleSelectAddress: false,
      selectCustomerValue: {},
      isVisibleAddress: false,
      editBusinessPartner: false
    }
  },

  computed: {
    copyShippingAddress: {
      get() {
        return this.$store.getters.getCopyShippingAddress
      },
      set(value) {
        this.$store.dispatch('changeCopyShippingAddress', value)
      }
    },
    value: {
      get() {
        return this.$store.getters.getValueOfField({
          containerUuid: this.parentMetadata.containerUuid,
          columnName: 'C_BPartner_ID' // this.parentMetadata.columnName
        })
      },
      set(value) {
        this.$store.commit('updateValueOfField', {
          containerUuid: this.parentMetadata.containerUuid,
          columnName: 'C_BPartner_ID', // this.parentMetadata.columnName,
          value
        })
      }
    },
    listAddress() {
      if (!this.isEmptyValue(this.templateCustomer) && this.templateCustomer.uuid !== this.orderCustomer.uud) {
        return this.orderCustomer.addresses
      }
      return []
    },
    listAddressCustomer() {
      if (!this.isEmptyValue(this.orderCustomer.addresses)) {
        return this.orderCustomer.addresses
      }
      return []
    },
    displayedValue: {
      get() {
        const display = this.$store.getters.getValueOfField({
          containerUuid: this.parentMetadata.containerUuid,
          columnName: 'DisplayColumn_C_BPartner_ID' // this.parentMetadata.displayColumnName
        })
        if (this.isEmptyValue(this.oldValueCustomer) && !this.isEmptyValue(this.newCustomer) && !this.editBusinessPartner && this.isEmptyValue(this.$store.getters.posAttributes.currentPointOfSales.currentOrder.uuid)) {
          return this.newCustomer.value + this.newCustomer.name
        }
        if (this.isEmptyValue(this.$store.getters.posAttributes.currentPointOfSales.currentOrder.uuid)) {
          if (!this.isEmptyValue(this.oldValueCustomer) && !this.isEmptyValue(this.$refs.displayBPartner) && !this.$refs.displayBPartner.$refs.input.focused) {
            return this.oldValueCustomerData + this.displayAddress(this.selectAddress.first_name)
          }
          if (!this.isEmptyValue(this.$refs.displayBPartner) && !this.$refs.displayBPartner.$refs.input.focused) {
            return this.templateCustomerData + this.displayAddress(this.selectAddress.first_name)
          }
          return display
        } else {
          if (!this.isEmptyValue(this.oldValueCustomer) && !this.isEmptyValue(this.$refs.displayBPartner) && !this.$refs.displayBPartner.$refs.input.focused) {
            return this.oldValueCustomerData + this.displayAddress(this.selectAddress.first_name)
          }
          if (!this.isEmptyValue(this.$refs.displayBPartner) && !this.$refs.displayBPartner.$refs.input.focused) {
            return this.orderCustomerData + this.displayAddress(this.selectAddress.first_name)
          }
          return display
        }
      },
      set(value) {
        this.$store.commit('updateValueOfField', {
          containerUuid: this.parentMetadata.containerUuid,
          columnName: 'DisplayColumn_C_BPartner_ID',
          value
        })
      }
    },
    newCustomer() {
      return this.$store.getters.getNewCustomer
    },
    templateCustomer() {
      const templateCustomer = this.$store.getters.posAttributes.currentPointOfSales.templateCustomer
      if (this.isEmptyValue(templateCustomer)) {
        return {
          value: '',
          name: ''
        }
      }
      return templateCustomer
    },
    templateCustomerData() {
      return this.templateCustomer.value + ' - ' + this.templateCustomer.name
    },
    orderCustomer() {
      return this.$store.getters.posAttributes.currentPointOfSales.currentOrder.businessPartner
    },
    orderCustomerData() {
      return this.orderCustomer.value + ' - ' + this.orderCustomer.name
    },
    oldValueCustomerData() {
      return this.oldValueCustomer.value + ' - ' + this.oldValueCustomer.name
    },
    recordsBusinessPartners() {
      return this.$store.getters.getBusinessPartnersList
    },
    blankBPartner() {
      return {
        uuid: undefined,
        id: undefined,
        name: undefined,
        value: undefined
      }
    },
    currentOrder() {
      const customer = this.$store.getters.posAttributes.currentPointOfSales.currentOrder
      if (this.isEmptyValue(customer.businessPartner.value)) {
        return this.$store.getters.getValueOfField({
          containerUuid: this.parentMetadata.containerUuid,
          columnName: 'C_BPartner_ID' // this.parentMetadata.columnName
        })
      }
      return customer
    },
    popoverCreateBusinessParnet: {
      get() {
        return this.$store.getters.getPopoverCreateBusinessParnet
      },
      set(value) {
        this.$store.commit('popoverCreateBusinessPartner', value)
        return value
      }
    },
    popoverListBusinessParnet: {
      get() {
        return this.$store.getters.getPopoverListBusinessParnet
      },
      set(value) {
        this.$store.dispatch('changePopoverListBusinessPartner', value)
        return value
      }
    },
    showUpdateCustomer() {
      return this.$store.getters.getShowUpdateCustomer
    },
    showAddNewAddress: {
      get() {
        return this.$store.getters.getShowAddNewAddress
      },
      set(value) {
        if (!value) {
          this.$store.commit('setShowAddressUpdate', value)
        }
        this.$store.commit('setShowAddNewAddress', value)
        return value
      }
    },
    showUpdate: {
      get() {
        if (!this.$store.getters.getShowUpdateCustomer && this.$store.getters.getShowAddressUpdate) {
          return true
        }
        return this.$store.getters.getShowUpdateCustomer
      },
      set(value) {
        this.$store.dispatch('changeShowUpdateCustomer', value)
        return value
      }
    },
    updatedCustomerValue() {
      return this.$store.getters.posAttributes.currentPointOfSales.currentOrder.businessPartner.value
    }
    // copyShippingAddress() {
    //   return this.$store.getters.getCopyShippingAddress
    // }
  },

  watch: {
    popoverListBusinessParnet(value) {
      if (!value) {
        this.$store.commit('updateValuesOfContainer', {
          containerUuid: 'Business-Partner-List',
          attributes: [{
            columnName: 'Code',
            value: undefined
          }, {
            columnName: 'Value',
            value: undefined
          }, {
            columnName: 'Name',
            value: undefined
          }, {
            columnName: 'EMail',
            value: undefined
          }, {
            columnName: 'Phone',
            value: undefined
          }]
        })
      }
    },
    popoverCreateBusinessParnet(value) {
      this.showCreate = value
    },
    showUpdateCustomer(value) {
      this.visible = value
    },
    updatedCustomerValue(value) {
      if (!this.isEmptyValue(value)) {
        this.customerValue = value
      }
    }
  },

  methods: {
    setBusinessPartner,
    searchBPartnerList,
    displayAddress(address) {
      if (!this.isEmptyValue(address)) {
        return ' - ' + address
      }
      return ''
    },
    changeShipping(value) {
      this.$store.dispatch('changeCopyShippingAddress', value)
    },
    clearValues() {
      this.$store.dispatch('changePopover', false)

      this.$store.dispatch('setDefaultValues', {
        containerUuid: this.containerUuid,
        panelType: this.panelType
      })
      this.clearAddresses('Location-Address-Create')
      this.clearAddresses('Shipping-Address')
      this.clearDataCustomer(this.containerUuid)
      this.$store.commit('updateValuesOfContainer', {
        containerUuid: 'Business-Partner-Create',
        attributes: [{
          columnName: 'Name',
          value: undefined
        }, {
          columnName: 'Name2',
          value: undefined
        }, {
          columnName: 'Value',
          value: undefined
        }, {
          columnName: 'TaxID',
          value: undefined
        }, {
          columnName: 'Phone',
          value: undefined
        }, {
          columnName: 'EMail',
          value: undefined
        }, {
          columnName: 'IsTaxpayer',
          value: undefined
        }, {
          columnName: 'PersonType',
          value: undefined
        }]
      })
    },
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
      const createBillingAddress = this.addressForm(this.$store.getters.getValuesView({
        containerUuid: 'Billing-Address',
        format: 'object'
      }))
      createBillingAddress.is_default_billing = true
      createBillingAddress.is_default_shipping = false
      let createShippingAddress = this.addressForm(this.$store.getters.getValuesView({
        containerUuid: 'Shipping-Address',
        format: 'object'
      }))
      createShippingAddress = {
        ...createShippingAddress,
        is_default_billing: true,
        is_default_shipping: false
      }
      if (this.copyShippingAddress) {
        createShippingAddress = {
          ...createBillingAddress,
          is_default_shipping: true
        }
      }
      values.addresses = [createBillingAddress, createShippingAddress]
      const emptyMandatoryFields = this.$store.getters.getFieldsListEmptyMandatory({
        containerUuid: 'Business-Partner-Create',
        formatReturn: 'name'
      })
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
      if (this.isEmptyValue(emptyMandatoryFields)) {
        this.isLoadingRecord = true
        const { value, taxId, duns, naics, name, lastName, description, addresses, phone, posUuid, additionalAttributes } = values
        this.$message({
          message: this.$t('notifications.actionToTake'),
          showClose: true
        })
        // actionToTake
        this.$store.commit('popoverCreateBusinessPartner', false)
        createCustomer({
          value,
          taxId,
          duns,
          naics,
          name,
          lastName,
          description,
          additionalAttributes,
          addresses,
          phone,
          posUuid
        })
          .then(responseBPartner => {
            this.$store.commit('customer', responseBPartner)
            // TODO: Add new record into vuex store.
            this.setBusinessPartner(responseBPartner)
            this.clearValues()
            this.$message({
              type: 'success',
              message: this.$t('form.pos.order.BusinessPartnerCreate.successfullyCreated'),
              duration: 1500,
              showClose: true
            })
          })
          .catch(error => {
            this.$store.commit('popoverCreateBusinessPartner', true)
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
          case 'PersonType':
            valuesToSend['PersonType'] = value
        }
      })
      valuesToSend['posUuid'] = this.$store.getters.posAttributes.currentPointOfSales.uuid
      return valuesToSend
    },
    handleCommandAddress(address) {
      this.selectAddress = address
    },
    closeAddress() {
      this.visibleAddress = !this.visibleAddress
    },
    handleCustomerAddress(address) {
      this.labelAddress = address
    },
    setNewDisplayedValue() {
      this.customerValue = ''
      this.editBusinessPartner = true
      this.visibleSelectAddress = false
      const displayValue = this.displayedValue
      if (this.controlDisplayed !== displayValue) {
        this.controlDisplayed = displayValue
      }
    },
    setOldDisplayedValue() {
      this.visibleSelectAddress = true
      this.editBusinessPartner = false
      this.customerValue = this.isEmptyValue(this.updatedCustomerValue) ? this.updatedCustomerValue : this.updatedCustomerValue + ' - '
      if (this.controlDisplayed !== this.displayedValue) {
        this.displayedValue = this.controlDisplayed
      }
    },
    localSearch(stringToMatch, callBack) {
      if (this.isEmptyValue(stringToMatch)) {
        // not show list
        callBack([])
        return
      }

      const recordsList = this.recordsBusinessPartners
      let results = recordsList
      if (stringToMatch) {
        const parsedValue = trimPercentage(stringToMatch.toLowerCase().trim())

        results = recordsList.filter(rowBPartner => {
          for (const columnBPartner in rowBPartner) {
            const valueToCompare = String(rowBPartner[columnBPartner]).toLowerCase()

            if (valueToCompare.includes(parsedValue)) {
              return true
            }
          }
          return false
        })

        // Remote search
        if (this.isEmptyValue(results) && String(stringToMatch.length > 3)) {
          clearTimeout(this.timeOut)

          this.timeOut = setTimeout(() => {
            this.remoteSearch(stringToMatch)
              .then(remoteResponse => {
                callBack(remoteResponse)
              })
          }, 2000)
          return
        }
      }

      // call callback function to return suggestions
      callBack(results)
    },
    remoteSearch(searchValue) {
      return new Promise(resolve => {
        const message = {
          message: this.$t('notifications.searchWithOutRecords'),
          type: 'info',
          showClose: true
        }

        this.$store.dispatch('listBPartnerFromServer', {
          pageNumber: 1,
          searchValue
        })
          .then(() => {
            const recordsList = this.recordsBusinessPartners

            if (this.isEmptyValue(recordsList)) {
              this.$message(message)
            }

            resolve(recordsList)
          })
          .catch(error => {
            console.warn(error.message)

            this.$message(message)
            resolve([])
          })
      })
    },
    handleSelect(selectedValue) {
      this.$store.commit('customer', selectedValue)
      this.oldValueCustomer = selectedValue
      let businessPartner = selectedValue
      if (this.isEmptyValue(businessPartner)) {
        businessPartner = this.blankBPartner
      }
      this.selectAddress = {}
      this.customerValue = businessPartner.value
      this.selectCustomerValue = businessPartner
      this.setBusinessPartner(businessPartner, false)
    },
    onClose() {
      this.showsPopovers.isShowCreate = true
    },
    // TODO: Improve the handling of the event, if given an option to not search
    getBPartnerWithEnter(event) {
      const value = String(event.target.value).trim()

      // Get one element
      // this.getBPartner(value)

      const createBP = () => {
        this.$store.commit('updateValueOfField', {
          containerUuid: 'Business-Partner-Create',
          columnName: 'Value',
          value
        })

        this.showsPopovers.isShowList = false
        this.showsPopovers.isShowCreate = true
        this.$store.commit('popoverCreateBusinessPartner', true)
      }

      this.searchBPartnerList({
        searchValue: `%${value}%`
      }, false)
        .then(responseBPartnerList => {
          const records = responseBPartnerList.length

          if (records <= 0) {
            // open create (without records)
            createBP()
            this.controlDisplayed = ''
          } else if (records === 1) {
            // set unique match
            this.setBusinessPartner(responseBPartnerList[0], false)
            this.controlDisplayed = responseBPartnerList[0].name
          } else {
            // show list with macth's
            const columnName = 'Name' // Value
            // if (Number.isNaN(Number(value))) {
            //   columnName = 'Name'
            // }
            this.$store.commit('updateValuesOfContainer', {
              containerUuid: 'Business-Partner-List',
              attributes: [{
                columnName,
                value: `%${value}%`
              }]
            })

            this.showsPopovers.isShowList = true
            this.showsPopovers.isShowCreate = false
          }
        })
        .catch(error => {
          // create bpartner with typing values
          createBP()
          console.warn(error)
        })
    },
    getBPartner(value) {
      if (this.isEmptyValue(value)) {
        this.$message({
          type: 'warning',
          message: this.$t('notifications.fieldCannotBeEmpty'),
          duration: 1500,
          showClose: true
        })
        return
      }

      requestGetBusinessPartner({
        searchValue: value
      })
        .then(responseBPartner => {
          // set id, uuid and name
          this.setBusinessPartner(responseBPartner, false)
        })
        .catch(error => {
          const message = this.$t('businessPartner.notFound') + ' ' + this.$t('data.createNewRecord')
          this.$message({
            type: 'info',
            message,
            duration: 1500,
            // showClose: true, // TODO: does not activate callback to display create form if closed with click
            onClose: this.onClose
          })

          this.setBusinessPartner({
            ...this.blankBPartner,
            name: value
          })

          this.$store.commit('updateValueOfField', {
            containerUuid: 'Business-Partner-Create',
            columnName: 'Name',
            value
          })
          this.$store.commit('updateValueOfField', {
            containerUuid: 'Business-Partner-Create',
            columnName: 'Value',
            value
          })
          console.info(`Error get Business Partner. Message: ${error.message}, code ${error.code}.`)
        })
    },
    popoverOpen(value) {
      this.$store.dispatch('changePopover', true)
    },
    popoverClose(value) {
      this.$store.commit('setShowedLocation', false)
    }
  }
}
</script>

<style lang="scss" scope>
  .custom-field-bpartner-info {
    li {
      line-height: normal;
      padding: 15px;

      .header {
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .info {
        color: #7e7e7e;
        float: left;
        font-size: 12px;
      }
    }
  }
</style>
