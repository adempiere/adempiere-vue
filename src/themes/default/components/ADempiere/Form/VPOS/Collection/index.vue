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
  <el-container style="background: white; height: 100% !important;">
    <el-main style="background: white; padding: 0px; height: 100% !important; overflow: hidden">
      <el-container style="background: white; padding: 0px; height: 100% !important;">
        <!-- Invoice Overdrawn at time of collection -->
        <overdrawn-invoice
          :change="change"
          :pay="pay"
          :pending="pending"
          :total-order="currentOrder.grandTotal"
          :currency="pointOfSalesCurrency"
        />
        <!-- Collection container top panel -->
        <el-header style="height: auto; padding-bottom: 10px; padding-right: 0px; padding-left: 0px">
          <el-card class="box-card" style="padding-left: 0px; padding-right: 0px">
            <div
              v-if="isLoaded"
              class="text item"
            >
              <el-form
                label-position="top"
                label-width="10px"
                style="float: right; display: flex; line-height: 10px;"
                :disabled="validateOpenAmount"
              >
                <el-row id="fieldListCollection">
                  <el-col
                    v-for="field in primaryFieldsList"
                    :key="field.sequence"
                    :span="size"
                  >
                    <field-definition
                      :metadata-field="field.columnName === 'PayAmt' ? {
                        ...field,
                        labelCurrency: currentFieldCurrency
                      } : field"
                      :container-uuid="'Collection'"
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
                  <el-col :span="size">
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
                  <el-col :span="size">
                    <el-form-item :label="$t('form.pos.collect.Currency')" class="from-field">
                      <el-select
                        v-model="currentFieldCurrency"
                        :disabled="!isEmptyValue(currentAvailablePaymentMethods.reference_currency)"
                        style="display: block;"
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
                  <el-col
                    v-for="field in hiddenFieldsList"
                    :key="field.sequence"
                    :span="size"
                  >
                    <field-definition
                      :metadata-field="field"
                      :container-uuid="'Collection'"
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
            </div>
          </el-card>
          <samp id="buttonCollection" style="float: right;padding-right: 10px;">
            <el-button type="danger" icon="el-icon-close" @click="exit" />
            <el-button type="info" icon="el-icon-minus" :disabled="isDisabled" @click="undoPatment" />
            <el-button type="success" icon="el-icon-plus" :disabled="validPay || addPay || validateOpenAmount" @click="addCollectToList(paymentBox)" />
            <el-button type="primary" :disabled="validatePaymentBeforeProcessing" icon="el-icon-shopping-cart-full" @click="validateOrder(listPayments)" />
          </samp>
        </el-header>
        <!-- Panel where they show the payments registered from the collection container -->
        <el-main style="padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px;">
          <type-collection
            v-if="!updateOrderPaymentPos"
            id="cardCollection"
            :is-add-type-pay="listPayments"
            :currency="pointOfSalesCurrency"
            :list-types-payment="fieldsList[2]"
            :is-loaded="isLoadedPayments"
            :list-payment-type="fieldsPaymentType"
          />
          <div
            v-else
            key="form-loading"
            v-loading="updateOrderPaymentPos"
            :element-loading-text="$t('notifications.loading')"
            :element-loading-spinner="'el-icon-loading'"
            element-loading-background="rgba(255, 255, 255, 0.8)"
            class="view-loading"
          />
        </el-main>
        <!-- Collection container bottom panel -->
        <el-footer id="infoInvoce" height="auto" style="padding-left: 0px; padding-right: 0px;">
          <el-row :gutter="24">
            <el-col :span="24" style="padding-left:  15px !important;padding-right: 15px !important;">
              <span>
                <div style="border: 1px solid rgb(54, 163, 247);padding-left: 10px;padding-right: 10px;">
                  <p class="total">
                    <b>
                      {{ $t('form.pos.collect.orderTotal') }} {{ '(' + currentOrder.documentNo + ')' }}:
                    </b>
                    <b style="float: right;">
                      {{ formatPrice(currentOrder.grandTotal, pointOfSalesCurrency.iSOCode) }}
                    </b>
                  </p>

                  <p v-if="!isEmptyValue(currentPointOfSales.displayCurrency)" class="total"><b> {{ $t('form.pos.collect.convertedAmount') }}: </b><b style="float: right;">{{ formatPrice(currentOrder.grandTotal / totalAmountConverted, currentPointOfSales.displayCurrency.iso_code) }}</b> </p>
                </div>
                <div style="padding-left: 10px;padding-right: 10px;">
                  <p class="total">
                    {{ $t('form.pos.collect.payment') }}:
                    <b style="float: right;">
                      {{ formatPrice(currentOrder.paymentAmount, pointOfSalesCurrency.iSOCode) }}
                    </b>
                  </p>

                  <p class="total">
                    {{ $t('form.pos.collect.pending') }}:
                    <b style="float: right;">
                      {{ formatPrice(currentOrder.openAmount, pointOfSalesCurrency.iSOCode) }}
                    </b>
                  </p>

                  <p class="total">
                    {{ $t('form.pos.collect.change') }}:
                    <b style="float: right;">
                      {{ formatPrice(currentOrder.refundAmount, pointOfSalesCurrency.iSOCode) }}
                    </b>
                  </p>

                  <p v-if="!isEmptyValue(dayRate)" class="total">
                    {{ $t('form.pos.collect.dayRate') }}:
                    <!-- Conversion rate to date -->
                    <b style="float: right;">
                      {{ showDayRate(dayRate) }}
                    </b>
                  </p>
                </div>
              </span>
            </el-col>
          </el-row>
        </el-footer>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
// constants
import fieldsListCollection from './fieldsListCollection.js'
import { FIELDS_DECIMALS } from '@/utils/ADempiere/references'

// components and mixins
import formMixin from '@theme/components/ADempiere/Form/formMixin'
import posMixin from '@theme/components/ADempiere/Form/VPOS/posMixin.js'
import typeCollection from '@theme/components/ADempiere/Form/VPOS/Collection/typeCollection'
import overdrawnInvoice from './overdrawnInvoice'

// utils and helper methods
import { formatPrice, formatDateToSend } from '@/utils/ADempiere/valueFormat.js'
import { clientDateTime } from '@/utils/ADempiere/formatValue/dateFormat.js'
import {
  getLookupList,
  isDisplayedField,
  isMandatoryField,
  isReadOnlyField,
  changeFieldShowedFromUser
} from '@theme/components/ADempiere/Form/VPOS/containerManagerPos.js'
// api request methods
import { processOrder } from '@/api/ADempiere/form/point-of-sales.js'

export default {
  name: 'Collection',

  components: {
    typeCollection,
    overdrawnInvoice
  },

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
      type: Object,
      default: undefined
    },
    metadata: {
      type: Object,
      default: () => {
        return {
          uuid: 'Collection',
          containerUuid: 'Collection'
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
      checked: false,
      currencyConversion: 1,
      convertAllPayment: 1,
      allPayCurrency: 0,
      labelTenderType: '',
      defaultLabel: '',
      fieldsList: fieldsListCollection,
      sendToServer: false,
      value: '',
      amontSend: 0,
      currentFieldCurrency: '',
      currentFieldPaymentMethods: ''
    }
  },

  computed: {
    listCurrency() {
      return this.$store.getters.getCurrenciesList
    },
    convertionList() {
      return this.$store.state['pointOfSales/point/index'].conversionsList
    },
    validateCompleteCollection() {
      let collection
      if (this.pay === this.currentOrder.grandTotal) {
        collection = false
      } else {
        if (this.pay >= this.currentOrder.grandTotal && (this.isCashAmt >= this.change) || this.checked) {
          collection = false
        } else {
          collection = true
        }
      }
      return collection
    },
    fullCopper() {
      if ((this.change > this.isCashAmt) && this.pay > this.currentOrder.grandTotal) {
        return true
      }
      return false
    },
    isPaymentBox() {
      return this.$store.getters.getPaymentBox
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
      const listServer = this.$store.getters.getListRefund
      if (!this.sendToServer && !this.isEmptyValue(listServer)) {
        return listServer.filter(payment => !payment.isRefund)
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
      return this.validateOpenAmount
    },
    validateOpenAmount() {
      if (this.currentOrder.openAmount > 0) {
        return false
      }
      if (!this.isEmptyValue(this.pendingPayments)) {
        return this.isEmptyValue(this.pendingPayments)
      }
      return this.isDisabled
    },
    pendingPayments() {
      return this.listPayments.filter(payment => payment.documentStatus.value === 'DR')
    },
    cashPayment() {
      const cash = this.listPayments.filter(pay => {
        return pay.tenderTypeCode === 'X'
      })
      return this.sumCash(cash)
    },
    isValidForPay() {
      const containerUuid = this.containerUuid
      const typePay = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'TenderType'
      })
      const amount = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'PayAmt'
      })
      const allChange = Number.parseFloat(amount + this.change).toFixed(2) - this.cashPayment
      if (typePay !== 'X' && !this.isMandatory) {
        if (this.cashPayment === this.change && this.pending === 0 || (allChange > 0 && this.pending === 0)) {
          return true
        }
        return false
      }
      const cash = this.isMandatory
      return cash
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
    convertion() {
      return this.$store.getters.getDivideRateCollection
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
    validPay() {
      const containerUuid = this.containerUuid
      // filter by visible fields
      const fieldLogic = this.hiddenFieldsList.filter(field => field.isDisplayedFromLogic === true)
      const fieldsEmpty = this.$store.getters.getFieldsListEmptyMandatory({
        containerUuid,
        fieldsList: fieldLogic,
        isValidate: true
      })
      if (this.$t('form.pos.collect.emptyRate') === this.showDayRate(this.dayRate) && this.isEmptyValue(this.currentFieldCurrency) && this.currentFieldCurrency !== this.currentPointOfSales.currentPriceList.currency.iSOCode) {
        return true
      }
      const paymentMethods = this.availablePaymentMethods.find(payment => payment.uuid === this.currentFieldPaymentMethods)
      if (paymentMethods.tender_type === 'X') {
        return false
      }
      if (this.isEmptyValue(fieldsEmpty)) {
        return false
      }
      return true
    },
    change() {
      const missing = this.pay - this.currentOrder.grandTotal
      if (this.pay > 0 && this.pay > this.currentOrder.grandTotal) {
        return missing
      }
      return 0
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
    displayCurrency() {
      return this.$store.getters.getListCurrency
    },
    convert() {
      return this.$store.getters.getConvertionPayment
    },
    updateOrderPaymentPos() {
      return this.$store.getters.getUpdatePaymentPos
    },
    convertionsList() {
      return this.$store.state['pointOfSales/point/index'].conversionsList
    },
    currentConvertion() {
      if (this.isEmptyValue(this.currentPointOfSales.displayCurrency)) {
        return {}
      }
      const convert = this.convertionsList.find(convert => {
        if (!this.isEmptyValue(convert.currencyTo) && !this.isEmptyValue(this.currentPointOfSales.displayCurrency) && convert.currencyTo.id === this.currentPointOfSales.displayCurrency.id) {
          return convert
        }
      })
      if (convert) {
        return convert
      }
      return {}
    },
    dayRate() {
      if (!this.isEmptyValue(this.currentFieldCurrency)) {
        const currency = this.listCurrency.find(currency => currency.iso_code === this.currentFieldCurrency)
        const convert = this.convertionsList.find(convert => {
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
    hiddenFieldsList() {
      return this.fieldsList.filter(field => {
        if (field.sequence > 1 && field.displayLogicPayment.includes(this.currentAvailablePaymentMethods.tender_type)) {
          return field
        }
      })
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
    validateReturn() {
      const refund = this.$store.getters.getListRefund
      if (this.isEmptyValue(refund)) {
        return this.change
      }
      const allRefund = refund.filter(refund => refund.isRefund)
      if (!this.isEmptyValue(allRefund)) {
        return allRefund[0].amount
      }
      return this.change
    },
    dateConvertions() {
      const date = this.$store.getters.getValueOfField({
        containerUuid: this.containerUuid,
        columnName: 'DateTrx'
      })
      if (this.isEmptyValue(date) && !this.isEmptyValue(this.currentPointOfSales.currentOrder.dateOrdered)) {
        const emptyDate = new Date()
        this.$store.commit('updateValueOfField', {
          containerUuid: this.containerUuid,
          columnName: 'DateTrx',
          value: emptyDate.getFullYear() + '-' + String(emptyDate.getMonth() + 1).padStart(2, '0') + '-' + String(emptyDate.getDate()).padStart(2, '0')
        })
        return this.formatDateToSend(this.currentPointOfSales.currentOrder.dateOrdered)
      }
      return date
    },
    selectCurrentFieldCurrency() {
      return this.listCurrency.find(currency => currency.iso_code === this.currentFieldCurrency)
    },
    size() {
      const size = this.$store.getters.getWidthRight
      if (this.primaryFieldsList.length <= 1 && this.hiddenFieldsList.length <= 1) {
        return 12
      }
      return 24 / size
    },
    amountForTheRate() {
      const amount = this.listCurrency.find(currency => currency.iso_code === this.currentFieldCurrency)
      const convert = this.convertionsList.find(convert => {
        if (!this.isEmptyValue(amount) && !this.isEmptyValue(convert.currencyTo) && amount.id === convert.currencyTo.id && this.currentPointOfSales.currentPriceList.currency.id !== amount.id) {
          return convert
        }
      })
      if (!this.isEmptyValue(convert) && this.currentPointOfSales.currentPriceList.currency.id !== amount.id) {
        return convert.divideRate
      }
      return 1
    },
    showCollection() {
      return this.$store.getters.getShowCollectionPos
    }
  },

  watch: {
    dateConvertions(value) {
      if (!this.isEmptyValue(this.currentPointOfSales.conversionTypeUuid) && !this.isEmptyValue(this.currentPointOfSales.priceList.currency.uuid) && !this.isEmptyValue(this.selectCurrentFieldCurrency.uuid) && !this.isEmptyValue(value) && this.formatDateToSend(this.currentPointOfSales.currentOrder.dateOrdered) !== value) {
        this.$store.dispatch('searchConversion', {
          conversionTypeUuid: this.currentPointOfSales.conversionTypeUuid,
          currencyFromUuid: this.currentPointOfSales.priceList.currency.uuid,
          currencyToUuid: this.selectCurrentFieldCurrency.uuid,
          conversionDate: clientDateTime(value, 'd')
        })
      }
    },
    showCollection(value) {
      this.defaultValueCurrency()
      this.currentFieldPaymentMethods = this.defaulValuePaymentMethods.uuid
      this.cancel()
    },
    pending(value) {
      this.$store.commit('updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'PayAmt',
        value: this.currentOrder.openAmount / this.amountForTheRate
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
          value: this.currentOrder.openAmount / this.amountForTheRate
        })
      }
    },
    dayRate(value) {
      if (!this.isEmptyValue(value.divideRate)) {
        this.$store.commit('updateValueOfField', {
          containerUuid: this.containerUuid,
          columnName: 'PayAmt',
          value: this.currentOrder.openAmount / this.amountForTheRate
        })
      } else {
        this.$store.commit('updateValueOfField', {
          containerUuid: this.containerUuid,
          columnName: 'PayAmt',
          value: this.currentOrder.openAmount / this.amountForTheRate
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
      if (!this.isEmptyValue(this.convertionsList)) {
        let rate
        payment.forEach((pay) => {
          rate = this.convertionsList.find(currency => !this.isEmptyValue(currency.currencyTo) && currency.currencyTo.uuid === pay.currencyUuid)
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
      if (!this.isEmptyValue(this.dayRate)) {
        this.showDayRate(this.dayRate)
      }
    },
    precision() {
      return this.$store.getters.getCurrency.standardPrecision
    }
  },

  created() {
    this.currentFieldCurrency = this.pointOfSalesCurrency.iSOCode
    this.$store.dispatch('addRateConvertion', this.pointOfSalesCurrency)
    this.unsubscribe = this.subscribeChanges()
    this.defaultValueCurrency()
    setTimeout(() => {
      if (!this.isEmptyValue(this.dayRate.divideRate)) {
        this.showDayRate(this.dayRate, this.dayRate.divideRate)
        this.$store.commit('updateValueOfField', {
          containerUuid: this.containerUuid,
          columnName: 'PayAmt',
          value: this.currentOrder.openAmount / this.amountForTheRate
        })
      }
    }, 1500)
    this.currentFieldPaymentMethods = this.defaulValuePaymentMethods.uuid
  },

  methods: {
    getLookupList,
    isDisplayedField,
    isMandatoryField,
    isReadOnlyField,
    changeFieldShowedFromUser,
    formatDateToSend,
    showDayRate(rate) {
      const amount = rate.divideRate > rate.multiplyRate ? rate.divideRate : rate.multiplyRate
      const currency = this.listCurrency.find(currency => currency.iso_code === this.currentFieldCurrency)
      if (this.isEmptyValue(currency)) {
        return this.$t('form.pos.collect.emptyRate')
      }
      if (!this.isEmptyValue(currency) && !this.isEmptyValue(rate.currencyTo.iSOCode) && rate.currencyTo.iSOCode !== currency.iso_code) {
        return this.$t('form.pos.collect.emptyRate')
      }
      if (!this.isEmptyValue(rate.currencyTo.iSOCode) && rate.currencyTo.iSOCode === this.currentPointOfSales.priceList.currency.iSOCode) {
        const convert = this.convertionsList.find(convert => {
          if (!this.isEmptyValue(convert.currencyTo) && !this.isEmptyValue(this.currentPointOfSales.displayCurrency) && this.currentPointOfSales.displayCurrency.iso_code === convert.currencyTo.iSOCode) {
            return convert
          }
        })
        const convertAmount = !this.isEmptyValue(convert) ? (convert.divideRate > convert.multiplyRate ? convert.divideRate : convert.multiplyRate) : ''
        const displayCurrency = this.isEmptyValue(this.currentPointOfSales.displayCurrency) ? '' : this.currentPointOfSales.displayCurrency.iso_code
        if (this.isEmptyValue(convertAmount)) {
          return this.formatPrice(1, displayCurrency)
        }
        return this.formatPrice(1, displayCurrency) + ' ~ ' + this.formatPrice(convertAmount, this.currentPointOfSales.priceList.currency.iSOCode)
      }
      return this.formatPrice(1, rate.currencyTo.iSOCode) + ' ~ ' + this.formatPrice(amount, this.currentPointOfSales.priceList.currency.iSOCode)
    },
    amountConvert(currency) {
      this.$store.dispatch('searchConversion', {
        conversionTypeUuid: this.currentPointOfSales.conversionTypeUuid,
        currencyFromUuid: this.currentPointOfSales.priceList.currency.uuid,
        currencyToUuid: currency.uuid,
        conversionDate: this.formatDateToSend(this.currentPointOfSales.currentOrder.dateOrdered)
      })
    },
    formatNumber({ displayType, number }) {
      let fixed = 0
      // Amount, Costs+Prices, Number
      if (FIELDS_DECIMALS.includes(displayType)) {
        fixed = 2
      }
      return new Intl.NumberFormat().format(number.toFixed(fixed))
    },
    formatPrice,
    sumCash(cash) {
      let sum = 0
      if (!this.isEmptyValue(cash)) {
        cash.forEach((pay) => {
          const searchConversion = this.$store.state['pointOfSales/point/index'].conversionsList.find(currency => !this.isEmptyValue(currency.currencyTo) && currency.currencyTo.uuid === pay.currencyUuid)
          if (!this.isEmptyValue(pay.divideRate) && !this.isEmptyValue(searchConversion)) {
            sum += pay.amount * searchConversion.divideRate
          } else {
            sum += pay.amount
          }
        })
      }
      return sum
    },
    convertAmount(currencyUuid) {
      const currencyPay = this.convertionsList.find(currency => {
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
    addCollectToList() {
      if (this.isEmptyValue(this.listCurrency)) {
        this.$message({
          type: 'error',
          showClose: true,
          message: this.$t('form.pos.collect.emptyRate')
        })
        return
      }
      const containerUuid = this.containerUuid
      const posUuid = this.currentPointOfSales.uuid
      const orderUuid = this.$store.getters.posAttributes.currentPointOfSales.currentOrder.uuid
      const bankUuid = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'C_Bank_ID_UUID'
      })
      this.amontSend = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'PayAmt'
      })
      const tenderTypeCode = this.currentAvailablePaymentMethods.tender_type
      const paymentMethodUuid = this.currentAvailablePaymentMethods.uuid
      const referenceNo = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'ReferenceNo'
      })
      const values = this.$store.getters.getValuesView({
        containerUuid,
        format: 'object'
      })
      const params = { referenceNo: values.DocumentNo, description: values.Description, paymentDate: values.DateTrx }
      if (this.currentAvailablePaymentMethods.is_payment_reference) {
        this.$store.dispatch('refundReference', {
          ...params,
          posUuid,
          orderUuid,
          customerBankAccountUuid: this.currentOrder.customer.uuid,
          isReceipt: true,
          bankUuid,
          amount: this.round(this.amontSend, this.standardPrecision),
          sourceAmount: this.amontSend * this.dayRate.divideRate,
          paymentMethodUuid,
          tenderTypeCode,
          customerUuid: this.currentOrder.customer.uuid,
          salesRepresentativeUuid: this.currentOrder.salesRepresentative.uuid,
          currencyUuid: this.dayRate.currencyTo.uuid
        })
        this.addCollect()
        return
      }
      if (this.sendToServer) {
        this.$store.dispatch('setPaymentBox', {
          ...params,
          posUuid,
          orderUuid,
          bankUuid,
          referenceNo,
          amount: this.round(this.amontSend, this.standardPrecision),
          convertedAmount: this.amontSend * this.dayRate.divideRate,
          tenderTypeCode,
          paymentMethodUuid,
          currencyUuid: this.dayRate.currencyTo.uuid
        })
      } else {
        this.$store.dispatch('createPayments', {
          ...params,
          posUuid,
          orderUuid,
          bankUuid,
          amount: this.round(this.amontSend, this.standardPrecision),
          convertedAmount: this.amontSend * this.dayRate.divideRate,
          paymentMethodUuid,
          tenderTypeCode,
          currencyUuid: this.dayRate.currencyTo.uuid
        })
          .then((response) => {
            if (response.type !== 'error') {
              this.addCollect()
            }
          })
      }
    },
    updateServer(listPaymentsLocal) {
      const posUuid = this.currentPointOfSales.uuid
      const orderUuid = this.$route.query.action
      this.$store.dispatch('uploadOrdersToServer', { listPaymentsLocal, posUuid, orderUuid })
    },
    addCollect() {
      this.fieldsList.forEach(element => {
        if (element.columnName !== 'PayAmt') {
          this.$store.commit('updateValueOfField', {
            containerUuid: this.containerUuid,
            columnName: element.columnName,
            value: element.defaultValue
          })

          // set default logics
          this.$store.dispatch('changeDependentFieldsList', {
            field: element
          })
        }
        this.$store.commit('updateValueOfField', {
          containerUuid: this.containerUuid,
          columnName: 'C_Currency_ID',
          value: this.pointOfSalesCurrency.id
        })
        this.$store.commit('updateValueOfField', {
          parentUuid: '',
          containerUuid: 'Collection',
          columnName: 'DisplayColumn_TenderType',
          value: this.defaultLabel
        })
        this.$store.commit('updateValueOfField', {
          containerUuid: this.containerUuid,
          columnName: 'PayAmt',
          value: this.currentOrder.openAmount / this.amountForTheRate
        })
      })
      this.defaultValueCurrency()
      this.$store.commit('currencyDivideRateCollection', 1)
      this.$store.commit('currencyMultiplyRate', 1)
      this.currentFieldPaymentMethods = this.defaulValuePaymentMethods.uuid
      this.cancel()
    },
    cancel() {
      this.fieldsList.forEach(element => {
        if (element.columnName !== 'PayAmt' || element.columnName !== 'C_Currency_ID') {
          this.$store.commit('updateValueOfField', {
            containerUuid: this.containerUuid,
            columnName: element.columnName,
            value: element.defaultValue
          })
        }
        this.$store.dispatch('changeDependentFieldsList', {
          field: element
        })
      })
      this.$store.commit('updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'C_Currency_ID',
        value: this.pointOfSalesCurrency.id
      })
      this.$store.commit('updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'PayAmt',
        value: this.currentOrder.openAmount / this.amountForTheRate
      })
      this.defaultValueCurrency()
      this.$store.commit('currencyDivideRateCollection', 1)
      this.$store.commit('currencyMultiplyRate', 1)
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
    undoPatment() {
      const list = this.listPayments[this.listPayments.length - 1]
      const orderUuid = list.orderUuid
      const paymentUuid = list.uuid
      this.$store.dispatch('deletetPayments', {
        posUuid: this.currentPointOfSales.uuid,
        orderUuid,
        paymentUuid
      })
    },
    validateOrder(payment) {
      // this.porcessInvoce = true
      if (this.currentOrder.paymentAmount > this.currentOrder.grandTotal) {
        this.$store.commit('dialogoInvoce', { show: true, type: 1 })
      } else if (this.currentOrder.paymentAmount < this.currentOrder.grandTotal && Math.abs(this.currentOrder.openAmount) > this.currentPointOfSales.writeOffAmountTolerance) {
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
      } else {
        this.completePreparedOrder(payment)
      }
    },
    completePreparedOrder(payment) {
      const posUuid = this.currentPointOfSales.uuid
      const orderUuid = this.$route.query.action
      this.$store.dispatch('updateOrderPos', true)
      this.$store.dispatch('updatePaymentPos', true)
      this.$message({
        type: 'info',
        message: this.$t('notifications.processing'),
        showClose: true
      })
      this.$store.commit('setShowPOSCollection', false)
      processOrder({
        posUuid,
        orderUuid,
        isOpenRefund: !this.isEmptyValue(this.$store.getters.getListRefundReference),
        createPayments: !this.isEmptyValue(payment),
        payments: payment
      })
        .then(response => {
          this.$store.dispatch('printTicket', { posUuid, orderUuid })
            .then(() => {
              this.$store.dispatch('setCurrentPOS', this.currentPointOfSales)
                .then(() => {
                  this.createOrder({ withLine: false, newOrder: true, customer: this.currentPointOfSales.templateCustomer.uuid })
                })
            })
            .catch((error) => {
              this.$message({
                type: 'info',
                message: 'Error no se a podido conectar con la impresora' + error.message,
                showClose: true
              })
              this.$store.dispatch('reloadOrder', response.uuid)
            })
          // this.$store.dispatch('reloadOrder', response.uuid)
          this.$message({
            type: 'success',
            message: this.$t('notifications.completed'),
            showClose: true
          })
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
        .finally(() => {
          this.$store.dispatch('listOrdersFromServer', {
            posUuid: this.currentPointOfSales.uuid
          })
          this.$store.dispatch('updateOrderPos', false)
          this.$store.dispatch('updatePaymentPos', false)
        })
    },
    formatDate(date) {
      let month = '' + (date.getMonth() + 1)
      let day = '' + date.getDate()
      const year = date.getFullYear()
      if (month.length < 2) {
        month = '0' + month
      }
      if (day.length < 2) {
        day = '0' + day
      }
      return [year, month, day].join('-')
    },
    newOrderAfterPrintTicket() {
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
      this.clearCollection()
    },
    changeCurrency(value) {
      this.currentFieldCurrency = value
      const currency = this.listCurrency.find(currency => currency.iso_code === value)
      const convert = this.convertionsList.find(convert => {
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
    clearCollection() {
      this.$store.commit('updateValuesOfContainer', {
        containerUuid: 'Collection',
        attributes: [
          {
            columnName: 'Description',
            value: undefined
          },
          {
            columnName: 'EMail',
            value: undefined
          },
          {
            columnName: 'ReferenceNo',
            value: undefined
          },
          {
            columnName: 'DocumentNo',
            value: undefined
          },
          {
            columnName: 'AccountNo',
            value: undefined
          },
          {
            columnName: 'C_Bank_ID',
            value: undefined
          },
          {
            columnName: 'C_Bank_ID_UUID',
            value: undefined
          },
          {
            columnName: 'DisplayColumn_C_Bank_ID',
            value: undefined
          },
          {
            columnName: 'CreditCardNumber',
            value: undefined
          },
          {
            columnName: 'CreditCardType',
            value: undefined
          },
          {
            columnName: 'DisplayColumn_CreditCardType',
            value: undefined
          },
          {
            columnName: 'DisplayColumn_TenderType',
            value: undefined
          },
          {
            columnName: 'DisplayColumn_WH_Type_ID',
            value: undefined
          },
          {
            columnName: 'WH_Type_ID',
            value: undefined
          }
        ]
      })
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
