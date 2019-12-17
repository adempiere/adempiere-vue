
import { requestLanguages } from '@/api/ADempiere'
const utils = {
  state: {
    width: 0,
    height: 0,
    splitHeight: 50,
    splitHeightTop: 0,
    widthLayout: 0,
    tempShareLink: '',
    oldAction: undefined,
    reportType: '',
    isShowedTable: false,
    recordUuidTable: 0,
    languageList: []
  },
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
    setSplitHeightTop(state, splitHeightTop) {
      state.splitHeightTop = splitHeightTop
    },
    setRecordUuidMenu(state, recordUuidTable) {
      state.recordUuidTable = recordUuidTable
    },
    setTempShareLink(state, payload) {
      state.tempShareLink = payload
    },
    setOldAction(state, payload) {
      state.oldAction = payload
    },
    setReportTypeToShareLink(state, payload) {
      state.reportType = payload
    },
    setLanguageList(state, payload) {
      state.languageList = payload
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
    setSplitHeight({ commit }, splitHeight) {
      commit('setSplitHeight', splitHeight)
    },
    setSplitHeightTop({ commit }, splitHeightTop) {
      commit('setSplitHeightTop', splitHeightTop)
    },
    setRecordUuidMenu({ commit }, recordUuidTable) {
      commit('setRecordUuidMenu', recordUuidTable)
    },
    changeShowedDetail({ dispatch }, params) {
      if (params.panelType === 'window') {
        dispatch('changeShowedDetailWindow', params)
      } else if (params.panelType === 'browser') {
        dispatch('changeShowedCriteriaBrowser', params)
      }
    },
    setTempShareLink({ commit }, parameters) {
      if (!parameters.href.includes(String(parameters.processId))) {
        commit('setTempShareLink', parameters.href)
      }
    },
    setOldAction({ commit }, value) {
      commit('setOldAction', value)
    },
    setReportTypeToShareLink({ commit }, value) {
      commit('setReportTypeToShareLink', value)
    },
    getLanguagesFromServer({ commit }) {
      return new Promise((resolve, reject) => {
        requestLanguages()
          .then(response => {
            const languageList = response.getLanguagesList().map(item => {
              return {
                language: item.getLanguage(),
                languageName: item.getLanguagename(),
                languageIso: item.getLanguageiso(),
                countryCode: item.getCountrycode(),
                isBaseLanguage: item.getIsbaselanguage(),
                isSystemLanguage: item.getIssystemlanguage(),
                isDecimalPoint: item.getIsdecimalpoint(),
                datePattern: item.getDatepattern(),
                timePattern: item.getTimepattern()
              }
            })
            commit('setLanguageList', languageList)
            resolve(languageList)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  },
  getters: {
    getWidth: (state) => {
      return state.width
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
      return state.recordUuidTable
    },
    getShowContextMenuTable: (state) => {
      const menu = state.isShowedTable.isShowedTable
      return menu
    },
    getSplitHeight: (state) => {
      const split = state.splitHeight
      var panelHeight = 0
      if (split !== 50) {
        panelHeight = split.splitHeight
      } else {
        panelHeight = 50
      }
      return panelHeight
    },
    getTempShareLink: (state) => {
      return state.tempShareLink
    },
    getOldAction: (state) => {
      return state.oldAction
    },
    getReportType: (state) => {
      return state.reportType
    },
    getLanguageList: (state) => {
      return state.languageList
    },
    getLanguageByParameter: (state) => (parameter) => {
      var list = state.languageList
      list.forEach(language => {
        if (language.hasOwnProperty(parameter)) {
          return language
        }
      })
    }
  }
}
export default utils
