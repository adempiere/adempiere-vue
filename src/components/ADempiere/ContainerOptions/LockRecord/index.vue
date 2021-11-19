<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com www.erpya.com
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <https:www.gnu.org/licenses/>.
-->

<template>
  <span v-if="isFirstTab" key="withTooltip">
    <el-tooltip
      v-if="isFirstTab"
      :content="tooltipText"
      placement="top"
    >
      <el-button v-if="isLocked" type="text" @click="unLockRecord()">
        <i
          class="el-icon-lock"
          style="font-size: 15px; color: black;"
        />
      </el-button>
      <el-button v-else type="text" @click="lockRecord()">
        <i
          class="el-icon-unlock"
          style="font-size: 15px; color: black;"
        />
      </el-button>
    </el-tooltip>

    <slot name="prefix" />

    <span :class="{ 'locked-record': isLocked }">
      {{ tabName }}
    </span>

    <slot name="sufix" />
  </span>

  <span v-else key="onlyName">
    <slot name="prefix" />

    {{ tabName }}

    <slot name="sufix" />
  </span>
</template>

<script>
import { defineComponent, computed, ref, watch } from '@vue/composition-api'

export default defineComponent({
  name: 'LockRecord',

  props: {
    tabUuid: {
      type: String,
      required: true
    },
    tabPosition: {
      type: Number,
      default: 0
    },
    tabName: {
      type: String,
      required: true
    },
    tableName: {
      type: String,
      required: true
    },
    isActiveTab: {
      type: Boolean,
      required: true
    }
  },

  setup(props, { root }) {
    const containerUuid = props.tabUuid
    const tableName = props.tableName

    const isFirstTab = computed(() => {
      return props.tabPosition === 0
    })

    const isLocked = ref(false)

    const isValidUuid = (recordUuid) => {
      return !root.isEmptyValue(recordUuid) && recordUuid !== 'create-new'
    }

    const tooltipText = computed(() => {
      if (isLocked.value) {
        return root.$t('data.unlockRecord')
      }
      return root.$t('data.lockRecord')
    })

    const storedPrivateAccess = computed(() => {
      const { recordUuid } = getRecordKeys()

      return root.$store.getters.getStoredPrivateAccess({
        tableName,
        recordUuid
      })
    })

    const lockRecord = () => {
      const { recordId, recordUuid } = getRecordKeys()

      root.$store.dispatch('lockRecordFromServer', {
        tableName,
        recordId,
        recordUuid
      })
        .then(isLockedResponse => {
          isLocked.value = isLockedResponse
        })
    }

    const unLockRecord = () => {
      const { recordId, recordUuid } = getRecordKeys()

      root.$store.dispatch('unlockRecordFromServer', {
        tableName,
        recordId,
        recordUuid
      })
        .then(isUnLockedResponse => {
          isLocked.value = isUnLockedResponse
        })
    }

    const record = computed(() => {
      if (isFirstTab) {
        const recordUuid = root.$route.query.action
        if (isValidUuid(recordUuid)) {
          return root.$store.getters.getRowData({
            containerUuid,
            recordUuid
          })
        }
      }

      return undefined
    })

    const getRecordKeys = () => {
      let recordId
      let recordUuid
      const recordRow = record.value
      if (!root.isEmptyValue(recordRow)) {
        recordId = recordRow[tableName + '_ID']
        recordUuid = recordRow.UUID
      } else {
        if (isValidUuid(root.$route.query.action)) {
          recordUuid = root.$route.query.action
        }
      }

      return {
        recordId,
        recordUuid
      }
    }

    const isGettingRecordAccess = ref(false)

    const getPrivateAccess = () => {
      const { recordId, recordUuid } = getRecordKeys()

      if (root.isEmptyValue(recordId) && root.isEmptyValue(recordUuid)) {
        return
      }

      // get from vuex stored
      if (!root.isEmptyValue(storedPrivateAccess.value)) {
        isLocked.value = storedPrivateAccess.value.isLocked
        return
      }

      isGettingRecordAccess.value = true

      // get from server
      root.$store.dispatch('getPrivateAccessFromServer', {
        tableName,
        recordId,
        recordUuid
      })
        .then(privateAccessResponse => {
          isLocked.value = privateAccessResponse
        })
        .finally(() => {
          isGettingRecordAccess.value = false
        })
    }

    // timer to execute the request between times
    const timeOut = ref(() => {})

    watch(() => root.$route.query.action, (newValue, oldValue) => {
      if (props.isActiveTab && isValidUuid(newValue) && !isGettingRecordAccess.value) {
        clearTimeout(timeOut.value)

        timeOut.value = setTimeout(() => {
          // get records
          getPrivateAccess()
        }, 1000)
      }
    })

    return {
      isLocked,
      // computed
      isFirstTab,
      tooltipText,
      // methods
      lockRecord,
      unLockRecord
    }
  }
})
</script>

<style lang="scss">
.locked-record {
  color: red !important;
}
</style>
