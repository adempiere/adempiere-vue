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

import { isEmptyValue, recursiveTreeSearch } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification'
import router from '@/router'
import language from '@/lang'
import store from '@/store'

export function zoomIn({
  uuid,
  params = {},
  query = {}
}) {
  const menuTree = store.getters.permissionRoutes

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
      message: language.$t('notifications.noRoleAccess')
    })
  }
}
