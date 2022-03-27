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
        <component
          :is="renderWindowComponent"
          :window-manager="containerManagerWindow"
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
import store from '@/store'

// components and mixins
import LoadingView from '@/components/ADempiere/LoadingView/index.vue'

// constants
import { READ_ONLY_FORM_COLUMNS } from '@/utils/ADempiere/constants/systemColumns.js'
import {
  ACTIVE, CLIENT, PROCESSING, PROCESSED, UUID
} from '@/utils/ADempiere/constants/systemColumns'

// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { convertWindow } from '@/utils/ADempiere/apiConverts/dictionary.js'
import {
  generateWindow,
  // panel
  isDisplayedField,
  isMandatoryField,
  isReadOnlyField,
  // table
  isDisplayedColumn,
  isMandatoryColumn,
  isReadOnlyColumn
} from '@/utils/ADempiere/dictionary/window.js'

export default defineComponent({
  name: 'Window',

  components: {
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
      getPanel({ parentUuid, containerUuid }) {
        return store.getters.getStoredTab(parentUuid, containerUuid)
      },
      getFieldsList: ({ parentUuid, containerUuid }) => {
        return store.getters.getStoredFieldsFromTab(parentUuid, containerUuid)
      },

      actionPerformed: function(eventInfo) {
        console.log('actionPerformed: ', eventInfo)
        return new Promise()
      },

      setDefaultValues: ({ parentUuid, containerUuid }) => {
        store.dispatch('setTabDefaultValues', {
          parentUuid,
          containerUuid
        })
      },

      seekRecord: function(eventInfo) {
        console.log('seekRecord: ', eventInfo)
        // return new Promise()
      },

      seekTab: function(eventInfo) {
        console.log('seekTab: ', eventInfo)
        return new Promise()
      },

      isDisplayedField,
      isDisplayedColumn,

      isReadOnlyField(field) {
        const { parentUuid, containerUuid } = field

        const { isParentTab, isReadOnly } = store.getters.getStoredTab(parentUuid, containerUuid)
        // if tab is read only, all fields are read only
        if (isReadOnly) {
          return true
        }
        if (!isParentTab) {
          // if parent record is new lock childs field to read only
          const recordParentTab = store.getters.getUuidOfContainer(field.firstTabUuid)
          if (isEmptyValue(recordParentTab) || recordParentTab === 'create-new') {
            return true
          }
        }

        // record uuid
        const recordUuid = store.getters.getValueOfField({
          parentUuid,
          containerUuid,
          columnName: UUID
        })
        // edit mode is diferent to create new
        const isWithRecord = recordUuid !== 'create-new' &&
          !isEmptyValue(recordUuid)

        if (isWithRecord) {
          // client id value of record
          const clientIdRecord = store.getters.getValueOfField({
            parentUuid,
            containerUuid,
            columnName: CLIENT
          })
          // evaluate client id context with record
          const preferenceClientId = store.getters.getPreferenceClientId
          if (clientIdRecord !== preferenceClientId) {
            return true
          }

          // not updateable and record saved
          if (!field.isUpdateable) {
            return true
          }

          // is active value of record
          const isActiveRecord = store.getters.getValueOfField({
            parentUuid,
            containerUuid,
            columnName: ACTIVE
          })
          // record is inactive isReadOnlyFromForm
          if (!isActiveRecord && field.columnName !== 'IsActive') {
            return true
          }

          // is processed value of record
          const isProcessed = store.getters.getValueOfField({
            parentUuid,
            containerUuid,
            columnName: PROCESSED
          })
          if (isProcessed) {
            return true
          }

          // is processing value of record
          const isProcessing = store.getters.getValueOfField({
            parentUuid,
            containerUuid,
            columnName: PROCESSING
          })
          if (isProcessing) {
            return true
          }
        }

        if (field.isAlwaysUpdateable) {
          return false
        }

        return isReadOnlyField(field) || field.isReadOnlyFromForm
      },

      isReadOnlyColumn({
        field,
        // records values
        row
      }) {
        // if tab is read only, all columns are read only
        const { isReadOnly } = store.getters.getStoredTab(field.parentUuid, field.containerUuid)
        if (isReadOnly) {
          return true
        }

        // read only with metadata
        if (isReadOnlyColumn(field)) {
          true
        }

        // not updateable and record saved
        const isWithRecord = !isEmptyValue(row.UUID)
        if (!field.isUpdateable && isWithRecord) {
          return true
        }

        // evaluate client id context with record
        const preferenceClientId = store.getters.getPreferenceClientId
        if (preferenceClientId !== parseInt(row.AD_Client_ID, 10) && isWithRecord) {
          return true
        }

        // columnName: IsActive
        const fieldReadOnlyForm = READ_ONLY_FORM_COLUMNS.find(item => {
          return !item.isChangedAllForm &&
            // columnName: IsActive, Processed, Processing
            Object.prototype.hasOwnProperty.call(row, item.columnName)
        })

        if (fieldReadOnlyForm) {
          const { columnName, valueIsReadOnlyForm } = fieldReadOnlyForm
          // compare if is same key
          return field.columnName !== columnName &&
            // compare if is same value
            row[columnName] === valueIsReadOnlyForm
        }

        return false
      },

      isMandatoryField,
      isMandatoryColumn,

      getRow: ({ containerUuid, rowIndex, rowUuid }) => {
        return store.getters.getTabRowData({
          containerUuid,
          rowIndex,
          rowUuid
        })
      },

      getCell: ({ containerUuid, rowIndex, rowUuid, columnName }) => {
        return store.getters.getTabCellData({
          containerUuid,
          rowIndex,
          rowUuid,
          columnName
        })
      },

      setSelection: ({
        containerUuid,
        recordsSelected
      }) => {
        store.commit('setTabSelectionsList', {
          containerUuid,
          selectionsList: recordsSelected
        })
      },
      getSelection: ({
        containerUuid
      }) => {
        return store.getters.getTabSelectionsList({
          containerUuid
        })
      },

      changeFieldShowedFromUser({ parentUuid, containerUuid, fieldsShowed }) {
        store.dispatch('changeTabFieldShowedFromUser', {
          parentUuid,
          containerUuid,
          fieldsShowed
        })
      },

      getLookupItem({ parentUuid, containerUuid, uuid, id, contextColumnNames, columnName }) {
        return store.dispatch('getLookupItemFromServer', {
          parentUuid,
          containerUuid,
          contextColumnNames,
          fieldUuid: uuid,
          id,
          //
          columnName
        })
      },
      getLookupList({ parentUuid, containerUuid, uuid, id, contextColumnNames }) {
        return store.dispatch('getLookupListFromServer', {
          parentUuid,
          containerUuid,
          contextColumnNames,
          fieldUuid: uuid,
          id
        })
      }

    }

    if (!isEmptyValue(props.containerManager)) {
      containerManagerWindow = {
        ...containerManagerWindow,
        // overwirte methods
        ...props.containerManager
      }
    }

    const isLoaded = ref(false)
    const windowMetadata = ref({})

    let windowUuid = root.$route.meta.uuid
    // set uuid from test
    if (!isEmptyValue(props.uuid)) {
      windowUuid = props.uuid
    }

    const storedWindow = computed(() => {
      return store.getters.getStoredWindow(windowUuid)
    })

    function setLoadWindow(window) {
      windowMetadata.value = window
      isLoaded.value = true
    }

    // get window from vuex store or request from server
    function getWindow() {
      let window = storedWindow.value
      if (!isEmptyValue(window)) {
        setLoadWindow(window)
        return
      }
      // metadata props use for test
      if (!isEmptyValue(props.metadata)) {
        // from server response
        window = convertWindow(props.metadata)
        // add apps properties
        window = generateWindow(window)
        // add into store
        return store.dispatch('addWindow', window)
          .then(windowResponse => {
            // to obtain the load effect
            setTimeout(() => {
              setLoadWindow(windowResponse)
            }, 1000)
          })
      }
      store.dispatch('getWindowDefinitionFromServer', {
        uuid: windowUuid
      })
        .then(windowResponse => {
          // add apps properties
          setLoadWindow(windowResponse)
        })
    }

    const renderWindowComponent = computed(() => {
      const windowComponent = () => import('@/views/ADempiere/Window/MultiTabWindow.vue')

      return windowComponent
    })

    // load metadata and generate window
    getWindow()

    return {
      windowUuid,
      containerManagerWindow,
      windowMetadata,
      // computed
      renderWindowComponent,
      isLoaded
    }
  }
})
</script>
