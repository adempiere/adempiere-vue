<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Elsio Sanchez esanchez@erpya.com www.erpya.com
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
  <el-card class="field-option-card context-info">
    <div slot="header">
      <span>
        {{ $t('field.field') }}
        <b> {{ fieldAttributes.name }} </b>
      </span>
    </div>

    <el-scrollbar wrap-class="scroll-child">
      <el-form
        ref="form"
        class="form-context-info"
        label-position="top"
        label-width="120px"
        style="overflow: auto;"
        @submit.native.prevent="notSubmitForm"
      >
        <el-form-item
          v-if="!isEmptyValue(messageText)"
          :label="$t('field.contextInfo')"
          class="justify-text"
        >
          {{ messageText }}
        </el-form-item>

        <el-form-item
          :label="$t('field.container.description')"
          class="justify-text"
        >
          {{ fieldAttributes.description }}
        </el-form-item>

        <el-form-item
          v-if="!isEmptyValue(fieldAttributes.help)"
          :label="$t('field.container.help')"
          class="justify-text"
        >
          {{ fieldAttributes.help }}
        </el-form-item>
      </el-form>
    </el-scrollbar>

    <template v-for="(zoomItem, index) in fieldAttributes.reference.zoomWindows">
      <el-button
        :key="index"
        type="text"
        @click="redirect({ window: zoomItem })"
      >
        {{ $t('table.ProcessActivity.zoomIn') }}
        {{ zoomItem.name }}
      </el-button>
    </template>
  </el-card>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

// utils and helper methods
import { zoomIn } from '@/utils/ADempiere/coreUtils.js'
import { parseContext } from '@/utils/ADempiere/contextUtils'

export default defineComponent({
  name: 'ContextInfo',

  props: {
    fieldAttributes: {
      type: Object,
      required: true
    }
  },

  setup(props, { root }) {
    const fieldValue = computed(() => {
      const { parentUuid, containerUuid, columnName } = props.fieldAttributes
      return root.$store.getters.getValueOfFieldOnContainer({
        parentUuid,
        containerUuid,
        columnName
      })
    })

    const messageText = computed(() => {
      if (!root.isEmptyValue(props.fieldAttributes.contextInfo.sqlStatement)) {
        const contextInfo = root.$store.getters.getContextInfoField(props.fieldAttributes.contextInfo.uuid, props.fieldAttributes.contextInfo.sqlStatement)
        if (!root.isEmptyValue(contextInfo)) {
          return contextInfo.messageText
        }
      }
      return ''
    })

    function redirect({ window }) {
      const { columnName } = props.fieldAttributes

      zoomIn({
        uuid: window.uuid,
        query: {
          action: 'zoomIn',
          tabParent: 0,
          columnName,
          value: fieldValue.value
        }
      })

      // panel in mobile mode
      root.$store.commit('changeShowRigthPanel', false)
      if (!root.isEmptyValue(root.$route.query.fieldColumnName)) {
        root.$router.push({
          name: root.$route.name,
          query: {
            ...root.$route.query,
            typeAction: '',
            fieldColumnName: ''
          }
        }, () => {})
      }
    }

    if (!root.isEmptyValue(props.fieldAttributes.contextInfo.sqlStatement)) {
      const sqlParse = parseContext({
        parentUuid: props.fieldAttributes.parentUuid,
        containerUuid: props.fieldAttributes.containerUuid,
        value: props.fieldAttributes.contextInfo.sqlStatement,
        isBooleanToString: true
      })

      root.$store.dispatch('getContextInfoValueFromServer', {
        contextInfoId: props.fieldAttributes.contextInfo.id,
        contextInfoUuid: props.fieldAttributes.contextInfo.uuid,
        sqlStatement: sqlParse.value
      })
    }

    return {
      // computeds
      messageText,
      // methods
      redirect
    }
  }
})
</script>

<style lang="scss" src="../common-style.scss">
</style>
<style lang="scss">
.context-info {
  &.el-card {
    max-width: 300px;

    .form-context-info {
      .el-form-item {
        // spacing between form items
        padding-bottom: 10px;

        .el-form-item__content {
          // text content interline
          line-height: 20px;
        }
      }
    }
  }
}
</style>
