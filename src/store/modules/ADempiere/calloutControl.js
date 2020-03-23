import { runCallOutRequest } from '@/api/ADempiere/data'
import { showMessage } from '@/utils/ADempiere/notification'
import language from '@/lang'

const callOutControl = {
  actions: {
    getCallout({ rootGetters, dispatch }, {
      parentUuid,
      containerUuid,
      callout,
      tableName,
      columnName,
      withOutColumnNames = [],
      inTable = false,
      row,
      value,
      oldValue
    }) {
      const window = rootGetters.getWindow(parentUuid)
      const attributesList = rootGetters.getParametersToServer({
        containerUuid,
        row
      })

      return runCallOutRequest({
        windowUuid: parentUuid,
        tabUuid: containerUuid,
        tableName,
        columnName,
        value,
        oldValue,
        callout,
        attributesList,
        windowNo: window.windowIndex
      })
        .then(calloutResponse => {
          if (inTable) {
            const newValues = {
              ...row,
              ...calloutResponse.values
            }
            dispatch('notifyRowTableChange', {
              parentUuid,
              containerUuid,
              row: newValues,
              isEdit: true
            })
          } else {
            dispatch('notifyPanelChange', {
              parentUuid,
              containerUuid,
              panelType: 'window',
              newValues: calloutResponse.values,
              isSendToServer: false,
              withOutColumnNames,
              isSendCallout: false,
              isChangeFromCallout: true
            })
          }
          return calloutResponse.values
        })
        .catch(error => {
          showMessage({
            message: error.message || language.t('window.callout.error'),
            type: 'error'
          })
          console.warn(`Field ${columnName} error callout. Code ${error.code}: ${error.message}`)
        })
    }
  }
}

export default callOutControl
