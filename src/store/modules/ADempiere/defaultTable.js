import language from '@/lang'

const defaultTable = {
  tableOption: language.t('table.dataTable.showMinimalistView')
}

export default {
  state: defaultTable,
  mutations: {
    setTableOption(state, payload) {
      state.tableOption = payload
    }
  },
  actions: {
    selectOption({ commit }, option) {
      commit('setTableOption', option)
    }
  },
  getters: {
    getTableOption: (state) => {
      return state.tableOption
    }
  }
}
