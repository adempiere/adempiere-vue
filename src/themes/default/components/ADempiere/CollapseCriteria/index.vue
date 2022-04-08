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
  <el-main class="default-table" style="border-top: 1px solid #dde6fa;padding-bottom: 1%;padding-top: 1%;border-bottom: 1px solid #dde6fa">
    <el-divider class="divider" />

    <el-row style="display: flex;">
      <el-col :span="19" style="display: grid;">
        <div class="title" @click="handlePanel(isCollapse)">
          <b class="label">
            {{ title }}
          </b>
        </div>
      </el-col>
      <el-col :span="4">
        <filter-fields
          :parent-uuid="parentUuid"
          :container-uuid="containerUuid"
          :fields-list="fieldsList"
          :filter-manager="containerManager.changeFieldShowedFromUser"
          :showed-manager="containerManager.isDisplayedField"
        />
      </el-col>
      <el-col :span="1" style="text-align: center;">
        <el-button type="text" :icon="icon" class="change-icon" @click="handlePanel(isCollapse)" />
      </el-col>
    </el-row>

    <transition name="el-zoom-in-top">
      <div v-show="isCollapse" class="transition-box">
        <el-row>
          <el-col :span="24">
            <!-- component -->
            <slot />
          </el-col>
        </el-row>
      </div>
    </transition>
    <el-divider class="divider" />
  </el-main>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

// components and mixins
import FilterFields from '@theme/components/ADempiere/FilterFields/index.vue'

export default defineComponent({
  name: 'CollapseCriteria',

  components: {
    FilterFields
  },

  props: {
    title: {
      type: String,
      default: ''
    },
    parentUuid: {
      type: String,
      default: undefined
    },
    containerUuid: {
      type: String,
      required: true
    },
    showedAttribute: {
      type: String,
      default: 'isShowedCriteria'
    },
    containerManager: {
      type: Object,
      required: true
    }
  },

  setup(props, { root }) {
    const storedPanel = computed(() => {
      return props.containerManager.getPanel({
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid
      })
    })

    const fieldsList = computed(() => {
      return props.containerManager.getFieldsList({
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid
      })
    })

    const isCollapse = computed({
      get() {
        const panel = storedPanel.value
        if (!root.isEmptyValue(panel)) {
          if (panel[props.showedAttribute]) {
            // open criteria
            return true
          }
        }
        // by default criteria if closed
        return false
      },
      set(isShowed) {
        root.$store.commit('changeBrowserAttribute', {
          uuid: props.containerUuid,
          attributeName: props.showedAttribute,
          attributeValue: isShowed
        })
      }
    })

    const icon = computed(() => {
      if (isCollapse.value) {
        return 'el-icon-arrow-down'
      }
      return 'el-icon-arrow-right'
    })

    function handlePanel(show) {
      isCollapse.value = !show
    }

    return {
      // computeds
      fieldsList,
      isCollapse,
      icon,
      // methods
      handlePanel
    }
  }
})
</script>

<style lang="scss">
.title {
  margin-top: 0%;
}
.title:hover, .title:focus {
  cursor: pointer;
}
.change-icon {
  font-size: 20px;
  color: #000000;
  font-weight: 605 !important;
}
.change-icon:hover, .change-icon:focus {
    color: #000000;
    border-color: transparent;
    background-color: transparent;
}
.collapse {
  border-top: 1px solid rgba(255, 255, 255, 0.5);
}
.divider {
  margin-left: 0px;
  margin-right: 0px;
  margin-bottom: 5px;
  margin-top: 5px;
}
.label {
  margin-top: 1%;
  display: block;
}
</style>
