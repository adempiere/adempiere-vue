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

import clipboard from '@/directive/clipboard'
import language from '@/lang'
function generateLink() {}

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
  callBack: ({ root, parentUuid, containerUuid }) => {
    root.$store.dispatch('setDefaultValues', {
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
  callBack: ({ root, parentUuid, containerUuid }) => {
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
  callBack: ({ root }) => {
    const link = generateLink(root.router)
    clipboard(link)
  }
}

export const deleteRecord = {
  name: language.t('actionMenu.deleteRecord'),
  enabled: true,
  svg: false,
  icon: 'el-icon-delete',
  type: 'deleteEntity',
  callBack: ({ root, parentUuid, containerUuid, recordId, recordUuid }) => {
    root.$store.dispatch('dataManager/deleteEntity', {
      parentUuid,
      containerUuid,
      recordId,
      recordUuid
    })
  }
}

export const refreshRecords = {
  name: language.t('actionMenu.refreshRecords'),
  enabled: true,
  svg: false,
  icon: 'el-icon-refresh',
  callBack: ({ root, parentUuid, containerUuid, tableName }) => {
    // used to window
    // TODO: implement to browser
    root.$store.dispatch('dataManager/getEntities', {
      parentUuid,
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
  callBack: ({ root, parentUuid, containerUuid, tableName }) => {
  }
}

export const unlockRecord = {
  name: language.t('actionMenu.refreshRecords'),
  type: 'unlockRecord',
  enabled: true,
  svg: false,
  icon: 'el-icon-unlock',
  callBack: ({ root, parentUuid, containerUuid, tableName }) => {
  }
}

export const recordAccess = {
  name: language.t('actionMenu.refreshRecords'),
  enabled: true,
  svg: false,
  icon: 'el-icon-c-scale-to-original',
  callBack: ({ root, parentUuid, containerUuid, tableName }) => {
  }
}

export const windowActions = [
  createNewRecord,
  refreshRecords,
  deleteRecord,
  sharedLink
]
