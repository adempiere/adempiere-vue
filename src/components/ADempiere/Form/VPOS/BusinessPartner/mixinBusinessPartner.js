// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

export default {
  name: 'MixinBusinessPartner',
  props: {
    parentMetadata: {
      type: Object,
      default: () => {}
    },
    showsPopovers: {
      type: Object,
      default: () => {
        return {
          panelType: 'form',
          isShowCreate: false,
          isShowList: false
        }
      }
    }
  },
  computed: {
    shortsKey() {
      return {
        closeForm: ['esc'],
        refreshListWithoutValues: ['shift', 'r'],
        refreshList: ['f5']
      }
    },
    billingAddress() {
      const billingAddress = this.addressForm(this.$store.getters.getValuesView({
        containerUuid: 'Billing-Address-Location-Address',
        format: 'object'
      }))
      billingAddress.is_default_billing = true
      billingAddress.is_default_shipping = false
      return billingAddress
    },
    shippingAddress() {
      let shippingAddress = this.addressForm(this.$store.getters.getValuesView({
        containerUuid: 'Shipping-Address-Location-Address',
        format: 'object'
      }))
      shippingAddress.is_default_shipping = true
      shippingAddress.is_default_billing = false
      if (this.copyShippingAddress) {
        shippingAddress = {
          ...this.billingAddress,
          is_default_billing: false,
          is_default_shipping: true
        }
        return shippingAddress
      }
      return shippingAddress
    },
    showCustomer() {
      return this.$store.getters.getPopoverCreateBusinessParnet
    },
    showPopover() {
      if (this.$store.getters.getPopoverCreateBusinessParnet || this.$store.getters.getShowUpdateCustomer) {
        return true
      }
      return false
    }
  },
  watch: {
    showPopover(value) {
      if (!value) {
        this.clearAddresses('Billing-Address-Location-Address')
        this.clearAddresses('Shipping-Address-Location-Address')
      }
    },
    showCustomer(value) {
      if (value) {
        this.clearAddresses('Billing-Address-Location-Address')
        this.clearAddresses('Shipping-Address-Location-Address')
      }
    }
  },
  methods: {
    keyAction(event) {
      switch (event.srcKey) {
        case 'closeForm':
          this.closeForm()
          break
      }
    },
    closeForm() {
      this.showsPopovers.isShowList = false
      this.showsPopovers.isShowCreate = false
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
    /**
     * ColumnName equals property to set into request's system-core
     * @param {object} values
     * @returns {object}
     */
    convertValuesToSend(values) {
      const valuesToSend = {}
      Object.keys(values).forEach(key => {
        const value = values[key]
        if (this.isEmptyValue(value)) {
          return
        }
        switch (key) {
          case 'Code':
            // Only used with search
            valuesToSend['searchValue'] = value
            break
          case 'Value':
            valuesToSend['value'] = value
            break
          case 'Name':
            valuesToSend['name'] = value
            break
          case 'Contact':
            valuesToSend['contactName'] = value
            break
          case 'EMail':
            valuesToSend['eMail'] = value
            break
          case 'Phone':
            valuesToSend['phone'] = value
            break
          // Location values
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

      valuesToSend['posUuid'] = this.$store.getters.posAttributes.currentPointOfSales.uuid
      return valuesToSend
    },
    setBusinessPartner({ id, name, uuid, value }, isCloseForm = true) {
      const { parentUuid, containerUuid } = this.parentMetadata
      // set ID value
      this.$store.commit('updateValueOfField', {
        parentUuid,
        containerUuid,
        columnName: 'C_BPartner_ID', // this.parentMetadata.columnName,
        value: id
      })

      // set display column (name) value
      this.$store.commit('updateValueOfField', {
        parentUuid,
        containerUuid,
        // DisplayColumn_'ColumnName'
        columnName: 'DisplayColumn_C_BPartner_ID', // this.parentMetadata.displayColumnName,
        value: value + ' - ' + name
      })

      // set UUID value
      this.$store.commit('updateValueOfField', {
        parentUuid,
        containerUuid,
        columnName: 'C_BPartner_ID_UUID', // this.parentMetadata.columnName + '_UUID',
        value: uuid
      })

      if (isCloseForm) {
        this.closeForm()
      }
    },
    clearDataCustomer(containerUuid) {
      this.$store.commit('updateValuesOfContainer', {
        containerUuid,
        attributes: [{
          columnName: 'Name',
          value: undefined
        }, {
          columnName: 'Value',
          value: undefined
        }, {
          columnName: 'TaxID',
          value: undefined
        }, {
          columnName: 'Name2',
          value: undefined
        }]
      })
    },
    clearAddresses(containerUuid) {
      this.$store.commit('updateValuesOfContainer', {
        containerUuid,
        attributes: [{
          columnName: 'Name',
          value: undefined
        }, {
          columnName: 'Description',
          value: undefined
        }, {
          columnName: 'Name2',
          value: undefined
        }, {
          columnName: 'Phone',
          value: undefined
        }, {
          columnName: 'EMail',
          value: undefined
        }, {
          columnName: 'ContactName',
          value: undefined
        }, {
          columnName: 'C_Country_ID_UUID',
          value: undefined
        }, {
          columnName: 'Postal',
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
    }
  }
}
