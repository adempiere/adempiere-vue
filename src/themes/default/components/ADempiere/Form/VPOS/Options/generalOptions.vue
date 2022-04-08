<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com www.erpya.com
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
  <el-row :gutter="24" style="padding-right: 10px;">
    <el-col :span="size">
      <el-card shadow="hover" style="height: 100px">
        <el-dropdown
          trigger="click"
          style="padding-top: 8px;color: black;display: block;"
          @command="changePos"
        >
          <p style="cursor: pointer;text-align: center !important;color: black;min-height: 50px;margin: 0px;">
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
        <el-dropdown
          trigger="click"
          style="padding-top: 8px;color: black;display: block;"
          @command="changeWarehouse"
        >
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
        <el-dropdown
          trigger="click"
          style="padding-top: 8px;color: black;display: block;"
          @command="changePriceList"
        >
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
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

// components and mixins
import ListProductPrice from '@theme/components/ADempiere/Form/VPOS/ProductInfo/productList'

export default defineComponent({
  name: 'GeneralOptions',

  components: {
    ListProductPrice
  },

  props: {
    metadata: {
      type: Object,
      default: () => {}
    }
  },

  setup(props, { root }) {
    const currentPointOfSales = computed(() => {
      return root.$store.getters.posAttributes.currentPointOfSales
    })

    const listPointOfSales = computed(() => {
      return root.$store.getters.posAttributes.pointOfSalesList
    })

    const priceListPointOfSales = computed(() => {
      const list = root.$store.getters.posAttributes.currentPointOfSales.pricesList
      if (root.isEmptyValue(list)) {
        return []
      }
      return list
    })

    const warehousesListPointOfSales = computed(() => {
      const list = root.$store.getters.posAttributes.currentPointOfSales.warehousesList
      if (root.isEmptyValue(list)) {
        return []
      }
      return list
    })

    const currentOrder = computed(() => {
      if (root.isEmptyValue(root.currentPointOfSales.value)) {
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
      return currentPointOfSales.value.currentOrder
    })

    const adviserPin = computed(() => {
      return root.$store.getters.posAttributes.currentPointOfSales.isPosRequiredPin
    })

    const size = computed(() => {
      return 24 / root.$store.getters.getWidthLeft
    })

    const blockOption = computed(() => {
      if (!root.isEmptyValue(currentOrder.uuid)) {
        return 'cursor: pointer; text-align: center !important; color: black;min-height: 50px;'
      }
      return 'cursor: not-allowed; text-align: center !important; color: gray;min-height: 50px;'
    })

    const isShowProductsPriceList = computed({
      get() {
        return root.$store.state['pointOfSales/point/index'].productPrice.isShowPopoverMenu
      },
      set(isShowed) {
        if (!root.isEmptyValue(root.$route.query.pos)) {
          root.$store.commit('showListProductPrice', {
            attribute: 'isShowPopoverMenu',
            isShowed
          })
        }
      }
    })

    // TODO: Manage with mixin
    const clearOrder = () => {
      root.$router.push({
        params: {
          ...root.$route.params
        },
        query: {
          pos: currentPointOfSales.value.id
        }
      }).catch(() => {
      }).finally(() => {
        root.$store.commit('setListPayments', {})
        const { templateCustomer } = currentPointOfSales.value
        root.$store.commit('updateValuesOfContainer', {
          containerUuid: props.metadata.containerUuid,
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
        root.$store.dispatch('setOrder', {
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
        root.$store.commit('setShowPOSCollection', false)
        root.$store.dispatch('listOrderLine', [])
      })
    }

    const changePos = (posElement) => {
      if (adviserPin.value) {
        // validateOption(root.$t('form.pos.optionsPoinSales.generalOptions.changePos'))
        return
      }

      root.$store.dispatch('setCurrentPOS', posElement)
      clearOrder()
    }

    const changeWarehouse = (warehouseElement) => {
      changePos({
        ...currentPointOfSales.value,
        warehouse: warehouseElement
      })
    }

    const changePriceList = (priceListElement) => {
      changePos({
        ...currentPointOfSales.value,
        priceList: priceListElement
      })
    }

    return {
      // computeds
      adviserPin,
      blockOption,
      isShowProductsPriceList,
      listPointOfSales,
      priceListPointOfSales,
      size,
      warehousesListPointOfSales,
      // methods
      changePos,
      changePriceList,
      changeWarehouse
    }
  }

})
</script>
