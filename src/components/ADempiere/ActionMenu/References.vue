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
  <!-- records references only window -->
  <el-dropdown
    :size="size"
    trigger="click"
    class="menu-references"
    @command="openReference"
  >
    <el-button
      :size="size"
      plain
      type="warning"
      :disabled="isDisabledMenu"
    >
      {{ $t('actionMenu.references') }}

      <i
        v-if="!isReferecesContent || isLoadedReferences"
        class="el-icon-arrow-down el-icon--right"
      />
      <i v-else class="el-icon-loading el-icon--right" />
    </el-button>

    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-if="isEmptyValue(referencesList) && isReferecesContent"
        key="withoutReference"
        style="min-height: 45px"
      >
        <span class="contents">
          <b class="label">
            {{ $t('actionMenu.withoutReferences') }}
          </b>
        </span>
      </el-dropdown-item>

      <el-scrollbar v-else key="withReferences" wrap-class="scroll-child">
        <el-dropdown-item
          v-for="(reference, index) in referencesList"
          :key="index"
          :command="reference"
          :divided="true"
        >
          <span class="contents">
            <b class="label">
              {{ reference.displayName }}
            </b>
          </span>
        </el-dropdown-item>

      </el-scrollbar>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { computed, defineComponent, ref, watch } from '@vue/composition-api'

import { zoomIn } from '@/utils/ADempiere/coreUtils.js'

export default defineComponent({
  name: 'MenuReferences',

  props: {
    size: {
      type: String,
      default: ''
    },
    referencesManager: {
      type: Object,
      required: true
    }
  },

  setup(props, { root, parent }) {
    const {
      parentUuid
    } = parent._props
    const {
      tableName
    } = props.referencesManager

    const isLoadedReferences = ref(false)
    const referencesList = ref([])

    const recordUuid = computed(() => {
      const { action } = root.$route.query
      return action
    })

    const isWithRecord = computed(() => {
      return !root.isEmptyValue(recordUuid.value) &&
        recordUuid.value !== 'create-new'
    })

    const isReferecesContent = computed(() => {
      if (!root.isEmptyValue(props.referencesManager) && isWithRecord.value) {
        return true
      }
      return false
    })

    const isDisabledMenu = computed(() => {
      return !(isReferecesContent.value &&
        isLoadedReferences.value)
    })

    const getterReferences = computed(() => {
      if (isReferecesContent.value) {
        return root.$store.getters.getStoredReferences({
          windowUuid: parentUuid,
          recordUuid: recordUuid.value
        })
      }

      return undefined
    })

    const openReference = (referenceElement) => {
      if (isDisabledMenu.value || root.isEmptyValue(referenceElement)) {
        return
      }

      if (referenceElement.windowUuid && referenceElement.recordUuid) {
        zoomIn({
          uuid: referenceElement.windowUuid,
          query: {
            action: referenceElement.type,
            referenceUuid: referenceElement.uuid,
            recordUuid: referenceElement.recordUuid,
            // windowUuid: parentUuid,
            tabParent: 0
          }
        })
      }
    }

    const getReferences = () => {
      if (!isReferecesContent.value) {
        return
      }

      const references = getterReferences.value
      if (!root.isEmptyValue(references)) {
        referencesList.value = references.referencesList
        isLoadedReferences.value = true
      } else {
        isLoadedReferences.value = false

        root.$store.dispatch('getReferencesFromServer', {
          parentUuid,
          tableName,
          recordUuid: recordUuid.value
        })
          .then(responseReferences => {
            referencesList.value = responseReferences.referencesList
          })
          .finally(() => {
            isLoadedReferences.value = true
          })
      }
    }

    // when change record uuid loaded references
    watch(recordUuid, () => {
      getReferences()
    })

    getReferences()

    return {
      referencesList,
      // computeds
      isReferecesContent,
      isLoadedReferences,
      isDisabledMenu,
      // methods
      openReference
    }
  }
})
</script>

<style scoped lang="scss" src="./common-style.scss">
</style>
<style lang="scss">
.menu-references {
  .el-button--warning {
    // darker orange tone for better readability
    border-color: #ff9b00;
    color: #ff9b00;
  }
}
</style>
