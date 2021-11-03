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

// API used for get information of locator from server API,
// please don't change it if is not related to locator field

import { getEntities } from '@/api/ADempiere/user-interface/persistence.js'
import { OPERATOR_EQUAL } from '@/utils/ADempiere/dataUtils.js'

const tableName = 'M_Locator'

// Get Locator list based on warehouse ID
export function getLocatorList({
  warehouseId
}) {
  return new Promise(resolve => {
    const conditions = [{
      columnName: `M_Warehouse_ID`,
      operator: OPERATOR_EQUAL.operator,
      value: warehouseId
    }]

    getEntities({
      tableName,
      conditions
    }).then(locatorData => {
      const locatorList = []

      if (locatorData) {
        locatorData.recordsList.map(record => {
          locatorList.push({
            id: record.id,
            value: record.attributes.Value,
            warehouseId: record.attributes.M_Warehouse_ID,
            rack: record.attributes.X,
            column: record.attributes.Y,
            level: record.attributes.Z
          })
        })
      }

      resolve(locatorList)
    })
  })
}
