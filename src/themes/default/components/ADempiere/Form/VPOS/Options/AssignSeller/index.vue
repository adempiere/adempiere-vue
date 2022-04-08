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
  <el-container style="height: -webkit-fill-available;overflow: hidden;">
    <el-main style="background: white;padding: 0px;overflow: hidden;height: -webkit-fill-available;">
      <el-card class="box-card" style="padding-left: 0px;padding-right: 0px;">
        <el-scrollbar wrap-class="scroll-seller">
          <el-row style="padding: 2px">
            <template v-for="(seller, key) in listSellers">
              <el-col :key="key" :span="8">
                <el-card
                  :shadow="seller.uuid === salesRepresentative.uuid ? 'always' : 'never'"
                  :class="seller.uuid === salesRepresentative.uuid ? 'custom-card-select' : 'custom-card'"
                  :body-style="{ padding: '10px' }"
                >
                  <div @click="changeSeller(seller)">
                    <div class="image-profile">
                      <el-avatar
                        shape="circle"
                        :size="100"
                        fit="fill"
                        :src="seller.image"
                      />
                    </div>
                    <div class="footer-product">
                      <p class="label">
                        <b> {{ seller.name }} </b>
                      </p>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </template>
          </el-row>
        </el-scrollbar>
      </el-card>
    </el-main>
    <el-footer>
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
import formMixin from '@theme/components/ADempiere/Form/formMixin'
import fieldsListAssignSeller from './fieldsList.js'
import {
  allocateSeller,
  availableSellers,
  deallocate
} from '@/api/ADempiere/form/point-of-sales.js'
import { getImagePath } from '@/utils/ADempiere/resource.js'

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
    shortkeyAction: {
      type: Boolean,
      default: false
    },
    metadata: {
      type: Object,
      default: () => {
        return {
          uuid: 'Assign-Seller',
          containerUuid: 'Assign-Seller'
        }
      }
    },
    containerManager: {
      type: Object,
      default: () => ({
        actionPerformed: () => {},
        changeFieldShowedFromUser: () => {},
        getFieldsLit: () => {},
        isDisplayedField: () => { return true },
        isMandatoryField: () => { return true },
        isReadOnlyField: () => { return false },
        setDefaultValues: () => {}
      })
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
      currentSeller: '',
      listSeller: [],
      isOnlyAllocated: false,
      salesRepresentative: {
        uuid: ''
      },
      value: ''
    }
  },
  computed: {
    validateSeller() {
      return this.isEmptyValue(this.salesRepresentative)
    },
    showAssignSeller() {
      return this.isEmptyValue(this.$store.getters.getShowAssignSeller) ? false : this.$store.getters.getShowAssignSeller
    },
    listSellers() {
      if (!this.isEmptyValue(this.listSeller)) {
        return this.listSeller.map(seller => {
          return {
            ...seller,
            image: this.avatarResize(seller.image)
          }
        })
      }
      return []
    },
    showUnassignSeller() {
      return this.$store.getters.getShowUnassignSeller
    }
  },
  watch: {
    shortkeyAction(value) {
      if (value && !this.validateSeller) {
        this.assignSeller()
      }
    },
    showAssignSeller(value) {
      if (value) {
        this.listAvailableSellers()
      }
    },
    fieldsList(value) {
      this.listAvailableSellers()
    }
  },
  methods: {
    avatarResize(image) {
      if (this.isEmptyValue(image)) {
        return require('@/image/ADempiere/avatar/no-avatar.png')
      }

      const { uri } = getImagePath({
        file: image,
        width: 500,
        height: 500
      })

      return uri
    },
    selectSeller() {
      if (this.showUnassignSeller) {
        this.unassignSeller()
        return
      }
      this.assignSeller()
    },
    unassignSeller() {
      this.$message({
        message: 'Acción a realizar',
        showClose: true
      })
      this.$store.commit('setShowUnassignSeller', false)
      deallocate({
        posUuid: this.$store.getters.posAttributes.currentPointOfSales.uuid,
        salesRepresentativeUuid: this.salesRepresentative.uuid
      })
        .then(response => {
          this.$message({
            message: response,
            isShowClose: true,
            type: 'success'
          })
          this.close()
        })
        .catch(error => {
          this.$store.commit('setShowAssignSeller', true)
          this.$message({
            message: error.message,
            isShowClose: true,
            type: 'error'
          })
          console.warn(`Error: ${error.message}. Code: ${error.code}.`)
        })
    },
    close() {
      this.$store.commit('updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'SalesRep_ID',
        value: undefined
      })
      this.$store.commit('setShowUnassignSeller', false)
      this.$store.commit('setShowAssignSeller', false)
      this.salesRepresentative = ''
    },
    listAvailableSellers(isOnlyAllocated) {
      availableSellers({
        posUuid: this.$store.getters.posAttributes.currentPointOfSales.uuid,
        isOnlyAllocated: false
      })
        .then(response => {
          this.listSeller = response.records
        })
        .catch(error => {
          this.$message({
            message: error.message,
            isShowClose: true,
            type: 'error'
          })
          console.warn(`Error: ${error.message}. Code: ${error.code}.`)
        })
    },
    changeSeller(value) {
      this.salesRepresentative = value
    },
    changeOnlyAllocated(value) {
      if (value) {
        this.listAvailableSellers(value)
        return
      }
      this.listAvailableSellers()
    },
    assignSeller() {
      this.$message({
        message: 'Acción a realizar',
        showClose: true
      })
      this.$store.commit('setShowAssignSeller', false)
      allocateSeller({
        posUuid: this.$store.getters.posAttributes.currentPointOfSales.uuid,
        salesRepresentativeUuid: this.salesRepresentative.uuid
      })
        .then(response => {
          this.$message({
            message: response,
            isShowClose: true,
            type: 'success'
          })
        })
        .catch(error => {
          this.$store.commit('setShowAssignSeller', true)
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
