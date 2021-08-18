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
  <el-popover
    placement="bottom"
    width="700"
    trigger="click"
  >
    <el-container>
      <el-header>
        <el-form label-position="top" :inline="true" class="demo-form-inline" @submit.native.prevent="notSubmitForm">
          <el-form-item label="No. del Documento">
            <el-input v-model="input" placeholder="Please input" @change="listOrdersInvoiced" />
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <el-table
          v-loading="isloading"
          :data="ordersInvoiced"
          height="400"
          border
          fit
          :highlight-current-row="highlightRow"
          @shortkey.native="keyAction"
          @current-change="handleCurrentChange"
        >
          <el-table-column
            prop="documentNo"
            label="Nro. Documento"
            width="130"
          />
          <el-table-column
            label="Estado"
            width="100"
          >
            <template slot-scope="scope">
              <el-tag
                :type="tagStatus(scope.row.documentStatus.value)"
              >
                {{ scope.row.documentStatus.name }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            prop="salesRepresentative.name"
            label="Agente Comercial"
            min-width="170"
          />

          <el-table-column
            label="Socio de Negocio"
            min-width="150"
          >
            <template slot-scope="scope">
              {{ scope.row.businessPartner.name }}
            </template>
          </el-table-column>

          <el-table-column
            label="Fecha de Orden"
            width="135"
          >
            <template slot-scope="scope">
              {{ formatDate(scope.row.dateOrdered) }}
            </template>
          </el-table-column>
          <el-table-column
            label="Total General"
            align="right"
            width="120"
          >
            <template slot-scope="scope">
              {{ formatQuantity(scope.row.grandTotal) }}
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <custom-pagination
          :total="ordersList.recordCount"
          :current-page="ordersList.pageNumber"
          :handle-change-page="handleChangePage"
          layout="total, prev, pager, next"
          style="float: right;"
        />
      </el-footer>
    </el-container>
    <el-button slot="reference" type="text" style="color: black;margin-left: 5%;margin-top: 15%;font-size: 15px;" @click="openPopover = !openPopover">
      <svg-icon icon-class="tree-table" />
      <b> Por Facturar </b>
    </el-button>
  </el-popover>
</template>

<script>
import CustomPagination from '@/components/ADempiere/Pagination'
import fieldsListOrders from './fieldsListOrders.js'
import {
  createFieldFromDictionary
} from '@/utils/ADempiere/lookupFactory'
import {
  formatDate,
  formatQuantity
} from '@/utils/ADempiere/valueFormat.js'
import {
  listOrders
} from '@/api/ADempiere/form/point-of-sales.js'
import posMixin from '@/components/ADempiere/Form/VPOS/posMixin.js'

export default {
  name: 'FastOrdesList',
  components: {
    CustomPagination
  },
  mixins: [
    posMixin
  ],
  props: {
    metadata: {
      type: Object,
      default: () => {
        return {
          panelType: 'from',
          uuid: 'Orders-List',
          containerUuid: 'Orders-List'
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
      defaultMaxPagination: 50,
      fieldsList: fieldsListOrders,
      metadataList: [],
      input: '',
      isCustomForm: true,
      activeAccordion: 'query-criteria',
      timeOut: null,
      isloading: true,
      ordersInvoiced: [],
      openPopover: false
    }
  },
  computed: {
    heightTable() {
      if (this.isEmptyValue(this.activeAccordion)) {
        return 500
      }
      return 250
    },
    highlightRow() {
      if (!this.isEmptyValue(this.selectOrder)) {
        return true
      }
      return false
    },
    selectOrder() {
      const action = this.$route.query.action
      if (!this.isEmptyValue(this.ordersList.ordersList)) {
        const order = this.ordersList.ordersList.find(item => item.uuid === action)
        if (!this.isEmptyValue(order)) {
          return order
        }
      }
      return null
    },
    isReadyFromGetData() {
      const { isReload } = this.ordersList
      return isReload
    },
    shortsKey() {
      return {
        closeOrdersList: ['esc'],
        refreshList: ['f5']
      }
    },
    sortFieldsListOrder() {
      return this.sortfield(this.metadataList)
    },
    sortTableOrderList() {
      if (this.isEmptyValue(this.ordersList.ordersList)) {
        return []
      }
      return this.sortDate(this.ordersList.ordersList)
    }
  },
  watch: {
    showField(value) {
      if (value && this.isEmptyValue(this.metadataList)) {
        this.setFieldsList()
      }
    },
    openPopover(value) {
      if (value && this.isEmptyValue(this.ordersInvoiced)) {
        this.listOrdersInvoiced()
      }
    }
  },
  created() {
    this.unsubscribe = this.subscribeChanges()
  },
  beforeDestroy() {
    this.unsubscribe()
  },
  methods: {
    formatDate,
    formatQuantity,
    createFieldFromDictionary,
    notSubmitForm(event) {
      event.preventDefault()
      return false
    },
    keyAction(event) {
      switch (event.srcKey) {
        case 'refreshList':
          this.loadOrdersList()
          break

        case 'closeOrdersList':
          this.$store.commit('showListOrders', false)
          break
      }
    },
    loadOrdersList() {
      const point = this.$store.getters.posAttributes.currentPointOfSales.uuid
      if (!this.isEmptyValue(point)) {
        this.$store.dispatch('listOrdersFromServer', {
          posUuid: point
        })
      }
    },
    handleChangePage(newPage) {
      this.$store.dispatch('setOrdersListPageNumber', newPage)
      const point = this.$store.getters.posAttributes.currentPointOfSales.uuid
      this.$store.dispatch('listOrdersFromServer', {
        posUuid: point
      })
    },
    handleCurrentChange(row) {
      // close popover
      this.$store.commit('showListOrders', false)
      this.$store.dispatch('currentOrder', row)
      if (!this.isEmptyValue(row)) {
        this.$store.dispatch('deleteAllCollectBox')
        this.$router.push({
          params: {
            ...this.$route.params
          },
          query: {
            ...this.$route.query,
            action: row.uuid
          }
        }, () => {})
        const orderUuid = this.$route.query.action
        this.$store.dispatch('listPayments', { orderUuid })
      }
    },
    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        console.log({ mutation, state })
        if (mutation.type === 'updateValueOfField' &&
          !mutation.payload.columnName.includes('DisplayColumn') &&
          !mutation.payload.columnName.includes('_UUID') &&
          mutation.payload.containerUuid === this.metadata.containerUuid) {
          clearTimeout(this.timeOut)
          this.timeOut = setTimeout(() => {
            this.loadOrdersList()
          }, 2000)
        }
      })
    },
    orderPrpcess(row) {
      const parametersList = [{
        columnName: 'C_Order_ID',
        value: row.id
      }]
      this.$store.dispatch('addParametersProcessPos', parametersList)
    },
    setFieldsList() {
      const list = []
      // Create Panel
      this.$store.dispatch('addPanel', {
        containerUuid: this.metadata.containerUuid,
        isCustomForm: false,
        uuid: this.metadata.uuid,
        panelType: this.metadata.panelType,
        fieldsList: this.fieldsList
      })
      // Product Code
      this.fieldsList.forEach(element => {
        this.createFieldFromDictionary(element)
          .then(response => {
            const data = response
            list.push({
              ...data,
              containerUuid: 'Orders-List'
            })
          }).catch(error => {
            console.warn(`LookupFactory: Get Field From Server (State) - Error ${error.code}: ${error.message}.`)
          })
      })
      this.metadataList = list
    },
    sortDate(listDate) {
      return listDate.sort((elementA, elementB) => {
        return new Date().setTime(new Date(elementB.dateOrdered).getTime()) - new Date().setTime(new Date(elementA.dateOrdered).getTime())
      })
    },
    sortfield(field) {
      return field.sort((elementA, elementB) => {
        return elementA.sequence - elementB.sequence
      })
    },
    listOrdersInvoiced() {
      this.isloading = true
      listOrders({
        posUuid: this.$store.getters.posAttributes.currentPointOfSales.uuid,
        documentNo: this.input,
        isAisleSeller: true
      })
        .then(response => {
          this.isloading = false
          this.ordersInvoiced = response.ordersList
        })
        .catch(error => {
          this.isloading = false
          console.warn(`listOrdersFromServer: ${error.message}. Code: ${error.code}.`)
        })
    }
  }
}
</script>
