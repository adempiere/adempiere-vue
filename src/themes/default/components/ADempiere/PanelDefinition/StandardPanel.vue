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
  <div class="wrapper" style="margin-right: 10px">
    <el-form
      label-position="top"
      label-width="200px"
    >
      <div class="cards-not-group">
        <div class="card">
          <filter-fields
            v-if="isShowFilter"
            :parent-uuid="parentUuid"
            :container-uuid="containerUuid"
            :fields-list="fieldsList"
            :filter-manager="containerManager.changeFieldShowedFromUser"
            :showed-manager="containerManager.isDisplayedField"
          />

          <el-card
            :shadow="shadowGroup"
            :body-style="{ padding: '10px' }"
          >
            <el-row>
              <template v-for="(fieldAttributes, subKey) in fieldsList">
                <field-definition
                  :key="subKey"
                  :parent-uuid="parentUuid"
                  :container-uuid="containerUuid"
                  :container-manager="containerManager"
                  :field-metadata="fieldAttributes"
                  :metadata-field="fieldAttributes"
                />
              </template>
            </el-row>
          </el-card>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'
import store from '@/store'

// components and mixins
import FieldDefinition from '@theme/components/ADempiere/Field/index.vue'
import FilterFields from '@theme/components/ADempiere/FilterFields/index.vue'

export default defineComponent({
  name: 'StandardPanel',

  components: {
    FieldDefinition,
    FilterFields
  },

  props: {
    parentUuid: {
      type: String,
      default: undefined
    },
    containerUuid: {
      type: String,
      required: true
    },
    containerManager: {
      type: Object,
      required: true
    },
    panelMetadata: {
      type: Object,
      default: () => {}
    },
    // TODO: Manage with store and container manager
    isShowFilter: {
      type: Boolean,
      default: true
    }
  },

  setup(props) {
    let fieldsList = []

    const generatePanel = () => {
      // order and assign groups
      if (props.panelMetadata) {
        fieldsList = props.panelMetadata.fieldsList
      }
    }

    const shadowGroup = computed(() => {
      if (store.state.app.device === 'mobile') {
        return 'never'
      }
      return 'hover'
    })

    generatePanel()

    return {
      fieldsList,
      shadowGroup
    }
  }
})
</script>

<style scoped>
.el-card {
  width: 100% !important;
}
</style>
