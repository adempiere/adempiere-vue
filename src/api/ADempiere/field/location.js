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

const tableName = 'C_Location'

/**
 * Create a location and return the created entity
 * @param {array} attributesList
 */
export function createLocationAddress({
  attributesList
}) {
  const { createEntity } = require('@/api/ADempiere/common/persistence.js')

  return createEntity({
    tableName,
    attributesList
  })
}

/**
 * Get location entity by identifier
 * @param {number} id as C_Location_ID
 * @param {string} uuid
 */
export function getLocationAddress({
  id,
  uuid
}) {
  const { getEntity } = require('@/api/ADempiere/common/persistence.js')

  return getEntity({
    tableName,
    recordId: id,
    recordUuid: uuid
  })
}

/**
 * Update an existing location by id or uuid
 * @param {number} id as C_Location_ID
 * @param {string} uuid
 * @param {array} attributesList, all attributes (including empty values)
 */
export function updateLocationAddress({
  id,
  uuid,
  attributesList
}) {
  const { updateEntity } = require('@/api/ADempiere/common/persistence.js')

  return updateEntity({
    tableName,
    recordId: id,
    recordUuid: uuid,
    attributesList
  })
}
