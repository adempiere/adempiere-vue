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
                width="900"
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

          <el-col :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                :style="blockOption"
                @click="adviserPin ? validateOption($t('form.pos.optionsPoinSales.salesOrder.generateImmediateInvoice')) : generateImmediateInvoice()"
              >
                <i class="el-icon-document-add" />
                <br>
                {{ $t('form.pos.optionsPoinSales.salesOrder.generateImmediateInvoice') }}
              </p>
            </el-card>
          </el-col>

          <el-col :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                :style="blockOption"
                @click="adviserPin ? validateOption($t('form.pos.optionsPoinSales.salesOrder.completePreparedOrder')) : completePreparedOrder()"
              >
                <i class="el-icon-success" />
                <br>
                {{ $t('form.pos.optionsPoinSales.salesOrder.completePreparedOrder') }}
              </p>
            </el-card>
          </el-col>

          <el-col v-if="allowsReturnOrder" :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <el-popover
                v-model="visibleReverse"
                placement="top"
                width="450"
                :disabled="!isProcessed"
              >
                <el-row :gutter="24" class="container-reverse">
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
                <el-button slot="reference" type="text" style="min-height: 50px;width: -webkit-fill-available;white-space: normal;">
                  <i class="el-icon-error" />
                  <br>
                  {{ $t('form.pos.optionsPoinSales.salesOrder.cancelSaleTransaction') }}
                </el-button>
              </el-popover>
            </el-card>
          </el-col>

          <el-col :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                :style="blockOption"
                @click="adviserPin ? validateOption($t('form.pos.optionsPoinSales.salesOrder.createPos')) : withdrawal()"
              >
                <i class="el-icon-document-remove" />
                <br>
                {{ $t('form.pos.optionsPoinSales.salesOrder.createPos') }}
              </p>
            </el-card>
          </el-col>

          <el-col :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                :style="blockOption"
                @click="printTicket()"
              >
                <i class="el-icon-printer" />
                <br>
                {{ $t('form.pos.optionsPoinSales.salesOrder.print') }}
              </p>
            </el-card>
          </el-col>
          <el-col :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                :style="blockOption"
                @click="adviserPin ? validateOption($t('form.pos.optionsPoinSales.salesOrder.createNewReturnOrder')) : createNewCustomerReturnOrder()"
              >
                <i class="el-icon-refresh-left" />
                <br>
                {{ $t('form.pos.optionsPoinSales.salesOrder.createNewReturnOrder') }}
              </p>
            </el-card>
          </el-col>
          <el-col :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                :style="blockOption"
                @click="adviserPin ? validateOption($t('form.pos.optionsPoinSales.salesOrder.copyOrder')) : copyOrder()"
              >
                <i class="el-icon-document-copy" />
                <br>
                {{ $t('form.pos.optionsPoinSales.salesOrder.copyOrder') }}
              </p>
            </el-card>
          </el-col>
          <el-col :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                :style="blockOption"
                @click="adviserPin ? validateOption($t('form.pos.optionsPoinSales.salesOrder.cancelOrder')) : deleteOrder()"
              >
                <i class="el-icon-close" />
                <br>
                {{ $t('form.pos.optionsPoinSales.salesOrder.cancelOrder') }}
              </p>
            </el-card>
          </el-col>
          <el-col :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
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
                  :style="blockOption"
                  @click="openDelivery()"
                >
                  <svg-icon icon-class="shopping" />
                  <br>
                  {{ $t('form.pos.optionsPoinSales.salesOrder.confirmDelivery') }}
                </div>
              </el-popover>
            </el-card>
          </el-col>
        </el-row>
      </el-collapse-item>

      <el-collapse-item :title="$t('form.pos.optionsPoinSales.cashManagement.title')" name="cashManagement">
        <el-row :gutter="12" style="padding-right: 10px;">
          <el-col :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                :style="blockOption"
              >
                <i class="el-icon-sell" />
                <br>
                {{ $t('form.pos.optionsPoinSales.cashManagement.cashOpening') }}
              </p>
            </el-card>
          </el-col>
          <el-col :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                :style="blockOption"
              >
                <i class="el-icon-money" />
                <br>
                {{ $t('form.pos.optionsPoinSales.cashManagement.cashwithdrawal') }}
              </p>
            </el-card>
          </el-col>
          <el-col :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                :style="blockOption"
                @click="cashClosing"
              >
                <i class="el-icon-sold-out" />
                <br>
                {{ $t('form.pos.optionsPoinSales.cashManagement.closeBox') }}
              </p>
            </el-card>
          </el-col>
        </el-row>
      </el-collapse-item>

      <el-collapse-item :title="$t('form.pos.optionsPoinSales.generalOptions.title')" name="generalOptions">
        <el-row :gutter="24" style="padding-right: 10px;">
          <el-col :span="size">
            <el-card shadow="hover" style="height: 100px">
              <el-dropdown trigger="click" style="padding-top: 8px;color: black;display: block;" @command="adviserPin ? validateOption($t('form.pos.optionsPoinSales.generalOptions.changePos')) : changePos()">
                <p
                  style="cursor: pointer;text-align: center !important;color: black;min-height: 50px;margin: 0px;"
                >
                  <i class="el-icon-mobile-phone" />
                  <br>
                  {{ $t('form.pos.optionsPoinSales.generalOptions.changePos') }}
                </p>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="item in listPointOfSales"
                    :key="item.uuid"
                    :command="item"
                  >
                    {{ item.name }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-card>
          </el-col>
          <!-- Product List Price -->
          <el-col :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <el-popover
                placement="right"
                trigger="click"
                width="800"
              >
                <list-product-price
                  :is-selectable="false"
                  popover-name="isShowPopoverMenu"
                />
                <div
                  slot="reference"
                  :style="blockOption"
                  @click="isShowProductsPriceList = !isShowProductsPriceList"
                >
                  <svg-icon icon-class="shopping" />
                  <br>
                  {{ $t('form.pos.optionsPoinSales.generalOptions.listProducts') }}
                </div>
              </el-popover>
            </el-card>
          </el-col>
          <!-- List Warehouse -->
          <el-col :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <el-dropdown trigger="click" style="padding-top: 8px;color: black;display: block;" @command="changePos">
                <p
                  style="cursor: pointer;text-align: center !important;color: black;min-height: 50px;margin: 0px;"
                >
                  <svg-icon icon-class="tree-table" />
                  <br>
                  {{ $t('form.pos.optionsPoinSales.generalOptions.changeWarehouseList') }}
                </p>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="item in warehousesListPointOfSales"
                    :key="item.id"
                    :command="item"
                  >
                    {{ item.name }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-card>
          </el-col>
          <!-- List Price -->
          <el-col :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <el-dropdown trigger="click" style="padding-top: 8px;color: black;display: block;" @command="changePos">
                <p
                  style="cursor: pointer;text-align: center !important;color: black;min-height: 50px;margin: 0px;"
                >
                  <svg-icon icon-class="list" />
                  <br>
                  {{ $t('form.pos.optionsPoinSales.generalOptions.changePriceList') }} </p>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="item in priceListPointOfSales"
                    :key="item.uuid"
                    :command="item"
                  >
                    {{ item.name }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-card>
          </el-col>
        </el-row>
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
  </div>
</template>

<script>
import OrdersList from '@/components/ADempiere/Form/VPOS/OrderList/index'
import ListProductPrice from '@/components/ADempiere/Form/VPOS/ProductInfo/productList'
import ConfirmDelivery from '@/components/ADempiere/Form/VPOS/ConfirmDelivery'
import {
  generateImmediateInvoice,
  withdrawal,
  createNewReturnOrder,
  cashClosing,
  deleteOrder,
  createOrder,
  reverseSales,
  processOrder
} from '@/api/ADempiere/form/point-of-sales.js'
import { createShipment, shipments } from '@/api/ADempiere/form/point-of-sales.js'
import { validatePin } from '@/api/ADempiere/form/point-of-sales.js'
import ModalDialog from '@/components/ADempiere/Dialog'
import posProcess from '@/utils/ADempiere/constants/posProcess'
import orderLineMixin from '@/components/ADempiere/Form/VPOS/Order/orderLineMixin.js'

export default {
  name: 'Options',
  components: {
    ListProductPrice,
    OrdersList,
    ModalDialog,
    ConfirmDelivery
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
      attributePin: {},
      validatePin: true,
      visible: false,
      visibleReverse: false,
      showFieldListOrder: false,
      messageReverseSales: '',
      showConfirmDelivery: false,
      posProcess
    }
  },
  computed: {
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
    isShowProductsPriceList: {
      get() {
        return this.$store.state['pointOfSales/point/index'].productPrice.isShowPopoverMenu
      },
      set(isShowed) {
        if (!this.isEmptyValue(this.$route.query.pos)) {
          this.$store.commit('showListProductPrice', {
            attribute: 'isShowPopoverMenu',
            isShowed
          })
        }
      }
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
    adviserPin() {
      return this.$store.getters.posAttributes.currentPointOfSales.isPosRequiredPin
    },
    blockOption() {
      if (!this.isEmptyValue(this.currentOrder.uuid)) {
        return 'cursor: pointer; text-align: center !important; color: black;min-height: 50px;'
      }
      return 'cursor: not-allowed; text-align: center !important; color: gray;min-height: 50px;'
    },
    size() {
      const size = this.$store.getters.getWidthLeft
      return 24 / size
    },
    currentPointOfSales() {
      return this.$store.getters.posAttributes.currentPointOfSales
    },
    listPointOfSales() {
      return this.$store.getters.posAttributes.pointOfSalesList
    },
    priceListPointOfSales() {
      const list = this.$store.getters.posAttributes.currentPointOfSales.pricesList
      if (this.isEmptyValue(list)) {
        return []
      }
      return list
    },
    warehousesListPointOfSales() {
      const list = this.$store.getters.posAttributes.currentPointOfSales.warehousesList
      if (this.isEmptyValue(list)) {
        return []
      }
      return list
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
    // popoverConfirmDelivery(value) {
    //   this.showConfirmDelivery = value
    // },
    visible(value) {
      if (value && !this.isEmptyValue(this.$refs)) {
        setTimeout(() => {
          this.focusPin()
        }, 300)
      }
    }
  },
  created() {
    this.findProcess(this.posProcess)
  },
  methods: {
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
      }
    },
    notSubmitForm(event) {
      event.preventDefault()
      return false
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
      if (this.isEmptyValue(this.currentOrder.uuid)) {
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
        createPayments: false,
        payments: []
      })
        .then(response => {
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
      reverseSales({
        posUuid: this.currentPointOfSales.uuid,
        orderUuid: this.currentOrder.uuid,
        description: this.messageReverseSales
      })
        .then(response => {
          const orderUuid = this.currentOrder.uuid
          this.$store.dispatch('reloadOrder', { orderUuid })
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
      if (this.isEmptyValue(this.currentOrder.uuid)) {
        return ''
      }
      this.processPos = posProcess[1].uuid
      const posUuid = this.currentPointOfSales.uuid
      const parametersList = [{
        columnName: 'C_Order_ID',
        value: this.currentOrder.id
      }]
      this.$store.commit('setShowPOSCollection', false)
      this.$store.dispatch('addParametersProcessPos', parametersList)
      createOrder({
        posUuid,
        customerUuid: this.currentOrder.businessPartner.uuid,
        priceListUuid: this.currentPointOfSales.currentPriceList.uuid,
        warehouseUuid: this.currentPointOfSales.currentWarehouse.uuid
      })
        .then(order => {
          this.$store.dispatch('currentOrder', order)

          this.$router.push({
            params: {
              ...this.$route.params
            },
            query: {
              ...this.$route.query,
              action: order.uuid
            }
          }).then(() => {
          }).catch(() => {})

          this.$store.commit('setIsReloadListOrders')
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
          const process = this.$store.getters.getProcess(this.posProcess[1].uuid)
          this.showModal(process)
          // close panel lef
          this.$store.commit('setShowPOSOptions', false)
        })
    },
    copyLineOrder() {
      const process = this.$store.getters.getProcess(this.posProcess[1].uuid)
      this.showModal(process)
    },
    cashClosing() {
      const { uuid: posUuid, id: posId } = this.currentPointOfSales
      cashClosing({
        posId,
        posUuid
      })
    },
    deleteOrder() {
      if (this.isEmptyValue(this.currentOrder.uuid)) {
        return ''
      }
      this.$store.dispatch('updateOrderPos', true)
      deleteOrder({
        orderUuid: this.currentOrder.uuid
      })
        .then(response => {
          this.changePos(this.currentPointOfSales)
        })
        .finally(() => {
          this.$store.dispatch('listOrdersFromServer', {
            posUuid: this.currentPointOfSales.uuid
          })
          this.$message({
            type: 'success',
            message: this.$t('form.pos.optionsPoinSales.salesOrder.orderRemoved'),
            showClose: true
          })
          this.$store.dispatch('updateOrderPos', false)
          // close panel lef
          this.$store.commit('setShowPOSOptions', false)
        })
    },
    seeOrderList() {
      if (this.ordersList.recordCount <= 0) {
        this.$store.dispatch('listOrdersFromServer', {})
      }
    },
    findProcess() {
      const findServer = this.$store.getters.getProcess('a42ad0c6-fb40-11e8-a479-7a0060f0aa01')
      if (this.isEmptyValue(findServer)) {
        posProcess.forEach(item => {
          this.$store.dispatch('getProcessFromServer', { containerUuid: item.uuid, processId: item.id })
        })
      }
    },
    changePos(posElement) {
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
        customerUuid = this.currentPointOfSales.templateBusinessPartner.uuid
      }
      this.$store.dispatch('createOrder', {
        posUuid,
        customerUuid,
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
        const { templateBusinessPartner } = this.currentPointOfSales
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
            value: templateBusinessPartner.id
          },
          {
            columnName: 'DisplayColumn_C_BPartner_ID',
            value: templateBusinessPartner.name
          },
          {
            columnName: ' C_BPartner_ID_UUID',
            value: templateBusinessPartner.uuid
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
</style>
<style>
  .el-textarea__inner:hover {
    background-color: #FFFFFF!important;
  }
</style>
