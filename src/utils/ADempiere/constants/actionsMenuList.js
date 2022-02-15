// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com www.erpya.com
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import language from '@/lang'
import { showMessage } from '@/utils/ADempiere/notification.js'
import { copyToClipboard, zoomIn } from '@/utils/ADempiere/coreUtils.js'

/**
 * Create new record
 */
export const createNewRecord = {
  sequence: 0,
  name: language.t('actionMenu.createNewRecord'),
  type: 'setDefaultValues',
  enabled: true,
  svg: false,
  icon: 'el-icon-circle-plus-outline',
  actionName: 'createNewRecord',
  createNewRecord: ({ root, parentUuid, containerUuid }) => {
    root.$store.dispatch('setTabDefaultValues', {
      parentUuid,
      containerUuid
    })
  }
}

export const undoChange = {
  sequence: 0,
  name: language.t('actionMenu.createNewRecord'),
  type: 'undoModifyData',
  enabled: false,
  svg: false,
  icon: 'el-icon-circle-plus-outline',
  actionName: 'undoChange',
  undoChange: ({ root, parentUuid, containerUuid }) => {
  }
}

/**
 * Shared url link
 */
export const sharedLink = {
  name: language.t('actionMenu.shareLink'),
  enabled: true,
  svg: false,
  icon: 'el-icon-share',
  actionName: 'sharedLink',
  sharedLink: ({ root, parentUuid, containerUuid }) => {
    const viewValues = root.$store.getters.getValuesViewType({
      parentUuid,
      containerUuid
    })

    const pairsValues = Array.from(viewValues.values())

    root.$router.push({
      name: root.$route.name,
      params: {
        ...root.$route.params
      },
      query: {
        ...root.$route.query,
        containerUuid,
        filters: pairsValues
      }
    }, () => {})

    const link = window.location.href

    copyToClipboard({
      text: link,
      isShowMessage: true
    })
  }
}

/**
 * Delete record (entity) with record
 */
export const deleteRecord = {
  name: language.t('actionMenu.deleteRecord'),
  enabled: true,
  svg: false,
  icon: 'el-icon-delete',
  type: 'deleteEntity',
  actionName: 'deleteRecord',
  deleteRecord: ({ root, parentUuid, containerUuid, recordId, recordUuid }) => {
    root.$store.dispatch('deleteEntity', {
      parentUuid,
      containerUuid,
      recordId,
      recordUuid
    })
      .then(() => {
        showMessage({
          message: root.$t('recordManager.deleteRecordSuccessful'),
          type: 'success'
        })
      })
      .catch(error => {
        showMessage({
          message: root.$t('recordManager.deleteRecordError'),
          type: 'error'
        })
        console.warn(`Delete Entity - Error ${error.message}, Code: ${error.code}.`)
      })
  }
}

/**
 * Zoom in on the window associated with the smart browser
 * @param {string} uuid of window
 */
export const zoomWindow = {
  name: language.t('actionMenu.zoomWindow'),
  enabled: true,
  svg: false,
  icon: 'el-icon-zoom-in',
  type: 'zoom',
  actionName: 'zoomWindow',
  uuid: null,
  zoomWindow: ({ uuid }) => {
    zoomIn({
      uuid
    })
  }
}

export const refreshRecords = {
  name: language.t('actionMenu.refreshRecords'),
  enabled: true,
  svg: false,
  icon: 'el-icon-refresh',
  actionName: 'refreshRecords',
  refreshRecords: ({ root, parentUuid, containerUuid, tableName }) => {
    // used to window
    root.$store.dispatch('getEntities', {
      parentUuid,
      containerUuid
    })
  }
}

export const refreshBrowserSearh = {
  name: language.t('actionMenu.refreshRecords'),
  enabled: true,
  svg: false,
  icon: 'el-icon-refresh',
  actionName: 'refreshRecords',
  refreshRecords: ({ root, containerUuid }) => {
    const fieldsEmpty = root.$store.getters.getBrowserFieldsEmptyMandatory({
      containerUuid
    })
    if (!root.isEmptyValue(fieldsEmpty)) {
      root.$message({
        message: language.t('notifications.mandatoryFieldMissing') + fieldsEmpty,
        type: 'info'
      })
      return
    }

    // used to browser
    root.$store.dispatch('getBrowserSearch', {
      containerUuid
    })
  }
}

export const lockRecord = {
  name: language.t('actionMenu.refreshRecords'),
  type: 'lockRecord',
  enabled: true,
  svg: false,
  icon: 'el-icon-lock',
  actionName: 'lockRecord',
  lockRecord: ({ root, parentUuid, containerUuid, tableName }) => {
  }
}

export const unlockRecord = {
  name: language.t('actionMenu.refreshRecords'),
  type: 'unlockRecord',
  enabled: true,
  svg: false,
  icon: 'el-icon-unlock',
  actionName: 'unlockRecord',
  unlockRecord: ({ root, parentUuid, containerUuid, tableName }) => {
  }
}

export const recordAccess = {
  name: language.t('actionMenu.refreshRecords'),
  enabled: true,
  svg: false,
  icon: 'el-icon-c-scale-to-original',
  actionName: 'recordAccess',
  recordAccess: ({ root, parentUuid, containerUuid, tableName }) => {
  }
}

export const runProcess = {
  name: language.t('actionMenu.runProcess'),
  enabled: true,
  svg: false,
  icon: 'el-icon-setting',
  actionName: 'runProcess',
  uuid: null,
  runProcess: ({ root, containerUuid }) => {
    root.$store.dispatch('startProcess', {
      containerUuid
    })
  }
}

export const runReport = {
  name: language.t('actionMenu.generateReport'),
  enabled: true,
  svg: false,
  icon: 'el-icon-document',
  actionName: 'runReport',
  uuid: null,
  runReport: ({ root, containerUuid }) => {
    root.$store.dispatch('startReport', {
      containerUuid
    })
  }
}

export const runReportAs = {
  name: language.t('actionMenu.generateReportAs'),
  enabled: true,
  svg: false,
  icon: 'el-icon-document',
  actionName: 'runReportAs',
  uuid: null,
  childs: [],
  runReportAs: ({ root, containerUuid }) => {
    root.$store.dispatch('startReport', {
      containerUuid
    })
  }
}

export const windowActions = [
  createNewRecord,
  refreshRecords,
  deleteRecord,
  sharedLink
]
