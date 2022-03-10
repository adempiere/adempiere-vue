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
  <div
    v-if="isLoaded"
    style="height: 100% !important;display: -webkit-box;"
  >
    <el-container style="height: 100% !important;">
      <el-header>
        <el-steps :active="active" finish-status="success" process-status="finish">
          <el-step
            v-for="(item, index) in step"
            :key="index"
            :title="item.name"
          />
        </el-steps>
      </el-header>
      <el-main style="display: contents">
        <carousel
          :step-reference="'epale'"
          :steps="step"
          :indicator="active"
          style="display: contents;height: -webkit-fill-available;"
        >
          <el-card v-if="active === 0" shadow="hover">
            <el-form
              key="form-loaded"
              label-position="top"
              label-width="10px"
              style="z-index: -1;"
              @submit.native.prevent="notSubmitForm"
            >
              <el-form ref="form" label-position="top" inline :model="form" label-width="120px">
                <el-row>
                  <el-col :span="5" style="padding-left: 1%;padding-right: 1%;">
                    <el-form-item label="Codigo" style="display: contents;">
                      <el-input v-model="form.name" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="5" style="padding-left: 1%;padding-right: 1%;">
                    <el-form-item label="Tipo de Aplicación" style="display: contents;">
                      <el-select v-model="form.region" placeholder="please select your zone">
                        <el-option label="Zone one" value="shanghai" />
                        <el-option label="Zone two" value="beijing" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5" style="padding-left: 1%;padding-right: 1%;">
                    <el-form-item label="Aplicación Soportada" style="display: contents;">
                      <el-select v-model="form.region" placeholder="please select your zone">
                        <el-option label="Zone one" value="shanghai" />
                        <el-option label="Zone two" value="beijing" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5" style="padding-left: 1%;padding-right: 1%;">
                    <el-form-item label="Nombre" style="display: contents;">
                      <el-input v-model="form.name" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4" style="padding-left: 1%;padding-right: 1%;">
                    <el-form-item label="Activo" style="display: contents;">
                      <el-switch v-model="form.delivery" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24" style="padding-left: 1%;padding-right: 1%;">
                    <el-form-item label="Descripción" style="display: contents;">
                      <el-input v-model="form.name" type="textarea" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" style="padding-left: 1%;padding-right: 1%;">
                    <el-form-item label="No. de Versión" style="display: contents;">
                      <el-input v-model="form.name" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" style="padding-left: 1%;padding-right: 1%;">
                    <el-form-item label="Usuario" style="display: contents;">
                      <el-input v-model="form.name" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" style="padding-left: 1%;padding-right: 1%;">
                    <el-form-item label="Servidor" style="display: contents;">
                      <el-input v-model="form.name" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" style="padding-left: 1%;padding-right: 1%;">
                    <el-form-item label="Puerto" style="display: contents;">
                      <el-input v-model="form.name" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" style="padding-left: 1%;padding-right: 1%;">
                    <el-form-item label="Tiempo de Espera" style="display: contents;">
                      <el-input v-model="form.name" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <!-- <field-definition
                v-for="(field) in fieldsList"
                id="AppSoport"
                ref="AppSoport"
                :key="field.columnName"
                :container-uuid="'App-Soport'"
                :container-manager="{
                  ...containerManager,
                  isMandatoryField({ isMandatory, isMandatoryFromLogic }) {return field.isMandatory || field.isMandatoryFromLogic},
                  isDisplayedField({ isDisplayed, isDisplayedFromLogic }) {return field.isDisplayed || field.isDisplayedFromLogic}
                }"
                :metadata-field="field"
                :v-model="field.value"
              /> -->
            </el-form>
          </el-card>
          <el-card v-if="active === 1" shadow="hover">
            <el-form label-position="top" label-width="100px" @submit.native.prevent="notSubmitForm">
              <el-form-item label="BaseURL">
                <el-input v-model="name" />
              </el-form-item>
              <el-form-item label="UserName">
                <el-input v-model="value" />
              </el-form-item>
              <el-form-item label="Password">
                <el-input v-model="qlq" />
              </el-form-item>
            </el-form>
          </el-card>
        </carousel>
      </el-main>
      <el-footer>
        <el-button type="primary" :icon="iconStep" style="float: right;" @click="next" />
        <el-button v-show="active > 0" type="danger" icon="el-icon-close" style="float: right;margin-right: 10px;" @click="prev" />
      </el-footer>
    </el-container>
  </div>

  <loading-view
    v-else
    key="form-loading"
  />
</template>

<script>
// constants
import fieldsList from './fieldsList.js'
import Carousel from '@/components/ADempiere/Carousel'

// components and mixins
import LoadingView from '@/components/ADempiere/LoadingView/index.vue'
import formMixin from '@/components/ADempiere/Form/formMixin.js'

// api request methods

// methods and helpers
export default {
  name: 'AppSoport',

  components: {
    LoadingView,
    Carousel
  },

  mixins: [
    formMixin
  ],

  props: {
    metadata: {
      type: Object,
      default: () => {
        return {
          uuid: 'App-Soport',
          containerUuid: 'App-Soport',
          fieldsList
        }
      }
    },
    parentUuid: {
      type: String,
      default: undefined
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
      messageError: true,
      fieldsList,
      productPrice: {},
      organizationBackground: '',
      currentImageOfProduct: '',
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      search: '',
      resul: '',
      name: 'http://nextcloud.demo-nextcloud/remote.php/dav/files/erp',
      value: 'erp',
      qlq: 'rtrt4545*',
      isActive: false,
      active: 0,
      backgroundForm: ''
    }
  },

  computed: {
    step() {
      return [
        {
          name: 'Registro de Aplicacion',
          description: 'Registro de Aplicación para una Conexión Externa'
        },
        {
          name: 'Parametros',
          description: 'Parámetros por Defecto para Aplicación Soportada'
        }
      ]
    },
    iconStep() {
      const step = this.step.length - 1
      if (step === this.active) {
        return 'el-icon-s-tools'
      }
      return 'el-icon-check'
    }
  },

  methods: {
    next() {
      if (this.iconStep !== 'el-icon-s-tools') {
        this.active++
      }
    },
    prev() {
      this.active--
    }
  }
}
</script>

<style lang="scss" scoped>
  .background-price-checking {
    width: 100%;
    height: 100%;
    float: inherit;
    background: white;
    // color: white;
    // opacity: 0.5;
  }

  .product-description {
    color: #32363a;
    font-size: 30px;
    float: right;
    padding-bottom: 1%;
    text-align: end;

  }
  .product-price-base, .product-tax {
    font-size: 30px;
    float: right;
  }
  .product-price {
    padding-top: 15px;
    font-size: 50px;
    float: right;
  }
  .rate-date {
    padding-top: 30%;
    font-size: 50px;
    float: right;
    color: black;
    font-weight: bold;
    text-align: end;
  }
  .inquiry-form {
    // position: absolute;
    position: inherit;
    right: 5%;
    width: 100%;
    top: 10%;
    z-index: 0;
  }
  .inquiry-product {
    position: absolute;
    right: 10%;
    top: 33%;
    .amount {
      color: black;
      font-weight: bold;
    }
  }
</style>
<style lang="scss">
  .price-inquiry {
    input {
      color: #606266 !important;
      font-size: 100% !important;
    }
  }
  .product-value {
    float: right;
    padding-right: 0% !important;
    z-index: 0;
    .el-form-item__label {
      font-size: 15px !important;
      color: #000 !important;
    }
  }

  .el-aside {
    background: white;
    width: 60%;
    overflow: hidden;
  }

  .el-form-item {
    margin-bottom: 10px !important;
    margin-left: 10px;
    margin-right: 0px !important;
  }
</style>
