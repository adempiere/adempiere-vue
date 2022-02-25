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
import { copyToClipboard } from '@/utils/ADempiere/coreUtils.js'

/**
 * Shared url link
 */
export const sharedLink = {
  name: language.t('actionMenu.shareLink'),
  description: language.t('actionMenu.shareLinkDescription'),
  // enabled: true,
  enabled: () => {
    return true
  },
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
