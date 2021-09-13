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
      <el-row>
        <el-col :span="12">
          <field-definition
            v-for="(field) in datos"
            :ref="field.columnName"
            :key="field.columnName"
            :metadata-field="{
              ...field,
              isReadOnly: isTemplateOfCustomer
            }"
          />
        </el-col>
        <el-col :span="12">
          <field-definition
            v-for="(field) in fieldsListLocation"
            :ref="field.columnName"
            :key="field.columnName"
            :metadata-field="{
              ...field,
              isReadOnly: isTemplateOfCustomer
            }"
          />
        </el-col>

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
// import { getSequenceAsList } from '@/utils/ADempiere/location'
import { requestGetCountryDefinition } from '@/api/ADempiere/system-core.js'

export default {
  name: 'BusinessPartnerUpdate',
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
      const currentOrder = this.$store.getters.posAttributes.currentPointOfSales.currentOrder
      if (!this.isEmptyValue(currentOrder.listPayments.payments)) {
        return !this.isEmptyValue(currentOrder.listPayments.payments)
      }
      return currentOrder.businessPartner.id === this.$store.getters.posAttributes.currentPointOfSales.templateBusinessPartner.id
    },
    showCustomer() {
      return this.$store.getters.getShowUpdateCustomer
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
      updateCustomer({
        uuid: this.currentBusinessPartner.uuid,
        value: values.Value,
        taxId: values.TaxID,
        name: values.Name,
        lastName: values.Name2,
        description: values.Description,
        contactName: values.ContactName,
        email: values.EMail,
        phone: values.Phone,
        addressUuid: this.currentCustomer.addresses[this.index].uuid,
        address1: values.Address1,
        address2: values.Address2,
        address3: values.Address3,
        address4: values.Address4,
        cityUuid: values.C_City_ID_UUID,
        cityName: values.DisplayColumn_C_City_ID,
        postalCode: values.Postal,
        regionUuid: values.C_Region_ID_UUID,
        regionName: values.DisplayColumn_C_Region_ID,
        countryUuid: values.C_Country_ID_UUID,
        posUuid: this.$store.getters.posAttributes.currentPointOfSales.uuid
      })
        .then(response => {
          this.$store.dispatch('changeShowUpdateCustomer', false)
        })
    },
    getCustomer() {
      customer({
        searchValue: this.currentBusinessPartner.value
      })
        .then(response => {
          const { name, value, taxId, description, lastName, addresses } = response
          let region = { id: '', uuid: '', name: '' }
          let postal
          if (!this.isEmptyValue(addresses[this.index].region)) {
            region = addresses[this.index].region
          }
          if (!this.isEmptyValue(addresses[this.index].postal_code)) {
            postal = addresses[this.index].postal_code
          }
          this.$store.commit('updateValuesOfContainer', {
            containerUuid: this.containerUuid,
            attributes: [{
              columnName: 'TaxID',
              value: taxId
            }, {
              columnName: 'Value',
              value: value
            }, {
              columnName: 'Name',
              value: name
            }, {
              columnName: 'Description',
              value: description
            }, {
              columnName: 'Name2',
              value: lastName
            }, {
              columnName: 'C_Country_ID_UUID',
              value: undefined
            }, {
              columnName: 'Postal',
              value: postal
            }, {
              columnName: 'C_Region_ID',
              value: region.id
            }, {
              columnName: 'C_Region_ID_UUID',
              value: region.uuid
            }, {
              columnName: 'DisplayColumn_C_Region_ID',
              value: region.name
            }, {
              columnName: 'C_City_ID',
              value: addresses[this.index].city.id
            }, {
              columnName: 'C_City_ID_UUID',
              value: addresses[this.index].city.uuid
            }, {
              columnName: 'DisplayColumn_C_City_ID',
              value: addresses[this.index].city.name
            }, {
              columnName: 'Address1',
              value: addresses[this.index].address_1
            }, {
              columnName: 'Address2',
              value: addresses[this.index].address_2
            }, {
              columnName: 'Address3',
              value: addresses[this.index].address_3
            }, {
              columnName: 'Address4',
              value: addresses[this.index].address_4
            }]
          })
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
      this.clearLocationValues()
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
