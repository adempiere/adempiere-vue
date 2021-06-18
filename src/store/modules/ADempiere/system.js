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

import {
  requestGetCountryDefinition,
  requestLanguagesList
} from '@/api/ADempiere/system-core.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { convertDateFormat } from '@/utils/ADempiere/dateTimeFormat.js'

const system = {
  state: {
    systemDefinition: {},
    country: {},
    languagesList: []
  },
  mutations: {
    setSystemDefinition(state, payload) {
      state.systemDefinition = payload
    },
    setCountry(state, payload) {
      state.country = payload
    },
    setLanguagesList: (state, payload) => {
      const languagesList = payload.map(language => {
        return {
          ...language,
          datePattern: convertDateFormat(language.datePattern),
          timePattern: convertDateFormat(language.timePattern)
        }
      })

      state.languagesList = Object.freeze(languagesList)
    }
  },
  actions: {
    getCountryFormServer({ commit }, {
      id,
      uuid
    }) {
      return new Promise(resolve => {
        requestGetCountryDefinition({
          id,
          uuid
        })
          .then(responseCountry => {
            commit('setCountry', responseCountry)

            resolve(responseCountry)
          })
          .catch(error => {
            console.warn(`Error getting Country Definition: ${error.message}. Code: ${error.code}.`)
          })
      })
    },
    getLanguagesFromServer({ commit }) {
      return new Promise(resolve => {
        requestLanguagesList({
          pageToke: undefined,
          pageSize: undefined
        })
          .then(languageResponse => {
            const languagesList = languageResponse.languagesList.map(language => {
              return {
                ...language,
                datePattern: convertDateFormat(language.datePattern),
                timePattern: convertDateFormat(language.timePattern)
              }
            })

            commit('setLanguagesList', languagesList)

            resolve(languagesList)
          })
          .catch(error => {
            console.warn(`Error getting Languages List: ${error.message}. Code: ${error.code}.`)
          })
      })
    }
  },
  getters: {
    getCountry: (state) => {
      return state.country
    },
    getCurrency: (state, getter) => {
      const { currencyIsoCode } = state.systemDefinition

      return {
        standardPrecision: getter.getStandardPrecision,
        iSOCode: currencyIsoCode || 'USD'
      }
    },
    getStandardPrecision: (state) => {
      const { standardPrecision } = state.systemDefinition

      return standardPrecision || 2
    },
    getCountryLanguage: (state) => {
      return state.systemDefinition.language.replace('_', '-')
    },
    getLanguagesList: (state) => {
      return state.languagesList
    },
    getCurrentLanguageDefinition: (state) => {
      let { language } = state.systemDefinition
      if (isEmptyValue(language)) {
        language = 'en_US'
      }
      return state.languagesList.find(definition => {
        return definition.language === language
      })
    }
  }
}

export default system
