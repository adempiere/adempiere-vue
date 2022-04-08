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
  <el-container style="background: white; height: 100% !important;display: block;">
    <el-main v-if="!isEmptyValue(isAddTypePay)" style="padding-top: 0px; padding-right: 0px; padding-bottom: 0px; overflow: auto; padding-left: 0px;">
      <el-row :gutter="24">
        <template v-for="(value, key) in isAddTypePay">
          <el-col v-if="!value.isRefund" :key="key" :span="size" style="padding-left: 5px; padding-right: 5px;">
            <el-card :body-style="{ padding: '0px' }" style="max-height: 120px;">
              <el-row>
                <el-col :span="6" style="padding: 10px">
                  <el-image style="width: 100px; height: 100px" :src="imageCard(value, iSOCode(value))" fit="contain" />
                </el-col>
                <el-col :span="18" style="padding-right: 0px;padding-left: 40px;">
                  <el-button
                    v-if="!isDisabled"
                    type="text"
                    icon="el-icon-close"
                    style="float: right; margin-right: 10px; color: red; padding-top: 10px;"
                    @click="deleteCollect(value)"
                  />
                  <div style="padding-right: 10px; padding-top: 10%;">
                    <div class="top clearfix">
                      <span>
                        {{
                          labelTenderType(value)
                        }}
                      </span>
                    </div>
                    <div class="bottom clearfix" style="margin-top: 0px !important!">
                      <el-button
                        type="text"
                        class="button"
                        style="color: rgb(50, 54, 58); font-size: 13px; text-align: left; float: unset; padding-top: 5px;"
                      >
                        {{ value.documentNo }}
                      </el-button>

                      <el-button
                        v-if="!isEmptyValue(value.paymentDate)"
                        type="text"
                        class="button"
                        style="color: rgb(50, 54, 58); font-size: 13px; text-align: left; float: unset; padding-top: 5px;"
                      >
                        {{ formatDate(value.paymentDate) }}
                      </el-button>
                      <div
                        slot="header"
                        class="clearfix"
                        style="padding-bottom: 20px;"
                      >
                        <p v-if="!isEmptyValue(value.orderCurrencyRate) && value.orderCurrencyRate !== 1" class="total">
                          <b :style=" isRefundReference ? 'float: right;color: red' : 'float: right;'">
                            {{ formatPrice(value.amount, iSOCode(value)) }}
                          </b>
                        </p>
                        <br>
                        <p class="total">
                          <b :style=" isRefundReference ? 'float: right;color: red' : 'float: right;'">
                            {{ formatPrice(value.amount * value.orderCurrencyRate, currency.iSOCode) }}
                          </b>
                        </p>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </template>
      </el-row>
    </el-main>
    <el-divider v-if="!isRefundReference && !isEmptyValue(listRefund)" content-position="center" style="padding: 10px;"><h2> {{ $t('form.pos.collect.refund') }} / Otros </h2></el-divider>
    <el-footer v-if="!isRefundReference && !isEmptyValue(listRefund)" style="height: 50%;padding: 0px;overflow: auto;">
      <el-row v-if="!isEmptyValue(listRefund)" :gutter="24">
        <template v-for="(value, key) in listRefund">
          <el-col :key="key" :span="size" style="padding-left: 5px; padding-right: 5px;">
            <el-card :body-style="{ padding: '0px' }" style="max-height: 250px;">
              <el-row>
                <el-col :span="6" style="padding: 10px">
                  <el-image style="width: 100px; height: 100px" :src="imageCard(value)" fit="contain" />
                </el-col>
                <el-col :span="18" style="padding-right: 0px;padding-left: 40px;">
                  <el-button
                    v-if="!isDisabled"
                    type="text"
                    icon="el-icon-close"
                    style="float: right; margin-right: 10px; color: red; padding-top: 10px;"
                    @click="deleteCollect(value)"
                  />
                  <div style="padding-right: 10px; padding-top: 10%;">
                    <div class="top clearfix">
                      <span>
                        {{
                          labelTenderType(value)
                        }}
                      </span>
                    </div>
                    <div class="bottom clearfix" style="margin-top: 0px !important!">
                      <el-button
                        type="text"
                        class="button"
                        style="color: rgb(50, 54, 58); font-size: 13px; text-align: left; float: unset; padding-top: 5px;"
                      >
                        {{ value.documentNo }}
                      </el-button>
                      <p v-if="!isEmptyValue(value.description)">
                        {{ value.description }}
                      </p>
                      <el-button
                        v-if="!isEmptyValue(value.paymentDate)"
                        type="text"
                        class="button"
                        style="color: rgb(50, 54, 58); font-size: 13px; text-align: left; float: unset; padding-top: 5px;"
                      >
                        {{ formatDate(value.paymentDate) }}
                      </el-button>
                      <div
                        slot="header"
                        class="clearfix"
                        style="padding-bottom: 20px;"
                      >
                        <p class="total">
                          <b style="float: right;color: red;">
                            {{ formatPrice(value.amount, searchRate(value).currencyTo.iSOCode) }}
                          </b>
                        </p>
                        <br>
                        <p v-if="(!isEmptyValue(value.currencyUuid) && currentPointOfSales.priceList.currency.uuid !== value.currencyUuid) || (!isEmptyValue(value.currency) && currentPointOfSales.priceList.currency.uuid !== value.currency.uuid)" class="total">
                          <b style="float: right;color: red;">
                            {{ formatPrice(value.amount * (isEmptyValue(value.orderCurrencyRate) ? searchRate(value).divideRate : value.orderCurrencyRate), currentPointOfSales.currentPriceList.currency.iSOCode) }}
                          </b>
                        </p>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </template>
      </el-row>
    </el-footer>
  </el-container>
</template>

<script>
import {
  formatDate,
  formatDateToSend,
  formatPrice
} from '@/utils/ADempiere/valueFormat.js'
import {
  requestGetConversionRate
} from '@/api/ADempiere/form/point-of-sales.js'
import posMixin from '@theme/components/ADempiere/Form/VPOS/posMixin.js'

export default {
  name: 'TypeCollection',
  mixins: [
    posMixin
  ],
  props: {
    isAddTypePay: {
      type: Array,
      default: undefined
    },
    openPanel: {
      type: Boolean,
      default: false
    },
    currency: {
      type: Object,
      default: undefined
    },
    listTypesPayment: {
      type: Object,
      default: undefined
    },
    listPaymentType: {
      type: Object,
      default: undefined
    },
    isLoaded: {
      type: Boolean,
      default: false
    },
    size: {
      type: Number,
      default: 12
    },
    isRefundReference: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      conevertion: 0,
      loginCovertion: false,
      labelTypesPayment: []
    }
  },
  computed: {
    listRefunds() {
      return this.currentPointOfSales.currentOrder.listPayments.payments.filter(payments => payments.isRefund)
    },
    typesPayment() {
      return this.$store.getters.getListsPaymentTypes
    },
    listCurrency() {
      return this.$store.getters.getCurrenciesList
    },
    conevertionAmount() {
      return this.$store.getters.getConvertionPayment
    },
    currentPointOfSales() {
      return this.$store.getters.posAttributes.currentPointOfSales
    },
    // Validate if there is a payment in a different type of currency to the point
    paymentCurrency() {
      return this.listRefund.find(pay => pay.currencyUuid !== this.currency.uuid)
    },
    convertionsList() {
      return this.$store.state['pointOfSales/point/index'].conversionsList
    },
    availablePaymentMethods() {
      return this.$store.getters.getPaymentTypeList
    },
    listRefund: {
      get() {
        const refund = this.$store.getters.getListRefund.filter(refund => refund.isRefund)
        const listRefundsReference = this.$store.getters.getListRefundReference
        const list = listRefundsReference.concat(refund)
        return list
      },
      set(value) {
        return value
      }
    }
  },
  watch: {
    listPaymentType(value) {
      if (!this.isEmptyValue(value) && !this.isEmptyValue(value.reference)) {
        this.tenderTypeDisplaye({
          tableName: value.reference.tableName,
          query: value.reference.query
        })
      }
    }
  },
  created() {
    if (!this.isEmptyValue(this.isAddTypePay)) {
      this.convertingPaymentMethods()
    }
    if (!this.isEmptyValue(this.listPaymentType) && !this.isEmptyValue(this.listPaymentType.reference)) {
      this.tenderTypeDisplaye({
        tableName: this.listPaymentType.reference.tableName,
        query: this.listPaymentType.reference.query
      })
    }
  },
  methods: {
    formatDate,
    formatDateToSend,
    formatPrice,
    searchRate(value) {
      if (!this.isEmptyValue(value)) {
        const currency = this.listCurrency.find(currency => {
          if ((!this.isEmptyValue(value.currencyUuid) && currency.uuid === value.currencyUuid) || (!this.isEmptyValue(value.currency) && currency.uuid === value.currency.uuid)) {
            return currency
          }
        })
        if (currency === undefined) {
          return {
            currencyTo: this.currentPointOfSales.priceList.currency,
            divideRate: 1,
            multiplyRate: 1,
            iSOCode: this.currentPointOfSales.priceList.currency.iSOCode
          }
        }
        const convert = this.convertionsList.find(convert => {
          if (!this.isEmptyValue(convert.currencyTo) && currency.id === convert.currencyTo.id && this.currentPointOfSales.currentPriceList.currency.id !== currency.id) {
            return convert
          }
        })
        if (!this.isEmptyValue(convert)) {
          return convert
        }
      }
      return {
        currencyTo: this.currentPointOfSales.priceList.currency,
        divideRate: 1,
        multiplyRate: 1,
        iSOCode: this.currentPointOfSales.priceList.currency.iSOCode
      }
    },
    labelCurrency(refunds) {
      const label = this.listCurrency.find(label => label.uuid === refunds)
      if (this.isEmptyValue(label)) {
        return ''
      }
      return label.iso_code
    },
    labelTenderType(tenderType) {
      const currentTenderType = this.availablePaymentMethods.find(label => {
        const params = !this.isEmptyValue(tenderType.is_paid) ? tenderType.payment_method_uuid : tenderType.paymentMethodUuid
        if (label.uuid === params || label.tender_type === tenderType.tender_type_code) {
          return label
        }
      })
      if (currentTenderType) {
        return currentTenderType.name
      }
      return ''
    },
    iSOCode(value) {
      const currencyPay = this.listCurrency.find(currency => {
        if (currency.uuid === value.currencyUuid) {
          return currency
        }
      })
      if (this.isEmptyValue(currencyPay)) {
        return this.currency.iSOCode
      }
      return currencyPay.iso_code
    },
    amountConvertion(value) {
      const currencyPay = this.convertionsList.find(currency => !this.isEmptyValue(currency.currencyTo) && currency.currencyTo.uuid === value.currencyUuid)
      if (!currencyPay) {
        this.$store.dispatch('searchConversion', {
          conversionTypeUuid: this.currentPointOfSales.conversionTypeUuid,
          currencyFromUuid: this.currency.uuid,
          currencyToUuid: value.currencyUuid,
          conversionDate: this.formatDateToSend(this.currentPointOfSales.currentOrder.dateOrdered)
        })
        return this.formatPrice(0)
      }
      return this.formatPrice(value.amount * currencyPay.divideRate, this.currency.iSOCode)
    },
    // If there are payments in another currency, search for conversion
    convertingPaymentMethods() {
      if (!this.isEmptyValue(this.paymentCurrency)) {
        requestGetConversionRate({
          conversionTypeUuid: this.currentPointOfSales.conversionTypeUuid,
          currencyFromUuid: this.currency.uuid,
          currencyToUuid: this.paymentCurrency.currencyUuid
        })
          .then(response => {
            this.$store.getters.posAttributes.currentPointOfSales.currentOrder.listPayments.payments.forEach(element => {
              if (element.currencyUuid !== this.pointOfSalesCurrency.uuid) {
                element.multiplyRate = element.amount / response.multiplyRate
                element.amountConvertion = element.amount * response.divideRate
                element.divideRate = response.multiplyRate
                element.currencyConvertion = response.currencyTo
              }
            })
            this.listRefund.forEach(element => {
              if (element.currencyUuid !== this.pointOfSalesCurrency.uuid) {
                element.multiplyRate = element.amount / response.multiplyRate
                element.amountConvertion = element.amount * response.divideRate
                element.divideRate = response.multiplyRate
                element.currencyConvertion = response.currencyTo
              }
            })
            this.$store.commit('setListPayments', {
              payments: this.isAddTypePay
            })
          })
          .catch(error => {
            console.warn(`conversion: ${error.message}. Code: ${error.code}.`)
          })
      }
      this.loginCovertion = true
    },
    getImageFromTenderType(typePay) {
      // A: Direct Deposit: ACH Automatic Clearing House
      // C: Credit Card:
      // D: Direct Debit:
      // K: Check:
      // M: Credit Memo:
      // P: Mobile Payment Interbank:
      // T: Account:
      // X: Cash:
      // Z: Zelle:
      let image = ''
      switch (typePay) {
        case 'A':
          image = 'DirectDeposit2'
          break
        case 'M':
          image = 'CreditMemo'
          break
        case 'K':
          image = 'check2'
          break
        case 'X':
          image = 'cash'
          break
        case 'Z':
          image = 'zelle'
          break
        case 'T':
          image = 'Account'
          break
        case 'P':
          image = 'paymobile'
          break
        case 'C':
          image = 'CreditCard'
          break
        case 'D':
          image = 'DirectDebit'
          break
      }
      return require('@/image/' + image + '.jpg')
    },
    imageCard(typePayment, currency) {
      let image
      const params = !this.isEmptyValue(typePayment.is_paid) ? typePayment.tender_type_code : typePayment.tenderTypeCode
      switch (params) {
        case 'D':
          image = 'MobilePayment.jpg'
          break
        case 'P':
          image = 'Mobile.jpg'
          break
        case 'X':
          image = 'Cash.jpg'
          break
        case 'A':
          image = 'ACH.jpg'
          break
        case 'M':
          image = 'GiftCard.jpg'
          break
        case 'Z':
          image = 'Zelle.jpg'
          break
        default:
          image = 'Default.jpg'
          break
      }
      return require('@/image/ADempiere/pos/typePayment/' + image)
    },
    findTypePay(value) {
      return this.availablePaymentMethods.find(pay => pay.uuid === value.paymentMethodUuid)
    },
    deleteCollect(key) {
      const paymentUuid = key.uuid
      if (!this.isEmptyValue(key.is_automatic) && key.is_automatic) {
        return
      }
      const deletetPayments = !this.isEmptyValue(key.is_paid) ? 'deleteRefundReferences' : 'deletetPayments'
      this.$store.dispatch(deletetPayments, {
        posUuid: this.currentPointOfSales.uuid,
        orderUuid: this.currentOrder.uuid,
        uuid: key.uuid,
        customerUuid: this.currentPointOfSales.currentOrder.businessPartner.uuid,
        paymentUuid
      })
      this.$store.dispatch('reloadOrder', this.currentOrder.uuid)
    },
    // Payment card label
    tenderTypeDisplaye({
      tableName,
      query
    }) {
      if (!this.isEmptyValue(tableName)) {
        this.$store.dispatch('getLookupListFromServer', {
          tableName,
          query
        })
          .then(response => {
            this.labelTypesPayment = response
          })
      }
    }
  }
}
</script>

<style scoped>
  .el-image {
    display: inline-block;
    overflow: hidden;
  }
  .el-card__header {
    padding: 18px 20px;
    border-bottom: 1px solid #e6ebf5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background-color: rgb(245, 247, 250);
  }
  .el-card__body {
    padding-top: 0px !important;
    padding-right: 0px!important;
    padding-bottom: 20px;
    padding-left: 10px!important;
    height: 100%!important;
  }

  .bottom {
    margin-top: 0px!important;
    line-height: 1px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
    height: 9vh;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
  .el-header {
    background: 'white';
    color: #333;
    line-height: 10px;
  }

  .el-aside {
    color: #333;
  }
  .el-row {
    margin: 0px!important;
  }
</style>
