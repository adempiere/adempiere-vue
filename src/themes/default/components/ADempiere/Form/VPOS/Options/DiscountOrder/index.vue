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
  <span>
    <el-form
      label-position="top"
      label-width="10px"
      @submit.native.prevent="notSubmitForm"
    >
      <field-definition
        :metadata-field="fieldsList[0]"
        :container-uuid="'Discount-Order'"
        :container-manager="{
          ...containerManager,
          getLookupList,
          isDisplayedField,
          isMandatoryField,
          isReadOnlyField,
          changeFieldShowedFromUser
        }"
      />
    </el-form>
  </span>
</template>

<script>
// constants
import fieldListDiscount from './fieldsList.js'

import formMixin from '@theme/components/ADempiere/Form/formMixin'
import {
  getLookupList,
  isDisplayedField,
  isMandatoryField,
  isReadOnlyField,
  changeFieldShowedFromUser
} from '@theme/components/ADempiere/Form/VPOS/containerManagerPos.js'

export default {
  name: 'DiscountOrder',
  mixins: [
    formMixin
  ],
  props: {
    metadata: {
      type: Object,
      default: () => {
        return {
          uuid: 'Discount-Order',
          containerUuid: 'Discount-Order'
        }
      }
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
      fieldsList: fieldListDiscount
    }
  },
  methods: {
    getLookupList,
    isDisplayedField,
    isMandatoryField,
    isReadOnlyField,
    changeFieldShowedFromUser
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
  .custom-card-select {
    margin: 1px;
    cursor: pointer;
    border: 1px solid #bfe3ff;
    background: hsl(206, 100%, 87%);
  }
  .custom-card {
    margin: 1px;
    cursor: pointer;
  }
  .custom-card:hover {
    background-color: #eaf5fe;
    border: 1px solid #36a3f7;
  }
  .footer-product {
    display: flex;
    width: 100%;
  }
  .key-layout {
    width: 100%;
    height: 200px;
    display: block;
    padding-top: 5px;
    padding-right: 5px;
    padding-bottom: 5px;
    padding-left: 5px;
  }
  .label {
    text-align: center;
    width: 100%;
    padding: 0px !important;
    margin: 0px;
  }
  .image-profile {
    width: 100%;
    text-align: center;
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
  .scroll-seller {
    max-height: 250px;
  }
</style>
