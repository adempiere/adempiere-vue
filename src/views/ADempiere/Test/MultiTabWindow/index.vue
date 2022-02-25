<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
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
  <component
    :is="WindowView"
    :uuid="uuid"
    :metadata="metadata"
    :container-manager="containerManager"
  />
</template>

<script>
import { defineComponent } from '@vue/composition-api'

import WindowView from '@/views/ADempiere/Window'
import multiTabMetadata from './multiTabWindow.json'
import { convertObjectToKeyValue } from '@/utils/ADempiere/valueFormat.js'

export default defineComponent({
  name: 'TestWindow',

  setup(props, { root }) {
    // Business Partner
    const uuid = 'a520de12-fb40-11e8-a479-7a0060f0aa01'
    const metadata = multiTabMetadata.result

    const containerManager = {
      actionPerformed: ({ field, value }) => {
        root.$store.dispatch('actionPerformed', {
          field,
          value
        })
      },

      seekRecord: ({ row, tableName, parentUuid, containerUuid }) => {
        root.$router.push({
          name: root.$route.name,
          query: {
            ...root.$route.query,
            action: row.UUID
          },
          params: {
            ...root.$router.params,
            tableName,
            recordId: row[`${tableName}_ID`]
          }
        }, () => {})

        const attributes = convertObjectToKeyValue({
          object: row
        })
        root.$store.dispatch('notifyPanelChange', {
          parentUuid,
          containerUuid,
          attributes
        })
      },

      seekTab: function(eventInfo) {
        console.log('seekTab: ', eventInfo)
        return new Promise()
      },

      // To Default Table
      setSelection: ({ containerUuid, recordsSelected }) => {
        console.info('setSelection callback', containerUuid, recordsSelected)
      },
      setSelectionAll: ({ containerUuid, recordsSelected }) => {
        console.info('setSelectionAll callback', containerUuid, recordsSelected)
      },

      // action menu
      relationsManager: {
        menuParentUuid: root.$route.meta.parentUuid
      },

      referencesManager: (tableName) => {
        return tableName
      },

      // current tab properties
      actionsManager: {
        actionsList: ({ tableName, uuid }) => []
      }
    }

    return {
      WindowView,
      metadata,
      uuid,
      containerManager
    }
  }
})
</script>
