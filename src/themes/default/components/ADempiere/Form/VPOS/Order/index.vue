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
  <div
    v-if="isLoaded"
    id="headerContainer"
    style="display: -webkit-box; height: 100%"
  >
    <el-container style="background: white; height: 100%!important;">
      <el-header
        height="15%"
        :style="isShowedPOSKeyLayout ? 'padding-right: 1%; padding-left: 1%;' : 'padding-right: 1%; padding-left: 1%;'"
      >
        <el-form label-position="top" label-width="500px" @submit.native.prevent="notSubmitForm">
          <el-row :gutter="24" style="display: flex;">
            <el-col :span="colFieldProductCode" style="padding-left: 0px; padding-right: 0px;">
              <template
                v-for="(field) in fieldsList"
              >
                <product-info
                  v-if="field.columnName === 'ProductValue'"
                  id="ProductValue"
                  ref="ProductValue"
                  :key="field.columnName"
                  :metadata="field"
                />
              </template>
            </el-col>
            <el-col :span="6" :style="styleTab">
              <business-partner
                id="BusinessPartner"
                :parent-metadata="{
                  name: panelMetadata.name,
                  containerUuid: panelMetadata.containerUuid,
                  uuid: panelMetadata.uuid,
                  panelType: panelMetadata.panelType
                }"
                :is-disabled="isDisabled"
              />
            </el-col>
            <el-col :span="6" :style="isShowedPOSKeyLayout ? 'padding: 0px; margin-top: 3.%;' : 'padding: 0px;'">
              <fast-ordes-list style="margin-right: 2%;margin-left: 2%;font-size: 12px;" />
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main style="background: white; padding: 0px; height: 100% !important; overflow: hidden">
        <el-container style="background: white; padding: 0px; height: 100% !important;">
          <el-main style="padding-top: 0px; padding-right: 10px; padding-bottom: 0px; padding-left: 10px;">
            <el-table
              id="linesOrder"
              ref="linesTable"
              v-shortkey="shortsKey"
              :data="listOrderLine"
              border
              highlight-current-row
              fit
              style="overflow: auto;"
              @current-change="handleCurrentLineChange"
              @shortkey.native="shortcutKeyMethod"
              @cell-click="editCell"
              @click.native.prevent="focusProducto()"
            >
              <template v-for="(valueOrder, item, key) in orderLineDefinition">
                <el-table-column
                  v-if="displayLabel(valueOrder)"
                  :key="key"
                  :column-key="valueOrder.columnName"
                  :label="valueOrder.label"
                  :width="!valueOrder.isNumeric ? valueOrder.size : valueOrder.size"
                  :align="valueOrder.isNumeric ? 'right' : 'left'"
                >
                  <template slot-scope="scope">
                    <template v-if="isEditQtyOrdered && fileColumnNameEdit === 'CurrentPrice' && valueOrder.columnName === 'CurrentPrice' && !isEmptyValue(isEditLine.uuid) && isEditLine.uuid === scope.row.uuid">
                      <el-input-number
                        ref="editField"
                        v-model="currentEditLine"
                        v-shortkey="shortKeysInputTable"
                        :autofocus="true"
                        controls-position="right"
                        @change="changeEdit(currentEditLine, 'PriceEntered')"
                        @shortkey.native="theActionEdit"
                      />
                    </template>
                    <template v-else-if="isEditQtyOrdered && fileColumnNameEdit === 'QtyEntered' && valueOrder.columnName === 'QtyEntered' && !isEmptyValue(isEditLine.uuid) && isEditLine.uuid === scope.row.uuid">
                      <el-input-number
                        ref="editField"
                        v-model="scope.row.quantityOrdered"
                        v-shortkey="shortKeysInputTable"
                        :autofocus="true"
                        controls-position="right"
                        @change="changeEdit(scope.row.quantityOrdered, valueOrder.columnName)"
                        @shortkey.native="theActionEdit"
                      />
                    </template>
                    <template v-else-if="isEditQtyOrdered && fileColumnNameEdit === 'Discount' && valueOrder.columnName === 'Discount' && !isEmptyValue(isEditLine.uuid) && isEditLine.uuid === scope.row.uuid">
                      <el-input-number
                        ref="editField"
                        v-model="scope.row.discount"
                        v-shortkey="shortKeysInputTable"
                        :autofocus="true"
                        controls-position="right"
                        @change="changeEdit(scope.row.discount, valueOrder.columnName)"
                        @shortkey.native="theActionEdit"
                      />
                    </template>
                    <span v-else>
                      {{ displayValue(scope.row, valueOrder) }}
                    </span>
                  </template>
                </el-table-column>
              </template>
              <el-table-column
                :label="$t('form.pos.tableProduct.options')"
                width="165"
              >
                <template slot-scope="scope">
                  <el-popover
                    v-if="!isEmptyValue(listOrderLine)"
                    popper-class="el-popper-info"
                    placement="right-start"
                    trigger="click"
                    width="300"
                    :hide="closeInfo"
                  >
                    {{ (isEmptyValue(scope.row.product.value) ? $t('form.productInfo.chargerInformation') : $t('form.productInfo.productInformation')) }}
                    <el-form
                      label-position="top"
                      style="float: right;display: contents;line-height: 30px;"
                    >
                      <el-row style="margin: 10px!important;">
                        <el-col :span="5">
                          <div>
                            <image-product
                              :show="showInfo"
                              :metadata-line="scope.row"
                            />
                          </div>
                        </el-col>
                        <el-col :span="11">
                          <span v-if="!isEmptyValue(scope.row.product.value)"> {{ $t('form.productInfo.code') }}: <b>{{ scope.row.product.value }}</b><br> </span>
                          {{ $t('form.productInfo.name') }}: <b>{{ (isEmptyValue(scope.row.product.name) ? scope.row.charge.name : scope.row.product.name) }}</b><br>
                          {{ $t('form.productInfo.description') }}: <b>{{ (isEmptyValue(scope.row.product.description) ? scope.row.charge.description : scope.row.product.description) }}</b><br>
                          {{ $t('form.productInfo.UM') }}: <b>{{ scope.row.product.uomName }}</b><br>
                        </el-col>
                        <el-col :span="8">
                          <div style="float: right; text-align: end;">
                            {{ $t('form.productInfo.price') }}:
                            <b>{{ formatPrice(scope.row.priceList, pointOfSalesCurrency.iSOCode) }}</b>
                            <br>
                            <b>{{ scope.row.taxRate.name }}</b>
                            <br>
                            {{ $t('form.productInfo.grandTotal') }}:
                            <b>{{ formatPrice(scope.row.totalAmountWithTax, pointOfSalesCurrency.iSOCode) }}</b>
                            <br>
                            {{ $t('form.pos.tableProduct.quantity') }}:
                            <b>{{ formatQuantity(scope.row.quantityOrdered) }}</b>
                          </div>
                        </el-col>
                      </el-row>
                    </el-form>
                    <el-button slot="reference" type="primary" icon="el-icon-info" size="mini" style="margin-right: 3%;" @click="showInfoLine(scope.row)" />
                  </el-popover>
                  <el-popover
                    placement="right"
                    trigger="click"
                    :title="$t('form.pos.tableProduct.editQuantities')"
                    width="600"
                    @hide="showFieldLine = false"
                  >
                    <field-line
                      :data-line="scope.row"
                      :show-field="showFieldLine"
                      :current-line="currentLineOrder"
                    />
                    <el-button slot="reference" type="success" icon="el-icon-edit" size="mini" style="margin-right: 3%;" :disabled="isDisabled" @click="showEditLine(scope.row)" />
                  </el-popover>
                  <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="isDisabled" @click="deleteOrderLine(scope.row)" />
                </template>
              </el-table-column>
            </el-table>
          </el-main>
          <el-dialog ref="dialog" :title="$t('form.pos.pinMessage.pin') + infowOverdrawnInvoice.label" width="40%" :visible.sync="visible">
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
          <el-footer :class="classOrderFooter">
            <div class="keypad">
              <el-row :gutter="24">
                <el-button type="info" icon="el-icon-top" :disabled="isDisabled" @click="arrowTop" />
                <el-button type="info" icon="el-icon-bottom" :disabled="isDisabled" @click="arrowBottom" />
                <el-button v-show="isValidForDeleteLine(listOrderLine)" type="danger" icon="el-icon-delete" :disabled="isDisabled" @click="deleteOrderLine(currentOrderLine)" />
                <el-button
                  v-show="isValidToRelease"
                  type="primary"
                  @click="releaseSalesOrder()"
                >
                  <i class="el-icon-document-checked" />
                  {{ $t('form.pos.releaseOrder') }}
                </el-button>
                <el-button
                  v-show="allowsCollectOrder"
                  type="success"
                  icon="el-icon-bank-card"
                  @click="openCollectionPanel"
                >
                  {{ labelButtonCollections }}
                </el-button>
              </el-row>
              <p id="point" style="margin-bottom: 5%;margin-top: 3%;">
                <el-dropdown
                  v-if="!isEmptyValue(currentPointOfSales)"
                  trigger="click"
                  class="info-pos"
                  @command="changePos"
                >
                  <span>
                    <i class="el-icon-mobile-phone" />
                    {{ $t('form.pos.order.pointSale') }}: <b style="cursor: pointer"> {{ currentPointOfSales.name }} </b>
                  </span>
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
                <br>
                <el-dropdown
                  v-if="!isEmptyValue(currentDocumentType)"
                  trigger="click"
                  class="info-pos"
                  @command="changeDocumentType"
                >
                  <span>
                    <el-icon class="el-icon-document" />
                    Tipo de Documento: <b style="cursor: pointer"> {{ currentDocumentType.name }} </b>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="item in listDocumentTypes"
                      :key="item.uuid"
                      :command="item"
                      :disabled="isDisabled"
                    >
                      {{ item.name }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <br>
                <el-dropdown
                  v-if="!isEmptyValue(currentWarehouse)"
                  trigger="click"
                  class="info-pos"
                  @command="changeWarehouse"
                >
                  <span>
                    <svg-icon icon-class="tree" />
                    {{ $t('route.warehouse') }}: <b style="cursor: pointer"> {{ currentWarehouse.name }} </b>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="item in listWarehouses"
                      :key="item.uuid"
                      :command="item"
                      :disabled="isDisabled"
                    >
                      {{ item.name }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <br>
                <el-dropdown
                  v-if="!isEmptyValue(currentPriceList)"
                  trigger="click"
                  class="info-pos"
                  @command="changePriceList"
                >
                  <span>
                    <svg-icon icon-class="tree-table" />
                    {{ $t('form.pos.priceList') }}: <b style="cursor: pointer"> {{ currentPriceList.name }} </b>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="item in pointPriceList"
                      :key="item.uuid"
                      :command="item"
                      :disabled="isDisabled"
                    >
                      {{ item.name }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <br>
                <el-dropdown
                  v-if="!isEmptyValue(currentOrder) && !isEmptyValue(listCampaign)"
                  trigger="click"
                  class="info-pos"
                  @command="changeCampaign"
                >
                  <span>
                    <i class="el-icon-guide" />
                    {{ $t('form.pos.order.campaign') }}:
                    <b style="cursor: pointer">
                      {{ currentCampaign }}
                    </b>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="item in listCampaign"
                      :key="item.uuid"
                      :command="item"
                    >
                      {{ item.values.DisplayColumn }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <br>
                <el-dropdown
                  v-if="!isEmptyValue(currentDiscountList)"
                  trigger="click"
                  class="info-pos"
                  @command="changeDiscountList"
                >
                  <span>
                    <svg-icon icon-class="list" />
                    {{ $t('form.pos.discountList') }}: <b style="cursor: pointer"> {{ currentDiscountList.name }} </b>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="item in pointDiscountList"
                      :key="item.uuid"
                      :command="item"
                      :disabled="isDisabled"
                    >
                      {{ item.name }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </p>
            </div>
            <span v-if="isMobile" style="float: right;padding-right: 1%;">
              <p class="total">{{ $t('form.pos.order.order') }}: <b class="order-info">{{ currentOrder.documentNo }}</b></p>
              <p class="total">
                {{ $t('form.pos.order.date') }}:
                <b v-if="!isEmptyValue(currentOrder.uuid)" class="order-info">
                  {{ orderDate }}
                </b>
              </p>
              <p v-if="!isEmptyValue(currentOrder.documentType)" class="total">{{ $t('form.pos.order.type') }}:<b class="order-info">{{ currentOrder.documentType.name }}</b></p>
              <p class="total">
                {{ $t('form.pos.order.itemQuantity') }}
                <b v-if="!isEmptyValue(currentOrder.uuid)" class="order-info">
                  {{ getItemQuantity }}
                </b>
              </p>
              <p class="total">
                {{ $t('form.pos.order.numberLines') }}
                <b v-if="!isEmptyValue(currentOrder.uuid)" class="order-info">
                  {{ numberOfLines }}
                </b></p>
            </span>
            <span style="float: right;">
              <div style="padding-left: 10px;padding-right: 10px;">
                <p class="total">{{ $t('form.pos.order.seller') }}:<b style="float: right;">
                  {{ currentOrder.salesRepresentative.name }}
                </b></p>
                <p class="total"> {{ $t('form.pos.order.subTotal') }}:<b v-if="!isEmptyValue(currentOrder.uuid)" class="order-info">{{ formatPrice(currentOrder.totalLines, pointOfSalesCurrency.iSOCode) }}</b></p>
                <p class="total"> {{ $t('form.pos.tableProduct.displayDiscountAmount') }}:<b v-if="!isEmptyValue(currentOrder.uuid)" style="float: right;">{{ formatPrice(currentOrder.discountAmount, pointOfSalesCurrency.iSOCode) }}</b> </p>
                <p class="total"> {{ $t('form.pos.order.tax') }}:<b v-if="!isEmptyValue(currentOrder.uuid)" style="float: right;">{{ formatPrice(currentOrder.taxAmount, pointOfSalesCurrency.iSOCode) }}</b> </p>
              </div>
              <div style="border: 1px solid rgb(54, 163, 247);padding-left: 10px;padding-right: 10px;">
                <p class="total">
                  <b>
                    {{ $t('form.pos.order.total') }}:
                  </b>
                  <b v-if="!isEmptyValue(currentOrder.uuid)" style="float: right;">
                    {{ formatPrice(currentOrder.grandTotal, pointOfSalesCurrency.iSOCode) }}
                  </b>
                </p>
                <p v-if="!isEmptyValue(currentPointOfSales.displayCurrency)" class="total"> <b> {{ $t('form.pos.collect.convertedAmount') }}: </b> <b v-if="!isEmptyValue(currentOrder.uuid)" style="float: right;">{{ formatPrice(currentOrder.grandTotal / totalAmountConverted, currentPointOfSales.displayCurrency.iso_code) }}</b> </p>
              </div>
            </span>
            <span v-if="!isMobile" style="float: right;padding-right: 3%;">
              <p class="total">{{ $t('form.pos.order.order') }}: <b class="order-info">{{ currentOrder.documentNo }}</b></p>
              <p class="total">
                {{ $t('form.pos.order.date') }}:
                <b v-if="!isEmptyValue(currentOrder.uuid)" class="order-info">
                  {{ orderDate }}
                </b>
              </p>
              <p v-if="!isEmptyValue(currentOrder.documentType)" class="total">{{ $t('form.pos.order.type') }}:<b class="order-info">{{ currentOrder.documentType.name }}</b></p>
              <p class="total">
                {{ $t('form.pos.order.itemQuantity') }}:
                <b v-if="!isEmptyValue(currentOrder.uuid)" class="order-info">
                  {{ getItemQuantity }}
                </b>
              </p>
              <p class="total">
                {{ $t('form.pos.order.numberLines') }}:
                <b v-if="!isEmptyValue(currentOrder.uuid)" class="order-info">
                  {{ numberOfLines }}
                </b>
              </p>
            </span>
          </el-footer>
        </el-container>
      </el-main>
    </el-container>
    <div v-if="isMobile && isShowedPOSKeyLayout" :style="classButtomRight">
      <el-button
        v-show="!isEmptyValue(currentPointOfSales.keyLayoutUuid)"
        :circle="true"
        type="primary"
        :icon="isShowedPOSKeyLayout ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"
        @click="isShowedPOSKeyLayout = !isShowedPOSKeyLayout"
      />
    </div>
    <div v-if="!isMobile && !isEmptyValue(currentPointOfSales.keyLayoutUuid)" :style="classButtomRight">
      <el-button
        id="buttonPanelRightPos"
        :circle="true"
        type="primary"
        :icon="isShowedPOSKeyLayout ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"
        @click="isShowedPOSKeyLayout = !isShowedPOSKeyLayout"
      />
    </div>
  </div>
  <div
    v-else
    key="form-loading"
    v-loading="!isLoaded"
    :element-loading-text="$t('notifications.loading')"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)"
    class="view-loading"
  />
</template>

<script>
// constants
import fieldsListOrder from './fieldsListOrder.js'

// components and mixins
// import DocumentStatusTag from '@theme/components/ADempiere/ContainerOptions/DocumentStatusTag/index.vue'
import formMixin from '@theme/components/ADempiere/Form/formMixin.js'
import orderLineMixin from './orderLineMixin.js'
import posMixin from '@theme/components/ADempiere/Form/VPOS/posMixin.js'
import BusinessPartner from '@theme/components/ADempiere/Form/VPOS/BusinessPartner/index.vue'
import fieldLine from '@theme/components/ADempiere/Form/VPOS/Order/line/index'
import ImageProduct from '@theme/components/ADempiere/Form/VPOS/Order/ImageProduct/index'
// src/themes/default/components/ADempiere/Form/VPOS/Order/ImageProduct/index.vue
import ProductInfo from '@theme/components/ADempiere/Form/VPOS/ProductInfo'
import FastOrdesList from '@theme/components/ADempiere/Form/VPOS/OrderList/fastOrder'

// utils and helper methods
// Format of values ( Date, Price, Quantity )
import {
  formatDate,
  formatDateToSend,
  formatPrice,
  formatQuantity
} from '@/utils/ADempiere/valueFormat.js'

// api request methods
import { requestLookupList } from '@/api/ADempiere/window.js'
import { releaseOrder } from '@/api/ADempiere/form/point-of-sales.js'

export default {
  name: 'Order',

  components: {
    BusinessPartner,
    // DocumentStatusTag,
    ProductInfo,
    FastOrdesList,
    fieldLine,
    ImageProduct
  },

  mixins: [
    formMixin,
    orderLineMixin,
    posMixin
  ],

  data() {
    return {
      fieldsList: fieldsListOrder,
      seeConversion: false,
      showFieldLine: false,
      pin: '',
      attributePin: {},
      validatePin: true,
      visible: false,
      isEditQtyOrdered: false,
      isEditLine: {},
      fileColumnNameEdit: '',
      editPrice: 0,
      showInfo: false,
      listCampaign: []
    }
  },

  computed: {
    isValidToRelease() {
      if (!this.isEmptyValue(this.currentOrder) && this.currentOrder.documentStatus.value === 'DR') {
        return true
      }
      return false
    },
    fieldCampaign() {
      return this.fieldsList.find(field => field.columnName === 'C_Campaign_ID')
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    isShowedPOSKeyLaout() {
      return this.$store.getters.getShowPOSKeyLayout
    },
    classOrderFooter() {
      if (this.isMobile) {
        return 'footer-mobile'
      }
      return 'footer-table'
    },
    classButtomRight() {
      if (this.isMobile) {
        if (this.$store.getters.getIsShowPOSOptions) {
          return 'position: fixed'
        }
        return 'position: absolute;top: 34%;z-index: 100;right: 0;'
      }
      return 'position: relative;padding-top: 30vh; z-index: 100;'
    },
    colFieldBusinessPartner() {
      if (this.isMobile) {
        return 12
      }
      if (this.isEmptyValue(this.currentOrder)) {
        return 9
      }
      return 7
    },
    colFieldProductCode() {
      if (this.isMobile) {
        return 12
      }
      if (this.isEmptyValue(this.currentOrder)) {
        return 14
      }
      if (this.isShowedPOSKeyLayout) {
        return 10
      }
      return 12
    },
    shortsKey() {
      return {
        popoverConvet: ['ctrl', 'x']
      }
    },
    shortKeysInputTable() {
      return {
        close: ['esc'],
        enter: ['enter']
      }
    },
    isShowedPOSKeyLayout: {
      get() {
        return this.$store.getters.getShowPOSKeyLayout
      },
      set(val) {
        if (!this.isEmptyValue(this.currentPointOfSales.keyLayoutUuid)) {
          this.$store.commit('setShowPOSKeyLayout', val)
        }
      }
    },
    styleTab() {
      const isShowedPOSOptions = this.$store.getters.getIsShowPOSOptions
      if (this.isShowedPOSKeyLayout || isShowedPOSOptions) {
        return 'padding-left: 0px; padding-left: 0px; padding-right: 0px; padding: 0px; '
      }
      return 'padding-left: 0px; padding-right: 0px; '
    },
    orderDate() {
      if (this.isEmptyValue(this.currentOrder) || this.isEmptyValue(this.currentOrder.dateOrdered)) {
        return this.formatDate(new Date())
      }
      return this.formatDate(this.currentOrder.dateOrdered)
    },
    getItemQuantity() {
      if (this.isEmptyValue(this.currentOrder)) {
        return 0
      }
      const result = this.listOrderLine.map(order => {
        return order.quantityOrdered
      })

      if (!this.isEmptyValue(result)) {
        return result.reduce((accumulator, currentValue) => {
          return accumulator + currentValue
        })
      }
      return 0
    },
    numberOfLines() {
      if (this.isEmptyValue(this.currentOrder)) {
        return 0
      }
      return this.listOrderLine.length
    },
    multiplyRate() {
      return this.$store.getters.getMultiplyRate
    },
    converCurrency() {
      return this.$store.getters.getValueOfField({
        containerUuid: 'Collection-Convert-Amount',
        columnName: 'C_Currency_ID_UUID'
      })
    },
    currencyUuid() {
      return this.$store.getters.getValueOfField({
        containerUuid: 'Collection-Convert-Amount',
        columnName: 'C_Currency_ID_UUID'
      })
    },
    labelButtonCollections() {
      return this.isDisabled ? this.$t('form.pos.order.collections') : this.$t('form.pos.order.collect')
    },
    currentPointOfSales() {
      return this.$store.getters.posAttributes.currentPointOfSales
    },
    // Currency Point Of Sales
    pointOfSalesCurrency() {
      // const currency = this.currentPointOfSales
      if (!this.isEmptyValue(this.currentPointOfSales.priceList)) {
        return {
          ...this.currentPointOfSales.priceList.currency,
          amountConvertion: 1
        }
      }
      return {
        uuid: '',
        iSOCode: '',
        curSymbol: '',
        amountConvertion: 1
      }
    },
    listPointOfSales() {
      return this.$store.getters.posAttributes.pointOfSalesList
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
    isDisabled() {
      return this.currentPointOfSales.currentOrder.isProcessed
    },
    listOrderLine() {
      if (this.isEmptyValue(this.currentOrder)) {
        return []
      }
      return this.currentOrder.lineOrder
    },
    currentLineOrder() {
      const line = this.$store.state['pointOfSales/orderLine/index'].line
      if (!this.isEmptyValue(line)) {
        return line
      }
      return {}
    },
    currentEditLine: {
      get() {
        if (this.isEmptyValue(this.currentLineOrder)) {
          return {}
        }
        if (this.editPrice > 0 && this.editPrice !== this.currentValuePriceLine(this.currentLineOrder)) {
          return this.editPrice
        }
        return this.currentValuePriceLine(this.currentLineOrder)
      },
      set(val) {
        this.editPrice = val
        return val
      }
    },
    currentPriceList() {
      if (!this.isEmptyValue(this.$store.getters.currentPriceList)) {
        return this.$store.getters.currentPriceList
      }
      return {}
    },
    currentDiscountList() {
      if (!this.isEmptyValue(this.$store.getters.currentDiscountList)) {
        return this.$store.getters.currentDiscountList
      }
      return {}
    },
    pointDiscountList() {
      const discount = this.$store.getters.posAttributes.currentPointOfSales.discountList
      if (this.isEmptyValue(discount)) {
        return []
      }
      return discount
    },
    pointPriceList() {
      const list = this.$store.getters.posAttributes.currentPointOfSales.pricesList
      if (this.isEmptyValue(list)) {
        return []
      }
      return list
    },
    currentWarehouse() {
      if (!this.isEmptyValue(this.$store.getters.posAttributes.currentPointOfSales.warehouse)) {
        return this.$store.getters.getCurrentWarehousePos
      }
      return {}
    },
    currentDocumentType() {
      if (!this.isEmptyValue(this.$store.getters.posAttributes.currentPointOfSales.documentType)) {
        if (!this.isEmptyValue(this.currentOrder.documentType)) {
          return this.currentOrder.documentType
        }
        return this.$store.getters.getCurrentDocumentTypePos
      }
      if (this.isEmptyValue(this.$store.getters.getCurrentDocumentTypePos)) {
        return {}
      }
      return {}
    },
    listWarehouses() {
      if (!this.isEmptyValue(this.$store.getters.posAttributes.currentPointOfSales.warehousesList)) {
        return this.$store.getters.posAttributes.currentPointOfSales.warehousesList
      }
      return []
    },
    listDocumentTypes() {
      const listDocumentTypes = this.$store.getters.posAttributes.currentPointOfSales.documentTypesList
      const templatePosDocumentTypes = this.$store.getters.posAttributes.currentPointOfSales.documentType
      if (!this.isEmptyValue(listDocumentTypes)) {
        const addDocumentType = listDocumentTypes.find(documentType => documentType.uuid === templatePosDocumentTypes.uuid)
        if (this.isEmptyValue(addDocumentType)) {
          listDocumentTypes.push(this.$store.getters.posAttributes.currentPointOfSales.documentType)
        }
        return listDocumentTypes
      }
      return []
    },
    showOverdrawnInvoice() {
      return this.$store.getters.getOverdrawnInvoice.visible
    },
    infowOverdrawnInvoice() {
      if (this.$store.getters.getOverdrawnInvoice.attributePin) {
        return this.$store.getters.getOverdrawnInvoice.attributePin
      }
      return ''
    },
    currentCampaign() {
      if (!this.isEmptyValue(this.currentOrder.campaignUuid)) {
        const campaig = this.listCampaign.find(campaign => campaign.uuid === this.currentOrder.campaignUuid)
        return campaig.values.DisplayColumn
      } else if (!this.isEmptyValue(this.currentPointOfSales.defaultCampaignUuid)) {
        const campaig = this.listCampaign.find(campaign => campaign.uuid === this.currentPointOfSales.defaultCampaignUuid)
        return campaig.values.DisplayColumn
      }
      return this.$t('form.pos.order.noCampaignSelected')
    }
  },

  watch: {
    showOverdrawnInvoice(value) {
      this.visible = value
    },
    numberOfLines(value) {
      if (this.isNewOrder) {
        this.$refs.ProductValue[0].$refs.product.focus()
      }
      if (value > 0) {
        this.convertedAmount()
      }
    },
    currentOrder(value) {
      this.validatePin = true
    },
    visible(value) {
      if (value && !this.isEmptyValue(this.$refs)) {
        setTimeout(() => {
          this.focusPin()
        }, 500)
      } else {
        this.$store.dispatch('changePopoverOverdrawnInvoice', { visible: value })
      }
    },
    orderDate(value) {
      this.$store.state['pointOfSales/point/index'].conversionsList = []
    },
    isEditLine(value) {
      if (!this.isEmptyValue(value.uuid) && this.isEditQtyOrdered && !this.isEmptyValue(this.$refs.editField)) {
        setTimeout(() => {
          this.$refs.editField[0].focus()
          this.$refs.editField[0].select()
        }, 500)
      }
    }
  },

  mounted() {
    setTimeout(() => {
      if (!this.isEmptyValue(this.fieldCampaign.reference) && this.isEmptyValue(this.listCampaign)) {
        this.getListCampaign(this.fieldCampaign.reference)
      }
    }, 500)
    if (!this.isEmptyValue(this.$route.query.action)) {
      this.$store.dispatch('reloadOrder', { orderUuid: this.$route.query.action })
    }
    if (this.isEmptyValue(this.$route.query.action) && !this.isEmptyValue(this.currentOrder.uuid)) {
      this.$router.push({
        params: {
          ...this.$route.params
        },
        query: {
          ...this.$route.query,
          action: this.currentOrder.uuid
        }
      })
    }
    if (this.isNewOrder) {
      this.$refs.ProductValue[0].$refs.product.focus()
    }
    this.$store.dispatch('changePopoverOverdrawnInvoice', { visible: false })
  },

  methods: {
    formatDate,
    formatDateToSend,
    formatPrice,
    formatQuantity,
    releaseSalesOrder() {
      releaseOrder({
        posUuid: this.currentPointOfSales.uuid,
        salesRepresentativeUuid: this.$store.getters['user/getUserUuid'],
        orderUuid: this.currentOrder.uuid
      })
        .then(response => {
          this.clearOrder()
          this.$message.success(this.$t('form.pos.generalNotifications.orderReleased') + response.documentNo)
        })
        .catch(error => {
          this.$message({
            message: error.message,
            isShowClose: true,
            type: 'error'
          })
          console.warn(`Error Hold Order ${error.message}. Code: ${error.code}.`)
        })
    },
    getListCampaign(campaing) {
      requestLookupList({
        tableName: campaing.tableName,
        query: campaing.query
      })
        .then(responseLookupItem => {
          this.listCampaign = responseLookupItem.recordsList
        })
    },
    focusProducto(value) {
      this.$refs.ProductValue[0].$refs.product.focus()
    },
    editCell(row, column) {
      switch (column.columnKey) {
        case 'CurrentPrice':
        case 'QtyEntered':
        case 'Discount':
          this.isEditQtyOrdered = true
          this.fileColumnNameEdit = column.columnKey
          this.isEditLine = row
          setTimeout(() => {
            this.$refs.editField[0].focus()
            this.$refs.editField[0].select()
          }, 100)
          break
      }
    },
    changeEdit(value, columnName) {
      if (!this.allowsModifyQuantity && (columnName === 'QtyEntered')) {
        const attributePin = {
          containerUuid: 'line',
          columnName,
          value,
          type: 'updateOrder',
          label: this.$t('form.pos.pinMessage.qtyEntered')
        }
        this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
        this.visible = true
        return
      } else if (!this.modifyPrice && (columnName === 'PriceEntered' || columnName === 'Discount')) {
        const attributePin = {
          containerUuid: 'line',
          columnName,
          value,
          type: 'updateOrder',
          label: columnName === 'PriceEntered' ? this.$t('form.pos.pinMessage.price') : this.$t('form.pos.pinMessage.discount')
        }
        this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
        this.visible = true
        return
      }
      const changeLine = { columnName, value }
      this.updateOrderLine(changeLine)
    },
    theActionEdit(event) {
      switch (event.srcKey) {
        case 'enter':
          this.$refs.editField[0].select()
          this.exitEdit()
          this.focusProducto()
          break
        case 'close':
          this.exitEdit()
          break
      }
    },
    exitEdit() {
      this.isEditLine = {}
      this.isEditQtyOrdered = false
    },
    keyActionClosePin(event) {
      this.visible = false
      this.$store.dispatch('changePopoverOverdrawnInvoice', { visible: false })
    },
    focusPin() {
      this.$refs.pin.focus()
    },
    closeConvertion() {
      this.seeConversion = false
    },
    openCollectionPanel() {
      this.$store.commit('setShowPOSCollection', true)
      const orderUuid = this.$route.query.action
      this.$store.dispatch('listPayments', { posUuid: this.currentPointOfSales.uuid, orderUuid })
      this.$store.commit('setShowPOSOptions', false)
    },
    open() {
      if (!this.seeConversion) {
        this.seeConversion = true
      }
    },
    getOrderTax(currency) {
      return this.formatPrice(this.currentOrder.grandTotal - this.currentOrder.totalLines, currency)
    },
    newOrder() {
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
    changePos(pointOfSales) {
      if (!this.isEmptyValue(this.currentPointOfSales.id) && this.currentPointOfSales.id !== pointOfSales.id) {
        this.$store.dispatch('setCurrentPOS', pointOfSales)
        this.$store.commit('customer', {})
        this.clearOrder()
      }
    },
    changeCampaign(item) {
      this.$store.dispatch('updateOrder', {
        orderUuid: this.currentOrder.uuid,
        posUuid: this.currentPointOfSales.uuid,
        documentTypeUuid: this.currentOrder.documentStatus.uuid,
        priceListUuid: this.currentPointOfSales.priceList.uuid,
        warehouseUuid: this.currentPointOfSales.warehouse.uuid,
        campaignUuid: item.uuid
      })
    },
    changeWarehouse(warehouse) {
      if (warehouse.id !== this.currentWarehouse.id) {
        if (warehouse.is_pos_required_pin) {
          const attributePin = {
            ...warehouse,
            action: 'changeWarehouse',
            type: 'actionPos',
            label: this.$t('form.pos.pinMessage.warehouse')
          }
          const visible = true
          this.visible = visible
          this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
        } else {
          this.$store.commit('setCurrentWarehousePos', warehouse)
        }
      }
    },
    changeDocumentType(documentType) {
      if (documentType.id !== this.currentDocumentType.id) {
        if (!documentType.is_pos_required_pin) {
          this.$store.dispatch('updateOrder', {
            orderUuid: this.currentOrder.uuid,
            posUuid: this.currentPointOfSales.uuid,
            documentTypeUuid: documentType.uuid,
            priceListUuid: this.currentPointOfSales.priceList.uuid,
            warehouseUuid: this.currentPointOfSales.warehouse.uuid
          })
        } else {
          const attributePin = {
            ...documentType,
            action: 'changeDocumentType',
            type: 'actionPos',
            label: this.$t('form.pos.pinMessage.documentType')
          }
          this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
          this.visible = true
        }
      }
    },
    changePriceList(priceList) {
      if (priceList.id !== this.currentPriceList.id) {
        if (priceList.is_pos_required_pin) {
          const attributePin = {
            ...priceList,
            action: 'changePriceList',
            type: 'actionPos',
            label: this.$t('form.pos.pinMessage.priceList')
          }
          this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
          this.visible = true
        } else {
          this.$store.dispatch('updateOrder', {
            orderUuid: this.currentOrder.uuid,
            posUuid: this.currentPointOfSales.uuid,
            documentTypeUuid: this.currentOrder.documentStatus.uuid,
            priceListUuid: priceList.uuid,
            warehouseUuid: this.currentPointOfSales.warehouse.uuid
          })
          this.$store.commit('setCurrentPriceList', priceList)
        }
      }
    },
    changeDiscountList(discountList) {
      console.log(discountList)
    },
    arrowTop() {
      if (this.currentTable > 0) {
        this.currentTable--
        this.$refs.linesTable.setCurrentRow(this.listOrderLine[this.currentTable])
        this.currentOrderLine = this.listOrderLine[this.currentTable]
      }
    },
    showInfoLine(line) {
      this.$store.commit('setLine', line)
      this.showInfo = true
    },
    closeInfo(line) {
      this.showInfo = false
    },
    showEditLine(line) {
      this.$store.commit('setLine', line)
      this.showFieldLine = !this.showFieldLine
    },
    arrowBottom() {
      const top = this.listOrderLine.length - 1
      if (this.currentTable < top) {
        this.currentTable++
        this.$refs.linesTable.setCurrentRow(this.listOrderLine[this.currentTable])
        this.currentOrderLine = this.listOrderLine[this.currentTable]
      }
    }
  }
}
</script>

<style scoped>
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
  .footer-mobile {
    padding: 0px;
    height: auto !important;
    overflow: auto;
    display: contents;
  }
  .footer-table {
    padding-top: 0px;
    padding-right: 9px;
    padding-bottom: 0px;
    padding-left: 9px;
    overflow: auto;
    height: auto !important;
  }
  .keypad {
    float: left;
    height: 20%;
    padding-top: 10px;
  }
  .total {
    margin-top: 10px;
    margin-bottom: 10px
  }
  .info-pos {
    padding-top: 10px;
    color: black;
  }
  .split {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    overflow-y: hidden;
    overflow-x: hidden;
    height: 100%;
    width: 100%;
  }
  .el-card__body {
    padding-top: 0px !important;
    padding-right: 0px!important;
    padding-bottom: 20px;
    padding-left: 10px!important;
    height: 100%!important;
  }

  /* Style of Table */
  .el-table {
    position: relative;
    overflow: hidden;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    width: 100%;
    max-width: 100%;
    height: 100%;
    background-color: #FFFFFF;
    font-size: 14px;
    color: #606266;
  }
  .el-card__header {
    padding: 0px 20px;
    border-bottom: 1px solid #e6ebf5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
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
  .el-button--text {
    border-color: transparent;
    color: #1890ff;
    background: transparent;
    padding: 0px;
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
    text-align: center;
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .order-header {
    padding-left: 10px;
    font-size: 13px;
  }
  .order-info {
    float: right;
    padding-left: 9px;
  }
  .transition-box {
    z-index: 1;
    width: auto;
    position: fixed;
    bottom: 5%;
    right: 5%;
  }
</style>

<style>
  .el-popper-info {
    margin-left: 12px;
    max-width: 75%;
    min-width: 60%;
  }
</style>
