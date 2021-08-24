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
  <div v-if="isLoaded" key="window-loaded" class="view-base">
    <el-container style="min-height: calc(100vh - 84px)">
      <el-aside style="width: 100%; margin-bottom: 0px; padding-right: 10px; padding-left: 10px;">

        <!-- // TODO: Add header window component for auxiliary menu and worflow status -->
        <action-menu
          :parent-uuid="windowUuid"
          :references-manager="referencesManager"
          :actions-manager="actionsManager"
          :relations-manager="relationsManager"
        />

        <component
          :is="renderWindowComponent"
          :container-manager="containerManagerWindow"
          :window-metadata="windowMetadata"
        />
      </el-aside>
    </el-container>
  </div>

  <loading-view
    v-else
    key="window-loading"
  />
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

import ActionMenu from '@/components/ADempiere/ActionMenu'
import LoadingView from '@/components/ADempiere/LoadingView'
import { convertWindow } from '@/utils/ADempiere/apiConverts/dictionary.js'
import { generateWindow as generateWindowDictionary } from './windowUtils'

export default defineComponent({
  name: 'Window',

  components: {
    ActionMenu,
    LoadingView
  },

  props: {
    // implement by test view
    uuid: {
      type: String,
      default: ''
    },
    metadata: {
      type: Object,
      default: () => {}
    },
    containerManager: {
      type: Object,
      default: () => {}
    }
  },

  setup(props, { root }) {
    let containerManagerWindow = {
      actionPerformed: function(eventInfo) {
        console.log('actionPerformed: ', eventInfo)
        return new Promise()
      },

      seekRecord: function(eventInfo) {
        console.log('seekRecord: ', eventInfo)
        // return new Promise()
      },

      seekTab: function(eventInfo) {
        console.log('seekTab: ', eventInfo)
        return new Promise()
      }
    }
    if (!root.isEmptyValue(props.containerManager)) {
      containerManagerWindow = {
        ...containerManagerWindow,
        // overwirte methods
        ...props.containerManager
      }
    }

    const actionsManager = ref({
      // overwrite logic or add actions
      ...props.containerManager.actionsManager
    })
    const referencesManager = ref({
      // overwrite logic
      ...props.containerManager.referencesManager
    })
    const relationsManager = ref({
      // overwrite logic
      ...props.containerManager.relationsManager
    })

    const isLoaded = ref(false)
    const windowMetadata = ref({})

    let windowUuid = root.$route.meta.uuid
    // set uuid from test
    if (!root.isEmptyValue(props.uuid)) {
      windowUuid = props.uuid
    }

    const storedWindow = computed(() => {
      return root.$store.getters.getStoredWindow(windowUuid)
    })

    const generateWindow = (window) => {
      windowMetadata.value = window
      isLoaded.value = true
    }

    // get window from vuex store or request from server
    const getWindow = () => {
      let window = storedWindow.value
      if (!root.isEmptyValue(window)) {
        generateWindow(window)
        return
      }
      // metadata props use for test
      if (!root.isEmptyValue(props.metadata)) {
        // from server response
        window = convertWindow(props.metadata)
        // add apps properties
        window = generateWindowDictionary(window)
        // add into store
        return root.$store.dispatch('addWindow', window)
          .then(windowResponse => {
            // to obtain the load effect
            setTimeout(() => {
              generateWindow(windowResponse)
            }, 1000)
          })
      }
      root.$store.dispatch('getWindowDefinitionFromServer', {
        uuid: windowUuid
      })
        .then(windowResponse => {
          // add apps properties
          window = generateWindowDictionary(windowResponse)
          generateWindow(window)
        })
    }

    const renderWindowComponent = computed(() => {
      const windowComponent = () => import('@/views/ADempiere/Window/StandardWindow')

      return windowComponent
    })

    // load metadata and generate window
    getWindow()

    return {
      windowUuid,
      containerManagerWindow,
      windowMetadata,
      actionsManager,
      referencesManager,
      relationsManager,
      // computed
      renderWindowComponent,
      isLoaded
    }
  }
})
</script>
