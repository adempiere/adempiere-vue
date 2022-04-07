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
  <div class="auxiliary-menu auxiliary-menu-mobile">
    <menu-actions
      :container-manager="containerManager"
      :parent-uuid="parentUuid"
      :container-uuid="containerUuid"
      :size="size"
      :actions-manager="actionsManager"
    />

    <menu-relations
      :size="size"
      :relations-manager="relationsManager"
    />

    <menu-references
      :size="size"
      :references-manager="referencesManager"
    />
  </div>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import MenuActions from './Actions.vue'
import MenuRelations from './Relations.vue'
import MenuReferences from './References.vue'

export default defineComponent({
  name: 'ActionMenu',

  components: {
    MenuActions,
    MenuRelations,
    MenuReferences
  },

  props: {
    parentUuid: {
      type: String,
      default: undefined
    },
    containerUuid: {
      type: String,
      required: true
    },
    containerManager: {
      type: Object,
      required: true
    },
    actionsManager: {
      type: Object,
      required: true
    },
    // used only window
    referencesManager: {
      type: Object,
      default: () => ({})
    },
    relationsManager: {
      type: Object,
      default: () => {}
    }
  },

  setup(props, { root }) {
    const isMobile = computed(() => {
      return root.$store.getters.device === 'mobile'
    })

    const size = computed(() => {
      if (isMobile.value) {
        return 'mini'
      }
      return 'medium'
    })

    return {
      size
    }
  }

})
</script>

<style lang="scss">
.auxiliary-menu {
  z-index: 1;

  .el-dropdown-menu {
    &.el-popper {
      max-height: 250px;
      overflow: auto;
    }

    max-height: 250px;
    overflow: auto;
  }
}

.auxiliary-menu-mobile {
  position: absolute;
  height: 39px !important;
  right: 0%;
  top: 0;
  display: flex;
}

.scroll-child {
  max-height: 300px;
}
</style>
