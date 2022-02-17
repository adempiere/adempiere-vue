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
  enabled: true,
  svg: false,
  icon: 'el-icon-document',
  actionName: 'runReport',
  uuid: null,
  runReport: ({ root, containerUuid }) => {
    root.$store.dispatch('startReport', {
      containerUuid
    })
  }
}

export const runReportAs = {
  name: language.t('actionMenu.generateReportAs'),
  description: language.t('actionMenu.generateReportAsOtherFormat'),
  enabled: true,
  svg: false,
  icon: 'el-icon-document',
  actionName: 'runReportAs',
  uuid: null,
  childs: [],
  runReportAs: ({ root, containerUuid }) => {
    root.$store.dispatch('startReport', {
      containerUuid
    })
  }
}

export const runReportAsPrintFormat = {
  name: language.t('actionMenu.printFormats'),
  description: language.t('actionMenu.generateReportWithPrintFormat'),
  enabled: true,
  svg: false,
  icon: 'el-icon-printer',
  actionName: 'runReportAsPrintFormat',
  uuid: null,
  childs: [],
  runReportAsPrintFormat: ({ root, containerUuid }) => {
    root.$store.dispatch('startReport', {
      containerUuid
    })
  }
}
