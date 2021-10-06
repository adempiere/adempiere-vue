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

/**
 * Create entity
 * @param {string}  tableName
 * @param {array}   attributesList
 */
export function createEntity({
  tableName,
  attributesList
}) {
  attributesList = attributesList.map(parameter => {
    return {
      key: parameter.columnName,
      value: parameter.value
    }
  })

  return request({
    url: '/common/api/create',
    method: 'post',
    data: {
      table_name: tableName,
      attributes: attributesList
    }
  })
    .then(entityCreateResponse => {
      const { convertEntity } = require('@/utils/ADempiere/apiConverts/persistence.js')

      return convertEntity(entityCreateResponse)
    })
}

/**
 * Update entity
 * @param {string}  tableName
 * @param {number}  recordId
 * @param {string}  recordUuid
 * @param {array}   attributesList
 */
export function updateEntity({
  tableName,
  recordId,
  recordUuid,
  attributesList
}) {
  attributesList = attributesList.map(parameter => {
    return {
      key: parameter.columnName,
      value: parameter.value
    }
  })

  return request({
    url: '/common/api/update',
    method: 'post',
    data: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid,
      attributes: attributesList
    }
  })
    .then(entityUpdateResponse => {
      const { convertEntity } = require('@/utils/ADempiere/apiConverts/persistence.js')

      return convertEntity(entityUpdateResponse)
    })
}

/**
 * Delete entity
 * @param {string}  tableName
 * @param {number}  recordId
 * @param {string}  recordUuid
 */
export function deleteEntity({
  tableName,
  recordId,
  recordUuid
}) {
  return request({
    url: '/common/api/delete',
    method: 'post',
    data: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid
    }
  }).then(response => {
    return response
  })
}

/**
 * Rollback entity (Create, Update, Delete)
 * @param {string} tableName
 * @param {number} recordId
 * @param {string} eventType
 */
export function rollbackEntity({
  tableName,
  recordId,
  recordUuid,
  eventType
}) {
  return request({
    url: '/common/api/rollback-entity',
    method: 'post',
    data: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid,
      event_type: eventType
    }
  })
    .then(entityResponse => {
      const { convertEntity } = require('@/utils/ADempiere/apiConverts/persistence.js')

      return convertEntity(entityResponse)
    })
}

/**
 * Get entity from table name and record id or record uuid
 */
export function getEntity({
  tableName,
  recordId,
  recordUuid
}) {
  return request({
    url: '/common/api/entity',
    method: 'get',
    params: {
      table_name: tableName,
      uuid: recordUuid,
      id: recordId
    }
  })
    .then(entityResponse => {
      const { convertEntity } = require('@/utils/ADempiere/apiConverts/persistence.js')

      return convertEntity(entityResponse)
    })
}
