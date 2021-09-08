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
    v-shortkey="popoverCreateBusinessParnet ? {close: ['esc'], enter: ['enter']} : {}"
    @shortkey.native="actionCreate"
  >
    <el-form
      label-position="top"
      size="small"
      class="create-bp"
    >
      <el-row :gutter="24">
        <el-col :span="12">
          <field-definition
            v-for="(field) in datos"
            :ref="field.columnName"
            :key="field.columnName"
            :metadata-field="field"
          />
        </el-col>
        <el-col :span="12">
          <field-definition
            v-for="(field) in fieldsListLocation"
            :ref="field.columnName"
            :key="field.columnName"
            :metadata-field="field"
          />
        </el-col>

        <el-col :span="24">
          <samp style="float: right; padding-right: 10px;">
            <el-button
              type="primary"
              class="custom-button-create-bp"
              icon="el-icon-check"
              @click="createBusinessParter"
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
import { createCustomer } from '@/api/ADempiere/form/point-of-sales.js'
import formMixin from '@/components/ADempiere/Form/formMixin.js'
import fieldsList from './fieldsListCreate.js'
import BParterMixin from './mixinBusinessPartner.js'

export default {
  name: 'BusinessPartnerCreate',
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
    showField: {
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
  watch: {
    showField(value) {
      if (value) {
        setTimeout(() => {
          this.focusValue()
        }, 1500)
      }
    }
  },
  beforeDestroy() {
    this.unsubscribe()
  },
  methods: {
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
    // TODO: Get locations values.
    createBusinessParter() {
      const values = this.$store.getters.getValuesView({
        containerUuid: this.containerUuid,
        format: 'object'
      })
      const name2 = this.$store.getters.getValueOfField({
        containerUuid: this.containerUuid,
        columnName: 'Name2'
      })
      values.name2 = name2
      const emptyMandatoryFields = this.$store.getters.getFieldsListEmptyMandatory({
        containerUuid: this.containerUuid,
        formatReturn: 'name'
      })
      if (this.isEmptyValue(emptyMandatoryFields)) {
        this.isLoadingRecord = true
        createCustomer({
          value: values.Value,
          taxId: values.Value,
          name: values.Name,
          lastName: values.Name2,
          description: values.Description,
          contactName: values.ContactName,
          email: values.EMail,
          phone: values.Phone,
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
          .then(responseBPartner => {
            // TODO: Add new record into vuex store.
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
