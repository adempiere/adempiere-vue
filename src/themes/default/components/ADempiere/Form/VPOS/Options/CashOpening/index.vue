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
  <el-empty v-if="isEmptyValue(listCurrency) && isEmptyValue(availablePaymentMethods)" :description="$t('form.pos.optionsPoinSales.emptyAvailablePaymentMethods')" />
  <el-container v-else style="background: white; height: 100% !important;">
    <el-main style="background: white; padding: 0px; height: 100% !important; overflow: hidden">
      <el-card class="box-card" style="padding-left: 0px; padding-right: 0px">
        <div
          class="text item"
        >
          <el-form
            label-position="top"
            label-width="10px"
          >
            <el-row id="fieldListCollection">
              <el-col
                :span="8"
              >
                <field-definition
                  :metadata-field="{
                    ...fieldsList[0],
                    labelCurrency: currentFieldCurrency
                  } "
                  :container-uuid="'Cash-Opening'"
                  :container-manager="{
                    ...containerManager,
                    getLookupList,
                    isDisplayedField,
                    isMandatoryField,
                    isReadOnlyField,
                    changeFieldShowedFromUser
                  }"
                />
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('form.pos.collect.paymentMethods')" class="from-field">
                  <el-select
                    v-model="currentFieldPaymentMethods"
                    style="display: block;"
                    @change="changePaymentMethods"
                  >
                    <el-option
                      v-for="item in availablePaymentMethods"
                      :key="item.id"
                      :label="item.name"
                      :value="item.uuid"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('form.pos.collect.Currency')" class="from-field">
                  <el-select
                    v-model="currentFieldCurrency"
                    style="display: block;"
                    :disabled="!isEmptyValue(currentAvailablePaymentMethods.reference_currency)"
                    @change="changeCurrency"
                  >
                    <el-option
                      v-for="item in listCurrency"
                      :key="item.id"
                      :label="item.iso_code + '(' + item.currency_symbol + ')'"
                      :value="item.iso_code"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <br>
          <el-button
            style="float: right;margin-left: 10px;"
            type="success"
            icon="el-icon-plus"
            :disabled="validPay"
            @click="addPayment()"
          />
          <el-button
            type="info"
            icon="el-icon-minus"
            style="float: right;margin-left: 0px;"
            :disabled="isEmptyValue(listCastOpen)"
            @click="undoPatment()"
          />
        </div>
      </el-card>
      <el-card class="box-card" style="padding-left: 0px; padding-right: 0px">
        <div
          class="text item"
        >
          <el-container>
            <el-main style="min-height: 150px;">
              <el-row :gutter="24">
                <template v-for="(payment) in listCastOpen">
                  <el-col :key="payment.uuid" :span="8" style="padding-left: 5px; padding-right: 5px;">
                    <el-card :body-style="{ padding: '0px' }" style="max-height: 120px;">
                      <el-row>
                        <el-col :span="6" style="padding: 10px">
                          <el-image style="width: 100px; height: 100px" :src="imageCard(payment)" fit="contain" />
                        </el-col>
                        <el-col :span="18" style="padding-right: 0px;padding-left: 40px;">
                          <el-button
                            v-if="!isDisabled"
                            type="text"
                            icon="el-icon-close"
                            style="float: right; margin-right: 10px; color: red; padding-top: 10px;"
                            @click="deleteCollect(payment)"
                          />
                          <div style="padding-right: 10px; padding-top: 5%;">
                            <div class="top clearfix">
                              <span>
                                {{
                                  displayTenderType(payment)
                                }}
                              </span>
                            </div>
                            <div class="bottom clearfix" style="margin-top: 0px !important!">
                              <el-button
                                type="text"
                                class="button"
                                style="color: rgb(50, 54, 58); font-size: 13px; text-align: left; float: unset; padding-top: 5px;"
                              >
                                {{ payment.documentNo }}
                              </el-button>
                              <el-button
                                v-if="!isEmptyValue(payment.paymentDate)"
                                type="text"
                                class="button"
                                style="color: rgb(50, 54, 58); font-size: 13px; text-align: left; float: unset; padding-top: 5px;"
                              >
                                {{ formatDate(payment.paymentDate) }}
                              </el-button>
                              <div
                                slot="header"
                                class="clearfix"
                                style="padding-bottom: 20px;"
                              >
                                <p class="total">
                                  <b style="float: right;">
                                    {{ formatPrice(payment.amount, currencyPayment(payment)) }}
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
            <el-footer style="height: auto; padding: 0px">
              <el-card shadow="never">
                <el-form
                  label-position="top"
                  label-width="10px"
                >
                  <el-row id="fieldListCollection">
                    <el-col
                      :span="8"
                    >
                      <el-form-item :label="fieldsList[1].name" class="from-field">
                        <el-select
                          v-model="labelCollectAgent"
                          style="display: block;"
                          @change="loadListCollectAgent"
                          @visible-change="getListCampaign(fieldsList[1].reference)"
                        >
                          <el-option
                            v-for="item in listCollectAgent"
                            :key="item.id"
                            :label="item.values.DisplayColumn"
                            :value="item.uuid"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col
                      :span="8"
                    >
                      <field-definition
                        v-if="isShowFieldBankAccount"
                        :metadata-field="fieldsList[3]"
                        :container-uuid="'Cash-Opening'"
                        :container-manager="{
                          ...containerManager,
                          getLookupList,
                          isDisplayedField,
                          isMandatoryField,
                          isReadOnlyField,
                          changeFieldShowedFromUser
                        }"
                      />
                    </el-col>
                    <el-col
                      :span="8"
                    >
                      <field-definition
                        :metadata-field="fieldsList[2]"
                        :container-uuid="'Cash-Opening'"
                        :container-manager="{
                          ...containerManager,
                          getLookupList,
                          isDisplayedField,
                          isMandatoryField,
                          isReadOnlyField,
                          changeFieldShowedFromUser
                        }"
                      />
                    </el-col>
                  </el-row>
                </el-form>
              </el-card>
            </el-footer>
          </el-container>
        </div>
      </el-card>
    </el-main>
    <el-footer style="height: auto; padding: 0px; padding-top: 10px">
      <el-button
        style="float: right;margin-left: 10px;"
        type="primary"
        icon="el-icon-check"
        :disabled="validateCash"
        @click="cashOpening()"
      />
      <el-button
        style="float: right;"
        type="danger"
        icon="el-icon-close"
        @click="close()"
      />
    </el-footer>
  </el-container>
</template>

<script>
// constants
import fieldsListCashOpen from './fieldsList.js'

// components and mixins
import formMixin from '@theme/components/ADempiere/Form/formMixin'
import posMixin from '@theme/components/ADempiere/Form/VPOS/posMixin.js'

// api request methods
import {
  createPayment,
  cashOpening,
  deletePayment
} from '@/api/ADempiere/form/point-of-sales.js'
import { requestLookupList } from '@/api/ADempiere/window.js'
// utils and helper methods
import {
  getLookupList,
  isDisplayedField,
  isMandatoryField,
  isReadOnlyField,
  changeFieldShowedFromUser
} from '@theme/components/ADempiere/Form/VPOS/containerManagerPos.js'
import { formatPrice, formatDate, formatDateToSend } from '@/utils/ADempiere/valueFormat.js'

export default {
  name: 'CashOpening',

  mixins: [
    formMixin,
    posMixin
  ],

  props: {
    isLoadedPanel: {
      type: Boolean,
      required: false
    },
    amount: {
      type: Boolean,
      default: undefined
    },
    shortkeyAction: {
      type: Boolean,
      default: false
    },
    labelPanel: {
      type: String,
      default: ''
    },
    currentPanel: {
      type: Object,
      default: () => {}
    },
    metadata: {
      type: Object,
      default: () => {
        return {
          uuid: 'Cash-Opening',
          containerUuid: 'Cash-Opening'
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
    }
  },

  data() {
    return {
      isCustomForm: true,
      labelCollectAgent: '',
      collectAgentUuid: '',
      checked: false,
      currencyConversion: 1,
      convertAllPayment: 1,
      allPayCurrency: 0,
      labelTenderType: '',
      defaultLabel: '',
      fieldsList: fieldsListCashOpen,
      sendToServer: false,
      value: '',
      amontSend: 0,
      listCollectAgent: [],
      currentFieldCurrency: '',
      currentFieldPaymentMethods: ''
    }
  },

  computed: {
    isShowFieldBankAccount() {
      const base = 'form.pos.optionsPoinSales.cashManagement.'
      return this.$t(base + 'transfer') === this.$t(this.labelPanel) || this.$t(base + 'moneyIncome') === this.$t(this.labelPanel)
    },
    listCurrency() {
      return this.$store.getters.getCurrenciesList
    },
    isPaymentBox() {
      return this.$store.getters.getPaymentBox
    },
    listCastOpen() {
      return this.$store.getters.getListCashOpen
    },
    addPay() {
      const amount = this.$store.getters.getValueOfField({
        containerUuid: this.containerUuid,
        columnName: 'PayAmt'
      })
      if (amount <= 0) {
        return true
      }
      return false
    },
    listPayments() {
      const listLocal = this.$store.getters.getPaymentBox
      const listServer = this.currentOrder.listPayments
      if (!this.sendToServer && !this.isEmptyValue(listServer)) {
        return listServer.payments.filter(payment => !payment.isRefund)
      }
      return listLocal.paymentBox
    },
    isLoadedPayments() {
      if (this.isEmptyValue(this.currentOrder.listPayments)) {
        return false
      }
      return this.currentOrder.listPayments.isLoaded
    },
    paymentBox() {
      if (this.isEmptyValue(this.listPayments)) {
        return []
      }
      const payment = this.listPayments.filter(pay => {
        return pay.isVisible
      })
      if (this.isEmptyValue(payment)) {
        return []
      }
      return payment
    },
    validatePaymentBeforeProcessing() {
      if (this.isEmptyValue(this.listPayments)) {
        return true
      }
      return this.isDisabled
    },
    cashPayment() {
      const cash = this.listPayments.filter(pay => {
        return pay.tenderTypeCode === 'X'
      })
      return this.sumCash(cash)
    },
    turned() {
      const containerUuid = this.containerUuid
      const amount = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'PayAmt'
      })
      const typePay = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'TenderType'
      })
      const allPay = this.cashPayment + amount
      if (typePay !== 'X') {
        if (allPay <= this.currentOrder.grandTotal) {
          return false
        }
        return true
      }
      return false
    },
    isCashAmt() {
      const cashAmt = this.listPayments.map(item => {
        if (item.tenderTypeCode === 'X') {
          return item.amount
        }
        return 0
      })
      if (!this.isEmptyValue(cashAmt)) {
        return cashAmt.reduce((accumulator, currentValue) => accumulator + currentValue)
      }
      return 0
    },
    isOtherPayAmt() {
      const cashAmt = this.listPayments.map(item => {
        if (item.tenderTypeCode !== 'X') {
          return item.payAmt
        }
        return 0
      })
      if (!this.isEmptyValue(cashAmt)) {
        return cashAmt.reduce((accumulator, currentValue) => accumulator + currentValue)
      }
      return 0
    },
    pay() {
      return this.sumCash(this.listPayments)
    },
    pending() {
      const missing = this.currentOrder.grandTotal - this.pay
      if (this.pay > 0 && this.pay < this.currentOrder.grandTotal) {
        return missing
      }
      const pending = this.currentOrder.grandTotal <= this.pay ? 0 : this.currentOrder.grandTotal
      return pending
    },
    isMandatory() {
      const containerUuid = this.containerUuid
      const fieldsEmpty = this.$store.getters.getFieldsListEmptyMandatory({
        containerUuid,
        fieldsList: this.fieldsList
      })
      const amount = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'PayAmt'
      })
      if (this.isEmptyValue(fieldsEmpty) && amount > 0) {
        return false
      }
      return true
    },
    isPosRequiredPin() {
      const pos = this.$store.getters.posAttributes.currentPointOfSales
      if (!this.isEmptyValue(pos.isPosRequiredPin)) {
        return pos.isPosRequiredPin
      }
      return false
    },
    typeCurrency() {
      return this.$store.getters.getValueOfField({
        containerUuid: this.containerUuid,
        columnName: 'C_Currency_ID'
      })
    },
    currencyUuid() {
      return this.$store.getters.getValueOfField({
        containerUuid: 'Collection',
        columnName: 'C_Currency_ID_UUID'
      })
    },
    multiplyRate() {
      return this.$store.getters.getMultiplyRate
    },
    multiplyRateCollection() {
      return this.$store.getters.getMultiplyRateCollection
    },
    divideRate() {
      return this.$store.getters.getDivideRate
    },
    fieldAmount() {
      const amount = this.$store.getters.getValueOfField({
        containerUuid: this.containerUuid,
        columnName: 'PayAmt'
      })
      return amount * this.divideRate
    },
    validateConvertion() {
      if (this.fieldAmount <= this.pending) {
        return false
      }
      return true
    },
    validPay() {
      // filter by visible fields
      const fieldsEmpty = this.$store.getters.getFieldsListEmptyMandatory({
        containerUuid: 'Cash-Opening',
        fieldsList: this.fieldsList,
        isValidate: true
      })
      const paymentMethods = this.availablePaymentMethods.find(payment => payment.uuid === this.currentFieldPaymentMethods)
      if (paymentMethods.tender_type === 'X') {
        return false
      }
      if (this.isEmptyValue(fieldsEmpty)) {
        return false
      }
      return true
    },
    displayCurrency() {
      return this.$store.getters.getListCurrency
    },
    convert() {
      return this.$store.getters.getConvertionPayment
    },
    updateOrderPaymentPos() {
      return this.$store.getters.getUpdatePaymentPos
    },
    conversionsList() {
      return this.$store.state['pointOfSales/point/index'].conversionsList
    },
    dayRate() {
      if (!this.isEmptyValue(this.currentFieldCurrency)) {
        const currency = this.listCurrency.find(currency => currency.iso_code === this.currentFieldCurrency)
        const convert = this.conversionsList.find(convert => {
          if (!this.isEmptyValue(currency) && !this.isEmptyValue(convert.currencyTo) && currency.id === convert.currencyTo.id && this.currentPointOfSales.currentPriceList.currency.id !== currency.id) {
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
    fieldsPaymentType() {
      return this.fieldsList[1]
    },
    primaryFieldsList() {
      return this.fieldsList.filter(field => field.sequence < 1)
    },
    overUnderPayment() {
      return this.$store.state['pointOfSales/payments/index'].dialogoInvoce.success
    },
    totalAmountConverted() {
      const conversionsList = this.$store.state['pointOfSales/point/index'].conversionsList
      if (this.isEmptyValue(conversionsList) && !this.isEmptyValue(this.currentPointOfSales.conversionTypeUuid)) {
        return 1
      }
      const converted = conversionsList.find(converted => {
        if (converted.conversionTypeUuid === this.currentPointOfSales.conversionTypeUuid) {
          return converted
        }
      })
      if (!this.isEmptyValue(converted)) {
        return converted.divideRate
      }
      return 1
    },
    standardPrecision() {
      const precision = this.listCurrency.find(currency => currency.iso_code === this.currentFieldCurrency)
      if (precision) {
        return precision.standard_precision
      }
      return this.pointOfSalesCurrency.standardPrecision
    },
    availablePaymentMethods() {
      return this.$store.getters.getPaymentTypeList
    },
    currentAvailablePaymentMethods() {
      if (this.isEmptyValue(this.availablePaymentMethods)) {
        return {
          name: ''
        }
      }
      const payment = this.availablePaymentMethods.find(payment => payment.uuid === this.currentFieldPaymentMethods)
      if (!this.isEmptyValue(payment)) {
        return payment
      }
      const defaultPayment = this.availablePaymentMethods.find(payment => payment.tender_type === 'X')
      if (!this.isEmptyValue(defaultPayment)) {
        return defaultPayment
      }
      return {
        name: ''
      }
    },
    defaulValuePaymentMethods() {
      const defaultPayment = this.availablePaymentMethods.find(payment => payment.tender_type === 'X')
      if (!this.isEmptyValue(defaultPayment)) {
        return defaultPayment
      }
      return {}
    },
    selectCurrentFieldCurrency() {
      return this.listCurrency.find(currency => currency.iso_code === this.currentFieldCurrency)
    },
    validateCash() {
      if (this.isEmptyValue(this.collectAgentUuid) || this.isEmptyValue(this.listCastOpen)) {
        return true
      }
      return false
    }
  },

  watch: {
    shortkeyAction(value) {
      if (value && !this.validateCash) {
        this.cashOpening()
      }
    },
    pending(value) {
      this.$store.commit('updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'PayAmt',
        value: this.round(value, this.standardPrecision)
      })
    },
    convertAllPayment(value) {
      if (!this.isEmptyValue(value)) {
        this.allPayCurrency = this.pay / value
      }
      this.allPayCurrency = this.pay
    },
    isLoaded(value) {
      if (value) {
        this.$store.commit('updateValueOfField', {
          containerUuid: this.containerUuid,
          columnName: 'PayAmt',
          value: this.round(this.pending, this.standardPrecision)
        })
      }
    },
    fieldsPaymentType(value) {
      const displayPaymentType = this.$store.getters.getValueOfField({
        containerUuid: 'Collection',
        columnName: 'DisplayColumn_PaymentType'
      })
      if (!this.isEmptyValue(value.reference) && this.isEmptyValue(displayPaymentType)) {
        this.$store.dispatch('getLookupListFromServer', {
          tableName: value.reference.tableName,
          query: value.reference.query
        })
      }
    },
    listPayments(payment) {
      if (!this.isEmptyValue(this.conversionsList)) {
        let rate
        payment.forEach((pay) => {
          rate = this.conversionsList.find(currency => !this.isEmptyValue(currency.currencyTo) && currency.currencyTo.uuid === pay.currencyUuid)
          if (!rate) {
            if (this.currentPointOfSales.priceList.currency.uuid !== pay.currencyUuid) {
              this.searchConversion(pay.currencyUuid)
            }
          }
        })
      }
    },
    currentFieldPaymentMethods(value) {
      const payment = this.availablePaymentMethods.find(payment => payment.uuid === value)
      if (!this.isEmptyValue(payment.reference_currency)) {
        this.changeCurrency(payment.reference_currency.iso_code)
      } else {
        this.changeCurrency(this.pointOfSalesCurrency.iSOCode)
      }
      // if (!this.isEmptyValue(this.dayRate)) {
      //   this.showDayRate(this.dayRate)
      // }
    },
    precision() {
      return this.$store.getters.getCurrency.standardPrecision
    }
  },

  created() {
    this.currentFieldCurrency = this.pointOfSalesCurrency.iSOCode
    this.$store.dispatch('addRateConvertion', this.pointOfSalesCurrency)
    // this.defaultValueCurrency()
    this.currentFieldPaymentMethods = this.defaulValuePaymentMethods.uuid
    setTimeout(() => {
      if (!this.isEmptyValue(this.fieldsList[1].reference) && this.isEmptyValue(this.fieldsList[1])) {
        this.getListCampaign(this.fieldsList[1].reference)
      }
    }, 1000)
  },

  mounted() {
    this.listPaymentOpen()
  },

  methods: {
    getLookupList,
    isDisplayedField,
    isMandatoryField,
    isReadOnlyField,
    changeFieldShowedFromUser,
    formatDateToSend,
    formatDate,
    loadListCollectAgent(value) {
      this.collectAgentUuid = value
    },
    getListCampaign(campaing) {
      requestLookupList({
        tableName: campaing.tableName,
        query: campaing.query
      })
        .then(responseLookupItem => {
          this.listCollectAgent = responseLookupItem.recordsList
        })
    },
    amountConvert(currency) {
      this.$store.dispatch('searchConversion', {
        conversionTypeUuid: this.currentPointOfSales.conversionTypeUuid,
        currencyFromUuid: this.currentPointOfSales.priceList.currency.uuid,
        currencyToUuid: currency.uuid,
        conversionDate: this.formatDateToSend(this.currentPointOfSales.currentOrder.dateOrdered)
      })
    },
    formatPrice,
    sumCash(cash) {
      let sum = 0
      if (!this.isEmptyValue(cash)) {
        cash.forEach((pay) => {
          if (!this.isEmptyValue(pay.divideRate)) {
            const searchConversion = this.$store.state['pointOfSales/point/index'].conversionsList.find(currency => currency.currencyTo.uuid === pay.currencyUuid)
            sum += pay.amount * searchConversion.divideRate
          } else {
            sum += pay.amount
          }
        })
      }
      return sum
    },
    convertAmount(currencyUuid) {
      const currencyPay = this.conversionsList.find(currency => {
        if (!this.isEmptyValue(currency.currencyTo) && currency.currencyTo.uuid === currencyUuid) {
          return currency
        }
      })
      if (!currencyPay) {
        return 0
      }
      const rate = (currencyPay.divideRate > currencyPay.multiplyRate) ? currencyPay.divideRate : currencyPay.multiplyRate
      return rate
    },
    updateServer(listPaymentsLocal) {
      const posUuid = this.currentPointOfSales.uuid
      const orderUuid = this.$route.query.action
      this.$store.dispatch('uploadOrdersToServer', { listPaymentsLocal, posUuid, orderUuid })
    },
    exit() {
      this.cancel()
      this.$store.commit('setShowPOSCollection', false)
    },
    getPriceApplyingDiscount(price, discount) {
      if (this.isEmptyValue(price)) {
        price = 0
      }
      if (this.isEmptyValue(discount)) {
        discount = 0
      }
      return price - discount * price / 100
    },
    getDiscountByPriceEntered(unitPrice, priceEntereded) {
      if (this.isEmptyValue(unitPrice)) {
        unitPrice = 0
      }
      if (this.isEmptyValue(priceEntereded)) {
        priceEntereded = 0
      }
      const discount = 100 - priceEntereded * 100 / unitPrice
      if (this.isEmptyValue(discount) || discount === -Infinity) {
        return 0
      }
      return discount
    },
    defaultValueCurrency() {
      this.$store.commit('updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'DisplayColumn_C_Currency_ID',
        value: this.pointOfSalesCurrency.iSOCode
      })
      this.$store.commit('updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'C_Currency_ID',
        value: this.pointOfSalesCurrency.id
      })
      this.$store.commit('updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'C_Currency_ID_UUID',
        value: this.pointOfSalesCurrency.uuid
      })
    },
    defaulTenderType() {
      this.$store.commit('updateValueOfField', {
        parentUuid: '',
        containerUuid: 'Collection',
        columnName: 'DisplayColumn_TenderType',
        value: this.$t('form.pos.collect.TenderType.cash')
      })
    },
    currencyDisplay(currency) {
      const display = this.displayCurrency.find(item => {
        if (item.currencyUuid === currency || (item.currencyId === currency)) {
          return item
        }
      })
      if (display) {
        return display
      }
      if (currency === this.pointOfSalesCurrency.id) {
        return this.pointOfSalesCurrency.uuid
      }
      return currency
    },
    validateOrder(payment) {
      this.porcessInvoce = true
      if (this.formatPrice(this.pay) < this.formatPrice(this.currentOrder.grandTotal)) {
        this.$store.commit('dialogoInvoce', { show: true, type: 1 })
      } else if (this.formatPrice(this.pay) > this.formatPrice(this.currentOrder.grandTotal)) {
        if (this.isPosRequiredPin) {
          const attributePin = {
            payment: payment,
            typeRefund: 0,
            action: 'openBalanceInvoice',
            type: 'actionPos',
            label: this.$t('form.pos.pinMessage.invoiceOpen')
          }
          this.visible = true
          this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
          return
        }
        this.$store.commit('dialogoInvoce', { show: true, type: 2 })
      }
    },
    newOrderAfterPrintTicket() {
      if (!this.allowsCreateOrder) {
        const attributePin = {
          withLine: false,
          newOrder: true,
          customer: this.currentPointOfSales.templateCustomer.uuid,
          action: 'newOrder',
          type: 'actionPos',
          label: this.$t('form.pos.pinMessage.newOrder')
        }
        this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
        this.visible = true
        return
      }
      this.clearOrder()
      this.$store.commit('setShowPOSCollection', false)
      this.createOrder({ withLine: false, newOrder: true, customer: this.currentPointOfSales.templateCustomer.uuid })
      this.$store.dispatch('listPayments', { posUuid: this.currentPointOfSales.uuid, orderUuid: this.currentOrder.uuid })
    },
    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'updateValueOfField') {
          if (mutation.payload.columnName === 'DisplayColumn_TenderType') {
            this.labelTenderType = mutation.payload.value
          }
        }
      })
    },
    changePaymentMethods(value) {
      this.currentFieldPaymentMethods = value
    },
    changeCurrency(value) {
      this.currentFieldCurrency = value
      const currency = this.listCurrency.find(currency => currency.iso_code === value)
      const convert = this.conversionsList.find(convert => {
        if (!this.isEmptyValue(currency) && !this.isEmptyValue(convert.currencyTo) && currency.id === convert.currencyTo.id && this.currentPointOfSales.currentPriceList.currency.id !== currency.id) {
          return convert
        }
      })
      if (!this.isEmptyValue(currency) && this.isEmptyValue(convert) && currency.uuid !== this.currentPointOfSales.currentPriceList.currency.uuid) {
        this.amountConvert(currency)
      }
    },
    searchConversion(value) {
      this.$store.dispatch('searchConversion', {
        conversionTypeUuid: this.currentPointOfSales.conversionTypeUuid,
        currencyFromUuid: this.currentPointOfSales.priceList.currency.uuid,
        currencyToUuid: value,
        conversionDate: this.formatDateToSend(this.currentPointOfSales.currentOrder.dateOrdered)
      })
    },
    // Open Cash
    addPayment() {
      const payment = this.$store.getters.getValuesView({
        containerUuid: 'Cash-Opening',
        format: 'object'
      })
      if (this.isEmptyValue(this.listCurrency)) {
        this.$message({
          type: 'error',
          showClose: true,
          message: this.$t('form.pos.collect.emptyRate')
        })
        return
      }
      const selectCurrency = this.listCurrency.find(payemnt => payemnt.iso_code === this.currentFieldCurrency)
      const paymentMethodsPos = this.availablePaymentMethods.find(payemnt => payemnt.uuid === this.currentFieldPaymentMethods)
      payment.currency = this.currentFieldCurrency
      payment.amount = payment.PayAmt
      payment.tenderTypeCode = paymentMethodsPos.tender_type
      payment.paymentMethodUuid = this.currentFieldPaymentMethods
      payment.paymentMethods = paymentMethodsPos
      payment.chargeUuid = this.currentPointOfSales.defaultOpeningChargeUuid
      payment.posUuid = this.currentPointOfSales.uuid
      payment.currencyUuid = selectCurrency.uuid
      this.sendPayment(payment)
    },
    sendPayment(payment) {
      createPayment(payment)
        .then(response => {
          this.clearField()
        })
        .catch(error => {
          this.$message({
            message: error.message,
            isShowClose: true,
            type: 'error'
          })
          console.warn(`Error: ${error.message}. Code: ${error.code}.`)
        })
        .finally(() => {
          this.listPaymentOpen()
        })
    },
    listPaymentOpen() {
      const posUuid = this.currentPointOfSales.uuid
      this.$store.dispatch('listPaymentOpen', posUuid)
    },
    deleteCollect(value) {
      deletePayment({
        paymentUuid: value.uuid
      })
        .then(response => {})
        .catch(error => {
          this.$message({
            message: error.message,
            isShowClose: true,
            type: 'error'
          })
          console.warn(`Error: ${error.message}. Code: ${error.code}.`)
        })
        .finally(() => {
          this.listPaymentOpen()
        })
    },
    displayTenderType(tenderType) {
      const currentTenderType = this.availablePaymentMethods.find(label => {
        if (label.uuid === tenderType.paymentMethodUuid) {
          return label
        }
      })
      if (currentTenderType) {
        return currentTenderType.name
      }
      return ''
    },
    cashOpening() {
      console.log(this.currentPanel)
      const attribute = this.$store.getters.getValuesView({
        containerUuid: 'Cash-Opening',
        format: 'object'
      })
      this.$store.commit(this.currentPanel.commit, false)
      this.$message({
        message: 'Acción a realizar',
        showClose: true
      })
      cashOpening({
        posUuid: this.currentPointOfSales.uuid,
        collectingAgentUuid: this.collectAgentUuid,
        description: attribute.Description,
        payments: this.listCastOpen
      })
        .then(response => {
          this.$message({
            type: 'success',
            showClose: true,
            message: this.$t('form.pos.optionsPoinSales.cashManagement.cashOpenBox')
          })
          this.close()
        })
        .catch(error => {
          this.$store.commit(this.currentPanel.commit, true)
          this.$message({
            message: error.message,
            isShowClose: true,
            type: 'error'
          })
          console.warn(`Error: ${error.message}. Code: ${error.code}.`)
        })
    },
    currencyPayment(payment) {
      const currency = this.listCurrency.find(currency => currency.uuid === payment.currencyUuid)
      if (!this.isEmptyValue(currency)) {
        return currency.iso_code
      }
      return ''
    },
    imageCard(typePayment) {
      let image
      switch (typePayment.tenderTypeCode) {
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
    clearField() {
      this.$store.commit('updateValuesOfContainer', {
        containerUuid: 'Cash-Opening',
        attributes: [{
          columnName: 'PayAmt',
          value: 0
        }, {
        //   columnName: 'CollectingAgent_ID',
        //   value: undefined
        // }, {
          columnName: 'Description',
          value: undefined
        }]
      })
    },
    undoPatment() {
      const list = this.listCastOpen[this.listCastOpen.length - 1]
      deletePayment({
        paymentUuid: list.uuid
      })
        .then(response => {
          this.$message({
            type: 'success',
            showClose: true,
            message: response
          })
        })
        .catch(error => {
          this.$message({
            message: error.message,
            isShowClose: true,
            type: 'error'
          })
          console.warn(`Error: ${error.message}. Code: ${error.code}.`)
        })
        .finally(() => {
          this.clearField()
          this.listPaymentOpen()
        })
    },
    close() {
      this.clearField()
      this.$store.commit(this.currentPanel.commit, false)
    }
  }
}
</script>

<style scoped>
  .stylefullPayment {
    font-size: 15px;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif
  }
  .el-button--text {
    border-color: transparent;
    color: #1890ff;
    background: transparent;
    padding-left: 0;
    padding-right: 0;
    padding-bottom: 0px;
    padding-top: 0px;
  }
  .el-card__header {
    padding: 18px 20px;
    border-bottom: 1px solid #e6ebf5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background-color: rgb(245, 247, 250);
  }
  .delete-buttom {
    border: none;
    width: 100%;
    text-align: left;
  }
  .el-col-24 {
    width: 100%;
    padding-right: 0px !important;
    padding-left: 0px !important;
  }
  .el-col-6 {
    padding-right: 0px !important;
    padding-left: 0px !important;
  }
  .el-card__body {
    padding-top: 0px !important;
    padding-right: 0px!important;
    padding-bottom: 20px;
    padding-left: 10px!important;
    height: 100%!important;
  }
  .el-card__header {
    padding: 0px 20px;
    border-bottom: 1px solid #e6ebf5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
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
  .el-tag--medium {
    height: 34px;
    line-height: 32px;
  }
  .el-col {
    border-radius: 4px;
  }
  .total {
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
