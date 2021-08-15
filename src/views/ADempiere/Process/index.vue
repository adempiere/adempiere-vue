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
    class="view-base"
    style="height: 84vh;"
  >
    <el-header
      v-if="showContextMenu"
      style="height: 30px;"
    >
      <action-menu
        :parent-uuid="processUuid"
        :actions-manager="actionsManager"
        :relations-manager="relationsManager"
      />
    </el-header>

    <el-main>
      <el-card class="content-collapse">
        <title-and-help
          :name="processMetadata.name"
          :help="processMetadata.help"
        />

        <el-scrollbar wrap-class="scroll-child">
          <panel-definition
            :container-uuid="processUuid"
            :panel-metadata="processMetadata"
            :container-manager="containerManager"
          />
        </el-scrollbar>
      </el-card>
    </el-main>
  </el-container>

  <loading-view
    v-else
    key="window-loading"
  />
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

import ActionMenu from '@/components/ADempiere/ActionMenu/index.vue'
import LoadingView from '@/components/ADempiere/LoadingView/index.vue'
import PanelDefinition from '@/components/ADempiere/PanelDefinition/index.vue'
import TitleAndHelp from '@/components/ADempiere/TitleAndHelp/index.vue'
import { sharedLink } from '@/utils/ADempiere/constants/actionsMenuList'

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
    const panelType = 'process'

    let processUuid = root.$route.meta.uuid
    // set uuid from test
    if (!root.isEmptyValue(props.uuid)) {
      processUuid = props.uuid
    }

    const showContextMenu = computed(() => {
      return root.$store.state.settings.showContextMenu
    })

    const storedProcess = computed(() => {
      return root.$store.getters.getStoredProcess(processUuid)
    })

    root.$store.dispatch('settings/changeSetting', {
      key: 'showContextMenu',
      value: true
    })

    const getProcess = async() => {
      const process = storedProcess.value
      if (process) {
        processMetadata.value = process
        isLoadedMetadata.value = true
        return
      }

      root.$store.dispatch('getProcessDefinitionFromServer', processUuid)
        .then(processResponse => {
          processMetadata.value = processResponse
        }).finally(() => {
          isLoadedMetadata.value = true
        })
    }

    const containerManager = {
      actionPerformed: ({ field, value }) => {
        // let action = 'processActionPerformed'
        // if (field.isReport) {
        //   action = 'reportActionPerformed'
        // }
        // root.$store.dispatch(action, {
        //   field,
        //   value
        // })
      }
    }

    getProcess()

    const actionsManager = ref({
      actionsList: [
        sharedLink
      ]
    })

    const relationsManager = ref({
      menuParentUuid: root.$route.meta.parentUuid
    })

    return {
      processUuid,
      panelType,
      isLoadedMetadata,
      processMetadata,
      containerManager,
      actionsManager,
      relationsManager,
      // computeds
      showContextMenu,
      // methods
      getProcess
    }
  }
})
</script>

<style>
  .el-card__body {
    padding-top: 0px !important;
    padding-right: 20px;
    padding-bottom: 20px;
    padding-left: 20px;
    height: 100%;
  }
</style>
<style scoped >
  .el-card {
    width: 100% !important;
    height: 100% !important;
  }
</style>
