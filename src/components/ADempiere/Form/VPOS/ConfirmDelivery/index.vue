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
    v-shortkey="shortsKey"
    style="padding-top: 0px;"
    @shortkey.native="keyAction"
  >
    <el-form
      v-shortkey="shortsKey"
      label-position="top"
      label-width="10px"
      @shortkey.native="keyAction"
      @submit.native.prevent="notSubmitForm"
    >
      <el-form-item label="Código Producto">
        <el-input v-model="input" :placeholder="$t('quickAccess.searchWithEnter')" @input="searchProduct" />
      </el-form-item>
    </el-form>
    <el-table
      ref="listProducto"
      v-shortkey="shortsKey"
      v-loading="isLoadedServer"
      :data="productdeliveryList"
      :empty-text="$t('quickAccess.searchWithEnter')"
      border
      fit
      height="450"
      highlight-current-row
      @shortkey.native="keyAction"
    >
      <el-table-column
        prop="value"
        :label="$t('form.productInfo.code')"
      />
      <el-table-column
        prop="name"
        :label="$t('form.pos.tableProduct.product')"
      />
      <el-table-column
        prop="quantity"
        :label="$t('form.pos.tableProduct.quantity')"
        align="right"
      />
      <el-table-column
        :label="$t('form.pos.tableProduct.options')"
        width="180"
      >
        <template slot-scope="scope">
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteOrderLine(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="$t('form.pos.optionsPoinSales.salesOrder.confirmDelivery')"
      :visible.sync="dialogVisible"
      width="30%"
      :modal="false"
    >
      <span>
        <p class="total">
          {{ $t('form.pos.order.BusinessPartnerCreate.businessPartner') }}:
          <b class="order-info">
            {{ currentOrder.businessPartner.name }}
          </b>
        </p>
        <p class="total">
          {{ $t('form.pos.order.order') }}:
          <b class="order-info">
            {{ currentOrder.documentNo }}
          </b>
        </p>
        <p class="total">
          {{ $t('form.pos.order.itemQuantity') }}:
          <b v-if="!isEmptyValue(productdeliveryList)" class="order-info">
            {{ getItemQuantity }}
          </b>
        </p>
        <p class="total">
          {{ $t('form.pos.order.numberLines') }}:
          <b v-if="!isEmptyValue(productdeliveryList)" class="order-info">
            {{ numberOfLines }}
          </b>
        </p>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-row :gutter="24">
          <el-col :span="24">
            <samp style="float: right; padding-right: 10px;">
              <el-button
                type="danger"
                class="custom-button-create-bp"
                icon="el-icon-close"
                @click="closeDialog"
              />
              <el-button
                type="primary"
                class="custom-button-create-bp"
                icon="el-icon-check"
                @click="makeDelivery"
              />
            </samp>
          </el-col>
        </el-row>
      </span>
    </el-dialog>
    <el-row :gutter="24">
      <el-col :span="24">
        <samp style="float: right; padding-right: 10px;">
          <el-button
            type="danger"
            class="custom-button-create-bp"
            icon="el-icon-close"
            @click="close"
          />
          <el-button
            type="primary"
            class="custom-button-create-bp"
            icon="el-icon-check"
            @click="dialogVisible = true"
          />
        </samp>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
import formMixin from '@/components/ADempiere/Form/formMixin.js'
import { formatPrice } from '@/utils/ADempiere/valueFormat.js'
import { findProduct, createShipment } from '@/api/ADempiere/form/point-of-sales.js'

export default {
  name: 'ConfirmDelivery',
  mixins: [
    formMixin
  ],
  props: {
    metadata: {
      type: Object,
      default: () => {
        return {
          uuid: 'Confirm-Delivery',
          containerUuid: 'Confirm-Delivery'
        }
      }
    },
    isSelectable: {
      type: Boolean,
      default: true
    },
    popoverName: {
      type: String,
      default: 'isShowPopoverField'
    }
  },
  data() {
    return {
      defaultMaxPagination: 50,
      isLoadedServer: false,
      isCustomForm: true,
      currentProduct: {},
      isSearchProduct: false,
      input: '',
      dialogVisible: false,
      deliveryList: [],
      timeOut: null
    }
  },
  computed: {
    getItemQuantity() {
      if (this.isEmptyValue(this.productdeliveryList)) {
        return 0
      }
      const result = this.productdeliveryList.map(order => {
        return order.quantity
      })

      if (!this.isEmptyValue(result)) {
        return result.reduce((accumulator, currentValue) => {
          return accumulator + currentValue
        })
      }
      return 0
    },
    numberOfLines() {
      if (this.isEmptyValue(this.productdeliveryList)) {
        return 0
      }
      return this.productdeliveryList.length
    },
    currentOrder() {
      return this.$store.getters.posAttributes.currentPointOfSales.currentOrder
    },
    productdeliveryList() {
      return this.$store.getters.getDeliveryList
    },
    isShowProductsPriceList() {
      return this.$store.state['pointOfSales/listProductPrice'].productPrice[this.attribute]
    },
    currentPointOfSales() {
      return this.$store.getters.posAttributes.currentPointOfSales
    },
    productPrice() {
      return this.$store.getters.getProductPrice
    },
    listWithPrice() {
      const { productPricesList } = this.productPrice
      if (!this.isEmptyValue(productPricesList)) {
        return []
      }
      return []
    },
    shortsKey() {
      return {
        closeProductList: ['esc'],
        refreshList: ['f5']
      }
    },
    isReadyFromGetData() {
      const { isLoaded, isReload } = this.productPrice
      return (!isLoaded || isReload) // && this.isShowProductsPriceList
    },
    searchValue() {
      return this.$store.getters.getValueOfField({
        containerUuid: this.metadata.containerUuid,
        columnName: 'ProductValue'
      })
    }
  },
  created() {
    this.$store.commit('setListProductPrice', {
      isLoaded: false
    })
    this.timeOut = setTimeout(() => {
      this.validatePos(this.currentPointOfSales)
    }, 3000)
  },
  methods: {
    formatPrice,
    keyAction(event) {
      switch (event.srcKey) {
        case 'refreshList':
          /**
           * TODO: When refreshing you are making 2 list requests, you can be the
           * observer that activates the second request
          */
          this.loadProductsPricesList()
          break

        case 'closeProductList':
          this.$store.commit('showListProductPrice', {
            attribute: this.popoverName,
            isShowed: false
          })
          break
      }
    },
    loadProductsPricesList() {
      this.$store.dispatch('listProductPriceFromServer', {})
    },
    close() {
      this.$store.commit('setConfirmDelivery', false)
    },
    addProductFromList() {
      if (!this.isSelectable) {
        return
      }
      // TODO: Change this dispatch for set values with local methods, to delete subscripton
      this.$store.dispatch('notifyActionKeyPerformed', {
        containerUuid: 'POS',
        columnName: 'ProductValue',
        // TODO: Verify with 'value' or 'searchValue' attribute
        value: this.currentProduct.product.name
      })

      // close popover of list product price
      this.close()
      this.$store.commit('showListProductPrice', {
        attribute: this.popoverName,
        isShowed: false
      })
    },
    searchProduct(value) {
      clearTimeout(this.timeOut)
      this.timeOut = setTimeout(() => {
        this.isSearchProduct = true
        this.findProductToShipping(value)
      }, 500)
    },
    deleteOrderLine(line) {
      const index = this.productdeliveryList.findIndex(product => product.uuid === line.uuid)
      this.productdeliveryList.splice(index, 1)
    },
    findProductToShipping(searchValue) {
      findProduct({
        searchValue,
        posUuid: this.currentPointOfSales.uuid,
        priceListUuid: this.currentPointOfSales.currentPriceList.uuid,
        warehouseUuid: this.currentPointOfSales.currentWarehouse.uuid
      })
        .then(response => {
          const product = {
            ...response.product,
            quantity: 1
          }
          this.$store.dispatch('addDeliveryList', product)
        })
        .catch((error) => {
          console.error(error.message)
          this.$message({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
        .finally(() => {
          this.input = ''
        })
    },
    /**
     * @param {object} PointOfSales
     */
    validatePos(PointOfSales) {
      if (this.isEmptyValue(PointOfSales)) {
        const message = this.$t('notifications.errorPointOfSale')
        this.$store.commit('setListProductPrice', {
          isLoaded: true,
          productPricesList: []
        })
        this.$message({
          type: 'info',
          message,
          duration: 1500,
          showClose: true
        })
      }
    },
    makeDelivery() {
      const posUuid = this.currentPointOfSales.uuid
      const orderUuid = this.currentOrder.uuid
      const listProduct = this.productdeliveryList.map(product => {
        return {
          orderLineUuid: product.uuid,
          quantity: product.quantity
        }
      })
      createShipment({
        posUuid,
        orderUuid,
        listProduct
      })
      this.dialogVisible = false
      this.$store.commit('setConfirmDelivery', false)
    },
    closeDialog() {
      this.dialogVisible = false
    }
  }
}
</script>
