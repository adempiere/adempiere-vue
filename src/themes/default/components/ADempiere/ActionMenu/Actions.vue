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
  <!-- actions or process on container -->
  <el-dropdown
    v-if="!isEmptyValue(actionsManager)"
    :hide-on-click="true"
    :size="size"
    split-button
    type="primary"
    trigger="click"
    class="action-container"
    @command="runAction"
    @click="runDefaultAction"
  >
    {{ defaultActionName }}

    <el-dropdown-menu slot="dropdown" class="action-dropdown-menu">
      <el-dropdown-item
        v-if="isEmptyValue(actionsList)"
        key="withoutActions"
        style="min-height: 26px"
      >
        <span class="contents">
          <b class="label">
            {{ $t('actionMenu.withoutActions') }}
          </b>
        </span>
      </el-dropdown-item>

      <el-scrollbar v-else key="withActions" wrap-class="scroll-child">
        <el-dropdown-item
          v-for="(action, index) in actionsList"
          :key="index"
          :command="action"
          :disabled="!action.enabled({
            root: $root,
            parentUuid,
            containerUuid,
            containerManager
          })"
          :divided="true"
        >
          <div class="contents">
            <div class="auxiliary-menu-icon">
              <i :class="action.icon" style="font-size: 18" />
            </div>

            <!-- for print format -->
            <el-dropdown v-if="!isEmptyValue(action.childs)">
              <span>
                <b class="label">
                  {{ action.name }}
                </b>
                <i class="el-icon-arrow-down" style="float: right;" />
                <p class="description">
                  <template v-if="isEmptyValue(action.description)">
                    {{ $t('data.noDescription') }}
                  </template>
                  <template v-else>
                    {{ action.description }}
                  </template>
                </p>
              </span>

              <el-dropdown-menu
                slot="dropdown"
                @command="runAction"
              >
                <el-scrollbar wrap-class="scroll-child">
                  <el-dropdown-item
                    v-for="(actionChild, key) in action.childs"
                    :key="key"
                    :command="actionChild"
                    :divided="true"
                  >
                    <span class="contents">
                      <b class="label" @click="runAction(actionChild)">
                        {{ actionChild.name }}
                      </b>
                    </span>

                    <p class="description" @click="runAction(actionChild)">
                      <template v-if="isEmptyValue(actionChild.description)">
                        {{ $t('data.noDescription') }}
                      </template>
                      <template v-else>
                        {{ actionChild.description }}
                      </template>
                    </p>
                  </el-dropdown-item>
                </el-scrollbar>
              </el-dropdown-menu>
            </el-dropdown>

            <div v-else>
              <span class="contents">
                <b class="label">
                  {{ action.name }}
                </b>
              </span>

              <p class="description">
                <template v-if="isEmptyValue(action.description)">
                  {{ $t('data.noDescription') }}
                </template>
                <template v-else>
                  {{ action.description }}
                </template>
              </p>
            </div>
          </div>
        </el-dropdown-item>
      </el-scrollbar>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { computed, defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'MenuActions',

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
      default: () => {},
      required: true
    },
    size: {
      type: String,
      default: ''
    }
  },

  setup(props, { root }) {
    const {
      parentUuid,
      containerUuid,
      tableName
    } = props.actionsManager

    // set initial value
    const actionsList = ref([])
    if (props.actionsManager && props.actionsManager.getActionList) {
      actionsList.value = props.actionsManager.getActionList()
    }

    const recordUuid = computed(() => {
      // TODO: Change query name 'action'
      const { action } = root.$route.query
      return action
    })

    const isWithRecord = computed(() => {
      return !root.isEmptyValue(recordUuid.value) && recordUuid.value !== 'create-new'
    })

    const isUndoAction = computed(() => {
      if (!root.isEmptyValue(tableName)) {
        if (!isWithRecord.value) {
          return true
        }
      }
      return false
    })

    const defaultActionToRun = computed(() => {
      if (isUndoAction.value) {
        return actionsList.value[2]
      }
      return actionsList.value[0]
    })

    const defaultActionName = computed(() => {
      if (!root.isEmptyValue(props.actionsManager.defaultActionName)) {
        return props.actionsManager.defaultActionName
      }
      if (!root.isEmptyValue(actionsList.value)) {
        return actionsList.value[0].name
      }
      return root.$t('actionMenu.runProcess')
    })

    /**
     * Run default action with last parameters
     */
    function runDefaultAction() {
      runAction(defaultActionToRun.value)
    } // end runAction

    /**
     * Run selected action
     * @param {object} action
     */
    function runAction(action) {
      const { actionName } = action
      action[actionName]({
        root,
        parentUuid,
        containerUuid,
        tableName,
        containerManager: props.containerManager,
        recordUuid: recordUuid.value,
        uuid: action.uuid
      })
    }

    return {
      actionsList,
      defaultActionName,
      // methods
      runAction,
      runDefaultAction
    }
  }
})
</script>

<style scoped lang="scss" src="./common-style.scss">
</style>
<style scoped lang="scss">
.action-container {
  .el-button-group {
    display: inline-flex;
  }
}

.action-dropdown-menu {
  .auxiliary-menu-icon {
    margin-right: 4px !important;

    >i {
      font-size: 18px;
    }
  }

  // height, and font size of the prefix icons of menu items
  .el-dropdown-menu__item {
    line-height: 17px;
    padding: 0 17px;
    padding-left: 10px !important;
    display: grid;
    font-size: 14px;

    // additional space on top of the first item in the list
    // &:first-child {
    //   margin-top: 10px;
    // }
    // additional space on bottom of the last item in the list
    &:last-child {
      margin-bottom: 10px;
    }
  }
}
</style>
<style lang="scss">
.action-container {
  .el-button-group {
    // light blue style of the first section of the menu button
    // >.el-button::first-child {
    >.el-button:not(:last-child) {
      min-width: 105px;
      font-weight: bold;
      // margin-right: -1px;
      color: #0080ff;
      border-color: #0080ff;
      background: #ecf5ff;
    }

    // light blue style of the drop down menu section
    .el-button--primary:last-child {
      // margin-right: 2px;
      color: #0080ff;
      border-color: #0080ff;
      background: #e6f1fd;
      border-left-color: #000000 !important;
    }

    // dark blue style when pointing to the menu
    .el-button--primary:hover {
      background: #1890ff;
      border-color: #1890ff;
      color: #FFFFFF;
    }
  }
}
</style>
