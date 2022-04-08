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
      <p style="text-align: center;"> <b> {{ $t('form.byInvoice.searchCompleteOrders') }} </b></p>
      <el-form label-position="top" :inline="true" class="demo-form-inline" @submit.native.prevent="notSubmitForm">
        <el-form-item label="No. del Documento">
          <el-input v-model="input" placeholder="Please input" @change="listOrdersInvoiced" />
        </el-form-item>
        <el-form-item
          v-for="(field) in metadataList"
          :key="field.columnName"
        >
          <field-definition
            :metadata-field="{
              ...field,
              size: 6,
              name: field.columnName === 'DateOrderedFrom' ? $t('form.pos.optionsPoinSales.generalOptions.dateOrder') : field.name
            }"
          />
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-table
        v-loading="isloading"
        :data="ordersInvoiced"
        height="400"
        border
        :empty-text="$t('form.byInvoice.emptyList')"
        fit
        highlight-current-row
        @current-change="handleCurrentChange"
      >
        <el-table-column
          prop="documentNo"
          :label="$t('form.byInvoice.documentNo')"
          width="135"
        />
        <el-table-column
          label="Fecha de Orden"
          width="135"
        >
          <template slot-scope="scope">
            {{ formatDate(scope.row.dateOrdered) }}
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('form.byInvoice.businessPartner')"
          min-width="120"
        >
          <template slot-scope="scope">
            {{ scope.row.businessPartner.name }}
          </template>
        </el-table-column>

        <el-table-column
          prop="salesRepresentative.name"
          :label="$t('form.byInvoice.salesRepresentative')"
          min-width="100"
        />

        <el-table-column
          :label="$t('table.ProcessActivity.Status')"
          width="100"
        >
          <template slot-scope="scope">
            <document-status-tag
              :value="scope.row.documentStatus.value"
              :displayed-value="scope.row.documentStatus.name"
            />
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
    <el-footer>
      <custom-pagination
        :total="total"
        :current-page="currentPage"
        :handle-change-page="handleChangePage"
        layout="total, prev, pager, next"
        style="float: right;"
      />
    </el-footer>
    <el-row :gutter="24">
      <el-col :span="24">
        <samp style="float: right; padding-right: 10px;">
          <el-button
            type="danger"
            class="custom-button-create-bp"
            icon="el-icon-close"
            @click="clear()"
          />
          <el-button
            type="primary"
            class="custom-button-create-bp"
            icon="el-icon-check"
            @click="selectionChangeOrder()"
          />
        </samp>
      </el-col>
    </el-row>
  </el-container>
</template>

<script>
// constants
import fieldsListOrders from './fieldsListOrders.js'

// components and mixins
import DocumentStatusTag from '@theme/components/ADempiere/ContainerOptions/DocumentStatusTag/index.vue'
import FieldDefinition from '@theme/components/ADempiere/Field'
import CustomPagination from '@theme/components/ADempiere/Pagination'

// api request methods
import {
  listOrders
} from '@/api/ADempiere/form/point-of-sales.js'

// utils and helpers methods
import {
  createFieldFromDictionary
} from '@/utils/ADempiere/lookupFactory'
import {
  formatDate,
  formatPrice
} from '@/utils/ADempiere/valueFormat.js'
import { extractPagingToken } from '@/utils/ADempiere/valueUtils.js'

export default {
  name: 'SearchCompleteOrders',

  components: {
    CustomPagination,
    DocumentStatusTag,
    FieldDefinition
  },

  props: {
    metadata: {
      type: Object,
      default: () => {
        return {
          panelType: 'from',
          uuid: 'Aisle-Vendor-List',
          containerUuid: 'Aisle-Vendor-List'
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
      fieldsList: fieldsListOrders,
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

  watch: {
    showField(value) {
      const date = new Date()
      this.$store.commit('updateValueOfField', {
        containerUuid: 'Aisle-Vendor-List',
        columnName: 'DateOrderedFrom',
        value: date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0')
      })
      if (value && this.isEmptyValue(this.ordersInvoiced)) {
        this.setFieldsList()
        clearTimeout(this.timeOut)
        this.timeOut = setTimeout(() => {
          this.listOrdersInvoiced()
        }, 500)
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
    formatPrice,
    extractPagingToken,
    createFieldFromDictionary,
    handleChangePage(newPage) {
      this.tokenPage = this.tokenPage + '-' + newPage
      this.listOrdersInvoiced()
    },
    handleCurrentChange(row) {
      // close popover
      this.$store.commit('showListOrders', false)
      this.changeOrder = row
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
    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'updateValueOfField' && mutation.payload.columnName === 'C_BPartner_ID_UUID' && mutation.payload.containerUuid === 'Aisle-Vendor-List' && mutation.payload.value !== this.businessPartner) {
          this.businessPartner = mutation.payload.value
        }
        if (mutation.type === 'updateValueOfField' && mutation.payload.columnName === 'DateOrderedFrom' && mutation.payload.containerUuid === 'Aisle-Vendor-List' && mutation.payload.value !== this.dateOrdered) {
          this.dateOrdered = mutation.payload.value
        }
        if (mutation.type === 'updateValueOfField' &&
          !mutation.payload.columnName.includes('DisplayColumn') &&
          !mutation.payload.columnName.includes('_UUID') &&
          mutation.payload.containerUuid === this.metadata.containerUuid) {
          clearTimeout(this.timeOut)
          this.timeOut = setTimeout(() => {
            this.listOrdersInvoiced()
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
      const fieldsList = [
        {
          ...this.sortFieldsListOrder,
          containerUuid: 'Aisle-Vendor-List'
        },
        {
          ...this.dateOrderedFrom,
          containerUuid: 'Aisle-Vendor-List'
        }
      ]
      const newfieldsList = []
      // Create Panel
      this.$store.dispatch('addPanel', {
        containerUuid: 'Aisle-Vendor-List',
        isCustomForm: false,
        uuid: this.metadata.uuid,
        panelType: this.metadata.panelType,
        fieldsList: fieldsList
      })
      // Product Code
      fieldsList.forEach(element => {
        this.createFieldFromDictionary(element)
          .then(response => {
            newfieldsList.push({
              ...response,
              containerUuid: 'Aisle-Vendor-List'
            })
          }).catch(error => {
            console.warn(`LookupFactory: Get Field From Server (State) - Error ${error.code}: ${error.message}.`)
          })
      })
      this.metadataList = newfieldsList
    },
    sortDate(listDate) {
      return listDate.sort((elementA, elementB) => {
        return new Date().setTime(new Date(elementB.dateOrdered).getTime()) - new Date().setTime(new Date(elementA.dateOrdered).getTime())
      })
    },
    listOrdersInvoiced() {
      this.isloading = true
      if (this.$store.getters.getSearchCompleteOrderss) {
        listOrders({
          posUuid: this.$store.getters.posAttributes.currentPointOfSales.uuid,
          documentNo: this.input,
          isOnlyProcessed: true,
          pageToken: this.tokenPage,
          dateOrderedFrom: this.dateOrdered,
          businessPartnerUuid: this.businessPartner,
          salesRepresentativeUuid: this.$store.getters['user/getUserUuid']
        })
          .then(response => {
            this.isloading = false
            this.tokenPage = this.extractPagingToken(response.nextPageToken)
            this.total = response.recordCount
            this.ordersInvoiced = response.ordersList
          })
          .catch(error => {
            this.isloading = false
            console.warn(`listOrdersFromServer: ${error.message}. Code: ${error.code}.`)
          })
      }
    },
    clear() {
      this.$store.commit('setShowFastCompleteOrders', false)
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
