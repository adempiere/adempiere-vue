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

import {
  getProductPriceList
} from '@/api/ADempiere/form/point-of-sales.js'
import { isEmptyValue, extractPagingToken } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification.js'
import language from '@/lang'

/**
 * Product Price Actions
 */
export default {
  setProductPicePageNumber({ commit }, pageNumber) {
    commit('setProductPicePageNumber', pageNumber)
    commit('setIsReloadProductPrice')
  },
  listProductPriceFromServer({ state, commit, rootGetters }, {
    containerUuid = 'Products-Price-List',
    pageNumber, // 1
    searchValue,
    currentPOS
  }) {
    const posUuid = isEmptyValue(currentPOS) ? rootGetters.posAttributes.currentPointOfSales.uuid : currentPOS.uuid
    if (isEmptyValue(posUuid)) {
      const message = language.t('notifications.errorPointOfSale')
      showMessage({
        type: 'info',
        message
      })
      console.warn(message)
      return
    }
    commit('setIsReloadProductPrice')
    let pageToken, token
    if (isEmptyValue(pageNumber)) {
      pageNumber = state.productPrice.pageNumber
      if (isEmptyValue(pageNumber)) {
        pageNumber = 1
      }

      token = state.productPrice.token
      if (!isEmptyValue(token)) {
        pageToken = token + '-' + pageNumber
      }
    }
    const currentPointOfSales = rootGetters.posAttributes.currentPointOfSales
    const { templateCustomer, currentPriceList, currentWarehouse } = currentPointOfSales
    const { uuid: businessPartnerUuid } = templateCustomer
    if (isEmptyValue(searchValue)) {
      searchValue = rootGetters.getValueOfField({
        containerUuid,
        columnName: 'ProductValue'
      })
    }
    return new Promise(resolve => {
      getProductPriceList({
        searchValue,
        posUuid,
        businessPartnerUuid,
        priceListUuid: currentPriceList.uuid,
        warehouseUuid: currentWarehouse.uuid,
        pageToken
      }).then(responseProductPrice => {
        if (isEmptyValue(token) || isEmptyValue(pageToken)) {
          token = extractPagingToken(responseProductPrice.nextPageToken)
        }

        commit('setListProductPrice', {
          ...responseProductPrice,
          isLoaded: true,
          isReload: false,
          businessPartnerUuid,
          warehouseUuid: currentWarehouse.uuid,
          token,
          pageNumber
        })

        resolve(responseProductPrice)
      }).catch(error => {
        console.warn(`getProductPriceList: ${error.message}. Code: ${error.code}.`)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
    })
  },
  listProductPriceFromServerProductInfo({ state, commit, rootGetters }, {
    containerUuid = 'Products-Price-List-ProductInfo',
    pageNumber, // 1
    searchValue,
    currentPOS
  }) {
    const posUuid = isEmptyValue(currentPOS) ? rootGetters.posAttributes.currentPointOfSales.uuid : currentPOS.uuid
    if (isEmptyValue(posUuid)) {
      const message = 'Sin punto de venta seleccionado'
      showMessage({
        type: 'info',
        message
      })
      console.warn(message)
      return
    }
    commit('setIsReloadProductPrice')
    let pageToken, token
    if (isEmptyValue(pageNumber)) {
      pageNumber = state.productPrice.pageNumber
      if (isEmptyValue(pageNumber)) {
        pageNumber = 1
      }

      token = state.productPrice.token
      if (!isEmptyValue(token)) {
        pageToken = token + '-' + pageNumber
      }
    }
    const currentPointOfSales = rootGetters.posAttributes.currentPointOfSales
    const { templateCustomer, currentPriceList, currentWarehouse } = currentPointOfSales
    const { uuid: businessPartnerUuid } = templateCustomer

    if (isEmptyValue(searchValue)) {
      searchValue = rootGetters.getValueOfField({
        containerUuid,
        columnName: 'ProductValue'
      })
    }
    return new Promise(resolve => {
      getProductPriceList({
        searchValue,
        posUuid: posUuid,
        businessPartnerUuid,
        priceListUuid: currentPriceList.uuid,
        warehouseUuid: currentWarehouse.uuid,
        pageToken
      }).then(responseProductPrice => {
        if (isEmptyValue(token) || isEmptyValue(pageToken)) {
          token = extractPagingToken(responseProductPrice.nextPageToken)
        }

        commit('setListProductPrice', {
          ...responseProductPrice,
          isLoaded: true,
          isReload: false,
          businessPartnerUuid,
          warehouseUuid: currentWarehouse.uuid,
          token,
          pageNumber
        })

        resolve(responseProductPrice)
      }).catch(error => {
        console.warn(`getKeyLayoutFromServer: ${error.message}. Code: ${error.code}.`)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
    })
  },
  updateSearch({ commit }, newValue) {
    commit('updtaeSearchProduct', newValue)
  }
}
