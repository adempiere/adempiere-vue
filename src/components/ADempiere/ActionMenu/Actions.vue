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
  <!-- actions or process on container -->
  <el-dropdown
    :hide-on-click="true"
    :size="size"
    split-button
    type="primary"
    trigger="click"
    class="menu-actions"
    @command="clickRunAction"
    @click="runAction(defaultActionToRun)"
  >
    {{ defaultActionName }}

    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-if="isEmptyValue(actionsList)"
        key="withoutActions"
        style="min-height: 26px"
      >
        <span class="contents">
          <b class="label">
            {{ $t('actionMenu.withoutActions') }}
          </b>
        </span>
      </el-dropdown-item>

      <el-scrollbar v-else key="withActions" wrap-class="scroll-child">
        <!-- <el-dropdown-item
          command="refreshData"
        >
          <div class="contents">
            <div class="auxiliary-menu-icon">
              <i class="el-icon-refresh" />
            </div>
            <div>
              <span class="contents">
                <b class="label">
                  {{ $t('components.contextMenuRefresh') }}
                </b>
              </span>
              <p class="description">
                {{ $t('data.noDescription') }}
              </p>
            </div>
          </div>
        </el-dropdown-item> -->

        <el-dropdown-item
          v-for="(action, index) in actionsManager.actionsList"
          :key="index"
          :command="action"
          :divided="true"
        >
          <div class="contents">
            <div class="auxiliary-menu-icon">
              <i :class="action.icon" />
            </div>

            <!-- for print format -->
            <el-dropdown v-if="!isEmptyValue(action.childs)">
              <span class="contents">
                <b class="label">
                  {{ action.name }}
                </b>
              </span>
              <p class="description">
                {{ $t('data.noDescription') }}
              </p>

              <el-dropdown-menu
                slot="dropdown"
                @command="runAction"
              >
                <el-scrollbar wrap-class="scroll-child">
                  <el-dropdown-item
                    v-for="(childs, key) in action.childs"
                    :key="key"
                    :command="childs"
                    :divided="true"
                  >
                    <span class="contents">
                      <b class="label" @click="runAction(childs)">
                        {{ childs.name }}
                      </b>
                    </span>

                    <p
                      v-if="!isEmptyValue(childs.description)"
                      class="description"
                    >
                      {{ childs.description }}
                    </p>
                    <p v-else class="description">
                      {{ $t('data.noDescription') }}
                    </p>
                  </el-dropdown-item>
                </el-scrollbar>
              </el-dropdown-menu>
            </el-dropdown>

            <div v-else>
              <span class="contents">
                <b class="label">
                  {{ action.name }}
                </b>
              </span>
              <p class="description">
                {{ $t('data.noDescription') }}
              </p>
            </div>
          </div>
        </el-dropdown-item>

        <!-- <el-dropdown-item
          command="shareLink"
          :divided="true"
        >
          <div class="contents">
            <div class="auxiliary-menu-icon">
              <i class="el-icon-share" />
            </div>
            <div>
              <span class="contents">
                <b class="label">
                  {{ $t('components.contextMenuShareLink') }}
                </b>
              </span>
              <p class="description">
                {{ $t('data.noDescription') }}
              </p>
            </div>
          </div>
        </el-dropdown-item> -->
      </el-scrollbar>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { computed, defineComponent, ref } from '@vue/composition-api'

import { showNotification } from '@/utils/ADempiere/notification'
import { buildLinkHref } from '@/utils/ADempiere/resource'

export default defineComponent({
  name: 'MenuActions',

  props: {
    actionsManager: {
      type: Object,
      required: true
    },
    size: {
      type: String,
      default: ''
    }
  },

  setup(props, { root, parent }) {
    const {
      parentUuid
    } = parent._props
    const {
      containerUuid, panelType,
      tableName, isInsertRecord, isReport,
      menuParentUuid, lastParameter
    } = props.actionsManager

    const actionsList = ref(
      props.actionsManager.actionsList
    )

    const setShareLink = () => {

    }

    // const getterFieldsList = computed(() => {
    //   return root.$store.getters.getFieldsListFromPanel(containerUuid)
    // })

    const recordUuid = computed(() => {
      const { action } = root.$route.query
      return action
    })

    const isWindow = computed(() => {
      return panelType === 'window'
    })

    const isWithRecord = computed(() => {
      return !root.isEmptyValue(recordUuid.value) && recordUuid.value !== 'create-new'
    })

    const isReferecesContent = computed(() => {
      if (isWindow.value && isWithRecord.value) {
        return true
      }
      return false
    })

    const getterContextMenu = computed(() => {
      return root.$store.getters.getContextMenu(containerUuid)
    })

    const isUndoAction = computed(() => {
      if (isWindow.value) {
        if (!isWithRecord.value) {
          return true
        }
      }
      return false
    })

    const defaultActionName = computed(() => {
      if (isWindow.value) {
        if (isWithRecord.value) {
          return root.$t('window.newRecord')
        }
        return root.$t('data.undo')
      }
      return root.$t('components.RunProcess')
    })

    const defaultActionToRun = computed(() => {
      if (isUndoAction.value) {
        return actionsList.value[2]
      }
      return actionsList.value[0]
    })

    const clickRunAction = (action) => {
      if (action === 'refreshData') {
        refreshData()
      } else if (action === 'shareLink') {
        setShareLink()
      } else {
        runAction(action)
      }
    }

    const refreshData = ({
      parentUuid,
      containerUuid,
      isRefreshPanel = false,
      isClearSelection = true,
      recordUuid
    }) => {
      props.actionsManager({
        parentUuid,
        containerUuid,
        isRefreshPanel,
        isClearSelection,
        recordUuid
      })
    } // end refreshData

    const showModal = (action) => {
      // TODO: Refactor and remove redundant dispatchs
      if (['process'].includes(action.type)) {
        // Add context from view open in process to opening
        if (action.parentUuidAssociated || action.containerUuidAssociated) {
          const attributes = root.$store.getters.getValuesView({
            parentUuid: action.parentUuidAssociated,
            containerUuid: action.containerUuidAssociated
          })

          if (!root.isEmptyValue(attributes)) {
            root.$store.dispatch('updateValuesOfContainer', {
              containerUuid: action.uuid,
              attributes
            })
          }
        }

        // open modal dialog with metadata
        root.$store.dispatch('setShowDialog', {
          type: action.type,
          action: {
            ...action,
            containerUuid: action.uuid
          }
        })
      }
    }

    const manageRecordAccess = (action) => {
      root.$store.commit('changeShowRigthPanel', true)
      root.$store.commit('setRecordAccess', true)
      root.$store.commit('attributeEmbedded', action)

      root.$router.push({
        name: root.$route.name,
        query: {
          ...root.$route.query,
          typeAction: root.$store.getters.getAttributeEmbedded.action
        }
      }, () => {})

      root.$store.dispatch('setShowDialog', {
        type: panelType,
        action: action
      })
    }

    const runAction = (action) => {
      console.log(action)
      action.callBack()

      if (action.type === 'action') {
        executeAction(action)
      } else if (action.type === 'process') {
        // run process associate with view (window or browser)
        showModal(action)
      } else if (action.type === 'dataAction') {
        if (action.action === 'undoModifyData' && Boolean(!getDataLog.value) && getOldRouteOfWindow.value) {
          root.$router.push({
            path: getOldRouteOfWindow.value.path,
            query: {
              ...getOldRouteOfWindow.value.query
            }
          }, () => {})
        } else if (action.action === 'recordAccess') {
          manageRecordAccess(action)
        } else if (action.action !== 'undoModifyData') {
          if (action.action === 'setDefaultValues' && root.$route.query.action === 'create-new') {
            return
          }

          root.$store.dispatch(action.action, {
            parentUuid,
            containerUuid,
            recordUuid: recordUuid.value,
            panelType,
            isNewRecord: action.action === 'setDefaultValues',
            tableName,
            recordId: getCurrentRecord.value[tableName + '_ID']
          })
            .then(response => {
              root.$message({
                type: 'success',
                message: root.$t('notifications.recordLocked'),
                showClose: true
              })
              if (response && response.isPrivateAccess) {
                validatePrivateAccess(response)
              }
            })
            .catch(error => {
              root.$message({
                type: 'error',
                message: root.$t('notifications.error') + error.message,
                showClose: true
              })
            })
        }
      } else if (action.type === 'updateReport') {
        updateReport(action)
      }
    } // end runAction

    const executeAction = (action) => {
      let containerParams = root.$route.meta.uuid
      if (!root.isEmptyValue(lastParameter)) {
        containerParams = lastParameter
      }
      const fieldsNotReady = root.$store.getters.getFieldsListEmptyMandatory({
        containerUuid: containerParams
      })

      // run process or report
      if (root.isEmptyValue(fieldsNotReady)) {
        let menuUuid = menuParentUuid
        if (root.isEmptyValue(menuUuid) && root.$route.params) {
          if (!root.isEmptyValue(root.$route.params.menuParentUuid)) {
            menuUuid = root.$route.params.menuParentUuid
          }
        }

        if (panelType === 'process') {
          root.$store.dispatch('setTempShareLink', {
            processId: root.$route.params.processId,
            href: window.location.href
          })
        }

        let reportFormat = action.reportExportType
        if (root.isEmptyValue(reportFormat)) {
          reportFormat = root.$route.query.reportType
          if (root.isEmptyValue(reportFormat)) {
            reportFormat = root.$route.meta.reportFormat
            if (root.isEmptyValue(reportFormat)) {
              reportFormat = 'html'
            }
          }
        }

        root.$store.dispatch(action.action, {
          action,
          parentUuid: containerUuid,
          containerUuid: containerParams, // EVALUATE IF IS action.uuid
          panelType, // determinate if get table name and record id (window) or selection (browser)
          reportFormat, // root.$route.query.reportType ? root.$route.query.reportType : action.reportExportType,
          menuParentUuid: menuUuid, // to load relationsList in context menu (report view)
          routeToDelete: root.$route
        })
          .catch(error => {
            console.warn(error)
          })
      } else {
        showNotification({
          type: 'warning',
          title: root.$t('notifications.emptyValues'),
          name: '<b>' + fieldsNotReady + '.</b> ',
          message: root.$t('notifications.fieldMandatory'),
          isRedirect: false
        })
      }
    } // end executeAction

    const updateReport = (action) => {
      let instanceUuid = action.instanceUuid
      if (root.isEmptyValue(instanceUuid)) {
        instanceUuid = root.$route.params.instanceUuid
      }
      let processId = action.processId
      if (root.isEmptyValue(processId)) {
        processId = root.$route.params.processId
      }
      root.$store.dispatch('getReportOutputFromServer', {
        instanceUuid,
        processUuid: action.processUuid,
        tableName: action.tableName,
        processId,
        printFormatUuid: action.printFormatUuid,
        reportViewUuid: action.reportViewUuid,
        isSummary: false,
        reportName: root.$store.getters.getProcessResult.name,
        reportType: root.$store.getters.getReportType,
        option: action.option
      })
        .then(reportOutputResponse => {
          if (!reportOutputResponse.isError) {
            const {
              fileName, mimeType, outputStream, reportType
            } = reportOutputResponse
            const isDownload = !['pdf', 'html'].includes(reportType)

            const link = buildLinkHref({
              fileName,
              mimeType,
              outputStream,
              isDownload
            })

            reportOutputResponse.url = link.href
          }
          root.$store.dispatch('finishProcess', {
            processOutput: reportOutputResponse,
            routeToDelete: root.$route
          })
        })
    }

    const recordAccess = computed(() => {
      return {
        action: 'recordAccess',
        disabled: false,
        hidden: false,
        isSortTab: true,
        name: root.$t('data.recordAccess.actions'),
        type: 'dataAction',
        tableName: tableName
      }
    })

    const validatePrivateAccess = ({ isLocked, tableName, recordId }) => {
      if (!isPersonalLock.value) {
        let isHiddenLock = false
        if (isLocked) {
          isHiddenLock = true
        }
        actionsList.value = actionsList.value.map(actionItem => {
          if (actionItem.action === 'lockRecord') {
            return {
              ...actionItem,
              hidden: isHiddenLock,
              tableName,
              recordId
            }
          } else if (actionItem.action === 'unlockRecord') {
            return {
              ...actionItem,
              hidden: !isHiddenLock
            }
          }
          return actionItem
        })
      }
    }

    const getAllDataRecords = computed(() => {
      return root.$store.getters.getDataRecordAndSelection(containerUuid)
    })

    const getCurrentRecord = computed(() => {
      const record = getAllDataRecords.value.record.find(fieldItem => {
        if (recordUuid.value === fieldItem.UUID) {
          return fieldItem
        }
      })
      if (!root.isEmptyValue(record)) {
        return record
      }
      return {}
    })

    const getDataLog = computed(() => {
      if (isWindow.value) {
        return root.$store.getters.getDataLog(containerUuid, recordUuid.value)
      }
      return undefined
    })

    const getOldRouteOfWindow = computed(() => {
      if (isWindow.value) {
        const oldRoute = root.$store.state['windowControl/index'].windowOldRoute
        if (!root.isEmptyValue(oldRoute.query.action) && oldRoute.query.action !== 'create-new' && root.$route.query.action === 'create-new') {
          return oldRoute
        }
      }
      return false
    })

    const isPersonalLock = computed(() => {
      return root.$store.getters['user/getIsPersonalLock']
    })

    const isLockRecord = computed(() => {
      return root.$store.getters['user/getRole'].isPersonalLock
    })

    const generateContextMenu = () => {
      const metadataMenu = getterContextMenu.value

      // the function is broken avoiding that an error is generated when closing
      // session being in a window, since the store of vuex is cleaned, being
      // metadataMenu with value undefined
      if (root.isEmptyValue(metadataMenu)) {
        return
      }
      actionsList.value = metadataMenu.actions

      if (!isReport) {
        // not showed pintFormat or run process as
        actionsList.value = actionsList.value.filter(actionItem => {
          return ![
            root.$t('views.printFormat'), root.$t('components.RunProcessAs')
          ].includes(actionItem.name)
        })
      }

      // TODO: Add store attribute to avoid making repeated requests
      let isChangePrivateAccess = true
      if (isReferecesContent.value) {
        if ((!root.isEmptyValue(getCurrentRecord.value) && !root.isEmptyValue(tableName))) {
          root.$store.dispatch('getPrivateAccessFromServer', {
            tableName: tableName,
            recordId: getCurrentRecord.value[tableName + '_ID'],
            recordUuid: recordUuid.value
          })
            .then(privateAccessResponse => {
              isChangePrivateAccess = false
              validatePrivateAccess(privateAccessResponse)
            })
        }

        const processAction = actionsList.value.find(item => {
          // TODO: Compare with 'action' attribute and not with 'name' (this change with language)
          if (item.name === 'Procesar Orden' || (item.name === 'Process Order')) {
            return item
          }
        })
        if (processAction) {
          root.$store.dispatch('setOrder', processAction)
        }
      }
      if (isWindow.value && root.isEmptyValue(actionsList.value.find(element => element.action === 'recordAccess'))) {
        actionsList.value.push(recordAccess.value)
      }

      if (!root.isEmptyValue(actionsList.value)) {
        actionsList.value.forEach(itemAction => {
          const { action } = itemAction
          if (root.$route.meta.type === 'report' && action === 'startProcess') {
            itemAction.reportExportType = 'html'
          }

          // if no exists set prop with value
          itemAction.disabled = false
          if ((root.$route.name !== 'Report Viewer' && action === 'changeParameters') ||
             (root.$route.meta.type === 'process' && itemAction.type === 'summary')) {
            itemAction.disabled = true
          }

          if (root.$route.meta.type === 'window') {
            if (isLockRecord.value) {
              if (action === 'lockRecord') {
                itemAction.hidden = isChangePrivateAccess
              } else if (action === 'unlockRecord') {
                itemAction.hidden = !isChangePrivateAccess
              }
            }

            // rollback
            if (itemAction.action === 'undoModifyData') {
              itemAction.disabled = Boolean(!getDataLog.value && !getOldRouteOfWindow.value)
            } else if (!isWithRecord.value || !isInsertRecord) {
              itemAction.disabled = true
            }
          }
        })
      }
    }

    /**
     * Get element-ui icon from action
     */
    const iconAction = ({ type, action }) => {
      let icon = 'el-icon-setting'
      if (type === 'dataAction') {
        switch (action) {
          case 'setDefaultValues':
            icon = 'el-icon-circle-plus-outline'
            break
          case 'deleteEntity':
            icon = 'el-icon-delete'
            break
          case 'undoModifyData':
            icon = 'el-icon-refresh-left'
            break
          case 'lockRecord':
            icon = 'el-icon-lock'
            break
          case 'unlockRecord':
            icon = 'el-icon-unlock'
            break
          case 'recordAccess':
            icon = 'el-icon-c-scale-to-original'
            break
        }
      }

      return icon
    }

    generateContextMenu()

    return {
      // size: pro,
      actionsList,
      // computeds
      defaultActionName,
      defaultActionToRun,
      // methods
      runAction,
      clickRunAction,
      iconAction
    }
  }
})
</script>

<style scoped lang="scss" src="./common-style.scss">
</style>
<style scoped lang="scss">
.menu-actions {
  .el-button-group {
    display: inline-flex;
  }
}

.el-dropdown-menu.el-dropdown-menu--medium {
  // height, and font size of the prefix icons of menu items
  .el-dropdown-menu__item {
    line-height: 17px;
    padding: 0 17px;
    display: grid;
    font-size: 14px;

    // additional space on top of the first item in the list
    &:first-child {
      margin-top: 10px;
    }
    // additional space on bottom of the last item in the list
    &:last-child {
      margin-bottom: 10px;
    }
  }
}
</style>
<style lang="scss">
.menu-actions {
  .el-button-group {
    // light blue style of the first section of the menu button
    // >.el-button::first-child {
    >.el-button:not(:last-child) {
      // margin-right: -1px;
      color: #409eff;
      background: #ecf5ff;
      border-color: #b3d8ff;
    }

    // light blue style of the drop down menu section
    .el-button--primary:last-child {
      // margin-right: 2px;
      color: #409eff;
      background: #e6f1fd;
      border-color: #b3d8ff;
      border-left-color: #000000 !important;
    }

    // dark blue style when pointing to the menu
    .el-button--primary:hover {
      background: #1890ff;
      border-color: #1890ff;
      color: #FFFFFF;
    }
  }
}
</style>
