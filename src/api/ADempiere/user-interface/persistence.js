// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
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

// Get Instance for connection
import { request } from '@/utils/ADempiere/request'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

/**
 * Object List from window
 * @param {string} windowUuid
 * @param {string} tabUuid
 * @param {array}  conditionsList
 * @param {array}  columnsList // TODO: Add support on adempiere-vue
 * @param {string} orderByClause
 * @param {string} pageToken
 */
export function getEntities({
  windowUuid,
  tabUuid,
  conditions = [],
  columns = [],
  attributes = [],
  sorting = [],
  pageToken,
  pageSize
}) {
  const filters = conditions.map(condition => {
    const { value, operator, columnName, valueTo, values } = condition
    return {
      column_name: columnName,
      value,
      operator,
      value_to: valueTo,
      values
    }
  })

  // context attributes
  if (!isEmptyValue(attributes)) {
    attributes.forEach(attributeValue => {
      filters.push({
        column_name: attributeValue.columnName,
        operator: attributeValue.operator,
        value: attributeValue.value
      })
    })
  }

  let sortingDefinition
  if (!isEmptyValue(sorting)) {
    sortingDefinition = sorting.map(sortValue => {
      return {
        column_name: sortValue.columnName,
        sorting: sortValue.sorting
      }
    })
  }

  return request({
    url: '/user-interface/window/entities',
    method: 'get',
    params: {
      window_uuid: windowUuid,
      tab_uuid: tabUuid,
      // DSL Query
      filters,
      columns,
      // replace sql values
      sorting: sortingDefinition,
      // Page Data
      page_token: pageToken,
      page_size: pageSize
    }
  })
    .then(response => {
      const { convertEntityList } = require('@/utils/ADempiere/apiConverts/persistence.js')
      return convertEntityList(response)
    })
}

/**
 * Get default value for a field, parameter or query criteria
 * @param {string} query, sql to get value
 */
export function requestDefaultValue(query) {
  return request({
    url: '/user-interface/window/default-value',
    method: 'get',
    params: {
      query
    }
  })
    .then(valueResponse => {
      return valueResponse
    })
}
