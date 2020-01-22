import { getLanguage } from '@/lang/index'
import { getToken } from '@/utils/auth'
import BusinessData from '@adempiere/grpc-data-client'
import { HOST_GRPC_DATA } from '@/api/ADempiere/constants'

// Get Instance for connection
function Instance() {
  return new BusinessData(
    HOST_GRPC_DATA,
    getToken(),
    getLanguage() || 'en_US'
  )
}

/**
 * Converted the gRPC value to the value needed
 * @param {object} grpcValue Value get of gRPC
 * @returns {mixed}
 */
export function convertValueFromGRPC(grpcValue) {
  return Instance.call(this).convertValueFromGRPC(grpcValue)
}

/**
 * Create entity
 * @param {string}  parameters.tableName
 * @param {array}   parameters.attributesList
 */
export function createEntity({ tableName, attributesList }) {
  return Instance.call(this).createEntity({
    tableName,
    attributesList
  })
}

/**
 * Update entity
 * @param {string}  tableName
 * @param {number}  recordId
 * @param {string}  recordUuid
 * @param {array}   attributesList
 */
export function updateEntity({ tableName, recordId, recordUuid, attributesList }) {
  return Instance.call(this).updateEntity({
    tableName,
    recordId,
    recordUuid,
    attributesList
  })
}

/**
 * Delete entity
 * @param {string}  tableName
 * @param {number}  recordId
 * @param {string}  recordUuid
 */
export function deleteEntity({ tableName, recordId, recordUuid }) {
  return Instance.call(this).deleteEntity({
    tableName,
    recordId,
    recordUuid
  })
}

export function getEntity({ tableName, recordId, recordUuid }) {
  return Instance.call(this).requestEntity({
    tableName,
    recordId,
    recordUuid
  })
}

/**
 * Object List from window
 * @param {string} tableName
 * @param {string} query
 * @param {string} whereClause
 * @param {array}  conditions
 * @param {string} orderByClause
 * @param {string} nextPageToken
 */
export function getEntitiesList({
  tableName,
  query,
  whereClause,
  conditions: conditionsList = [],
  orderByClause,
  nextPageToken: pageToken,
  pageSize
}) {
  return Instance.call(this).requestEntitiesList({
    tableName,
    query,
    whereClause,
    conditionsList,
    orderByClause,
    pageToken,
    pageSize
  })
}

/**
 * Rollback entity (Create, Update, Delete)
 * @param {string} tableName
 * @param {number} recordId
 * @param {string} eventType
 */
export function rollbackEntity({
  tableName,
  recordId,
  eventType
}) {
  return Instance.call(this).rollbackEntityRequest({
    tableName,
    recordId,
    eventTypeExecuted: eventType
  })
}

/**
 * Request a Lookup data from Reference
 * The main attributes that function hope are:
 * @param {string} tableName
 * @param {string} directQuery
 * @param {string|number} value
 */
export function getLookup({
  tableName,
  directQuery,
  value
}) {
  return Instance.call(this).requestLookupFromReference({
    tableName,
    directQuery,
    value
  })
}

/**
 * Request a Lookup list data from Reference
 * The main attributes that function hope are:
 * @param {string} tableName
 * @param {string} query
 */
export function getLookupList({
  tableName,
  query,
  pageToken,
  pageSize
}) {
  return Instance.call(this).requestListLookupFromReference({
    tableName,
    query,
    pageToken,
    pageSize
  })
}

/**
 * Request a process
 * This function allows follow structure:
 * @param {string}  uuid, uuid from process to run
 * @param {number}  reportType
 * @param {number}  tableName, table name of tab, used only window
 * @param {number}  recordId, record identifier, used only window
 * @param {array}   parameters, parameters from process [{ columnName, value }]
 * @param {array}   selection, selection records, used only browser
      [{
          selectionId,
          selectionValues: [{ columnName, value }]
      }]
 * @param {string}  printFormatUuid
 */
export function runProcess({ uuid, reportType, tableName, recordId, parameters: parametersList = [], selection: selectionsList = [], printFormatUuid }) {
  //  Run Process
  return Instance.call(this).requestRunProcess({
    uuid,
    reportType,
    tableName,
    recordId,
    parametersList,
    selectionsList,
    printFormatUuid
  })
}

/**
 * Request a browser search
 * @param {string} uuid
 * @param {string} query
 * @param {string} whereClause
 * @param {string} orderByClause
 * @param {string} nextPageToken
 * @param {array}  parameters, This allows follow structure:
 * [{
 *     columnName,
 *     value
 * }]
 */
export function getBrowserSearch({ uuid, parameters: parametersList = [], query, whereClause, orderByClause, nextPageToken: pageToken, pageSize }) {
  //  Run browser
  return Instance.call(this).requestListBrowserSearch({
    uuid,
    parametersList,
    query,
    whereClause,
    orderByClause,
    pageToken,
    pageSize
  })
}

// Request a Process Activity list
export function requestProcessActivity({ pageToken, pageSize }) {
  //  Get Process Activity
  return Instance.call(this).requestListProcessesLogs({ pageToken, pageSize })
}

export function getRecentItems({ pageToken, pageSize }) {
  return Instance.call(this).requestListRecentItems({ pageToken, pageSize })
}

/**
 * Reference List from Window
 * @param {string}  tableName
 * @param {string}  windowUuid
 * @param {string}  recordUuid
 * @param {number}  recordId
 */
export function getReferencesList({ windowUuid, tableName, recordId, recordUuid, pageToken, pageSize }) {
  return Instance.call(this).requestListReferences({
    windowUuid,
    tableName,
    recordId,
    recordUuid,
    pageToken,
    pageSize
  })
}

/**
 * Run callout request
 * @param {string}  windowUuid
 * @param {number}  windowNo
 * @param {string}  tabUuid
 * @param {string}  tableName
 * @param {string}  columnName
 * @param {mixed}   value
 * @param {mixed}   oldValue
 * @param {string}  callout
 * @param {array}   attributesList
 * @returns {Map} Entity
 */
export function runCallOutRequest({ windowUuid, windowNo, tabUuid, tableName, columnName, value, oldValue, callout, attributesList = [] }) {
  return Instance.call(this).runCalloutRequest({
    windowUuid,
    windowNo,
    tabUuid,
    tableName,
    columnName,
    value,
    oldValue,
    callout,
    attributesList
  })
}

export function getDefaultValueFromServer(query) {
  return Instance.call(this).getDefaultValue(query)
}

export function getContextInfoValueFromServer({ uuid, query }) {
  return Instance.call(this).getContextInfoValue({ uuid, query })
}

export function getPrivateAccessFromServer({ tableName, recordId, userUuid }) {
  return Instance.call(this).getPrivateAccess({
    tableName,
    recordId,
    userUuid
  })
}

export function lockPrivateAccessFromServer({ tableName, recordId, userUuid }) {
  return Instance.call(this).lockPrivateAccess({
    tableName,
    recordId,
    userUuid
  })
}

export function unlockPrivateAccessFromServer({ tableName, recordId, userUuid }) {
  return Instance.call(this).unlockPrivateAccess({
    tableName,
    recordId,
    userUuid
  })
}

/**
 * Request Favorites List
 * @param {string} userUuid
 */
export function getFavoritesFromServer({ userUuid, pageToken, pageSize }) {
  return Instance.call(this).requestListFavorites({ userUuid, pageToken, pageSize })
}

export function getPendingDocumentsFromServer({ userUuid, roleUuid, pageToken, pageSize }) {
  return Instance.call(this).requestListPendingDocuments({
    userUuid,
    roleUuid,
    pageToken,
    pageSize
  })
}

/**
 * Request Pending Documents List
 * @param {string} tableName
 * @param {string} processUuid
 */
export function requestReportViews({ tableName, processUuid, pageToken, pageSize }) {
  return Instance.call(this).requestListReportViews({
    tableName,
    processUuid,
    pageToken,
    pageSize
  })
}

export function requestPrintFormats({ tableName, reportViewUuid, processUuid, pageToken, pageSize }) {
  return Instance.call(this).requestListPrintFormats({
    tableName,
    reportViewUuid,
    processUuid,
    pageToken,
    pageSize
  })
}

export function requestLisDashboards({ roleUuid, pageToken, pageSize }) {
  return Instance.call(this).requestListDashboards({
    roleUuid,
    pageToken,
    pageSize
  })
}

export function requestLanguages({ pageToken, pageSize }) {
  return Instance.call(this).requestListLanguages({ pageToken, pageSize })
}

/**
 * Request translations
 * @param {string} tableName
 * @param {string} language
 * @param {string} recordUuid
 * @param {integer} recordId
 */
export function requestTranslations({ tableName, language, recordUuid, recordId, pageToken, pageSize }) {
  return Instance.call(this).requestTranslations({
    tableName,
    recordUuid,
    recordId,
    language,
    pageToken,
    pageSize
  })
}

export function requestDrillTables({ tableName, pageToken, pageSize }) {
  return Instance.call(this).requestListDrillTables({
    tableName,
    pageToken,
    pageSize
  })
}

export function getReportOutput({
  parametersList,
  tableName,
  printFormatUuid,
  reportViewUuid,
  isSummary,
  reportName,
  reportType
}) {
  return Instance.call(this).getReportOutput({
    parametersList,
    tableName,
    printFormatUuid,
    reportViewUuid,
    isSummary,
    reportName,
    reportType
  })
}

export function requestListRecordsLogs({
  tableName,
  recordId,
  pageToken,
  pageSize
}) {
  console.log(tableName,
    recordId,
    pageToken,
    pageSize)
  return Instance.call(this).requestListRecordsLogs({
    tableName,
    recordId,
    pageToken,
    pageSize
  })
}

export function requestListWorkflowsLogs({
  tableName,
  recordId,
  pageToken,
  pageSize
}) {
  return Instance.call(this).requestListWorkflowsLogs({
    tableName,
    recordId,
    pageToken,
    pageSize
  })
}
