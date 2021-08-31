<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Elsio Sanchez elsiosanches@gmail.com www.erpya.com
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
  <div style="width: 140px">
    <p>
      <label style="margin-right: 16px;">Switch Loading</label>
      <el-switch v-model="loading" />
    </p>
    <el-skeleton style="width: 140px" :loading="loading" animated>
      <template slot="template">
        <el-skeleton-item
          variant="image"
          style="width: 140px; height: 140px;"
        />
      </template>
      <template>
        <el-card :body-style="{ padding: '0px', marginBottom: '1px' }">
          <el-image
            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            class="image"
            style="width: 140px; height: 140px;"
          />
        </el-card>
      </template>
    </el-skeleton>
  </div>
</template>

<script>
export default {
  name: 'ImageProduct',
  props: {
    stepReference: {
      type: String,
      default: 'carousel'
    },
    steps: {
      type: Array,
      default: () => []
    },
    indicator: {
      type: Number,
      default: 0
    },
    show: {
      type: Boolean,
      default: false
    },
    metadataLine: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: true,
      currentDate: '2021-06-01'
    }
  },
  watch: {
    indicator(value) {
      this.$refs[this.stepReference].activeIndex = value
    },
    show(value) {
      if (value && !this.isEmptyValue(this.metadataLine)) {
        this.getListImageProduct(this.metadataLine)
      }
    }
  },
  methods: {
    getListImageProduct(product) {
      console.log(product)
    }
  }
}
</script>

<style>
.el-carousel__container {
  position: relative;
  height: 100%;
}
</style>
