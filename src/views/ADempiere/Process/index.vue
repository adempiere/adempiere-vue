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
  <el-container
    v-if="isLoadedMetadata"
    key="process-loaded"
    class="view-base process-view"
    style="height: 84vh;"
  >
    <el-header
      v-if="showContextMenu"
      style="height: 30px;"
    >
      <action-menu
        :parent-uuid="processUuid"
        :container-uuid="processUuid"
        :container-manager="containerManager"
        :actions-manager="actionsManager"
        :relations-manager="relationsManager"
      />
    </el-header>

    <el-main>
      <el-card class="content-collapse card-process">
        <title-and-help
          :name="processMetadata.name"
          :help="processMetadata.help"
        />

        <panel-definition
          :container-uuid="processUuid"
          :container-manager="containerManager"
        />
      </el-card>
    </el-main>
  </el-container>

  <loading-view
    v-else
    key="process-loading"
  />
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

import store from '@/store'

// components and mixins
import ActionMenu from '@theme/components/ADempiere/ActionMenu/index.vue'
import LoadingView from '@theme/components/ADempiere/LoadingView/index.vue'
import mixinProcess from '@/views/ADempiere/Process/mixinProcess.js'
import PanelDefinition from '@theme/components/ADempiere/PanelDefinition/index.vue'
import TitleAndHelp from '@theme/components/ADempiere/TitleAndHelp/index.vue'

import { convertProcess } from '@/utils/ADempiere/apiConverts/dictionary.js'
import { generateProcess } from '@/utils/ADempiere/dictionary/process.js'

// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

export default defineComponent({
  name: 'ProcessView',

  components: {
    ActionMenu,
    LoadingView,
    PanelDefinition,
    TitleAndHelp
  },

  props: {
    // implement by test view
    uuid: {
      type: String,
      default: ''
    }
  },

  setup(props, { root }) {
    const isLoadedMetadata = ref(false)
    const processMetadata = ref({})

    let processUuid = root.$route.meta.uuid
    // set uuid from test
    if (!isEmptyValue(props.uuid)) {
      processUuid = props.uuid
    }

    const { actionsManager, containerManager, relationsManager, storedProcessDefinition } = mixinProcess(processUuid)

    const showContextMenu = computed(() => {
      return store.state.settings.showContextMenu
    })

    store.dispatch('settings/changeSetting', {
      key: 'showContextMenu',
      value: true
    })

    // get process/report from vuex store or request from server
    const getProcess = async() => {
      let process = storedProcessDefinition.value
      if (process) {
        processMetadata.value = process
        isLoadedMetadata.value = true
        return
      }

      // metadata props use for test
      if (!isEmptyValue(props.metadata)) {
        // from server response
        process = convertProcess(props.metadata)
        // add apps properties
        process = generateProcess(process)
        // add into store
        return store.dispatch('addProcess', process)
          .then(processResponse => {
            // to obtain the load effect
            setTimeout(() => {
              processMetadata.value = processResponse
              isLoadedMetadata.value = true
            }, 1000)
          })
      }

      store.dispatch('getProcessDefinitionFromServer', {
        uuid: processUuid
      })
        .then(processResponse => {
          processMetadata.value = processResponse
        }).catch(error => {
          console.warn(error)
        }).finally(() => {
          isLoadedMetadata.value = true
        })
    }

    getProcess()

    return {
      processUuid,
      isLoadedMetadata,
      processMetadata,
      // computeds
      showContextMenu,
      // methods
      getProcess,
      // common mixin
      actionsManager,
      containerManager,
      relationsManager
    }
  }
})
</script>

<style lang="scss">
.process-view {
  .card-process {
    >.el-card__body {
      padding-top: 0px;
      padding-right: 20px;
      padding-bottom: 20px;
      padding-left: 20px;
      height: 100%;
    }
  }
}
</style>
<style scoped >
  .el-card {
    width: 100% !important;
    height: 100% !important;
  }
</style>
