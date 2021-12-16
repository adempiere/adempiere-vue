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
  <el-container>
    <el-header style="height: 2%;">
      <p style="text-align: center;"> <b> {{ data.title }} </b></p>
      <slot />
    </el-header>
    <el-main>
      <el-table
        v-loading="isLoadingTable"
        :data="dataList"
        height="250"
        style="width: 100%"
        border
        :empty-text="$t('form.byInvoice.emptyList')"
        fit
        highlight-current-row
        @current-change="handleCurrentChange"
      >
        <el-table-column
          prop="documentNo"
          sortable
          :label="$t('form.byInvoice.documentNo')"
          width="155"
        />
        <el-table-column
          label="Fecha de Orden"
          width="140"
        >
          <template slot-scope="scope">
            {{ formatDate(scope.row.dateOrdered) }}
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('form.byInvoice.businessPartner')"
          min-width="130"
        >
          <template slot-scope="scope">
            {{ scope.row.businessPartner.name }}
          </template>
        </el-table-column>

        <el-table-column
          prop="salesRepresentative.name"
          :label="$t('form.byInvoice.salesRepresentative')"
          min-width="130"
        />

        <el-table-column
          :label="$t('table.ProcessActivity.Status')"
          width="90"
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
          :label="$t('form.productInfo.grandTotal')"
          align="right"
          width="150"
        >
          <template slot-scope="scope">
            {{ formatPrice(scope.row.grandTotal, scope.row.priceList.currency.iso_code) }}
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
import {
  formatDate,
  formatPrice
} from '@/utils/ADempiere/valueFormat.js'
import { extractPagingToken } from '@/utils/ADempiere/valueUtils.js'

export default {
  name: 'FindOrders',
  props: {
    metadata: {
      type: Object,
      default: () => {
        return {
          panelType: 'from',
          uuid: 'Find-Orders',
          containerUuid: 'Find-Orders'
        }
      }
    },
    showField: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    dataList: {
      type: Array,
      default: () => []
    },
    isLoadingTable: {
      type: Boolean,
      default: true
    },
    params: {
      type: Object,
      default: () => {
        return {}
      }
    },
    showPanel: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      metadataList: {},
      total: 0,
      currentPage: 1,
      tokenPage: '',
      input: '',
      isCustomForm: true,
      businessPartner: '',
      timeOut: null,
      changeOrder: {},
      isloading: true,
      ordersInvoiced: [],
      dateOrdered: '',
      openPopover: false
    }
  },
  computed: {
    highlightRow() {
      if (!this.isEmptyValue(this.selectOrder)) {
        return true
      }
      return false
    },
    selectOrder() {
      const action = this.$route.query.action
      if (!this.isEmptyValue(this.ordersInvoiced)) {
        const order = this.ordersInvoiced.find(item => item.uuid === action)
        if (!this.isEmptyValue(order)) {
          return order
        }
      }
      return null
    },
    sortFieldsListOrder() {
      return this.fieldsList.find(field => field.columnName === 'C_BPartner_ID')
    },
    dateOrderedFrom() {
      return this.fieldsList.find(field => {
        if (field.columnName === 'DateOrdered') {
          return field
        }
      })
    }
  },
  methods: {
    formatDate,
    formatPrice,
    extractPagingToken,
    notSubmitForm(event) {
      event.preventDefault()
      return false
    },
    handleChangePage(newPage) {
      this.tokenPage = this.tokenPage + '-' + newPage
    },
    handleCurrentChange(row) {
      // close popover
      this.$store.commit('setQuickSearchOrder', row)
    },
    selectionChangeOrder() {
      const posUuid = this.$store.getters.posAttributes.currentPointOfSales.uuid
      const currentOrder = this.$store.getters.posAttributes.currentPointOfSales.currentOrder
      if (!this.isEmptyValue(this.changeOrder) && this.changeOrder.documentNo !== currentOrder.documentNo) {
        this.$store.state['pointOfSales/point/index'].conversionsList = []
        this.$store.dispatch('currentOrder', this.changeOrder)
        this.$store.dispatch('deleteAllCollectBox')
        this.$router.push({
          params: {
            ...this.$route.params
          },
          query: {
            ...this.$route.query,
            action: this.changeOrder.uuid
          }
        }, () => {})
        const orderUuid = this.$route.query.action
        this.$store.dispatch('listPayments', { posUuid, orderUuid })
      }
      this.clear()
    },
    orderPrpcess(row) {
      const parametersList = [{
        columnName: 'C_Order_ID',
        value: row.id
      }]
      this.$store.dispatch('addParametersProcessPos', parametersList)
    },
    sortDate(listDate) {
      return listDate.sort((elementA, elementB) => {
        return new Date().setTime(new Date(elementB.dateOrdered).getTime()) - new Date().setTime(new Date(elementA.dateOrdered).getTime())
      })
    },
    clear() {
      this.$store.commit('setShowsearchToDeliveOrders', false)
      this.input = ''
      this.$store.commit('updateValueOfField', {
        containerUuid: 'Aisle-Vendor-List',
        columnName: 'C_BPartner_ID',
        value: undefined
      })
      this.$store.commit('updateValueOfField', {
        containerUuid: 'Aisle-Vendor-List',
        columnName: 'DisplayColumn_C_BPartner_ID',
        value: undefined
      })
      this.$store.commit('updateValueOfField', {
        containerUuid: 'Aisle-Vendor-List',
        columnName: 'C_BPartner_ID_UUID',
        value: undefined
      })
    }
  }
}
</script>
