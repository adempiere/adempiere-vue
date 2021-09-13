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
    class="view-base"
    style="height: 86vh;"
  >
    <el-header v-if="isShowContextMenu">
      <action-menu
        :parent-uuid="browserUuid"
        :actions-manager="actionsManager"
        :relations-manager="relationsManager"
      />

      <div class="center" style="width: 100%">
        <title-and-help
          :name="browserMetadata.name"
          :help="browserMetadata.help"
        />
      </div>
    </el-header>

    <el-main>
      <el-collapse
        v-model="openedCriteria"
        class="container-collasep-open"
      >
        <el-collapse-item :title="$t('views.searchCriteria')" name="opened-criteria">
          <panel-definition
            :container-uuid="browserUuid"
            :panel-metadata="browserMetadata"
            :container-manager="containerManager"
          />
        </el-collapse-item>
      </el-collapse>

      <!-- result of records in the table -->
      <default-table
        :container-uuid="browserUuid"
        :container-manager="containerManagerTable"
        :panel-metadata="browserMetadata"
        :header="tableHeader"
        :data-table="[]"
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

import ActionMenu from '@/components/ADempiere/ActionMenu/index.vue'
import DefaultTable from '@/components/ADempiere/DefaultTable/index.vue'
import LoadingView from '@/components/ADempiere/LoadingView/index.vue'
import TitleAndHelp from '@/components/ADempiere/TitleAndHelp'
import PanelDefinition from '@/components/ADempiere/PanelDefinition/index.vue'

import { BUTTON } from '@/utils/ADempiere/references'
import { sharedLink } from '@/utils/ADempiere/constants/actionsMenuList'

export default defineComponent({
  name: 'BrowserView',

  components: {
    ActionMenu,
    DefaultTable,
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

    const openedCriteria = computed({
      get() {
        // by default criteria if closed
        const openCriteria = []
        const browser = browserMetadata.value
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
      return browserMetadata.value.fieldsList
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
        }).finally(() => {
          isLoadedMetadata.value = true
        })
    }

    const containerManager = {
      actionPerformed({ field, value }) {
        console.log(value)
      },

      /**
       * Is displayed field in panel single record
       */
      isDisplayedField({ displayType, isActive, isQueryCriteria }) {
        // button field not showed
        if (displayType === BUTTON.id) {
          return false
        }

        return isActive && isQueryCriteria
      },

      isMandatoryField({ isMandatoryFromLogic }) {
        return isMandatoryFromLogic
      },

      validateReadOnly({ field }) {
        return field.isReadOnlyFromLogic
      }
    }

    const containerManagerTable = {
      ...containerManager,

      /**
       * Is displayed column in table multi record
       */
      isDisplayedColumn({ displayType, isActive, isDisplayed, isDisplayedFromLogic, isKey }) {
        // button field not showed
        if (isKey || displayType === BUTTON.id) {
          return false
        }

        return isActive && isDisplayed && isDisplayedFromLogic
      },

      isMandatoryColumn({ isMandatory, isMandatoryFromLogic }) {
        return isMandatory || isMandatoryFromLogic
      },

      validateReadOnly({ field }) {
        return field.isReadOnly
      }
    }

    const actionsManager = ref({
      getActionList: () => [
        sharedLink
      ]
    })

    const relationsManager = ref({
      menuParentUuid: root.$route.meta.parentUuid
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
      tableHeader
    }
  }
})
</script>

<style>
/* removes the title link effect on collapse */
.el-collapse-item__header:hover {
  background-color: #fcfcfc;
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
