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

import { defineComponent, computed, onMounted, ref } from '@vue/composition-api'
import LoadingView from '@/components/ADempiere/LoadingView'
import { zoomIn } from '@/utils/ADempiere/coreUtils.js'

export default defineComponent({
  name: 'ProcessActivity',

  components: {
    LoadingView
  },

  setup(props, { root }) {
    const processActivity = ref([])
    const recordCount = ref(0)
    const pageToken = ref('')
    const pageSize = ref(50)

    // process local is running
    const getterAllInExecution = computed(() => {
      return root.$store.getters.getAllInExecution
    })

    // process local and send with response
    const getterAllFinishProcess = computed(() => {
      return root.$store.getters.getAllFinishProcess
    })

    // session process from server
    const getterAllSessionProcess = computed(() => {
      return root.$store.getters.getAllSessionProcess
    })

    // all process
    const getRunProcessAll = computed(() => {
      const processAll = [].concat(
        getterAllSessionProcess.value,
        getterAllInExecution.value,
        getterAllFinishProcess.value
      )
      const processAllReturned = []
      processAll.forEach(element => {
        // let processMetadataReturned = {}
        if (element !== undefined) {
          const processMetadataReturned = {}
          let infoMetadata = !root.isEmptyValue(element.output) ? findStoredReportUuid(element.uuid) : getProcessMetadata(element.uuid)
          if (!infoMetadata) {
            infoMetadata = {}
          }

          Object.assign(processMetadataReturned, element, infoMetadata)
          processMetadataReturned.parametersList = element.parametersList
          const indexRepeat = processAllReturned.findIndex(item => {
            return item.instanceUuid === element.instanceUuid && !root.isEmptyValue(element.instanceUuid)
          })
          if (indexRepeat > -1) {
            // update attributes in exists process to return
            // Object.assign(processAllReturned[indexRepeat], processMetadataReturned)
            const other = Object.assign(processMetadataReturned, processAllReturned[indexRepeat])
            processAllReturned[indexRepeat] = other
          }
          processAllReturned.push(processMetadataReturned)
        }
      })

      return processAllReturned.sort((a, b) => {
        // sort by most recently date
        return new Date(b.lastRun) - new Date(a.lastRun)
      })
    })
    const getProcessLog = computed(() => {
      return getRunProcessAll.value.filter(element => {
        const { isError, isProcessing } = element
        if (!root.isEmptyValue(isError) && !root.isEmptyValue(isProcessing)) {
          return element
        }
      })
    })
    const getProcessLogSuccess = computed(() => {
      return getProcessLog.value.filter(element => {
        const { isError, output, isReport, isProcessing } = element
        if ((!isError && !isProcessing) || (isError && !isProcessing && isReport && !root.isEmptyValue(output.output))) {
          return element
        }
      })
    })
    const getProcessLogError = computed(() => {
      return getProcessLog.value.filter(element => {
        const { isError, output, isReport, isProcessing } = element
        if ((isError && !isProcessing) || (isError && !isProcessing && isReport && root.isEmptyValue(output.output))) {
          return element
        }
      })
    })
    const getProcessLogProcessing = computed(() => {
      return getProcessLog.value.filter(element => {
        const { isProcessing } = element
        if (isProcessing) {
          return element
        }
      })
    })
    const language = computed(() => {
      return root.$store.getters.language
    })
    const isLoadProcess = ref(true)
    onMounted(() => {
      root.$store.dispatch('getSessionProcessFromServer', {
        pageToken: pageToken.value,
        pageSize: pageSize.value
      })
        .then(response => {
          pageToken.value = response.nextPageToken
        })
        .finally(() => {
          isLoadProcess.value = false
        })
    })
    const getProcessMetadata = (uuid) => {
      return root.$store.getters.getStoredProcess(uuid)
    }
    const findStoredReportUuid = (uuid) => {
      return root.$store.getters.getStoredReport(uuid)
    }
    function handleCommand(activity) {
      if (activity.command === 'seeReport') {
        root.$router.push({
          name: 'Report Viewer',
          params: {
            reportUuid: activity.uuid,
            instanceUuid: activity.instanceUuid,
            fileName: activity.output.fileName,
            name: activity.output.name
          }
        }, () => {})
      } else if (activity.command === 'zoomIn') {
        zoomIn({
          uuid: activity.uuid,
          query: {
            ...root.$route.query,
            ...activity.parametersList
          }
        })
      }
    }

    const checkStatus = ({ isError, isProcessing, output, isReport }) => {
      const status = {
        text: root.$t('notifications.completed'),
        type: 'success',
        color: '#67C23A'
      }
      // is executing
      if (isProcessing) {
        status.text = root.$t('notifications.processing')
        status.type = 'info'
        status.color = '#909399'
        return status
      }
      // is with error
      if (isError) {
        status.text = root.$t('notifications.error')
        status.type = 'danger'
        status.color = '#F56C6C'
        return status
      }
      // is completed
      return status
    }

    const generateTitle = (title) => {
      const hasKey = root.$te('table.ProcessActivity.' + title)
      if (hasKey) {
        // $t : this method from vue-i18n, inject in @/lang/index.js
        const translatedTitle = root.$t('table.ProcessActivity.' + title)
        return translatedTitle
      }
      return title
    }
    const findTranslation = (title) => {
      const hasKey = root.$te('views.' + title)
      if (hasKey) {
        // $t : this method from vue-i18n, inject in @/lang/index.js
        const translatedTitle = root.$t('views.' + title)
        return translatedTitle
      }
      return title
    }

    const translateDate = (value) => {
      return root.$d(new Date(value), 'long', language.value)
    }
    const currentKey = ref(0)
    const showkey = (value) => {
      if (value === currentKey.value) {
        currentKey.value = 999
      } else {
        currentKey.value = value
      }
    }

    return {
      processActivity,
      recordCount,
      pageToken,
      isLoadProcess,
      currentKey,
      pageSize,
      // computeds
      getRunProcessAll,
      getProcessLog,
      getProcessLogSuccess,
      getProcessLogError,
      getProcessLogProcessing,
      language,
      // methods
      showkey,
      handleCommand,
      checkStatus,
      generateTitle,
      findTranslation,
      translateDate
    }
  }
})
