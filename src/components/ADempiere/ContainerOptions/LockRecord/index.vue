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
  <span v-if="isActiveTab" key="withTooltip" class="lock-record">
    <span :class="{ 'locked-record': isLocked }">
      {{ tabName }}
    </span>

    <el-tooltip
      :content="tooltipText"
      placement="top"
    >
      <el-button v-if="isLocked" type="text" @click="unLockRecord()">
        <i class="el-icon-unlock icon-font" />
      </el-button>

      <el-button v-else type="text" @click="lockRecord()">
        <i class="el-icon-lock icon-font" />
      </el-button>
    </el-tooltip>
  </span>

  <span v-else key="onlyName" :class="{ 'locked-record': isLocked }">
    {{ tabName }}

    <slot name="sufix" />
  </span>
</template>

<script>
import { defineComponent, computed, ref, watch } from '@vue/composition-api'

export default defineComponent({
  name: 'LockRecord',

  props: {
    parentUuid: {
      type: String,
      required: true
    },
    containerUuid: {
      type: String,
      required: true
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
    const tableName = props.tableName

    const isLocked = ref(false)

    const isValidUuid = (recordUuid) => {
      return !root.isEmptyValue(recordUuid) && recordUuid !== 'create-new'
    }

    const tooltipText = computed(() => {
      if (isLocked.value) {
        return root.$t('recordManager.unlockRecord')
      }
      return root.$t('recordManager.lockRecord')
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
      return root.$store.getters.getValuesView({
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid,
        format: 'object'
      })
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
      tooltipText,
      // methods
      lockRecord,
      unLockRecord
    }
  }
})
</script>

<style lang="scss">
.lock-record {
  .locked-record {
    color: red !important;
  }

  .icon-font {
    font-size: 15px;
    color: black;
  }
}
</style>
