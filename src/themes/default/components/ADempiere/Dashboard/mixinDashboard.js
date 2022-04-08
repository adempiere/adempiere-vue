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

import { zoomIn } from '@/utils/ADempiere/coreUtils.js'

export default {
  name: 'MixinDashboard',
  props: {
    metadata: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      search: '',
      unsubscribe: () => {}
    }
  },

  methods: {
    handleClick(row) {
      let recordUuid
      if (!this.isEmptyValue(row.uuidRecord)) {
        recordUuid = row.uuidRecord
      }
      let tabParent
      if (row.action === 'window') {
        tabParent = 0
      }

      zoomIn({
        uuid: row.referenceUuid,
        query: {
          tabParent,
          action: recordUuid
        }
      })

      // conditions for the registration amount (operador: row.criteria.whereClause)
    },
    filterResult(search, list) {
      const searchFilter = this.ignoreAccent(search.toLowerCase())
      return list.filter(data => !searchFilter || data.name.toLowerCase().includes(searchFilter.toLowerCase()))
    },
    ignoreAccent(s) {
      if (!s) {
        return ''
      }
      return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    }
  }
}
