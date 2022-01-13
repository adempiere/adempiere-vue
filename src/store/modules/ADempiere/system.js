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

// api request methods
import {
  requestLanguagesList
} from '@/api/ADempiere/system-core.js'

// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { convertDateFormat } from '@/utils/ADempiere/formatValue/dateFormat.js'

const system = {
  state: {
    systemDefinition: {},
    languagesList: []
  },

  mutations: {
    setSystemDefinition(state, payload) {
      state.systemDefinition = payload
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
    getLanguagesFromServer({ commit, dispatch, rootGetters }) {
      return new Promise(resolve => {
        requestLanguagesList({
          pageToke: undefined,
          pageSize: undefined
        })
          .then(languageResponse => {
            dispatch('serverListActivity', rootGetters['user/getUserUuid'])
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
    getCurrency: (state) => {
      const { currencyIsoCode, standardPrecision } = state.systemDefinition

      return {
        standardPrecision: standardPrecision || 2,
        iSOCode: currencyIsoCode || 'USD'
      }
    },
    getCurrencyCode: (state) => {
      const { currencyIsoCode } = state.systemDefinition

      return currencyIsoCode || 'USD'
    },
    getStandardPrecision: (state) => {
      const { standardPrecision } = state.systemDefinition

      return standardPrecision || 2
    },
    getCountryLanguage: (state) => {
      return state.systemDefinition.language.replace('_', '-')
    },
    getDisplaySequence: (state) => {
      return state.systemDefinition.displaySequence
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
