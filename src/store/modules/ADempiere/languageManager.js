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

import Vue from 'vue'

import { updateEntity } from '@/api/ADempiere/common/persistence.js'
import { requestTranslations } from '@/api/ADempiere/actions/translation.js'

import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

const languageManager = {
  state: {
    translationsList: {}
  },

  mutations: {
    resetStateTranslations(state) {
      state.translationsList = {}
    },

    setTranslation(state, {
      language,
      tableName,
      recordUuid,
      uuid,
      values
    }) {
      const key = `${language}_${tableName}_${recordUuid}`
      Vue.set(state.translationsList, key, {
        key,
        uuid,
        values,
        originalValues: values
      })
    },

    setTranslationValue(state, {
      language,
      tableName,
      recordUuid,
      columnName,
      value
    }) {
      const key = `${language}_${tableName}_${recordUuid}`

      Vue.set(state.translationsList[key].values, columnName, value)
    },

    cancelTranslated(state, {
      language,
      tableName,
      recordUuid
    }) {
      const key = `${language}_${tableName}_${recordUuid}`
      const { originalValues } = state.translationsList[key]

      Vue.set(state.translationsList[key], 'values', originalValues)
    }
  },

  actions: {
    /**
     * Get translation values from server
     * @param {string} language
     * @param {string} tableName
     * @param {string} recordUuid
     * @returns
     */
    getTranslationsFromServer({ commit }, {
      language,
      tableName,
      recordUuid
    }) {
      return new Promise(resolve => {
        const langRequest = language

        requestTranslations({
          recordUuid,
          tableName,
          language
        })
          .then(translationResponse => {
            const { translationsList } = translationResponse
            if (isEmptyValue(translationsList)) {
              console.warn(translationResponse)
              return
            }

            let currentValues = {}
            translationsList.forEach(translationItem => {
              const { values, uuid, language } = translationItem

              if (language === langRequest) {
                currentValues = values
              }
              commit('setTranslation', {
                tableName,
                language,
                recordUuid,
                uuid,
                values
              })
            })

            if (isEmptyValue(currentValues)) {
              const { values } = translationsList[0]
              currentValues = values
            }

            resolve(currentValues)
          })
          .catch(error => {
            console.warn(`Error Get Translations List ${error.message}. Code: ${error.code}.`)
          })
      })
    },

    /**
     * Change translation value on server
     * @param {string} language
     * @param {string} tableName
     * @param {string} recordUuid
     * @param {string} columnName
     * @param {string} value
     * @returns
     */
    changeTranslationValue({ state, commit, getters }, {
      language,
      tableName,
      recordUuid,
      columnName,
      value
    }) {
      return new Promise(resolve => {
        const values = getters.getTranslationValues({
          language,
          tableName,
          recordUuid
        })
        // not change value
        if (values[columnName] === value) {
          resolve(values)
          return value
        }

        const key = `${language}_${tableName}_${recordUuid}`
        // uuid of translation table record
        const { uuid } = state.translationsList[key]

        return updateEntity({
          tableName: `${tableName}_Trl`, // '_Trl' is suffix for translation tables
          recordUuid: uuid,
          attributesList: [{
            columnName,
            value
          }]
        })
          .then(responseEntity => {
            const { attributes } = responseEntity
            const newValues = {}

            Object.keys(values).forEach(key => {
              newValues[key] = attributes[key]
            })

            commit('setTranslation', {
              language,
              tableName,
              recordUuid,
              uuid: attributes.UUID,
              values: newValues
            })

            resolve(newValues)
          })
          .catch(error => {
            console.warn(`Error Update Translation ${error.message}. Code: ${error.code}.`)
          })
      })
    }
  },

  getters: {
    getTranslationValues: (state) => ({
      language,
      tableName,
      recordUuid
    }) => {
      const key = `${language}_${tableName}_${recordUuid}`
      const translation = state.translationsList[key]
      if (translation) {
        return translation.values
      }
      return {}
    }
  }
}

export default languageManager
