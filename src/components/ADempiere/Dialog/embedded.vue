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
  <el-dialog
    title="Tips"
    :visible.sync="showEmbedded"
    :before-close="handleClose"
    width="80%"
  >
    <span slot="title">
      {{ $t('data.recordAccess.actions') }}
    </span>
    <slot />
  </el-dialog>
</template>

<script>
// import { showNotification } from '@/utils/ADempiere/notification'
export default {
  name: 'Embedded',
  props: {
    parentUuid: {
      type: String,
      default: undefined
    },
    containerUuid: {
      type: String,
      default: ''
    },
    panelType: {
      type: String,
      default: 'window'
    },
    reportExportType: {
      type: String,
      default: ''
    },
    tableName: {
      type: String,
      default: undefined
    },
    recordId: {
      type: Object,
      default: undefined
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      lock: false,
      dialogVisible: false
    }
  },
  computed: {
    showEmbedded() {
      return this.visible
    }
  },
  methods: {
    handleClose() {
      this.$store.commit('setShowRecordAccess', false)
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
