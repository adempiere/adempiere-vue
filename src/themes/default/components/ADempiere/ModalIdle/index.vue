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
  <div v-if="userTimeout === 0" v-loading.fullscreen.lock="isIdle" />
</template>

<script>
import Vue from 'vue'
import IdleVue from 'idle-vue'
import store from '@/store'

const connectionTimeout = (store.getters['user/userInfo'].connection_timeout > 0) ? store.getters['user/userInfo'].connection_timeout : 86400000
Vue.use(IdleVue, {
  eventEmitter: new Vue(),
  store,
  idleTime: `${connectionTimeout}`,
  startAtIdle: false
})
export default {
  name: 'ModalIdle',
  props: {
    parentUuid: {
      type: String,
      default: undefined
    },
    containerUuid: {
      type: String,
      default: ''
    },
    isIdle: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      time: 1000
    }
  },
  computed: {
    isSession() {
      return this.$store.getters['user/getIsSession']
    },
    userTimeout() {
      if (!this.isEmptyValue(this.$store.getters['user/userInfo']) && this.$store.getters['user/userInfo'].connection_timeout > 0) {
        return this.$store.getters['user/userInfo'].connection_timeout
      }
      return 0
    }
  },
  created() {
    setInterval(() => {
      this.time -= this.userTimeout
      if (!this.$store.state.idleVue.isIdle) clearInterval()
      if (this.time < 1 && this.isSession) {
        clearInterval()
        this.logout()
      }
    }, 1000)
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push({
        path: '/login'
      }, () => {})
      this.$store.commit('setPointOfSalesList', [])
      this.$store.commit('setListOrderLine', [])
      this.$store.commit('setOrder', {
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
    }
  }
}
</script>

<style>
  .el-dialog__body {
    padding: 10px 20px;
    max-height: 90%;
    overflow: auto;
  }
  .el-dialog__header {
    padding: 20px;
    padding-bottom: 10px;
    background: #dae6f38c;
}
  .embedded-style {
    height: 77%;
  }
</style>
