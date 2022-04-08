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
  <div>
    <div style="text-align: center">
      <b>{{ $t('form.pos.title') }}</b>
      <br>
      {{ $t('form.pos.optionsPoinSales.title') }}
    </div>
    <modal-dialog
      :parent-uuid="processPos"
      :container-uuid="processPos"
      panel-type="From"
    />
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item :title="$t('form.pos.optionsPoinSales.salesOrder.title')" name="salesOrder">
        <el-row :gutter="12" style="padding-right: 10px;">
          <el-col :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                style="cursor: pointer; text-align: center !important; color: black;min-height: 50px;"
                @click="!allowsCreateOrder ? validateOption($t('form.pos.pinMessage.newOrder')) : newOrder()"
              >
                <i class="el-icon-news" />
                <br>
                {{ $t('form.pos.optionsPoinSales.salesOrder.newOrder') }}
              </p>
            </el-card>
          </el-col>

          <el-col :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <el-popover
                v-model="showListOrdes"
                placement="right"
                trigger="click"
                @show="seeOrderList"
              >
                <orders-list
                  :parent-metadata="metadata"
                  :show-field="showFieldListOrder"
                />
                <p
                  slot="reference"
                  :style="blockOption"
                >
                  <el-button
                    type="text"
                    style="min-height: 50px;width: -webkit-fill-available;white-space: normal;"
                    @click="openListOrdes()"
                  >
                    <svg-icon icon-class="list" />
                    <br>
                    {{ $t('form.pos.optionsPoinSales.salesOrder.ordersHistory') }}
                  </el-button>
                </p>
              </el-popover>
            </el-card>
          </el-col>

          <!-- generateImmediateInvoice -->

          <el-col :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                :class="classblockOption"
                @click="adviserPin ? validateOption($t('form.pos.optionsPoinSales.salesOrder.generateImmediateInvoice')) : generateImmediateInvoice()"
              >
                <i class="el-icon-document-add" />
                <br>
                {{ $t('form.pos.optionsPoinSales.salesOrder.generateImmediateInvoice') }}
              </p>
            </el-card>
          </el-col>

          <!-- completePreparedOrder -->

          <el-col :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                :class="(isEmptyValue(currentOrder.uuid) || currentOrder.documentStatus.value !== 'DR') ? 'is-disabled-option-card' : 'is-enable-option-card'"
                @click="adviserPin ? validateOption($t('form.pos.optionsPoinSales.salesOrder.completePreparedOrder')) : completePreparedOrder()"
              >
                <i class="el-icon-success" />
                <br>
                {{ $t('form.pos.optionsPoinSales.salesOrder.completePreparedOrder') }}
              </p>
            </el-card>
          </el-col>

          <!-- cancelSaleTransaction -->

          <el-col v-if="allowsReturnOrder" :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <el-popover
                v-model="visibleReverse"
                placement="top"
                width="450"
                :disabled="!isProcessed"
              >
                <el-row v-if="!isLoadingReverse" :gutter="24" class="container-reverse">
                  <el-col :span="24" class="container-reverse">
                    <p class="container-popover">
                      <b class="container-popover">
                        {{ $t('data.addDescription') }}
                      </b>
                    </p>
                  </el-col>
                  <el-col :span="24">
                    <el-input
                      v-model="messageReverseSales"
                      type="textarea"
                      :rows="2"
                      :placeholder="$t('data.addDescription')"
                      style=""
                    />
                  </el-col>
                  <el-col :span="24">
                    <samp class="spam-button">
                      <el-button
                        type="danger"
                        icon="el-icon-close"
                        style="background: #ff6d6d;border-color: #ff6d6d;background-color: #ff6d6d;"
                        @click="messageReverseSales = false"
                      />
                      <el-button
                        type="primary"
                        style="background: #46a6ff;border-color: #46a6ff;background-color: #46a6ff;"
                        icon="el-icon-check"
                        @click="adviserPin ? validateOption($t('form.pos.optionsPoinSales.salesOrder.cancelSaleTransaction')) : reverseSalesTransaction()"
                      />
                    </samp>
                  </el-col>
                </el-row>
                <div
                  v-else
                  key="form-loading"
                  v-loading="isLoadingReverse"
                  :element-loading-text="$t('notifications.loading')"
                  :element-loading-spinner="'el-icon-loading'"
                  element-loading-background="rgba(255, 255, 255, 0.8)"
                  class="view-loading"
                />
                <el-button
                  slot="reference"
                  type="text"
                  :class="isEmptyValue(currentOrder.uuid) ? 'is-disabled-option-popover' : 'is-enable-option-popover'"
                >
                  <i class="el-icon-error" />
                  <br>
                  {{ $t('form.pos.optionsPoinSales.salesOrder.cancelSaleTransaction') }}
                </el-button>
              </el-popover>
            </el-card>
          </el-col>

          <!-- printTicket -->

          <el-col :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                :class="(isEmptyValue(currentOrder.uuid) || !isProcessed) ? 'is-disabled-option-card' : 'is-enable-option-card'"
                @click="printTicket()"
              >
                <i class="el-icon-printer" />
                <br>
                {{ $t('form.pos.optionsPoinSales.salesOrder.print') }}
              </p>
            </el-card>
          </el-col>

          <!-- createNewReturnOrder -->

          <el-col :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                :class="classblockOption"
                @click="adviserPin ? validateOption($t('form.pos.optionsPoinSales.salesOrder.createNewReturnOrder')) : createNewCustomerReturnOrder()"
              >
                <i class="el-icon-refresh-left" />
                <br>
                {{ $t('form.pos.optionsPoinSales.salesOrder.createNewReturnOrder') }}
              </p>
            </el-card>
          </el-col>

          <!-- copyOrder -->

          <el-col :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                :class="classblockOption"
                @click="adviserPin ? validateOption($t('form.pos.optionsPoinSales.salesOrder.copyOrder')) : copyOrder()"
              >
                <i class="el-icon-document-copy" />
                <br>
                {{ $t('form.pos.optionsPoinSales.salesOrder.copyOrder') }}
              </p>
            </el-card>
          </el-col>

          <!-- cancelOrder -->

          <el-col :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                :style="blockOption"
                :class="(isEmptyValue(currentOrder.uuid) || isProcessed) ? 'is-disabled-option-card' : 'is-enable-option-card'"
                @click="adviserPin ? validateOption($t('form.pos.optionsPoinSales.salesOrder.cancelOrder')) : deleteOrder()"
              >
                <i class="el-icon-close" />
                <br>
                {{ $t('form.pos.optionsPoinSales.salesOrder.cancelOrder') }}
              </p>
            </el-card>
          </el-col>

          <!-- confirmDelivery -->

          <el-col v-if="allowsConfirmShipment" :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <el-popover
                v-model="popoverConfirmDelivery"
                placement="right"
                trigger="click"
                width="800"
                :disabled="!isProcessed"
              >
                <confirm-delivery
                  :is-selectable="false"
                  :is-visible="popoverConfirmDelivery"
                  popover-name="isShowPopoverMenu"
                />
                <div
                  slot="reference"
                  :class="classOptionPopoverConfirmDelivery"
                  @click="openDelivery()"
                >
                  <svg-icon icon-class="shopping" />
                  <br>
                  {{ $t('form.pos.optionsPoinSales.salesOrder.confirmDelivery') }}
                </div>
              </el-popover>
            </el-card>
          </el-col>

          <!-- applyDiscountOnOrder -->

          <el-col v-if="isAllowsApplyDiscount" :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <el-popover
                v-model="showCount"
                width="350"
                :title="$t('form.pos.applyDiscountOnOrder')"
                placement="top"
              >
                <div style="padding: 20px;">
                  <discount-order
                    ref="applyDiscountOnOrder"
                    v-shortkey="showCount ? {close: ['esc'], enter: ['enter']} : {}"
                    @shortkey.native="theActionDiscount"
                  />
                </div>
                <div style="text-align: right; margin: 0">
                  <el-button
                    type="danger"
                    class="custom-button-create-bp"
                    icon="el-icon-close"
                    @click="showCount = false"
                  />
                  <el-button
                    type="primary"
                    class="custom-button-create-bp"
                    icon="el-icon-check"
                    @click="addCount(discountAmount)"
                  />
                </div>
                <el-button
                  slot="reference"
                  type="text"
                  :disabled="isOptionPopoverDiscuent"
                  :class="classOptionPopoverDiscuent"
                >
                  <i class="el-icon-document-remove" />
                  <br>
                  {{ $t('form.pos.applyDiscountOnOrder') }}
                </el-button>
              </el-popover>
            </el-card>
          </el-col>

          <!-- salesDiscountOff -->

          <el-col v-if="isAllowsApplyDiscount" :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover">
              <el-popover
                v-model="showSalesDiscount"
                width="350"
                :title="$t('form.pos.salesDiscountOff')"
                placement="top"
              >
                <div style="padding: 20px;">
                  <sales-discount-off
                    ref="salesDiscountOff"
                    v-shortkey="showSalesDiscount ? {close: ['esc'], enter: ['enter']} : {}"
                    @shortkey.native="theActionSalesDiscountOff"
                  />
                </div>
                <div style="text-align: right; margin: 0">
                  <el-button
                    type="danger"
                    class="custom-button-create-bp"
                    icon="el-icon-close"
                    @click="showSalesDiscount = false"
                  />
                  <el-button
                    type="primary"
                    class="custom-button-create-bp"
                    icon="el-icon-check"
                    @click="SalesDiscount(discountRateOff)"
                  />
                </div>
                <el-button
                  slot="reference"
                  type="text"
                  :disabled="isOptionPopoverDiscuent"
                  :class="classOptionPopoverDiscuent"
                >
                  <i class="el-icon-document-remove" />
                  <br>
                  {{ $t('form.pos.salesDiscountOff') }}
                </el-button>
              </el-popover>
            </el-card>
          </el-col>
        </el-row>
      </el-collapse-item>

      <el-collapse-item :title="$t('form.pos.optionsPoinSales.cashManagement.title')" name="cashManagement">
        <el-row :gutter="12" style="padding-right: 10px;">
          <el-col v-if="isAllowsCashOpening" :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                style="cursor: pointer; text-align: center !important; color: black;min-height: 50px;"
              >
                <i class="el-icon-sell" />
                <br>
                <el-button
                  type="text"
                  @click="openCashOpening()"
                >
                  {{ $t('form.pos.optionsPoinSales.cashManagement.cashOpening') }}
                </el-button>
              </p>
            </el-card>
          </el-col>
          <el-col v-if="isAllowsCashWithdrawal" :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                style="cursor: pointer; text-align: center !important; color: black;min-height: 50px;"
              >
                <i class="el-icon-money" />
                <br>
                <el-button
                  type="text"
                  @click="openCashWithdrawal()"
                >
                  {{ $t('form.pos.optionsPoinSales.cashManagement.cashwithdrawal') }}
                </el-button>
              </p>
            </el-card>
          </el-col>
          <el-col v-if="isAllowsCashClosing" :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                style="cursor: pointer; text-align: center !important; color: black;min-height: 50px;"
                @click="openCashClosing()"
              >
                <i class="el-icon-sold-out" />
                <br>
                {{ $t('form.pos.optionsPoinSales.cashManagement.closeBox') }}
              </p>
            </el-card>
          </el-col>
          <el-col v-if="isAllowsAllocateSeller" :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                style="cursor: pointer; text-align: center !important; color: black;min-height: 50px;"
                @click="adviserPin ? validateOption($t('form.pos.optionsPoinSales.cashManagement.assignSeller')) : assignSeller()"
              >
                <svg-icon icon-class="peoples" />
                <i class="el-icon-bottom-right" />
                <br>
                {{ $t('form.pos.optionsPoinSales.cashManagement.assignSeller') }}
              </p>
            </el-card>
          </el-col>
          <el-col v-if="isAllowsAllocateSeller" :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                style="cursor: pointer; text-align: center !important; color: black;min-height: 50px;"
                @click="adviserPin ? validateOption($t('form.pos.optionsPoinSales.cashManagement.unassignSeller')) : unassignSeller()"
              >
                <svg-icon icon-class="peoples" />
                <i class="el-icon-top-right" />
                <br>
                {{ $t('form.pos.optionsPoinSales.cashManagement.unassignSeller') }}
              </p>
            </el-card>
          </el-col>
          <el-col v-if="isAllowsAllocateSeller" :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                style="cursor: pointer; text-align: center !important; color: black;min-height: 50px;"
                @click="adviserPin ? validateOption($t('form.pos.optionsPoinSales.cashManagement.transfer')) : transfer()"
              >
                <i class="el-icon-sort" />
                <br>
                {{ $t('form.pos.optionsPoinSales.cashManagement.transfer') }}
              </p>
            </el-card>
          </el-col>
          <el-col v-if="isAllowsAllocateSeller" :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                style="cursor: pointer; text-align: center !important; color: black;min-height: 50px;"
                @click="adviserPin ? validateOption($t('form.pos.optionsPoinSales.cashManagement.moneyIncome')) : moneyIncome()"
              >
                <i class="el-icon-money" />
                <br>
                {{ $t('form.pos.optionsPoinSales.cashManagement.moneyIncome') }}
              </p>
            </el-card>
          </el-col>
        </el-row>
      </el-collapse-item>

      <el-collapse-item :title="$t('form.pos.optionsPoinSales.generalOptions.title')" name="generalOptions">
        <general-options :metadata="metadata" />
      </el-collapse-item>
    </el-collapse>

    <el-dialog ref="dialog" :title="$t('form.pos.pinMessage.pin') + attributePin.label" width="40%" :visible.sync="visible">
      <el-input
        id="pin"
        ref="pin"
        v-model="pin"
        v-shortkey="visible ? {close: ['esc'], enter: ['enter']} : {}"
        autofocus
        type="password"
        :placeholder="$t('form.pos.tableProduct.pin')"
        :focus="true"
        @shortkey.native="theAction"
      />
      <span style="float: right;">
        <el-button
          type="danger"
          icon="el-icon-close"
          @click="closePin"
        />
        <el-button
          type="primary"
          icon="el-icon-check"
          @click="openPin(pin)"
        />
      </span>
    </el-dialog>
    <el-dialog
      v-shortkey="isComputedRender ? {close: ['esc'], enter: ['enter']} : {}"
      :title="$t(isLabelPanel)"
      :visible.sync="isComputedRender"
      :is-loaded-panel="isComputedRender"
      close-on-press-escape
      width="70%"
      center
      class="dialogo-seller"
      @shortkey.native="cashManagementModal"
    >
      <component
        :is="isComponentRender"
        :shortkey-action="isAction"
        :label-panel="isLabelPanel"
        :current-panel="isOpenPanel"
      />
    </el-dialog>
  </div>
</template>

<script>
// components and mixins
import OrdersList from '@theme/components/ADempiere/Form/VPOS/OrderList/index'
import ConfirmDelivery from '@theme/components/ADempiere/Form/VPOS/ConfirmDelivery'
import orderLineMixin from '@theme/components/ADempiere/Form/VPOS/Order/orderLineMixin.js'
import CashOpening from './CashOpening'
import CashSummaryMovements from './CashSummaryMovements'
import CashWithdrawal from './Cashwithdrawal'
import DiscountOrder from './DiscountOrder'
import AssignSeller from './AssignSeller'
import SalesDiscountOff from './SalesDiscountOff'
import ModalDialog from '@theme/components/ADempiere/Dialog'
import GeneralOptions from '@theme/components/ADempiere/Form/VPOS/Options/generalOptions.vue'

// api request methods
import {
  generateImmediateInvoice,
  withdrawal,
  createNewReturnOrder,
  deleteOrder,
  reverseSales,
  processOrder
} from '@/api/ADempiere/form/point-of-sales.js'
import { createShipment, shipments } from '@/api/ADempiere/form/point-of-sales.js'
import { validatePin } from '@/api/ADempiere/form/point-of-sales.js'
// import posProcess from '@/utils/ADempiere/constants/posProcess'

export default {
  name: 'PointOfSalesOptions',

  components: {
    AssignSeller,
    CashOpening,
    CashSummaryMovements,
    CashWithdrawal,
    ConfirmDelivery,
    GeneralOptions,
    ModalDialog,
    SalesDiscountOff,
    DiscountOrder,
    OrdersList
  },

  mixins: [
    orderLineMixin
  ],

  props: {
    metadata: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      activeName: '',
      processPos: '',
      pin: '',
      isAction: false,
      attributePin: {},
      validatePin: true,
      visible: false,
      showCount: false,
      showSalesDiscount: false,
      visibleReverse: false,
      isLoadingReverse: false,
      showFieldListOrder: false,
      messageReverseSales: '',
      showConfirmDelivery: false
    }
  },

  computed: {
    isComputedRender: {
      get() {
        return this.$store.getters[this.isOpenPanel.getters]
      },
      set(value) {
        this.$store.commit(this.isOpenPanel.commit, value)
      }
    },
    isOpenPanel() {
      const isOpen = {}
      switch (true) {
        case this.showCashOpen:
          isOpen.getters = 'getShowCashOpen'
          isOpen.commit = 'setshowCashOpen'
          break
        case this.showCashWithdrawl:
          isOpen.getters = 'getShowCashWithdrawl'
          isOpen.commit = 'setShowCashWithdrawl'
          break
        case this.showCashSummaryMovements:
          isOpen.getters = 'getShowCashSummaryMovements'
          isOpen.commit = 'setShowCashSummaryMovements'
          break
        case this.showAssignSeller:
          isOpen.getters = 'getShowAssignSeller'
          isOpen.commit = 'setShowAssignSeller'
          break
        case this.showUnassignSeller:
          isOpen.getters = 'getShowUnassignSeller'
          isOpen.commit = 'setShowUnassignSeller'
          break
        case this.showTransfer:
          isOpen.getters = 'getShowTransfer'
          isOpen.commit = 'setShowTransfer'
          break
        case this.showMoneyIncome:
          isOpen.getters = 'getShowMoneyIncome'
          isOpen.commit = 'setShowMoneyIncome'
          break
      }
      return isOpen
    },
    isLabelPanel() {
      let isLabel
      const baseTag = 'form.pos.optionsPoinSales.cashManagement.'
      switch (true) {
        case this.showCashOpen:
          isLabel = baseTag + 'cashOpening'
          break
        case this.showCashWithdrawl:
          isLabel = baseTag + 'cashwithdrawal'
          break
        case this.showCashSummaryMovements:
          isLabel = baseTag + 'closeBox'
          break
        case this.showAssignSeller:
          isLabel = baseTag + 'assignSeller'
          break
        case this.showUnassignSeller:
          isLabel = baseTag + 'unassignSeller'
          break
        case this.showTransfer:
          isLabel = baseTag + 'transfer'
          break
        case this.showMoneyIncome:
          isLabel = baseTag + 'moneyIncome'
          break
        default:
          isLabel = ''
          break
      }
      return isLabel
    },
    isComponentRender() {
      let component
      switch (true) {
        case this.showCashOpen:
        case this.showMoneyIncome:
          component = () => import('@theme/components/ADempiere/Form/VPOS/Options/CashOpening')
          this.clearField('Cash-Opening')
          break
        case this.showCashWithdrawl:
        case this.showTransfer:
          component = () => import('@theme/components/ADempiere/Form/VPOS/Options/Cashwithdrawal')
          this.clearField('Cash-Withdrawal')
          break
        case this.showCashSummaryMovements:
          component = () => import('@theme/components/ADempiere/Form/VPOS/Options/CashSummaryMovements')
          break
        case this.showAssignSeller:
        case this.showUnassignSeller:
          component = () => import('@theme/components/ADempiere/Form/VPOS/Options/AssignSeller')
          break
      }
      return component
    },
    isAllowsCashOpening() {
      return this.currentPointOfSales.isAllowsCashOpening
    },
    isAllowsCashClosing() {
      return this.currentPointOfSales.isAllowsCashClosing
    },
    isAllowsCashWithdrawal() {
      return this.currentPointOfSales.isAllowsCashWithdrawal
    },
    isAllowsAllocateSeller() {
      return this.currentPointOfSales.isAllowsAllocateSeller
    },
    allowsConfirmShipment() {
      return this.currentPointOfSales.isAllowsConfirmShipment
    },
    isDisplayCount() {
      return this.currentPointOfSales.isDisplayDiscount
    },
    infowOverdrawnInvoice() {
      if (this.$store.getters.getOverdrawnInvoice.attributePin) {
        return this.$store.getters.getOverdrawnInvoice.attributePin
      }
      return ''
    },
    allowsReturnOrder() {
      return this.$store.getters.posAttributes.currentPointOfSales.isAllowsReturnOrder
    },
    allowsCreateOrder() {
      return this.$store.getters.posAttributes.currentPointOfSales.isAllowsCreateOrder
    },
    isShowOrdersList: {
      get() {
        return this.ordersList.isShowPopover
      },
      set(value) {
        if (!this.isEmptyValue(this.$route.query.pos)) {
          this.$store.commit('showListOrders', value)
        }
      }
    },
    showCashWithdrawl() {
      return this.$store.getters.getShowCashWithdrawl
    },
    showCashOpen() {
      return this.$store.getters.getShowCashOpen
    },
    showCashSummaryMovements() {
      return this.$store.getters.getShowCashSummaryMovements
    },
    showAssignSeller() {
      return this.$store.getters.getShowAssignSeller
    },
    showUnassignSeller() {
      return this.$store.getters.getShowUnassignSeller
    },
    showTransfer() {
      return this.$store.getters.getShowTransfer
    },
    showMoneyIncome() {
      return this.$store.getters.getShowMoneyIncome
    },
    adviserPin() {
      return this.$store.getters.posAttributes.currentPointOfSales.isPosRequiredPin
    },
    blockOption() {
      if (!this.isEmptyValue(this.currentOrder.uuid)) {
        return 'cursor: pointer; text-align: center !important; color: black;min-height: 50px;'
      }
      return 'cursor: not-allowed; text-align: center !important; color: gray;min-height: 50px;'
    },
    blockOptionIsProcess() {
      if (!this.isEmptyValue(this.currentOrder.uuid)) {
        return this.currentOrder.isProcessed
      }
      return true
    },
    isAllowsApplyDiscount() {
      if (!this.isEmptyValue(this.currentPointOfSales.isAllowsApplyDiscount)) return this.currentPointOfSales.isAllowsApplyDiscount
      return false
    },
    isOptionPopoverDiscuent() {
      if (!this.isEmptyValue(this.currentOrder.uuid) && this.currentOrder.grandTotal > 0) return this.currentOrder.isProcessed
      return true
    },
    classOptionPopoverDiscuent() {
      if (this.isOptionPopoverDiscuent) return 'is-disabled-option-popover'
      return 'is-enable-option-popover'
    },
    classOptionPopoverConfirmDelivery() {
      if (!this.isOptionPopoverDiscuent || !this.isProcessed || this.currentOrder.isDelivered) return 'is-disabled-option-popover'
      return 'is-enable-option-popover'
    },
    classblockOption() {
      if (!this.isEmptyValue(this.currentOrder.uuid)) return 'is-enable-option-card'
      return 'is-disabled-option-card'
    },
    size() {
      const size = this.$store.getters.getWidthLeft
      return 24 / size
    },
    discountAmount() {
      return this.$store.getters.getValueOfField({
        containerUuid: 'Discount-Order',
        columnName: 'Discount'
      })
    },
    discountRateOff() {
      return this.$store.getters.getValueOfField({
        containerUuid: 'Sales-Discount-Off',
        columnName: 'Discount'
      })
    },
    currentPointOfSales() {
      return this.$store.getters.posAttributes.currentPointOfSales
    },
    ordersList() {
      if (this.isEmptyValue(this.currentPointOfSales)) {
        return []
      }
      return this.currentPointOfSales.listOrder
    },
    currentOrder() {
      if (this.isEmptyValue(this.currentPointOfSales)) {
        return {
          documentType: {},
          documentStatus: {
            value: ''
          },
          totalLines: 0,
          grandTotal: 0,
          salesRepresentative: {},
          businessPartner: {
            value: '',
            uuid: ''
          }
        }
      }
      return this.currentPointOfSales.currentOrder
    },
    showListOrdes: {
      get() {
        return this.$store.getters.getShowList
      },
      set(value) {
        this.$store.commit('showListOrders', value)
      }
    },
    popoverConfirmDelivery: {
      get() {
        return this.$store.getters.getConfirmDelivery
      },
      set(value) {
        if (!this.isEmptyValue(this.currentOrder.uuid)) {
          this.$store.commit('setConfirmDelivery', value)
        }
      }
    },
    isProcessed() {
      if (!this.isEmptyValue(this.currentOrder.documentStatus.value) && this.currentOrder.documentStatus.value === 'CO') {
        return true
      }
      return false
    }
  },

  watch: {
    visible(value) {
      if (value && !this.isEmptyValue(this.$refs)) {
        setTimeout(() => {
          this.focusPin()
        }, 300)
      }
    },
    showCount(value) {
      if (value && !this.isEmptyValue(this.$refs)) {
        setTimeout(() => {
          this.focusDiscount(value, 'applyDiscountOnOrder')
        }, 300)
      }
    },
    showSalesDiscount(value) {
      if (value && !this.isEmptyValue(this.$refs)) {
        setTimeout(() => {
          this.focusDiscount(value, 'salesDiscountOff')
        }, 300)
      }
    }
  },

  methods: {
    clearField(containerUuid) {
      this.$store.commit('updateValuesOfContainer', {
        containerUuid,
        attributes: [{
          columnName: 'PayAmt',
          value: 0
        }, {
          columnName: 'CollectingAgent_ID',
          value: undefined
        }, {
          columnName: 'Description',
          value: undefined
        }]
      })
    },
    openDelivery() {
      if (!this.isProcessed) {
        return
      }
      createShipment({
        posUuid: this.currentPointOfSales.uuid,
        orderUuid: this.currentOrder.uuid,
        salesRepresentativeUuid: this.currentPointOfSales.salesRepresentative.uuid
      })
        .then(shipment => {
          this.$store.commit('setShipment', shipment)
          shipments({ shipmentUuid: shipment.uuid })
            .then(response => {
              this.$store.commit('setDeliveryList', response.records)
            })
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: error.message,
            duration: 1500,
            showClose: true
          })
        })
    },
    theAction(event) {
      if (this.visible) {
        switch (event.srcKey) {
          case 'enter':
            this.openPin(this.pin)
            break
          case 'close':
            this.closePin()
            break
        }
      }
    },
    focusDiscount(value, ref) {
      this.$refs[ref].$children[0].$children[0].$children[0].$children[0].$children[1].isShowed = value
      this.$refs[ref].$children[0].$children[0].$children[0].$children[0].$children[1].$children[0].$children[0].focus()
    },
    theActionDiscount(event) {
      if (this.showCount) {
        switch (event.srcKey) {
          case 'enter':
            if (this.discountAmount > 1) this.addCount(this.discountAmount)
            break
          case 'close':
            this.showCount = false
            this.$store.commit('updateValueOfField', {
              containerUuid: 'Discount-Order',
              columnName: 'Discount',
              value: ''
            })
            break
        }
      }
    },
    theActionSalesDiscountOff(event) {
      if (this.showSalesDiscount) {
        switch (event.srcKey) {
          case 'enter':
            if (this.discountAmount > 0) this.SalesDiscount(this.discountRateOff)
            break
          case 'close':
            this.showSalesDiscount = false
            this.$store.commit('updateValueOfField', {
              containerUuid: 'Sales-Discount-Off',
              columnName: 'Discount',
              value: ''
            })
            break
        }
      }
    },
    cashManagementModal(event) {
      if (this.isComputedRender) {
        switch (event.srcKey) {
          case 'close':
            this.$store.commit(this.isOpenPanel.commit, false)
            break
          case 'enter': {
            this.isAction = true
            break
          }
        }
      }
    },
    openCashOpening() {
      const posUuid = this.currentPointOfSales.uuid
      this.$store.dispatch('listPaymentOpen', posUuid)
      this.$store.commit('setshowCashOpen', true)
    },
    openCashWithdrawal() {
      const posUuid = this.currentPointOfSales.uuid
      this.$store.dispatch('listPaymentWithdrawal', posUuid)
      this.$store.commit('setShowCashWithdrawl', true)
    },
    openCashClosing() {
      const posUuid = this.currentPointOfSales.uuid
      this.$store.dispatch('listCashSummary', posUuid)
      this.$store.commit('setShowCashSummaryMovements', true)
    },
    assignSeller() {
      this.$store.commit('setShowAssignSeller', true)
    },
    unassignSeller() {
      this.$store.commit('setShowUnassignSeller', true)
    },
    moneyIncome() {
      this.$store.commit('setShowMoneyIncome', true)
    },
    transfer() {
      this.$store.commit('setShowTransfer', true)
    },
    openListOrdes() {
      this.showFieldListOrder = true
    },
    closePin() {
      this.visible = false
      this.$store.dispatch('changePopoverOverdrawnInvoice', { visible: false })
      this.pin = ''
    },
    focusPin() {
      this.$refs.pin.focus()
    },
    openPin(pin) {
      this.focusPin()
      validatePin({
        posUuid: this.currentPointOfSales.uuid,
        pin
      })
        .then(response => {
          this.validatePin = true
          this.pin = ''
          this.visible = false
          this.optionPin(this.attributePin)
          this.$message({
            type: 'success',
            message: 'Acción a realizar',
            showClose: true
          })
        })
        .catch(error => {
          console.error(error.message)
          this.$message({
            type: 'error',
            message: error.message,
            showClose: true
          })
          this.pin = ''
        })
        .finally(() => {
          this.pin = ''
          this.visible = false
        })
    },
    validateOption(name) {
      this.visible = true
      this.attributePin = {
        type: 'updateOrder',
        label: name
      }
    },
    optionPin(action) {
      switch (action.label) {
        case this.$t('form.pos.optionsPoinSales.salesOrder.createNewReturnOrder'):
          this.createNewCustomerReturnOrder()
          break
        case this.$t('form.pos.optionsPoinSales.salesOrder.completePreparedOrder'):
          this.completePreparedOrder()
          break
        case this.$t('form.pos.optionsPoinSales.salesOrder.generateImmediateInvoice'):
          this.generateImmediateInvoice()
          break
        case this.$t('form.pos.optionsPoinSales.salesOrder.cancelSaleTransaction'):
          this.reverseSalesTransaction()
          break
        case this.$t('form.pos.optionsPoinSales.salesOrder.createPos'):
          this.withdrawal()
          break
        case this.$t('form.pos.optionsPoinSales.salesOrder.print'):
          this.printTicket()
          break
        case this.$t('form.pos.optionsPoinSales.salesOrder.copyOrder'):
          this.copyOrder()
          break
        case this.$t('form.pos.optionsPoinSales.salesOrder.cancelOrder'):
          this.deleteOrder()
          break
        case this.$t('form.pos.optionsPoinSales.generalOptions.changePos'):
          this.changePos()
          break
        case this.$t('form.pos.pinMessage.newOrder'):
          this.newOrder()
          break
        case this.$t('form.pos.optionsPoinSales.cashManagement.cashOpening'):
          this.openCashOpening()
          break
        case this.$t('form.pos.optionsPoinSales.cashManagement.cashwithdrawal'):
          this.openCashWithdrawal()
          break
        case this.$t('form.pos.optionsPoinSales.cashManagement.closeBox'):
          this.openCashClosing()
          break
        case this.$t('form.pos.optionsPoinSales.cashManagement.assignSeller'):
          this.assignSeller()
          break
        case this.$t('form.pos.optionsPoinSales.cashManagement.unassignSeller'):
          this.unassignSeller()
          break
        case this.$t('form.pos.optionsPoinSales.cashManagement.moneyIncome'):
          this.moneyIncome()
          break
        case this.$t('form.pos.optionsPoinSales.cashManagement.transfer'):
          this.transfer()
          break
      }
    },
    printTicket() {
      const orderUuid = this.currentOrder.uuid
      const posUuid = this.currentPointOfSales.uuid
      this.$store.dispatch('printTicket', { posUuid, orderUuid })
    },
    generateImmediateInvoice() {
      // TODO: Add BPartner
      const { uuid: posUuid, id: posId } = this.currentPointOfSales
      generateImmediateInvoice({
        posId,
        posUuid
      })
      // close panel lef
      this.$store.commit('setShowPOSOptions', false)
    },
    completePreparedOrder() {
      if (this.isEmptyValue(this.currentOrder.uuid) || this.currentOrder.documentStatus.value !== 'DR') {
        return ''
      }
      const orderUuid = this.currentOrder.uuid
      const posUuid = this.currentPointOfSales.uuid
      this.$store.dispatch('updateOrderPos', true)
      this.$store.dispatch('updatePaymentPos', true)
      this.$message({
        type: 'info',
        message: this.$t('notifications.processing'),
        showClose: true
      })
      processOrder({
        posUuid,
        orderUuid,
        isOpenRefund: !this.isEmptyValue(this.$store.getters.getListRefundReference),
        createPayments: false,
        payments: []
      })
        .then(response => {
          this.$store.dispatch('printTicket', { posUuid, orderUuid })
          this.$store.dispatch('reloadOrder', response.uuid)
          this.$message({
            type: 'success',
            message: this.$t('notifications.completed'),
            showClose: true
          })
          this.$store.dispatch('printTicket', { posUuid, orderUuid })
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
          // close panel lef
          this.$store.commit('setShowPOSOptions', false)
        })
    },
    reverseSalesTransaction() {
      this.isLoadingReverse = true
      reverseSales({
        posUuid: this.currentPointOfSales.uuid,
        orderUuid: this.currentOrder.uuid,
        description: this.messageReverseSales
      })
        .then(response => {
          const posUuid = this.currentPointOfSales.uuid
          const orderUuid = response.uuid
          this.$store.dispatch('printTicket', { posUuid, orderUuid })
          this.$store.dispatch('setCurrentPOS', this.currentPointOfSales)
          this.clearOrder()
        })
        .catch(error => {
          console.error(error.message)
          this.$message({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
        .finally(() => {
          this.isLoadingReverse = false
          this.visibleReverse = false
          this.messageReverseSales = ''
        })
    },
    withdrawal() {
      const { uuid: posUuid, id: posId } = this.currentPointOfSales
      // TODO: Add BParner, C_BankAccount_ID (caja), CashTransferBankAccount_ID, PAY_C_BankAccount_ID
      withdrawal({
        posId,
        posUuid
      })
      // close panel lef
      this.$store.commit('setShowPOSOptions', false)
    },
    createNewCustomerReturnOrder() {
      // TODO: New Customer Return Order
      if (this.isEmptyValue(this.currentOrder.uuid)) {
        return ''
      }

      createNewReturnOrder({
        orderUuid: this.currentOrder.uuid
      })
      // close panel lef
      this.$store.commit('setShowPOSOptions', false)
    },
    showModal(action) {
      this.$store.dispatch('setShowDialog', {
        type: action.type,
        action: {
          ...action,
          containerUuid: action.uuid
        }
      })
    },
    copyOrder() {
      // TODO: Support Copy Order
      if (this.isEmptyValue(this.currentOrder.uuid)) {
        return ''
      }
      console.info('Support Copy Order', this.currentOrder.uuid)
    },
    copyLineOrder() {
      const process = this.$store.getters.getProcess(this.posProcess[1].uuid)
      this.showModal(process)
    },
    deleteOrder() {
      if (this.isEmptyValue(this.currentOrder.uuid) || this.isProcessed) {
        return ''
      }
      this.$store.dispatch('updateOrderPos', true)
      deleteOrder({
        orderUuid: this.currentOrder.uuid
      })
        .then(response => {
          this.changePos(this.currentPointOfSales)
          this.$message({
            type: 'success',
            message: this.$t('form.pos.optionsPoinSales.salesOrder.orderRemoved'),
            showClose: true
          })
          this.$store.dispatch('listOrdersFromServer', {
            posUuid: this.currentPointOfSales.uuid
          })
          this.$store.dispatch('updateOrderPos', false)
          // close panel lef
          this.$store.commit('setShowPOSOptions', false)
          this.newOrder()
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
    },
    addCount(discountAmount) {
      this.$message({
        message: 'Acción a realizar',
        showClose: true
      })
      this.$store.dispatch('updateOrder', {
        orderUuid: this.currentOrder.uuid,
        posUuid: this.currentPointOfSales.uuid,
        discountAmount,
        isDiscountOrder: true
      })
        .then(response => {
          this.$message({
            type: 'success',
            showClose: true,
            message: 'ok'
          })
          this.$store.commit('updateValueOfField', {
            containerUuid: 'Discount-Order',
            columnName: 'Discount',
            value: ''
          })
        })
      this.showCount = false
    },
    SalesDiscount(discountRateOff) {
      this.$message({
        message: 'Acción a realizar',
        showClose: true
      })
      this.$store.dispatch('updateOrder', {
        orderUuid: this.currentOrder.uuid,
        posUuid: this.currentPointOfSales.uuid,
        discountRateOff,
        isDiscountOrder: true
      })
        .then(response => {
          setTimeout(() => {
            this.$message({
              type: 'success',
              showClose: true,
              message: 'ok'
            })
          }, 2000)
        })
      this.$store.commit('updateValueOfField', {
        containerUuid: 'Sales-Discount-Off',
        columnName: 'Discount',
        value: ''
      })
      this.showSalesDiscount = false
    },
    seeOrderList() {
      if (this.ordersList.recordCount <= 0) {
        this.$store.dispatch('listOrdersFromServer', {})
      }
    },
    changePos(posElement) {
      if (this.adviserPin) {
        this.validateOption(this.$t('form.pos.optionsPoinSales.generalOptions.changePos'))
        return
      }

      this.$store.dispatch('setCurrentPOS', posElement)
      this.clearOrder()
    },
    newOrder() {
      const posUuid = this.currentPointOfSales.uuid
      let customerUuid = this.$store.getters.getValueOfField({
        containerUuid: this.$route.meta.uuid,
        columnName: 'C_BPartner_ID_UUID'
      })
      const id = this.$store.getters.getValueOfField({
        containerUuid: this.$route.meta.uuid,
        columnName: 'C_BPartner_ID'
      })
      const documentTypeUuid = this.$store.getters.getValueOfField({
        containerUuid: this.$route.meta.uuid,
        columnName: 'C_DocTypeTarget_ID_UUID'
      })
      if (this.isEmptyValue(customerUuid) || id === 1000006) {
        customerUuid = this.currentPointOfSales.templateCustomer.uuid
      }
      this.$store.dispatch('createOrder', {
        posUuid,
        customerUuid: this.isEmptyValue(this.$store.getters.getNewCustomer) ? customerUuid : this.$store.getters.getNewCustomer.uuid,
        salesRepresentativeUuid: this.currentPointOfSales.salesRepresentative.uuid,
        documentTypeUuid
      })
        .then(response => {
          this.$store.dispatch('reloadOrder', { orderUuid: response.uuid })
          this.$router.push({
            params: {
              ...this.$route.params
            },
            query: {
              ...this.$route.query,
              action: response.uuid
            }
          }).then(() => {
            this.$store.commit('setShowPOSCollection', false)
            this.$store.dispatch('listOrdersFromServer', {
              posUuid: this.currentPointOfSales.uuid
            })
          }).catch(() => {})
        })
      this.$store.dispatch('changeFocusNewOrder', true)
    },
    clearOrder() {
      this.$router.push({
        params: {
          ...this.$route.params
        },
        query: {
          pos: this.currentPointOfSales.id
        }
      }).catch(() => {
      }).finally(() => {
        this.$store.commit('setListPayments', {})
        const { templateCustomer } = this.currentPointOfSales
        this.$store.commit('updateValuesOfContainer', {
          containerUuid: this.metadata.containerUuid,
          attributes: [{
            columnName: 'UUID',
            value: undefined
          },
          {
            columnName: 'ProductValue',
            value: undefined
          },
          {
            columnName: 'C_BPartner_ID',
            value: templateCustomer.id
          },
          {
            columnName: 'DisplayColumn_C_BPartner_ID',
            value: templateCustomer.name
          },
          {
            columnName: ' C_BPartner_ID_UUID',
            value: templateCustomer.uuid
          }]
        })
        this.$store.dispatch('setOrder', {
          documentType: {},
          documentStatus: {
            value: ''
          },
          totalLines: 0,
          grandTotal: 0,
          salesRepresentative: {},
          businessPartner: {
            value: '',
            uuid: ''
          }
        })
        this.$store.commit('setShowPOSCollection', false)
        this.$store.dispatch('listOrderLine', [])
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .is-disabled-option-popover {
    cursor: not-allowed;
    text-align: center !important;
    color: gray !important;
    min-height: 50px;
    width: -webkit-fill-available;
    white-space: normal;
  }
  .is-enable-option-popover {
    cursor: pointer;
    text-align: center !important;
    color: black;
    min-height: 50px;
    width: -webkit-fill-available;
    white-space: normal;
  }
  .is-disabled-option-card {
    cursor: not-allowed;
    text-align: center !important;
    color: gray !important;
    min-height: 50px;
  }
  .is-enable-option-card {
    cursor: pointer;
    text-align: center !important;
    color: black !important;
    min-height: 50px;
  }
  .el-button--text {
    border-color: transparent;
    color: black;
    background: transparent;
    padding-left: 0;
    padding-right: 0;
  }
  .el-button--text:hover, .el-button--text:focus {
    color: #46a6ff !important;
    border-color: transparent;
    background-color: transparent;
  }
  .el-col :hover {
    background-color: rgba(209, 233, 255, 0.719);
  }
  .title-of-option {
    cursor: pointer;
    text-align: center !important;
  }
  .spam-button {
    float: right;
    padding-top: 5px;
    background-color:white;
    background:white;
  }
  .container-reverse {
    background-color:white;
    background:white;
  }
  .container-popover {
    padding-right: 10px;
    background-color:white;
    background:white;
  }
  .dialogo-seller {
    overflow: hidden;
  }
</style>
<style>
  .el-textarea__inner:hover {
    background-color: #FFFFFF!important;
  }
</style>
