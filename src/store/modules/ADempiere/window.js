import {
  getWindow as getWindowMetadata,
  getTab as getTabMetadata
} from '@/api/ADempiere/dictionary'
import { showMessage } from '@/utils/ADempiere/notification'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import language from '@/lang'
import router from '@/router'
import { generateField } from '@/utils/ADempiere/dictionaryUtils'
import { getFieldTemplate } from '@/utils/ADempiere/lookupFactory'

const initStateWindow = {
  window: [],
  windowIndex: 0
}

const window = {
  state: initStateWindow,
  mutations: {
    addWindow(state, payload) {
      state.window.push(payload)
      state.windowIndex++
    },
    dictionaryResetCacheWindow(state) {
      state = initStateWindow
    },
    setCurrentTab(state, payload) {
      payload.window.currentTab = payload.tab
      payload.window.currentTabUuid = payload.tab.uuid
    },
    changeWindowAttribute(state, payload) {
      let value = payload.attributeValue
      if (payload.attributeNameControl) {
        value = payload.window[payload.attributeNameControl]
      }
      payload.window[payload.attributeName] = value
    },
    changeTabAttribute(state, payload) {
      let value = payload.attributeValue
      if (payload.attributeNameControl) {
        value = payload.tab[payload.attributeNameControl]
      }
      payload.tab[payload.attributeName] = value
    }
  },
  actions: {
    getWindowFromServer({ commit, state, dispatch }, {
      windowUuid,
      routeToDelete
    }) {
      return getWindowMetadata(windowUuid)
        .then(responseWindow => {
          const firstTabTableName = responseWindow.tabsList[0].tableName
          const firstTabUuid = responseWindow.tabsList[0].uuid
          const tabsListParent = []
          const tabsListChildren = []

          const tabsSequence = []
          // TODO Add source tab on the server for tabs Translation and Sort
          const tabs = responseWindow.tabsList.filter(itemTab => {
            if (itemTab.isSortTab) {
              // TODO: Add convert tab as process function
              tabsSequence.push({
                uuid: itemTab.uuid,
                id: itemTab.id,
                parentUuid: windowUuid,
                containerUuid: itemTab.uuid,
                parentTabUuid: itemTab.parentTabUuid,
                panelType: 'window',
                type: 'sequence',
                isSortTab: itemTab.isSortTab,
                name: itemTab.name,
                description: itemTab.description,
                tableName: itemTab.tableName,
                sortOrderColumnName: itemTab.sortOrderColumnName, // order column
                sortYesNoColumnName: itemTab.sortYesNoColumnName // included column
              })
            }
            // TODO: Add support to isAdvancedTab, isTranslationTab and isHasTree
            return !itemTab.isTranslationTab
          }).map((tabItem, index, list) => {
            // let tab = tabItem
            const tab = {
              ...tabItem,
              containerUuid: tabItem.uuid,
              parentUuid: windowUuid,
              windowUuid,
              tabGroup: tabItem.fieldGroup,
              firstTabUuid,
              // relations
              isParentTab: Boolean(firstTabTableName === tabItem.tableName),
              // app properties
              isAssociatedTabSequence: false, // show modal with order tab
              isShowedRecordNavigation: !(tabItem.isSingleRow),
              isLoadFieldsList: false,
              index
            }
            delete tab.processesList

            // action is dispatch used in vuex
            let actions = []
            actions.push({
              // action to set default values and enable fields not isUpdateable
              name: language.t('window.newRecord'),
              processName: language.t('window.newRecord'),
              type: 'dataAction',
              action: 'resetPanelToNew',
              uuidParent: windowUuid,
              disabled: !tab.isInsertRecord || tab.isReadOnly
            }, {
              // action to delete record selected
              name: language.t('window.deleteRecord'),
              processName: language.t('window.deleteRecord'),
              type: 'dataAction',
              action: 'deleteEntity',
              uuidParent: windowUuid,
              disabled: tab.isReadOnly
            }, {
              // action to undo create, update, delete record
              name: language.t('data.undo'),
              processName: language.t('data.undo'),
              type: 'dataAction',
              action: 'undoModifyData',
              uuidParent: windowUuid,
              disabled: false
            }, {
              name: language.t('data.lockRecord'),
              processName: language.t('data.lockRecord'),
              type: 'dataAction',
              action: 'lockRecord',
              disabled: false,
              hidden: true,
              tableName: '',
              recordId: null
            }, {
              name: language.t('data.unlockRecord'),
              processName: language.t('data.unlockRecord'),
              type: 'dataAction',
              action: 'unlockRecord',
              disabled: false,
              hidden: true,
              tableName: '',
              recordId: null
            })

            if (tab.isSortTab) {
              const tabParent = list.find(itemTab => itemTab.tableName === tab.tableName && !itemTab.isSortTab)
              if (tabParent) {
                tab.tabAssociatedUuid = tabParent.uuid // tab source uuid
                tab.tabAssociatedName = tabParent.name // tab source name
              }
            } else {
              // add tabs sequence associated as process in tab source
              let orderTabs = tabsSequence.filter(itemTab => itemTab.tableName === tab.tableName)
              if (orderTabs.length) {
                orderTabs = orderTabs.map(itemTab => {
                  return {
                    ...itemTab,
                    // appication attributes
                    tabAssociatedUuid: tab.uuid, // tab source
                    tabAssociatedName: tab.name, // tab source
                    action: 'orderSequence',
                    panelType: 'window',
                    type: 'application'
                  }
                })
                actions = actions.concat(orderTabs)
                tab.isAssociatedTabSequence = true
                tab.tabsOrder = orderTabs
              }
            }

            // get processess associated in tab
            if (tabItem.processesList && tabItem.processesList.length) {
              const processList = tabItem.processesList.map(processItem => {
                // TODO: No list of parameters
                // add process associated in vuex store
                // dispatch('addProcessAssociated', {
                //   processToGenerate: processItem,
                //   containerUuidAssociated: tabItem.uuid
                // })
                return {
                  id: processItem.id,
                  uuid: processItem.uuid,
                  name: processItem.name,
                  type: 'process',
                  panelType: 'process',
                  description: processItem.description,
                  help: processItem.help,
                  isReport: processItem.isReport,
                  isDirectPrint: processItem.isDirectPrint,
                  containerUuidAssociated: tabItem.uuid,
                  parentUuidAssociated: windowUuid,
                  panelTypeAssociated: 'window'
                }
              })
              actions = actions.concat(processList)
            }
            //  Add process menu
            dispatch('setContextMenu', {
              containerUuid: tab.uuid,
              actions
            })

            if (tab.isParentTab) {
              tabsListParent.push(tab)
              return tab
            }
            if (!tab.isSortTab) {
              tabsListChildren.push(tab)
            }
            return tab
          })

          const newWindow = {
            ...responseWindow,
            tabsList: tabs,
            currentTab: tabsListParent[0],
            tabsListParent,
            tabsListChildren,
            // app attributes
            currentTabUuid: tabsListParent[0].uuid,
            firstTab: tabsListParent[0],
            firstTabUuid,
            windowIndex: state.windowIndex + 1,
            // App properties
            isShowedTabsChildren: Boolean(tabsListChildren.length),
            isShowedRecordNavigation: undefined,
            isShowedAdvancedQuery: false
          }
          commit('addWindow', newWindow)
          return newWindow
        })
        .catch(error => {
          router.push({ path: '/dashboard' })
          dispatch('tagsView/delView', routeToDelete)
          showMessage({
            message: language.t('login.unexpectedError'),
            type: 'error'
          })
          console.warn(`Dictionary Window (State Window) - Error ${error.code}: ${error.message}.`)
        })
    },
    getTabAndFieldFromServer({ dispatch, getters }, {
      parentUuid,
      containerUuid,
      panelType = 'window',
      panelMetadata,
      isAdvancedQuery = false
    }) {
      return new Promise(resolve => {
        getTabMetadata(containerUuid)
          .then(tabResponse => {
            const additionalAttributes = {
              parentUuid,
              containerUuid,
              isShowedFromUser: true,
              panelType,
              tableName: tabResponse.tableName,
              //
              isReadOnlyFromForm: false,
              isAdvancedQuery,
              isEvaluateValueChanges: !isAdvancedQuery
            }

            let isWithUuidField = false // indicates it contains the uuid field
            let fieldLinkColumnName
            //  Convert and add to app attributes
            const fieldsList = tabResponse.fieldsList.map((fieldItem, index) => {
              fieldItem = generateField({
                fieldToGenerate: fieldItem,
                moreAttributes: {
                  ...additionalAttributes,
                  fieldListIndex: index
                }
              })

              if (!isWithUuidField && fieldItem.columnName === 'UUID') {
                isWithUuidField = true
              }

              if (fieldItem.isParent) {
                fieldLinkColumnName = fieldItem.columnName
              }

              return fieldItem
            })

            let isTabsChildren = false
            if (!isAdvancedQuery) {
              const window = getters.getWindow(parentUuid)
              isTabsChildren = Boolean(window.tabsListChildren.length)
            }

            if (!isWithUuidField) {
              const fieldUuid = getFieldTemplate({
                ...additionalAttributes,
                isShowedFromUser: false,
                name: 'UUID',
                columnName: 'UUID',
                componentPath: 'FieldText'
              })
              fieldsList.push(fieldUuid)
            }

            if (isEmptyValue(panelMetadata)) {
              panelMetadata = getters.getTab(parentUuid, containerUuid)
            }
            //  Panel for save on store
            const panel = {
              ...panelMetadata,
              isAdvancedQuery,
              fieldLinkColumnName,
              fieldList: fieldsList,
              panelType,
              // app attributes
              isLoadFieldsList: true,
              isShowedTotals: false,
              isTabsChildren // to delete records assiciated
            }

            dispatch('addPanel', panel)
            resolve(panel)

            dispatch('changeTabAttribute', {
              parentUuid,
              containerUuid,
              tab: panelMetadata,
              attributeName: 'isLoadFieldsList',
              attributeValue: true
            })
          })
          .catch(error => {
            showMessage({
              message: language.t('login.unexpectedError'),
              type: 'error'
            })
            console.warn(`Dictionary Tab (State Window) - Error ${error.code}: ${error.message}.`)
          })
      })
    },
    setCurrentTab({ commit, getters }, {
      parentUuid,
      containerUuid,
      window,
      tab
    }) {
      if (isEmptyValue(window)) {
        window = getters.getWindow(parentUuid)
      }
      if (isEmptyValue(tab)) {
        tab = window.tabsList.find(itemTab => itemTab.uuid === containerUuid)
      }

      commit('setCurrentTab', {
        window,
        tab
      })
    },
    changeWindowAttribute({ commit, getters }, {
      parentUuid,
      window,
      attributeName,
      attributeNameControl,
      attributeValue
    }) {
      if (isEmptyValue(window)) {
        window = getters.getWindow(parentUuid)
      }

      commit('changeWindowAttribute', {
        parentUuid,
        window,
        attributeName,
        attributeNameControl,
        attributeValue
      })
    },
    changeTabAttribute({ commit, getters }, {
      parentUuid,
      containerUuid,
      tab,
      attributeName,
      attributeNameControl,
      attributeValue
    }) {
      if (isEmptyValue(tab)) {
        tab = getters.getTab(parentUuid, containerUuid)
      }
      commit('changeTabAttribute', {
        tab,
        attributeName,
        attributeValue,
        attributeNameControl
      })
    }
  },
  getters: {
    getWindow: (state) => (windowUuid) => {
      return state.window.find(
        item => item.uuid === windowUuid
      )
    },
    getIsShowedRecordNavigation: (state, getters) => (windowUuid) => {
      const window = getters.getWindow(windowUuid)
      if (window) {
        return window.isShowedRecordNavigation
      }
      return window
    },
    getTab: (state, getters) => (windowUuid, tabUuid) => {
      const window = getters.getWindow(windowUuid)
      if (window) {
        return window.tabsList.find(tabItem => {
          return tabItem.uuid === tabUuid
        })
      }
      return window
    },
    getCurrentTab: (state, getters) => (windowUuid) => {
      const window = getters.getWindow(windowUuid)
      if (window) {
        return window.tabsList.find(tabItem => {
          return tabItem.uuid === window.currentTabUuid
        })
      }
      return {
        isInsertRecord: false
      }
    },
    getTableNameFromTab: (state, getters) => (windowUuid, tabUuid) => {
      return getters.getTab(windowUuid, tabUuid).tableName
    }
  }
}

export default window
