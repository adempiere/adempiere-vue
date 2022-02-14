
const initStateUtils = {
  width: 0,
  height: 0,
  splitHeight: 50,
  splitHeightTop: 0,
  widthLayout: 0,
  oldAction: undefined,
  isShowedTable: false,
  isShowedTabChildren: false,
  recordTable: 0,
  selectionProcess: [],
  isContainerInfo: false,
  documentAction: [],
  splitWidthRight: 3,
  splitWidthLeft: 3,
  parametersProcessPos: [],
  updateOrder: false,
  updatePayment: false,
  createBusinessPartner: false,
  listBusinessPartner: false,
  copyShippingAddress: true,
  step: 0,
  updateCustomer: false,
  overdrawnInvoice: {
    visible: false
  },
  searchCompleteOrders: false,
  searchToDeliveOrders: false,
  isNewOrder: false,
  showProductList: false,
  confirmDelivery: false,
  showConfirmDelivery: false,
  showFastConfirmDelivery: false,
  showAddNewAddress: false,
  showAddressUpdate: false,
  showCashOpen: false,
  showCashWithdrawl: false,
  showCashSummaryMovements: false,
  showAssignSeller: false,
  showPanelAddress: false,
  quickSearchOrder: {}
}

export default {
  state: initStateUtils,
  mutations: {
    setWidth(state, width) {
      state.width = width
    },
    setWidthLayout(state, width) {
      state.widthLayout = width
    },
    setHeigth(state, height) {
      state.height = height
    },
    setSplitHeight(state, splitHeight) {
      state.splitHeight = splitHeight
    },
    showMenuTable(state, isShowedTable) {
      state.isShowedTable = isShowedTable
    },
    showContainerInfo(state, isContainerInfo) {
      state.isContainerInfo = isContainerInfo
    },
    showMenuTabChildren(state, isShowedTabChildren) {
      state.isShowedTabChildren = isShowedTabChildren
    },
    setSplitHeightTop(state, splitHeightTop) {
      state.splitHeightTop = splitHeightTop
    },
    setProcessTable(state, recordTable) {
      state.recordTable = recordTable
    },
    setOrder(state, payload) {
      state.documentAction = payload
    },
    setProcessSelecetion(state, selectionProcess) {
      state.selectionProcess = selectionProcess
    },

    resetStateUtils(state) {
      state = initStateUtils
    },
    setSplitWidthRight(state, splitWidthRight) {
      state.splitWidthRight = splitWidthRight
    },
    setSplitWidthLeft(state, splitWidthLeft) {
      state.splitWidthLeft = splitWidthLeft
    },
    parametersProcessPos(state, params) {
      state.parametersProcessPos = params
    },
    setUpdateOrder(state, order) {
      state.updateOrder = order
    },
    setUpdatePayment(state, payment) {
      state.updatePayment = payment
    },
    setStepCurrent(state, step) {
      state.step = step
    },
    popoverCreateBusinessPartner(state, createBusinessPartner) {
      state.createBusinessPartner = createBusinessPartner
    },
    popoverListBusinessPartner(state, payload) {
      state.listBusinessPartner = payload
    },
    popoverOverdrawnInvoice(state, payload) {
      state.overdrawnInvoice = payload
    },
    showUpdateCustomer(state, show) {
      state.updateCustomer = show
    },
    setShowFastCompleteOrders(state, show) {
      state.searchCompleteOrders = show
    },
    setShowsearchToDeliveOrders(state, show) {
      state.searchToDeliveOrders = show
    },
    focusNewOrder(state, payload) {
      state.isNewOrder = payload
    },
    setCopyShippingAddress(state, payload) {
      state.copyShippingAddress = payload
    },
    setShowProductList(state, payload) {
      state.showProductList = payload
    },
    setConfirmDelivery(state, payload) {
      state.confirmDelivery = payload
    },
    setShowConfirmDelivery(state, payload) {
      state.showConfirmDelivery = payload
    },
    setShowFastConfirmDelivery(state, payload) {
      state.showFastConfirmDelivery = payload
    },
    setShowAddNewAddress(state, payload) {
      state.showAddNewAddress = payload
    },
    setShowAddressUpdate(state, payload) {
      state.showAddressUpdate = payload
    },
    setshowCashOpen(state, payload) {
      state.showCashOpen = payload
    },
    setShowCashWithdrawl(state, payload) {
      state.showCashWithdrawl = payload
    },
    setShowCashSummaryMovements(state, payload) {
      state.showCashSummaryMovements = payload
    },
    setShowAssignSeller(state, payload) {
      state.showAssignSeller = payload
    },
    setQuickSearchOrder(state, order) {
      state.quickSearchOrder = order
    },
    setShowPanelAddress(state, showPanelAddress) {
      console.log({ showPanelAddress })
      state.showPanelAddress = showPanelAddress
    }
  },
  actions: {
    setWidth({ commit }, width) {
      commit('setWidth', width)
    },
    setWidthLayout({ commit }, width) {
      commit('setWidthLayout', width)
    },
    setHeight({ commit }, height) {
      commit('setHeigth', height)
    },
    showMenuTable({ commit }, isShowedTable) {
      commit('showMenuTable', isShowedTable)
    },
    showContainerInfo({ commit, state }, isContainerInfo) {
      commit('showContainerInfo', isContainerInfo)
    },
    showMenuTabChildren({ commit }, isShowedTabChildren) {
      commit('showMenuTabChildren', isShowedTabChildren)
    },
    setSplitHeight({ commit }, splitHeight) {
      commit('setSplitHeight', splitHeight)
    },
    setSplitHeightTop({ commit }, splitHeightTop) {
      commit('setSplitHeightTop', splitHeightTop)
    },
    setProcessTable({ commit }, recordTable) {
      commit('setProcessTable', recordTable)
    },
    setProcessSelect({ commit }, params) {
      commit('setProcessSelecetion', params)
    },

    setOrder({ commit }, params) {
      commit('setOrder', params)
    },
    changeWidthRight({ commit }, newWidthRight) {
      commit('setSplitWidthRight', newWidthRight)
    },
    changeWidthLeft({ commit }, newWidthLeft) {
      commit('setSplitWidthLeft', newWidthLeft)
    },
    addParametersProcessPos({ commit }, params) {
      commit('parametersProcessPos', params)
    },
    updateOrderPos({ commit }, params) {
      commit('setUpdateOrder', params)
    },
    updatePaymentPos({ commit }, params) {
      commit('setUpdatePayment', params)
    },
    changePopover({ commit }, params) {
      commit('popoverCreateBusinessPartner', params)
    },
    changePopoverListBusinessPartner({ commit }, params) {
      commit('popoverListBusinessPartner', params)
    },
    changeShowAddNewAddress({ commit }, params) {
      commit('setShowAddNewAddress', params)
    },
    changePopoverOverdrawnInvoice({ commit }, { attributePin, visible }) {
      const overdrawn = {
        attributePin,
        visible
      }
      commit('popoverOverdrawnInvoice', overdrawn)
    },
    changeShowUpdateCustomer({ commit }, show) {
      commit('showUpdateCustomer', show)
    },
    changeFocusNewOrder({ commit }, params) {
      commit('focusNewOrder', params)
    },
    changeCopyShippingAddress({ commit }, params) {
      commit('setCopyShippingAddress', params)
    }
  },
  getters: {
    getShowPanelAddress: (state) => {
      return state.showPanelAddress
    },
    getWidth: (state) => {
      return state.width
    },
    getProcessSelect: (state) => {
      return state.selectionProcess
    },
    getWidthLayout: (state, rootGetters) => {
      if (rootGetters.toggleSideBar) {
        return state.width - 250
      }
      return state.width - 54
    },
    getHeigth: (state) => {
      return state.height
    },
    getSplitHeightTop: (state) => {
      return state.getSplitHeightTop
    },
    getRecordUuidMenu: (state) => {
      return state.recordTable
    },
    getShowContextMenuTable: (state) => {
      const menu = state.isShowedTable.isShowedTable
      return menu
    },
    getShowContainerInfo: (state) => {
      const showInfo = state.isContainerInfo
      return showInfo
    },
    getShowContextMenuTabChildren: (state) => {
      const menu = state.isShowedTabChildren.isShowedTabChildren
      return menu
    },
    getSplitHeight: (state) => {
      const split = state.splitHeight
      if (split !== 50) {
        return split.splitHeight
      }
      return 50
    },

    getOrders: (state) => {
      return state.documentAction
    },
    getWidthRight: (state) => {
      return state.splitWidthRight
    },
    getWidthLeft: (state) => {
      return state.splitWidthLeft
    },
    getPosParameters: (state) => {
      return state.parametersProcessPos
    },
    getUpdateOrderPos: (state) => {
      return state.updateOrder
    },
    getUpdatePaymentPos: (state) => {
      return state.updatePayment
    },
    getPopoverCreateBusinessParnet: (state) => {
      return state.createBusinessPartner
    },
    getPopoverListBusinessParnet: (state) => {
      return state.listBusinessPartner
    },
    getCopyShippingAddress: (state) => {
      return state.copyShippingAddress
    },
    getStepCurrent: (state) => {
      return state.step
    },
    getOverdrawnInvoice: (state) => {
      return state.overdrawnInvoice
    },
    getShowUpdateCustomer: (state) => {
      return state.updateCustomer
    },
    getFocusNewOrder: (state) => {
      return state.isNewOrder
    },
    getShowProductList: (state) => {
      return state.showProductList
    },
    getConfirmDelivery: (state) => {
      return state.confirmDelivery
    },
    getShowConfirmDelivery: (state) => {
      return state.showConfirmDelivery
    },
    showConfirmDelivery: (state) => {
      return state.showFastConfirmDelivery
    },
    getSearchCompleteOrderss: (state) => {
      return state.searchCompleteOrders
    },
    getSearchToDeliveOrders: (state) => {
      return state.searchToDeliveOrders
    },
    getShowAddNewAddress: (state) => {
      return state.showAddNewAddress
    },
    getShowAddressUpdate: (state) => {
      return state.showAddressUpdate
    },
    getShowCashOpen: (state) => {
      return state.showCashOpen
    },
    getShowCashWithdrawl: (state) => {
      return state.showCashWithdrawl
    },
    getShowCashSummaryMovements: (state) => {
      return state.showCashSummaryMovements
    },
    getShowAssignSeller: (state) => {
      return state.showAssignSeller
    },
    getQuickSearchOrder: (state) => {
      return state.quickSearchOrder
    }
  }
}
