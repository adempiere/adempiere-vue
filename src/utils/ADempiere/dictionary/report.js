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

import language from '@/lang'
import store from '@/store'

// utils and helpers methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

/**
 * Suppoerted render files
 */
export const viewerSupportedFormats = [
  'csv',
  'html',
  'pdf',
  'ssv',
  'txt',
  'xls',
  'xlsx',
  'xml'
]

export const reportFormatsList = [
  'arxml',
  'csv',
  'pdf',
  'ps',
  'ssv',
  'txt',
  'xls',
  'xlsx',
  'xml'
]

export const runReport = {
  name: language.t('actionMenu.generateReport'),
  description: language.t('actionMenu.generateDefaultReport'),
  enabled: () => {
    // always active
    return true
  },
  svg: false,
  icon: 'el-icon-document',
  actionName: 'runReport',
  uuid: null,
  runReport: ({ containerUuid }) => {
    store.dispatch('startReport', {
      containerUuid
    })
  }
}

export const runReportAs = {
  name: language.t('actionMenu.generateReportAs'),
  description: language.t('actionMenu.generateReportAsOtherFormat'),
  enabled: ({ containerUuid }) => {
    return !isEmptyValue(store.getters.getStoredReportExportTypes(containerUuid))
  },
  svg: false,
  icon: 'el-icon-document',
  actionName: 'runReportAs',
  uuid: null,
  childs: [],
  runReportAs: ({ containerUuid }) => {
    store.dispatch('startReport', {
      containerUuid
    })
  }
}

export const runReportAsPrintFormat = {
  name: language.t('actionMenu.printFormats'),
  description: language.t('actionMenu.generateReportWithPrintFormat'),
  enabled: ({ containerUuid }) => {
    return !isEmptyValue(store.getters.getPrintFormatList(containerUuid))
  },
  svg: false,
  icon: 'el-icon-printer',
  actionName: 'runReportAsPrintFormat',
  uuid: null,
  childs: [],
  runReportAsPrintFormat: ({ containerUuid }) => {
    store.dispatch('startReport', {
      containerUuid
    })
  }
}

export const runReportAsView = {
  name: language.t('actionMenu.reportViews'),
  description: language.t('actionMenu.generateWithReportView'),
  enabled: ({ containerUuid }) => {
    return !isEmptyValue(store.getters.getReportViewList(containerUuid))
  },
  svg: false,
  icon: 'el-icon-data-analysis',
  actionName: 'runReportAsView',
  uuid: null,
  childs: [],
  runReportAsView: ({ containerUuid }) => {
    store.dispatch('startReport', {
      containerUuid
    })
  }
}

/**
 * Only used with report viewer
 */
export const changeParameters = {
  name: language.t('actionMenu.changeParameters'),
  description: language.t('actionMenu.changeParameters'),
  // enabled: true,
  enabled: ({ root }) => {
    if (root.$route.name === 'Report Viewer') {
      return true
    }
    return false
  },
  svg: false,
  icon: 'el-icon-set-up',
  actionName: 'runReportAsView',
  uuid: null,
  childs: [],
  runReportAsView: ({ containerUuid }) => {
    store.dispatch('startReport', {
      containerUuid
    })
  }
}
