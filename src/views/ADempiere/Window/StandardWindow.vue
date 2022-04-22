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
  <div>
    <tab-manager
      :parent-uuid="windowMetadata.uuid"
      :container-manager="containerManager"
      :tabs-list="windowMetadata.tabsListParent"
    />

    <tab-manager
      v-if="isWithChildsTab"
      :parent-uuid="windowMetadata.uuid"
      :container-manager="containerManager"
      :tabs-list="windowMetadata.tabsListChild"
      :is-parent-tabs="false"
    />
  </div>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

// components and mixins
import TabManager from '@theme/components/ADempiere/TabManager'

export default defineComponent({
  name: 'StandardWindow',

  components: {
    TabManager
  },

  props: {
    containerManager: {
      type: Object,
      required: true
    },
    windowMetadata: {
      type: Object,
      required: true
    }
  },

  setup(props, { root }) {
    const isWithChildsTab = computed(() => {
      return !root.isEmptyValue(props.windowMetadata.tabsListChild)
    })

    return {
      isWithChildsTab
    }
  }

})
</script>
