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
          :panel-metadata="processMetadata"
          :container-manager="containerManager"
        />
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

// components and mixins
import ActionMenu from '@/components/ADempiere/ActionMenu/index.vue'
import LoadingView from '@/components/ADempiere/LoadingView/index.vue'
import PanelDefinition from '@/components/ADempiere/PanelDefinition/index.vue'
import TitleAndHelp from '@/components/ADempiere/TitleAndHelp/index.vue'

import { convertProcess } from '@/utils/ADempiere/apiConverts/dictionary.js'
import { generateProcess } from '@/utils/ADempiere/dictionary/process.js'

// utils and helper methods
import {
  isDisplayedField,
  isMandatoryField,
  isReadOnlyField
} from '@/utils/ADempiere/dictionary/process.js'

// constants
import {
  runProcess,
  sharedLink
} from '@/utils/ADempiere/constants/actionsMenuList'

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
    if (!root.isEmptyValue(props.uuid)) {
      processUuid = props.uuid
    }

    const showContextMenu = computed(() => {
      return root.$store.state.settings.showContextMenu
    })

    const storedProcess = computed(() => {
      return root.$store.getters.getStoredProcess(processUuid)
    })

    const storedPrintFormatList = computed(() => {
      if (root.$route.meta.type === 'report') {
        return root.$store.getters.getPrintFormatList(processUuid)
      }
      return []
    })

    root.$store.dispatch('settings/changeSetting', {
      key: 'showContextMenu',
      value: true
    })

    // get process/report from vuex store or request from server
    const getProcess = async() => {
      let process = storedProcess.value
      if (process) {
        processMetadata.value = process
        isLoadedMetadata.value = true
        return
      }

      // metadata props use for test
      if (!root.isEmptyValue(props.metadata)) {
        // from server response
        process = convertProcess(props.metadata)
        // add apps properties
        process = generateProcess(process)
        // add into store
        return root.$store.dispatch('addProcess', process)
          .then(processResponse => {
            // to obtain the load effect
            setTimeout(() => {
              processMetadata.value = processResponse
              isLoadedMetadata.value = true
            }, 1000)
          })
      }

      root.$store.dispatch('getProcessDefinitionFromServer', {
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

    const containerManager = {
      getPanel({ containerUuid }) {
        return root.$store.getters.getStoredProcess(containerUuid)
      },
      getFieldsList({ containerUuid }) {
        return root.$store.getters.getStoredFieldsFromProcess(containerUuid)
      },

      actionPerformed: ({ field, value }) => {
        // let action = 'processActionPerformed'
        // if (field.isReport) {
        //   action = 'reportActionPerformed'
        // }
        // root.$store.dispatch(action, {
        //   field,
        //   value
        // })
      },

      setDefaultValues: ({ containerUuid }) => {
        root.$store.dispatch('setProcessDefaultValues', {
          containerUuid
        })
      },

      isDisplayedField,

      isReadOnlyField({
        field
      }) {
        return isReadOnlyField(field)
      },

      isMandatoryField,

      changeFieldShowedFromUser({ containerUuid, fieldsShowed }) {
        root.$store.dispatch('changeProcessFieldShowedFromUser', {
          containerUuid,
          fieldsShowed
        })
      }
    }

    getProcess()

    const actionsManager = ref({
      containerUuid: processUuid,

      defaultActionName: root.$t('actionMenu.runProcess'),

      getActionList: () => [
        runProcess,
        sharedLink
      ]
    })

    const relationsManager = ref({
      menuParentUuid: root.$route.meta.parentUuid
    })

    return {
      processUuid,
      isLoadedMetadata,
      processMetadata,
      containerManager,
      actionsManager,
      relationsManager,
      // computeds
      showContextMenu,
      storedPrintFormatList,
      // methods
      getProcess
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
