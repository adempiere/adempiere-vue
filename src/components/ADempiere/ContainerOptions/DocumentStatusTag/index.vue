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
  <el-tag
    :size="size"
    :type="tagRender.type"
    :effect="tagRender.effect"
    disable-transitions
  >
    {{ displayText }}
  </el-tag>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'DocumentStatusTag',

  props: {
    value: {
      type: String,
      default: ''
    },
    displayedValue: {
      type: [String, Number, Boolean, Date],
      default: ''
    },
    size: {
      type: String,
      default: 'medium'
    }
  },

  setup(props) {
    /**
     * Get tag type of the document status
     * add a tab depending on the status of the document
     * @param {string} status, document status key
     */
    const tagRender = computed(() => {
      let effect = 'plain'
      let type = 'info'

      switch (props.value) {
        case 'AP':
          type = 'success'
          effect = 'light'
          break

        case 'CO':
          type = 'success'
          effect = 'dark'
          break

        case '??':
        case 'DR':
          type = 'info'
          effect = 'light'
          break

        case 'CL':
          type = 'primary'
          break
        case 'IP':
          type = 'warning'
          effect = 'light'
          break

        case 'WC':
        case 'WP':
          type = 'warning'
          effect = 'dark'
          break

        case 'VO':
          type = 'danger'
          effect = 'plain'
          break

        case 'NA':
        case 'IN':
        case 'RE':
          type = 'danger'
          effect = 'light'
          break
      }

      return {
        type,
        effect
      }
    })

    const displayText = computed(() => {
      if (!isEmptyValue(props.displayedValue)) {
        return props.displayedValue
      }
      return props.value
    })

    return {
      // computeds
      displayText,
      tagRender
    }
  }
})
</script>
