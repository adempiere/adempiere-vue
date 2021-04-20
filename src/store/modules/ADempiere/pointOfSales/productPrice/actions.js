import {
  getProductPriceList
} from '@/api/ADempiere/form/point-of-sales.js'
import { isEmptyValue, extractPagingToken } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification.js'
import language from '@/lang'

/**
 * Product Price Actions
 * @author Elsio Sanchez <elsiosanches@gmail.com>
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
    const { priceList, templateBusinessPartner } = rootGetters.posAttributes.currentPointOfSales
    const { uuid: businessPartnerUuid } = templateBusinessPartner
    const { uuid: priceListUuid } = priceList
    const { uuid: warehouseUuid } = rootGetters['user/getWarehouse']
    if (isEmptyValue(searchValue)) {
      searchValue = rootGetters.getValueOfField({
        containerUuid,
        columnName: 'ProductValue'
      })
    }
    return new Promise(resolve => {
      getProductPriceList({
        searchValue,
        priceListUuid,
        businessPartnerUuid,
        warehouseUuid,
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
          warehouseUuid,
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
  listProductPriceFromServerProductInfo({ state, commit, rootGetters }, {
    containerUuid = 'Products-Price-List-ProductInfo',
    pageNumber, // 1
    searchValue
  }) {
    const posUuid = rootGetters.posAttributes.currentPointOfSales.uuid
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

    const { priceList, templateBusinessPartner } = rootGetters.posAttributes.currentPointOfSales
    const { uuid: businessPartnerUuid } = templateBusinessPartner
    const { uuid: priceListUuid } = priceList
    const { uuid: warehouseUuid } = rootGetters['user/getWarehouse']

    if (isEmptyValue(searchValue)) {
      searchValue = rootGetters.getValueOfField({
        containerUuid,
        columnName: 'ProductValue'
      })
    }
    return new Promise(resolve => {
      getProductPriceList({
        searchValue,
        priceListUuid,
        businessPartnerUuid,
        warehouseUuid,
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
          warehouseUuid,
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
