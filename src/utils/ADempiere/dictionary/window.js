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

// utils and helpers methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { generatePanelAndFields } from '@/utils/ADempiere/dictionary/panel.js'
import { isHiddenField } from '@/utils/ADempiere/references.js'

/**
 * Is displayed field in panel single record
 */
export function isDisplayedField({ isDisplayed, isDisplayedFromLogic, isActive, displayType }) {
  // button field not showed
  if (isHiddenField(displayType)) {
    return false
  }

  // verify if field is active and displayed
  return isActive && isDisplayed && isDisplayedFromLogic
}

/**
 * Tab manager mandatory logic
 * @param {boolean} isMandatoryFromLogic
 * @returns {boolean}
 */
export function isMandatoryField({ isMandatory, isMandatoryFromLogic }) {
  return isMandatory || isMandatoryFromLogic
}

/**
 * Is read only field in panel single record
 * @param {boolean} isReadOnly
 * @param {boolean} isReadOnlyFromLogic
 * @returns {boolean}
 */
export function isReadOnlyField({ isReadOnly, isReadOnlyFromLogic }) {
  return isReadOnly || isReadOnlyFromLogic
}

/**
 * Is displayed column in table multi record
 */
export function isDisplayedColumn({ isDisplayedGrid, isDisplayedFromLogic, isActive, isKey, displayType }) {
  // key or button field not showed
  if (isKey || isHiddenField(displayType)) {
    return false
  }

  // window (table) result
  return isActive && isDisplayedGrid && isDisplayedFromLogic
}

export function isMandatoryColumn({ isMandatory, isMandatoryFromLogic }) {
  return isMandatory || isMandatoryFromLogic
}

export function isReadOnlyColumn({ isReadOnly }) {
  return isReadOnly
}

/**
 * Generate window
 * @param {object} responseWindow
 * @returns {object}
 */
export function generateWindow(responseWindow) {
  const {
    tabsList, tabsListParent, tabsListChild,
    firstTab, firstTabUuid
  } = generateTabs({
    tabs: responseWindow.tabs,
    parentUuid: responseWindow.uuid
  })

  let currentTabChild = {}
  if (!isEmptyValue(tabsListChild)) {
    currentTabChild = tabsListChild[0]
  }

  const newWindow = {
    ...responseWindow,
    tabsList,
    currentTab: tabsListParent[0],
    currentTabChild,
    tabsListChild,
    tabsListParent,
    currentTabUuid: tabsListParent[0].uuid,
    firstTab,
    firstTabUuid,
    // App properties
    isShowedTabsParent: true,
    isShowedTabsChildren: true,
    isShowedRecordNavigation: undefined, // TODO: @deprecated
    isShowedAdvancedQuery: false
  }

  // delete unused property
  delete newWindow.tabs

  return newWindow
}

export function generateTabs({
  tabs,
  parentUuid
}) {
  const firstTabTableName = tabs[0].tableName
  const firstTabUuid = tabs[0].uuid

  // indexes related to visualization
  const tabsList = tabs.filter((itemTab) => {
    return !(
      itemTab.isTranslationTab || itemTab.isSortTab ||
      itemTab.isAdvancedTab || itemTab.isHasTree
    )
  }).map((tabItem, index) => {
    const isParentTab = Boolean(firstTabTableName === tabItem.tableName)
    // let tab = tabItem
    const tab = {
      ...tabItem,
      parentUuid,
      containerUuid: tabItem.uuid,
      tabGroup: tabItem.fieldGroup,
      firstTabUuid,
      // relations
      isParentTab,
      // app properties
      isShowedRecordNavigation: !(tabItem.isSingleRow || isParentTab), // TODO: @deprecated
      isShowedTableRecords: !(tabItem.isSingleRow || isParentTab),
      index // this index is not related to the index in which the tabs are displayed
    }

    return generatePanelAndFields({
      parentUuid,
      containerUuid: tabItem.uuid,
      panelMetadata: tab,
      isAddFieldUuid: true,
      isAddLinkColumn: true,
      fieldOverwrite: {
        isReadOnlyFromForm: true
      }
    })
  })

  const tabsListParent = tabsList.filter(tabItem => {
    return tabItem.isParentTab
  }).map((itemTab, tabParentIndex) => {
    return {
      ...itemTab,
      tabParentIndex
    }
  })

  // generate tabs childs
  const tabsListChild = tabsList.filter(tabItem => {
    return !tabItem.isParentTab
  }).map((itemTab, tabChildIndex) => {
    return {
      ...itemTab,
      tabChildIndex
    }
  })

  return {
    firstTabUuid,
    firstTab: tabsList[0],
    tabsListParent,
    tabsListChild,
    tabsList
  }
}
