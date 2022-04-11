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
  <el-main
    v-shortkey="shorcutKeys"
    class="container-main"
    @shortkey.native="keyAction"
  >
    <el-row>
      <transition name="slide-fade">
        <el-col :span="10" class="container-main" :style="isFullScreen ? {width: 100 + '%'} : ''">
          <el-card class="table">
            <div slot="header">
              {{ label }}

              <el-button
                type="text"
                icon="el-icon-close"
                style="float: right; padding: 3px 0px;font-size: 22px; padding-left: 5px;"
                @click="closeContainer"
              />
              <el-button
                type="text"
                style="float: right; font-size: 18px; padding: 3px 0"
                @click="isFullScreen = !isFullScreen"
              >
                <svg-icon :icon-class="!isFullScreen ? 'fullscreen' : 'exit-fullscreen'" />
              </el-button>
            </div>

            <slot />

          </el-card>
        </el-col>
      </transition>
    </el-row>
  </el-main>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'AuxiliaryPanel',

  props: {
    parentUuid: {
      type: String,
      default: undefined
    },
    containerUuid: {
      type: String,
      required: true
    },
    // Container Title or Description
    label: {
      type: String,
      required: true
    }
  },

  setup(props, { root }) {
    const isFullScreen = ref(false)

    const shorcutKeys = computed(() => {
      return {
        closePanel: ['esc']
      }
    })

    function keyAction(event) {
      switch (event.srcKey) {
        case 'closePanel':
          closeContainer()
          break
      }
    }

    function closeContainer() {
      root.$store.dispatch('changeTabAttribute', {
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid,
        attributeName: 'isShowedTableRecords',
        attributeValue: false
      })
    }

    return {
      isFullScreen,
      // computeds
      shorcutKeys,
      // methods
      closeContainer,
      keyAction
    }
  }

})
</script>

<style>
  .el-card__body {
    height: 100% !important;
    padding: 20px;
  }
  .el-card__header {
    padding: 0px;
    border-bottom: 1px solid #e6ebf5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
</style>
<style scoped>
.container-main{
  padding-left: 0% !important;
  padding-right: 3% !important;
  height: 100% !important;
  position: fixed;
  z-index: 5;
  top: 0px;
}
.table {
  padding: 20px 0px;
  height: 100% !important;
}
/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all .0 ease;
}
.slide-fade-leave-active {
  transition: all .0s ease;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
