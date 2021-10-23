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

import { generateField } from '@/utils/ADempiere/dictionaryUtils'
import { sortFields } from '@/utils/ADempiere/dictionary/panel'

/**
 * Generate the actions and the associated process to store in the vuex store,
 * avoiding additional requests
 * @param {object} processToGenerate
 * @returns {object}
 */
export function generateProcess({
  processToGenerate,
  containerUuidAssociated = undefined
}) {
  const panelType = processToGenerate.isReport ? 'report' : 'process'
  const additionalAttributes = {
    containerUuid: processToGenerate.uuid,
    isEvaluateValueChanges: true,
    panelType
  }

  //  Convert from gRPC
  let fieldsList = []
  if (processToGenerate.parameters) {
    const fieldsRangeList = []

    fieldsList = processToGenerate.parameters
      .map(fieldItem => {
        const field = generateField({
          fieldToGenerate: fieldItem,
          moreAttributes: additionalAttributes
        })
        // Add new field if is range number
        if (field.isRange && field.componentPath === 'FieldNumber') {
          const fieldRange = generateField({
            fieldToGenerate: fieldItem,
            moreAttributes: additionalAttributes,
            typeRange: true
          })

          fieldsRangeList.push(fieldRange)
        }

        return field
      })

    fieldsList = fieldsList.concat(fieldsRangeList)
    // order range fields
    fieldsList = sortFields({
      fieldsList
    })
  }

  // delete fields props
  delete processToGenerate.parameters

  const processDefinition = {
    ...processToGenerate,
    ...additionalAttributes,
    isAssociated: Boolean(containerUuidAssociated),
    containerUuidAssociated,
    fieldsList
  }

  return {
    processDefinition
  }
}
