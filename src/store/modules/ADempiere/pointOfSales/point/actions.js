// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Elsio Sanchez esanchez@erpya.com www.erpya.com
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

import router from '@/router'
import {
  getPointOfSales,
  listPointOfSales,
  listWarehouses,
  listDiscount,
  listDocumentTypes,
  listTenderTypes,
  listPrices,
  listCurrencies
} from '@/api/ADempiere/form/point-of-sales.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification.js'
import language from '@/lang'

/**
 * Pos Actions
 */
export default {
  /**
   * Load Point of Sale Data from Server
   */
  loadDataFromServer({ dispatch, getters }) {
    const PointOfSales = getters.posAttributes.currentPointOfSales
    if (!isEmptyValue(PointOfSales.uuid)) {
      dispatch('findPointOfSales', PointOfSales.uuid)
    }
    dispatch('listPointOfSalesFromServer')
  },
  /**
   * GET Point of Sales
   * @param {string} posUuid POS UUID reference
   */
  findPointOfSales({ commit }, posUuid) {
    getPointOfSales({
      posUuid
    })
      .then(response => {
        commit('setCurrentPointOfSales', response)
      })
      .catch(error => {
        console.warn(`listPointOfSalesFromServer: ${error.message}. Code: ${error.code}.`)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  },
  /**
   * List point of sales terminal
   * @param {number} posToSet id to set
   */
  listPointOfSalesFromServer({ commit, getters, dispatch }, posToSet = null) {
    const userUuid = getters['user/getUserUuid']
    let pos, pointOfSalesList
    listPointOfSales({
      userUuid
    })
      .then(response => {
        pointOfSalesList = response.sellingPointsList
        if (isEmptyValue(pos) && isEmptyValue(posToSet) && !isEmptyValue(pointOfSalesList)) {
          pos = pointOfSalesList.find(itemPOS => itemPOS.salesRepresentative.uuid === userUuid)
        }
        if (isEmptyValue(pos) && !isEmptyValue(pointOfSalesList)) {
          pos = pointOfSalesList[0]
        }
        if (!isEmptyValue(router.app._route.query.pos) && !isEmptyValue(pointOfSalesList)) {
          pos = pointOfSalesList.find(point => point.id === parseInt(router.app._route.query.pos))
        }
        commit('setPointOfSalesList', pointOfSalesList)
        if (pos) {
          dispatch('setCurrentPOS', pos)
        } else {
          showMessage({
            type: 'error',
            message: language.t('notifications.emptyPos'),
            showClose: true
          })
        }
      })
      .catch(error => {
        console.warn(`listPointOfSalesFromServer: ${error.message}. Code: ${error.code}.`)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  },
  listWarehousesFromServer({ commit }, posUuid) {
    listWarehouses({
      posUuid
    })
      .then(response => {
        commit('setWarehousesList', response.records)
      })
      .catch(error => {
        console.warn(`listWarehousesFromServer: ${error.message}. Code: ${error.code}.`)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  },
  listDiscountFromServer({ commit }, posUuid) {
    listDiscount({
      posUuid
    })
      .then(response => {
        commit('setDiscountList', response.records)
      })
      .catch(error => {
        console.warn(`listDiscountFromServer: ${error.message}. Code: ${error.code}.`)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  },
  listDocumentTypesFromServer({ commit }, posUuid) {
    listDocumentTypes({
      posUuid
    })
      .then(response => {
        commit('setDocumentTypesList', response.records)
      })
      .catch(error => {
        console.warn(`listDocumentTypesFromServer: ${error.message}. Code: ${error.code}.`)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  },
  listPricesFromServer({ commit }, point) {
    listPrices({
      posUuid: point.uuid
    })
      .then(response => {
        commit('setPricesList', response.records)
      })
      .catch(error => {
        console.warn(`listPricesFromServer: ${error.message}. Code: ${error.code}.`)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  },
  listCurrenciesFromServer({ commit }, posUuid) {
    listCurrencies({
      posUuid
    })
      .then(response => {
        commit('setCurrenciesList', response.records)
      })
      .catch(error => {
        console.warn(`listPricesFromServer: ${error.message}. Code: ${error.code}.`)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  },
  listTenderTypesFromServer({ commit }, posUuid) {
    listTenderTypes({
      posUuid
    })
      .then(response => {
        commit('setTenderTypesList', response.records)
      })
      .catch(error => {
        console.warn(`listTenderTypesFromServer: ${error.message}. Code: ${error.code}.`)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  },
  setCurrentPOS({ commit, dispatch, state, rootGetters }, posToSet) {
    commit('setCurrentPointOfSales', posToSet)
    const oldRoute = router.app._route
    router.push({
      name: oldRoute.name,
      params: {
        ...oldRoute.params
      },
      query: {
        ...oldRoute.query,
        pos: posToSet.id
      }
    }, () => {})
    dispatch('listWarehousesFromServer', posToSet.uuid)
    dispatch('listDocumentTypesFromServer', posToSet.uuid)
    dispatch('listCurrenciesFromServer', posToSet.uuid)
    dispatch('listTenderTypesFromServer', posToSet.uuid)
    dispatch('listPricesFromServer', posToSet)
    commit('setCurrentPriceList', posToSet.priceList)
    commit('setCurrentWarehousePos', posToSet.warehouse)
    commit('resetConversionRate', [])
    commit('setIsReloadKeyLayout')
    commit('setIsReloadProductPrice')
    commit('setIsReloadListOrders')
    commit('setShowPOSKeyLayout', false)
  }
}
