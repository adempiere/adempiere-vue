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
    @shortkey.native="keyAction"
  >
    <el-collapse v-model="activeAccordion" accordion>
      <el-collapse-item name="query-criteria">
        <template slot="title">
          Ver Histórico de Órdenes
        </template>
        <el-form
          v-if="!isEmptyValue(sortFieldsListOrder)"
          label-position="top"
          label-width="10px"
          @submit.native.prevent="notSubmitForm"
        >
          <template
            v-for="(field) in sortFieldsListOrder"
          >
            <field-definition
              :key="field.columnName"
              :metadata-field="field"
              :container-uuid="'Orders-List'"
              :container-manager="{
                ...containerManager,
                getLookupList,
                isDisplayedField,
                isMandatoryField,
                isReadOnlyField,
                changeFieldShowedFromUser
              }"
            />
          </template>
        </el-form>
        <div
          v-else
          key="form-loading"
          v-loading="isEmptyValue(sortFieldsListOrder)"
          :element-loading-text="$t('notifications.loading')"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255, 255, 255, 0.8)"
          class="loading-panel"
        />
      </el-collapse-item>
    </el-collapse>

    <el-table
      ref="orderTable"
      v-shortkey="shortsKey"
      v-loading="!ordersList.isLoaded || isLoadRecord"
      :data="sortTableOrderList"
      border
      :empty-text="$t('form.byInvoice.emptyList')"
      fit
      highlight-current-row
      :height="heightTable"
      @shortkey.native="keyAction"
      @current-change="handleCurrentChange"
      @row-dblclick="selectionChangeOrder"
    >
      <el-table-column
        prop="documentNo"
        width="155"
      >
        <template slot="header" slot-scope="scope">
          {{ $t('form.byInvoice.documentNo') }}
          <el-button-group
            style="display: inline-grid;vertical-align: inherit;"
          >
            <el-button
              type="text"
              icon="el-icon-caret-top"
              style="margin: 0px;padding: 0px;"
              @click="sortAscendingTable(sortTableOrderList, scope.column.property)"
            />
            <el-button
              type="text"
              icon="el-icon-caret-bottom"
              style="margin: 0px;padding: 0px;"
              @click="sortDescendingTable(sortTableOrderList, scope.column.property)"
            />
          </el-button-group>
        </template>
      </el-table-column>

      <el-table-column
        width="100"
      >
        <template slot="header">
          {{ $t('table.ProcessActivity.Status') }}
          <el-button-group
            style="display: inline-grid;vertical-align: inherit;"
          >
            <el-button
              type="text"
              icon="el-icon-caret-top"
              style="margin: 0px;padding: 0px;"
              @click="sortAscendingTable(sortTableOrderList, 'documentStatus', 'name')"
            />
            <el-button
              type="text"
              icon="el-icon-caret-bottom"
              style="margin: 0px;padding: 0px;"
              @click="sortDescendingTable(sortTableOrderList, 'documentStatus', 'name')"
            />
          </el-button-group>
        </template>
        <template slot-scope="scope">
          <document-status-tag
            :value="scope.row.documentStatus.value"
            :displayed-value="scope.row.documentStatus.name"
          />
        </template>
      </el-table-column>

      <el-table-column
        prop="salesRepresentative.name"
        min-width="170"
      >
        <template slot="header">
          {{ $t('form.byInvoice.salesRepresentative') }}
          <el-button-group
            style="display: inline-grid;vertical-align: inherit;"
          >
            <el-button
              type="text"
              icon="el-icon-caret-top"
              style="margin: 0px;padding: 0px;"
              @click="sortAscendingTable(sortTableOrderList, 'salesRepresentative', 'name')"
            />
            <el-button
              type="text"
              icon="el-icon-caret-bottom"
              style="margin: 0px;padding: 0px;"
              @click="sortDescendingTable(sortTableOrderList, 'salesRepresentative', 'name')"
            />
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column
        min-width="160"
      >
        <template slot="header">
          {{ $t('form.byInvoice.businessPartner') }}
          <el-button-group
            style="display: inline-grid;vertical-align: inherit;"
          >
            <el-button
              type="text"
              icon="el-icon-caret-top"
              style="margin: 0px;padding: 0px;"
              @click="sortAscendingTable(sortTableOrderList, 'businessPartner', 'name')"
            />
            <el-button
              type="text"
              icon="el-icon-caret-bottom"
              style="margin: 0px;padding: 0px;"
              @click="sortDescendingTable(sortTableOrderList, 'businessPartner', 'name')"
            />
          </el-button-group>
        </template>
        <template slot-scope="scope">
          {{ scope.row.businessPartner.name }}
        </template>
      </el-table-column>

      <el-table-column
        width="155"
      >
        <template slot="header">
          Fecha de Orden
          <el-button-group
            style="display: inline-grid;vertical-align: inherit;"
          >
            <el-button
              type="text"
              icon="el-icon-caret-top"
              style="margin: 0px;padding: 0px;"
              @click="sortAscendingDate(sortTableOrderList)"
            />
            <el-button
              type="text"
              icon="el-icon-caret-bottom"
              style="margin: 0px;padding: 0px;"
              @click="sortDescendingDate(sortTableOrderList)"
            />
          </el-button-group>
        </template>
        <template slot-scope="scope">
          {{ formatDate(scope.row.dateOrdered) }}
        </template>
      </el-table-column>
      <el-table-column
        align="right"
        width="150"
      >
        <template slot="header">
          {{ $t('form.productInfo.grandTotal') }}
          <el-button-group
            style="display: inline-grid;vertical-align: inherit;"
          >
            <el-button
              type="text"
              icon="el-icon-caret-top"
              style="margin: 0px;padding: 0px;"
              @click="sortAscendingTable(sortTableOrderList, 'grandTotal')"
            />
            <el-button
              type="text"
              icon="el-icon-caret-bottom"
              style="margin: 0px;padding: 0px;"
              @click="sortDescendingTable(sortTableOrderList, 'grandTotal')"
            />
          </el-button-group>
        </template>
        <template slot-scope="scope">
          {{ formatPrice(scope.row.grandTotal, scope.row.priceList.currency.iso_code) }}
        </template>
      </el-table-column>
    </el-table>

    <custom-pagination
      :total="ordersList.recordCount"
      :current-page="ordersList.pageNumber"
      :handle-change-page="handleChangePage"
    />
    <el-row :gutter="24">
      <el-col :span="24">
        <samp style="float: right; padding-right: 10px;">
          <el-button
            type="danger"
            class="custom-button-create-bp"
            icon="el-icon-close"
            @click="clear"
          />
          <el-button
            type="primary"
            class="custom-button-create-bp"
            icon="el-icon-check"
            @click="selectionChangeOrder"
          />
        </samp>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
// constants
import fieldsListOrders from './fieldsListOrders.js'

// components and mixins
import DocumentStatusTag from '@theme/components/ADempiere/ContainerOptions/DocumentStatusTag/index.vue'
import CustomPagination from '@theme/components/ADempiere/DefaultTable/CustomPagination.vue'
import FieldDefinition from '@theme/components/ADempiere/Field/index.vue'
import posMixin from '@theme/components/ADempiere/Form/VPOS/posMixin.js'

// api request methods
import { holdOrder } from '@/api/ADempiere/form/point-of-sales.js'

// utils and helper methods
import {
  getLookupList,
  isDisplayedField,
  isMandatoryField,
  isReadOnlyField,
  changeFieldShowedFromUser
} from '@theme/components/ADempiere/Form/VPOS/containerManagerPos.js'
import {
  createFieldFromDictionary
} from '@/utils/ADempiere/lookupFactory'
import {
  formatDate,
  formatQuantity
} from '@/utils/ADempiere/valueFormat.js'

export default {
  name: 'OrdersList',

  components: {
    CustomPagination,
    DocumentStatusTag,
    FieldDefinition
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
      defaultMaxPagination: 50,
      fieldsList: fieldsListOrders,
      metadataList: [],
      isLoadRecord: false,
      isCustomForm: true,
      changeOrder: {},
      activeAccordion: 'query-criteria',
      timeOut: null
    }
  },

  computed: {
    heightTable() {
      if (this.isEmptyValue(this.activeAccordion)) {
        return 600
      }
      return 350
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
    sortTableOrderList: {
      get() {
        if (this.isEmptyValue(this.ordersList.ordersList)) {
          return []
        }
        return this.ordersList.ordersList
      },
      set(value) {
        return value
      }

    }
  },

  watch: {
    showField(value) {
      if (value && this.isEmptyValue(this.metadataList)) {
        this.setFieldsList()
      }
    },
    sortTableOrderList(value) {
      this.isLoadRecord = false
    }
  },

  created() {
    this.unsubscribe = this.subscribeChanges()
    if (this.isReadyFromGetData) {
      this.loadOrdersList()
    }
  },

  beforeDestroy() {
    this.unsubscribe()
  },

  methods: {
    formatDate,
    formatQuantity,
    getLookupList,
    isDisplayedField,
    isMandatoryField,
    isReadOnlyField,
    changeFieldShowedFromUser,
    createFieldFromDictionary,
    sortAscendingDate(listDate) {
      return listDate.sort((elementA, elementB) => {
        return new Date().setTime(new Date(elementB.dateOrdered).getTime()) - new Date().setTime(new Date(elementA.dateOrdered).getTime())
      })
    },
    sortDescendingDate(listDate) {
      return listDate.sort((elementA, elementB) => {
        return new Date().setTime(new Date(elementA.dateOrdered).getTime()) - new Date().setTime(new Date(elementB.dateOrdered).getTime())
      })
    },
    sortDescendingTable(listDate, column, params) {
      return listDate.sort((element, item) => {
        if ((!this.isEmptyValue(params) && element[column][params] > item[column][params]) || element[column] > item[column]) {
          return 1
        }
        if ((!this.isEmptyValue(params) && element[column][params] < item[column][params]) || (element[column] < item[column])) {
          return -1
        }
        return 0
      })
    },
    sortAscendingTable(listDate, column, params) {
      return listDate.sort((element, item) => {
        if ((!this.isEmptyValue(params) && element[column][params] < item[column][params]) || (element[column] < item[column])) {
          return 1
        }
        if ((!this.isEmptyValue(params) && element[column][params] > item[column][params]) || (element[column] > item[column])) {
          return -1
        }
        return 0
      })
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
      this.isLoadRecord = true
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
      // if (this.changeOrder.documentStatus.value === 'DR') {
      holdOrder({
        posUuid: this.$store.getters.posAttributes.currentPointOfSales.uuid,
        salesRepresentativeUuid: this.$store.getters['user/getUserUuid'],
        orderUuid: this.changeOrder.uuid
      })
        .then(response => {
          this.$message.success(this.$t('form.pos.generalNotifications.selectedOrder') + response.documentNo)
        })
        .catch(error => {
          this.$message({
            message: error.message,
            isShowClose: true,
            type: 'error'
          })
          console.warn(`Error Hold Order ${error.message}. Code: ${error.code}.`)
        })
      // }
      this.clear()
    },
    clear() {
      this.$store.commit('showListOrders', false)
    },
    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'updateValueOfField' &&
          !mutation.payload.columnName.includes('DisplayColumn') &&
          !mutation.payload.columnName.includes('_UUID') &&
          mutation.payload.containerUuid === this.metadata.containerUuid) {
          clearTimeout(this.timeOut)
          this.isLoadRecord = true
          this.timeOut = setTimeout(() => {
            this.$store.dispatch('setOrdersListPageNumber', 1)
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
    }

  }
}
</script>
