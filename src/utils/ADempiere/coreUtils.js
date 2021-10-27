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

import router from '@/router'
import language from '@/lang'
import store from '@/store'

import { showMessage } from '@/utils/ADempiere/notification'
import { isEmptyValue, recursiveTreeSearch } from '@/utils/ADempiere/valueUtils.js'

export function zoomIn({
  uuid,
  params = {},
  query = {}
}) {
  if (isEmptyValue(uuid)) {
    showMessage({
      type: 'error',
      showClose: true,
      message: language.t('notifications.emptyValues')
    })
    return
  }

  const menuTree = store.getters.permission_routes

  const viewSearch = recursiveTreeSearch({
    treeData: menuTree,
    attributeValue: uuid,
    attributeName: 'meta',
    secondAttribute: 'uuid',
    attributeChilds: 'children'
  })

  if (!isEmptyValue(viewSearch)) {
    router.push({
      name: viewSearch.name,
      params,
      query
    }, () => {})
  } else {
    showMessage({
      type: 'error',
      showClose: true,
      message: language.t('notifications.noRoleAccess')
    })
  }
}

/**
 * Copy text into clipboard
 * @param {string} text, text copy to clipboard
 * @param {boolean} isShowMessage, is show notification when copy or error
 * @returns
 */
export function copyToClipboard({
  text,
  isShowMessage = true
}) {
  if (navigator.clipboard) {
    copyWhitNavigatorClipboard({
      text,
      isShowMessage
    })
    return
  }

  copyWithDOMClipboard({
    text,
    isShowMessage
  })
}

export function copyWhitNavigatorClipboard({
  text,
  isShowMessage = true
}) {
  if (!navigator.clipboard) {
    // web browser doesn't support
    return
  }
  navigator.clipboard.writeText(text)
    .then(() => {
      if (isShowMessage) {
        showMessage({
          type: 'success',
          message: language.t('notifications.copySuccessful'),
          showClose: true,
          duration: 1500
        })
      }
    })
    .catch(() => {
      if (isShowMessage) {
        showMessage({
          type: 'error',
          message: language.t('notifications.copyUnsuccessful'),
          showClose: true,
          duration: 1500
        })
      }
    })
}

export function copyWithDOMClipboard({
  text,
  isShowMessage = true
}) {
  const id = 'text-area-clipboard-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
  const textArea = document.createElement('textarea')
  textArea.id = id
  textArea.value = text
  textArea.text = text
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    if (document.execCommand('copy')) {
      if (isShowMessage) {
        showMessage({
          type: 'success',
          message: language.t('notifications.copySuccessful'),
          showClose: true,
          duration: 1500
        })
      }
    }
  } catch (err) {
    if (isShowMessage) {
      showMessage({
        type: 'error',
        message: language.t('notifications.copyUnsuccessful'),
        showClose: true,
        duration: 1500
      })
    }
  }

  // document.body.removeChild(textArea)
  textArea.remove()
}
