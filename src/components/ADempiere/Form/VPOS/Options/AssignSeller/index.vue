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
      <el-card class="box-card" style="padding-left: 0px; padding-right: 0px">
        <el-col
          :span="8"
        >
          <el-form
            label-position="top"
            label-width="10px"
          >
            <field-definition
              :metadata-field="fieldsList[0]"
            />
          </el-form>
        </el-col>
      </el-card>
    </el-main>
    <el-footer style="height: auto; padding: 0px">
      <el-button
        style="float: right;margin-left: 10px;"
        type="primary"
        icon="el-icon-check"
        :disabled="validateSeller"
        @click="assignSeller()"
      />
      <el-button
        style="float: right;"
        type="danger"
        icon="el-icon-close"
        @click="close()"
      />
    </el-footer>
  </el-container>
</template>

<script>
import formMixin from '@/components/ADempiere/Form/formMixin'
import fieldsListAssignSeller from './fieldsList.js'
import {
  allocateSeller
} from '@/api/ADempiere/form/point-of-sales.js'

export default {
  name: 'AssignSeller',
  mixins: [
    formMixin
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
          uuid: 'Assign-Seller',
          containerUuid: 'Assign-Seller'
        }
      }
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
      fieldsList: fieldsListAssignSeller,
      sendToServer: false,
      visible: false,
      infoClose: {},
      value: ''
    }
  },
  computed: {
    validateSeller() {
      const salesRep = this.$store.getters.getValueOfField({
        containerUuid: this.containerUuid,
        columnName: 'SalesRep_ID'
      })
      return this.isEmptyValue(salesRep)
    }
  },
  methods: {
    close() {
      this.$store.commit('updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'SalesRep_ID',
        value: undefined
      })
      this.$store.commit('setShowAssignSeller', false)
    },
    assignSeller() {
      const salesRepID = this.$store.getters.getValueOfField({
        containerUuid: this.containerUuid,
        columnName: 'SalesRep_ID_UUID'
      })
      allocateSeller({
        posUuid: this.$store.getters.posAttributes.currentPointOfSales.uuid,
        salesRepresentativeUuid: salesRepID
      })
        .then(response => {
          this.$message({
            message: response,
            isShowClose: true,
            type: 'success'
          })
        })
        .catch(error => {
          this.$message({
            message: error.message,
            isShowClose: true,
            type: 'error'
          })
          console.warn(`Error: ${error.message}. Code: ${error.code}.`)
        })
        .finally(() => {
          this.close()
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
