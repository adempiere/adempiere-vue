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
        :container-uuid="browserUuid"
        :actions-manager="actionsManager"
        :relations-manager="relationsManager"
      />
    </el-header>

    <el-main>
      <collapse
        :title="$t('views.searchCriteria')"
        :container-uuid="browserUuid"
        :panel-metadata="browserMetadata"
        :container-manager="containerManager"
      >
        <panel-definition
          class="browser-query-criteria"
          :container-uuid="browserUuid"
          :panel-metadata="browserMetadata"
          :container-manager="containerManager"
          :is-show-filter="false"
        />
      </collapse>
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
  </el-container>

  <loading-view
    v-else
    key="browser-loading"
  />
</template>

<script>
import { computed, defineComponent, ref } from '@vue/composition-api'

// componets and mixins
import ActionMenu from '@/components/ADempiere/ActionMenu/index.vue'
import DefaultTable from '@/components/ADempiere/DefaultTable/index.vue'
import Collapse from '@/components/ADempiere/Collapse/index.vue'
import LoadingView from '@/components/ADempiere/LoadingView/index.vue'
import TitleAndHelp from '@/components/ADempiere/TitleAndHelp'
import PanelDefinition from '@/components/ADempiere/PanelDefinition/index.vue'

// utils and helper methods
import {
  isDisplayedField, isDisplayedColumn,
  isMandatoryField, isMandatoryColumn,
  isReadOnlyField, isReadOnlyColumn
} from '@/utils/ADempiere/dictionary/browser.js'

export default defineComponent({
  name: 'BrowserView',

  components: {
    ActionMenu,
    DefaultTable,
    Collapse,
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
    const browserMetadata = ref({})

    let browserUuid = root.$route.meta.uuid
    // set uuid from test
    if (!root.isEmptyValue(props.uuid)) {
      browserUuid = props.uuid
    }

    const storedBrowser = computed(() => {
      return root.$store.getters.getStoredBrowser(browserUuid)
    })

    // TODO: Handle per individual smart browser
    // by default enable context menu and title
    root.$store.dispatch('settings/changeSetting', {
      key: 'showContextMenu',
      value: true
    })

    const isShowContextMenu = computed(() => {
      return root.$store.state.settings.showContextMenu
    })

    const isReadyToSearch = computed(() => {
      if (browserMetadata.value.awaitForValuesToQuery) {
        return false
      }
      return root.isEmptyValue(
        root.$store.getters.getBrowserFieldsEmptyMandatory({
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

        root.$store.commit('changeBrowserAttribute', {
          uuid: browserUuid,
          attributeName: 'isShowedCriteria',
          attributeValue: showCriteria
        })
      }
    })

    const tableHeader = computed(() => {
      return storedBrowser.value.fieldsList
    })

    function getBrowserDefinition() {
      const browser = storedBrowser.value
      if (browser) {
        browserMetadata.value = browser
        isLoadedMetadata.value = true
        return
      }

      root.$store.dispatch('getBrowserDefinitionFromServer', browserUuid)
        .then(browserResponse => {
          browserMetadata.value = browserResponse

          defaultSearch()
        }).finally(() => {
          isLoadedMetadata.value = true
        })
    }

    function defaultSearch() {
      // if (this.isLoadedRecords) {
      //   // not research
      //   return
      // }
      if (isReadyToSearch.value) {
        // first search by default
        root.$store.dispatch('getBrowserSearch', {
          containerUuid: browserUuid
        })

        // hide showed criteria
        root.$store.commit('changeBrowserAttribute', {
          uuid: browserUuid,
          attributeName: 'isShowedCriteria',
          attributeValue: false
        })
        return
      }

      // set empty values into container data
      root.$store.commit('setBrowserData', {
        containerUuid: browserUuid
      })
    }

    const containerManager = {
      actionPerformed({ field, value, valueTo, containerUuid }) {
        return root.$store.dispatch('browserActionPerformed', {
          containerUuid,
          field,
          value,
          valueTo
        })
      },

      setDefaultValues: ({ parentUuid, containerUuid }) => {
        root.$store.dispatch('setBrowserDefaultValues', {
          parentUuid,
          containerUuid
        })
      },

      /**
       * Is displayed field in panel single record
       */
      isDisplayedField,

      isMandatoryField,

      isReadOnlyField({ field }) {
        return isReadOnlyField(field)
      },

      changeFieldShowedFromUser({ containerUuid, fieldsShowed }) {
        root.$store.dispatch('changeBrowserFieldShowedFromUser', {
          containerUuid,
          fieldsShowed
        })
      },

      getFieldsList({ containerUuid }) {
        return root.$store.getters.getStoredFieldsFromBrowser(containerUuid)
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
        return root.$store.commit('setBrowserRow', {
          containerUuid,
          rowIndex,
          row
        })
      },
      getRow: ({ containerUuid, rowIndex }) => {
        return root.$store.getters.getBrowserRowData({
          containerUuid,
          rowIndex
        })
      },

      setCell: ({ containerUuid, rowIndex, columnName, value }) => {
        return root.$store.commit('setBrowserCell', {
          containerUuid,
          rowIndex,
          columnName,
          value
        })
      },
      getCell: ({ containerUuid, rowIndex, columnName }) => {
        return root.$store.getters.getBrowserCellData({
          containerUuid,
          rowIndex,
          columnName
        })
      },

      setPage: ({ containerUuid, pageNumber }) => {
        root.$store.commit('getBrowserSearch', {
          containerUuid,
          pageNumber
        })
      },

      setSelection: ({
        containerUuid,
        recordsSelected
      }) => {
        root.$store.commit('setBrowserSelectionsList', {
          containerUuid,
          selectionsList: recordsSelected
        })
      },
      getSelection: ({
        containerUuid
      }) => {
        return root.$store.getters.getBrowserSelectionsList({
          containerUuid
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

      return root.$t('actionMenu.runProcess')
    })

    const actionsManager = computed(() => {
      return {
        containerUuid: browserUuid,

        defaultActionName: processName.value,

        getActionList: () => root.$store.getters.getStoredActionsMenu({
          containerUuid: browserUuid
        })
      }
    })

    const relationsManager = ref({
      menuParentUuid: root.$route.meta.parentUuid
    })

    // get records list
    const recordsList = computed(() => {
      return root.$store.getters.getBrowserRecordsList({
        containerUuid: browserUuid
      })
    })

    getBrowserDefinition()

    return {
      isLoadedMetadata,
      browserUuid,
      browserMetadata,
      containerManager,
      containerManagerTable,
      actionsManager,
      relationsManager,
      // computed
      openedCriteria,
      isShowContextMenu,
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
