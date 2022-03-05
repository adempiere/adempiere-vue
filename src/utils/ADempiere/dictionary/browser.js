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
import store from '@/store'

// utils and helpers methods
import { isHiddenField } from '@/utils/ADempiere/references'
import { showMessage, showNotification } from '@/utils/ADempiere/notification.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { zoomIn } from '@/utils/ADempiere/coreUtils.js'

/**
 * Is displayed field in panel query criteria
 */
export function isDisplayedField({ displayType, isActive, isQueryCriteria, isDisplayedFromLogic }) {
  // button field not showed
  if (isHiddenField(displayType)) {
    return false
  }

  return isActive && isQueryCriteria && isDisplayedFromLogic
}

/**
 * Smart Browser not manager mandatory logic, used as query
 * @param {boolean} isMandatoryFromLogic
 * @returns {boolean}
 */
export function isMandatoryField({ isQueryCriteria, isMandatory, isMandatoryFromLogic }) {
  return isQueryCriteria && (isMandatory || isMandatoryFromLogic)
}

export function isReadOnlyField({ isQueryCriteria, isReadOnlyFromLogic }) {
  return isQueryCriteria && isReadOnlyFromLogic
}

/**
 * Is displayed column in table multi record
 */
export function isDisplayedColumn({ displayType, isActive, isDisplayed, isKey }) {
  // column check to selection or button field not showed
  if (isKey || isHiddenField(displayType)) {
    return false
  }

  return isActive && isDisplayed
}

export function isMandatoryColumn({ isMandatory, isMandatoryFromLogic }) {
  return isMandatory || isMandatoryFromLogic
}

/**
 * Read only column in table multi record
 * @param {boolean} isReadOnly
 * @returns {boolean}
 */
export function isReadOnlyColumn({ isReadOnly }) {
  return isReadOnly
}

export const refreshBrowserSearh = {
  name: language.t('actionMenu.refreshRecords'),
  enabled: () => {
    return true
  },
  svg: false,
  icon: 'el-icon-refresh',
  actionName: 'refreshRecords',
  refreshRecords: ({ containerUuid }) => {
    const fieldsEmpty = store.getters.getBrowserFieldsEmptyMandatory({
      containerUuid
    })
    if (!isEmptyValue(fieldsEmpty)) {
      showMessage({
        message: language.t('notifications.mandatoryFieldMissing') + fieldsEmpty,
        type: 'info'
      })
      return
    }

    // used to browser
    store.dispatch('getBrowserSearch', {
      containerUuid
    })
  }
}

export const runProcessOfBrowser = {
  name: language.t('actionMenu.runProcess'),
  enabled: ({ containerUuid, containerManager }) => {
    const selection = containerManager.getSelection({
      containerUuid
    })

    return !isEmptyValue(selection)
  },
  svg: false,
  icon: 'el-icon-setting',
  actionName: 'runProcessOfBrowser',
  uuid: null,
  runProcessOfBrowser: ({ containerUuid, containerManager }) => {
    const selection = containerManager.getSelection({
      containerUuid
    })
    if (isEmptyValue(selection)) {
      showNotification({
        title: language.t('data.selectionRequired'),
        type: 'warning'
      })
      return
    }
    store.dispatch('startProcessOfBrowser', {
      containerUuid
    })
  }
}

/**
 * Zoom in on the window associated with the smart browser
 * @param {string} uuid of window
 */
export const zoomWindow = {
  name: language.t('actionMenu.zoomWindow'),
  enabled: ({ containerUuid }) => {
    const browser = store.getters.getStoredBrowser(containerUuid)
    if (!isEmptyValue(browser)) {
      return !isEmptyValue(browser.window)
    }
    return false
  },
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
