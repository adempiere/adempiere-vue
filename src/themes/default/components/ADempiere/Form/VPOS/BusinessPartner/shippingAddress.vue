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
  <el-col :span="12">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>{{ $t('form.pos.order.BusinessPartnerCreate.shippingAddress') }}</span>
      </div>
      <div class="text item">
        <field-location
          :ref="fieldsList[0].columnName"
          :value-model="fieldsList[0].value"

          :metadata="{
            ...fieldsList[0],
            isReadOnly: disabled
          }"
          :container-uuid="'Shipping-Address'"
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
</template>

<script>
// constants
import fieldsList from './shippingFieldLocation/fieldsList'

// mixins and components
import formMixin from '@theme/components/ADempiere/Form/formMixin.js'
import BParterMixin from './mixinBusinessPartner.js'
import FieldLocation from './shippingFieldLocation'
import {
  getLookupList,
  isDisplayedField,
  isMandatoryField,
  isReadOnlyField,
  changeFieldShowedFromUser
} from '@theme/components/ADempiere/Form/VPOS/containerManagerPos.js'

export default {
  name: 'ShippingAddress',
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
          uuid: 'Shipping-Address',
          containerUuid: 'Shipping-Address',
          fieldsList
        }
      }
    },
    showField: {
      type: Boolean,
      default: false
    },
    disabled: {
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
      isCustomForm: true,
      unsubscribe: () => {}
    }
  },
  computed: {
    fieldsListLocationShippingAddress() {
      if (!this.isEmptyValue(this.$store.getters.getFieldLocation)) {
        return this.$store.getters.getFieldLocation
      }
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
    }
  },
  beforeDestroy() {
    this.unsubscribe()
  },
  methods: {
    getLookupList,
    isDisplayedField,
    isMandatoryField,
    isReadOnlyField,
    changeFieldShowedFromUser
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
