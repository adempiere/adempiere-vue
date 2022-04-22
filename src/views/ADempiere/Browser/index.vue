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
    key="browser-loaded"
    class="view-base browser-view"
    style="height: 86vh;"
  >
    <el-header v-if="isShowContextMenu">
      <div class="center" style="width: 100%">
        <!-- TODO: Correct when the title is large -->
        <title-and-help
          :name="browserMetadata.name"
          :help="browserMetadata.help"
        />
      </div>

      <action-menu
        :container-manager="containerManager"
        :container-uuid="browserUuid"
        :actions-manager="actionsManager"
        :relations-manager="relationsManager"
      />
    </el-header>

    <el-main>
      <!-- query criteria -->
      <collapse-criteria
        :title="$t('views.searchCriteria')"
        :container-uuid="browserUuid"
        :container-manager="containerManager"
      >
        <panel-definition
          class="browser-query-criteria"
          :container-uuid="browserUuid"
          :panel-metadata="browserMetadata"
          :container-manager="containerManager"
          :is-show-filter="false"
        />
      </collapse-criteria>

      <!-- result of records in the table -->
      <default-table
        class="browser-table-result"
        :container-uuid="browserUuid"
        :container-manager="containerManagerTable"
        :panel-metadata="browserMetadata"
        :header="tableHeader"
        :data-table="recordsList"
        :is-show-search="false"
      />
    </el-main>

    <modal-dialog
      v-if="!isEmptyValue(processUuid)"
      :container-manager="containerManagerProcess"
      :parent-uuid="browserUuid"
      :container-uuid="processUuid"
    />
  </el-container>

  <loading-view
    v-else
    key="browser-loading"
  />
</template>

<script>
import { computed, defineComponent, ref } from '@vue/composition-api'

import lang from '@/lang'
import store from '@/store'

// componets and mixins
// import ActionMenu from '@theme/components/ADempiere/ActionMenu/index.vue'
import ActionMenu from '@theme/components/ADempiere/ActionMenu/index.vue'
import DefaultTable from '@theme/components/ADempiere/DefaultTable/index.vue'
import CollapseCriteria from '@theme/components/ADempiere/CollapseCriteria/index.vue'
import LoadingView from '@theme/components/ADempiere/LoadingView/index.vue'
import mixinProcess from '@/views/ADempiere/Process/mixinProcess.js'
import ModalDialog from '@theme/components/ADempiere/ModalDialog/index.vue'
import PanelDefinition from '@theme/components/ADempiere/PanelDefinition/index.vue'
import TitleAndHelp from '@theme/components/ADempiere/TitleAndHelp'

// utils and helper methods
import {
  isDisplayedField, isDisplayedColumn,
  isMandatoryField, isMandatoryColumn,
  isReadOnlyField, isReadOnlyColumn
} from '@/utils/ADempiere/dictionary/browser.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

export default defineComponent({
  name: 'BrowserView',

  components: {
    ActionMenu,
    CollapseCriteria,
    DefaultTable,
    LoadingView,
    ModalDialog,
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
    const browserMetadata = ref({})
    const containerManagerProcess = ref({})

    let browserUuid = root.$route.meta.uuid
    // set uuid from test
    if (!root.isEmptyValue(props.uuid)) {
      browserUuid = props.uuid
    }

    const storedBrowser = computed(() => {
      return store.getters.getStoredBrowser(browserUuid)
    })

    /**
     * Process associated
     */
    const processUuid = computed(() => {
      const browser = storedBrowser.value
      if (isEmptyValue(browser) || isEmptyValue(browser.process)) {
        return undefined
      }
      return browser.process.uuid
    })

    // TODO: Handle per individual smart browser
    // by default enable context menu and title
    store.dispatch('settings/changeSetting', {
      key: 'showContextMenu',
      value: true
    })

    const isShowContextMenu = computed(() => {
      return store.state.settings.showContextMenu
    })

    const isReadyToSearch = computed(() => {
      if (browserMetadata.value.awaitForValuesToQuery) {
        return false
      }
      return root.isEmptyValue(
        store.getters.getBrowserFieldsEmptyMandatory({
          containerUuid: browserUuid
        })
      )
    })

    const openedCriteria = computed({
      get() {
        // by default criteria if closed
        const openCriteria = []
        const browser = storedBrowser.value
        if (!root.isEmptyValue(browser)) {
          if (browser.isShowedCriteria) {
            // open criteria
            openCriteria.push('opened-criteria')
          }
        }
        return openCriteria
      },
      set(value) {
        let showCriteria = false
        if (value.length) {
          showCriteria = true
        }

        store.commit('changeBrowserAttribute', {
          uuid: browserUuid,
          attributeName: 'isShowedCriteria',
          attributeValue: showCriteria
        })
      }
    })

    const tableHeader = computed(() => {
      return storedBrowser.value.fieldsList
    })

    function generateBrowser(browser) {
      browserMetadata.value = browser
      isLoadedMetadata.value = true

      const { containerManager: containerManagerByProcess } = mixinProcess(processUuid)
      containerManagerProcess.value = containerManagerByProcess
    }

    function getBrowserDefinition() {
      const browser = storedBrowser.value
      if (browser) {
        generateBrowser(browser)
        return
      }

      store.dispatch('getBrowserDefinitionFromServer', browserUuid)
        .then(browserResponse => {
          generateBrowser(browserResponse)

          defaultSearch()
        })
    }

    function defaultSearch() {
      // if (this.isLoadedRecords) {
      //   // not research
      //   return
      // }
      if (isReadyToSearch.value) {
        // first search by default
        store.dispatch('getBrowserSearch', {
          containerUuid: browserUuid
        })

        // hide showed criteria
        store.commit('changeBrowserAttribute', {
          uuid: browserUuid,
          attributeName: 'isShowedCriteria',
          attributeValue: false
        })
        return
      }

      // set empty values into container data
      store.commit('setBrowserData', {
        containerUuid: browserUuid
      })
    }

    const containerManager = {
      getPanel({ containerUuid }) {
        return store.getters.getStoredBrowser(containerUuid)
      },
      getFieldsList({ containerUuid }) {
        return store.getters.getStoredFieldsFromBrowser(containerUuid)
      },

      actionPerformed({ field, value, valueTo, containerUuid }) {
        return store.dispatch('browserActionPerformed', {
          containerUuid,
          field,
          value,
          valueTo
        })
      },

      setDefaultValues: ({ parentUuid, containerUuid }) => {
        store.dispatch('setBrowserDefaultValues', {
          parentUuid,
          containerUuid
        })
      },

      /**
       * Is displayed field in panel single record
       */
      isDisplayedField,

      isMandatoryField,

      isReadOnlyField,

      changeFieldShowedFromUser({ containerUuid, fieldsShowed }) {
        store.dispatch('changeBrowserFieldShowedFromUser', {
          containerUuid,
          fieldsShowed
        })
      },

      setSelection: ({
        containerUuid,
        recordsSelected
      }) => {
        store.commit('setBrowserSelectionsList', {
          containerUuid,
          selectionsList: recordsSelected
        })
      },
      getSelection: ({
        containerUuid
      }) => {
        return store.getters.getBrowserSelectionsList({
          containerUuid
        })
      },

      /**
       * @returns Promisse with value and displayedValue
       */
      getDefaultValue({ parentUuid, containerUuid, uuid, id, contextColumnNames, columnName }) {
        return store.dispatch('getDefaultValueFromServer', {
          parentUuid,
          containerUuid,
          contextColumnNames,
          browseFieldUuid: uuid,
          id,
          //
          columnName
        })
      },
      getLookupList({ parentUuid, containerUuid, contextColumnNames, uuid, searchValue }) {
        return store.dispatch('getLookupListFromServer', {
          parentUuid,
          containerUuid,
          contextColumnNames,
          browseFieldUuid: uuid,
          searchValue
        })
      }
    }

    const containerManagerTable = {
      ...containerManager,

      actionPerformed({ field, value, valueTo, containerUuid }) {
        // TODO: Logic to implement in table
      },

      /**
       * Is displayed column in table multi record
       */
      isDisplayedColumn,

      isMandatoryColumn,

      isReadOnlyColumn({
        field,
        row
      }) {
        // read only with metadata
        return isReadOnlyColumn(field)
      },

      seekRecord: ({
        containerUuid,
        row
      }) => {
        // TODO: Logic to implement in table
      },

      setRow: ({ containerUuid, rowIndex, row }) => {
        return store.commit('setBrowserRow', {
          containerUuid,
          rowIndex,
          row
        })
      },
      getRow: ({ containerUuid, rowIndex }) => {
        return store.getters.getBrowserRowData({
          containerUuid,
          rowIndex
        })
      },

      setCell: ({ containerUuid, rowIndex, columnName, value }) => {
        return store.commit('setBrowserCell', {
          containerUuid,
          rowIndex,
          columnName,
          value
        })
      },
      getCell: ({ containerUuid, rowIndex, columnName }) => {
        return store.getters.getBrowserCellData({
          containerUuid,
          rowIndex,
          columnName
        })
      },

      setPage: ({ containerUuid, pageNumber }) => {
        store.commit('getBrowserSearch', {
          containerUuid,
          pageNumber
        })
      }
    }

    const processName = computed(() => {
      const browser = storedBrowser.value
      if (!root.isEmptyValue(browser)) {
        const process = storedBrowser.value.process
        if (!root.isEmptyValue(process)) {
          return process.name
        }
      }

      return lang.t('actionMenu.runProcess')
    })

    const actionsManager = computed(() => {
      return {
        containerUuid: browserUuid,

        defaultActionName: processName.value,

        getActionList: () => store.getters.getStoredActionsMenu({
          containerUuid: browserUuid
        })
      }
    })

    const relationsManager = ref({
      menuParentUuid: root.$route.meta.parentUuid
    })

    // get records list
    const recordsList = computed(() => {
      return store.getters.getBrowserRecordsList({
        containerUuid: browserUuid
      })
    })

    getBrowserDefinition()

    return {
      isLoadedMetadata,
      browserUuid,
      browserMetadata,
      containerManager,
      containerManagerProcess,
      containerManagerTable,
      actionsManager,
      relationsManager,
      // computed
      isShowContextMenu,
      openedCriteria,
      processUuid,
      tableHeader,
      recordsList
    }
  }
})
</script>

<style lang="scss">
.browser-view {
  .browser-collapse {
    margin-bottom: 10px;
  }

  /* removes the title link effect on collapse */
  .el-collapse-item__header {
    &:hover {
      background-color: #fcfcfc;
      color: #000;
    }
    &.focusing:focus:not(:hover) {
      color: #000;
    }

    /* browser criteria title */
    font-weight: bold;
    font-size: 16px;
  }
}
</style>
<style scoped>
.el-main {
  padding-bottom: 0px;
  padding-top: 0px;
}

.el-header {
  height: 50px !important;
}

.center {
  text-align: center;
}
</style>
