<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Leonel Matos lmatos@erpya.com www.erpya.com
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
  <div v-if="!isLoadProcess">
    <div v-if="!isEmptyValue(getProcessLog)" key="with-process" class="app-container">
      <el-tabs type="border-card">
        <el-tab-pane>
          <span slot="label">
            <el-badge :value="getProcessLogSuccess.length" type="success" class="item" style="color: #67C23A">
              {{ generateTitle('complete') }}
            </el-badge>
          </span>
          <h1 v-if="isEmptyValue(getProcessLogSuccess)" class="text-center">
            {{ $t('views.noProcess') }}
          </h1>
          <el-timeline style="padding: 0px">
            <el-timeline-item
              v-for="(activity, index) in getProcessLogSuccess"
              :key="index"
              placement="top"
              type="primary"
              size="large"
              :color="checkStatus(activity).color"
            >
              <el-card>
                <div slot="header" class="clearfix" style="display: flex;">
                  <div class="header-panel">
                    <div class="header-panel" @click="showkey(index)">
                      <b> {{ activity.name }} </b>
                    </div>
                  </div>

                  <div class="actions">
                    <el-dropdown @command="handleCommand">
                      <span class="el-dropdown-link">
                        {{ $t('components.contextMenuActions') }}
                        <i class="el-icon-arrow-down el-icon--right" />
                      </span>

                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                          v-if="activity.isReport"
                          :command="{ ...activity, command: 'seeReport' }"
                        >
                          {{ $t('views.seeReport') }}
                        </el-dropdown-item>

                        <el-dropdown-item :command="{ ...activity, command: 'zoomIn' }">
                          {{ $t('table.ProcessActivity.zoomIn') }}
                        </el-dropdown-item>

                        <!-- TODO: add more actions -->
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </div>
                <el-collapse-transition>
                  <div v-show="(currentKey === index)">
                    <el-form label-position="top" style="padding-left: 1%;" :inline="true">
                      <el-form-item :label="$t('table.ProcessActivity.Logs')" style="margin-bottom: 0;">

                        <span v-if="activity.isReport && !isEmptyValue(activity.summary)">
                          <ul>
                            <li @click="handleCommand({ ...activity, command: 'zoomIn' })">
                              {{ activity.summary }}
                            </li>
                            <el-scrollbar wrap-class="popover-scroll">
                              <li v-for="(logItem, key) in activity.logsList" :key="key" @click="zoomIn(activity)">
                                {{ logItem.log }}
                              </li>
                            </el-scrollbar>
                          </ul>
                          <!-- {{ activity.output.description }}-->
                        </span>
                        <div v-if="isEmptyValue(activity.summary)" key="withSummary">
                          {{ $t('route.withoutLog') }}
                        </div>
                        <ul v-else>
                          <li @click="handleCommand({ ...activity, command: 'zoomIn' })">
                            {{ activity.summary }}
                          </li>
                          <el-scrollbar wrap-class="popover-scroll">
                            <li v-for="(logItem, key) in activity.logsList" :key="key" @click="zoomIn(activity)">
                              {{ logItem.log }}
                            </li>
                          </el-scrollbar>
                        </ul>
                      </el-form-item>

                      <!-- <el-form-item :label="generateTitle('Status')">
                        show only when it is error -->
                      <el-form-item v-if="!isEmptyValue(activity.panelType)" style="float: right;padding-top: 3%">
                        <el-tag type="success">
                          {{ findTranslation(activity.panelType) }}
                        </el-tag>
                      </el-form-item>
                    </el-form>
                  </div>
                </el-collapse-transition>
                <p style="padding-left: 1%;color: cadetblue;margin: 0px;"> # {{ translateDate(activity.lastRun) }} </p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label">
            <el-badge :value="getProcessLogError.length" class="item" type="danger" style="color: #F56C6C">
              {{ generateTitle('error') }}
            </el-badge>
          </span>
          <h1 v-if="isEmptyValue(getProcessLogError)" class="text-center">
            {{ $t('views.noProcess') }}
          </h1>
          <el-timeline v-else style="padding: 0px">
            <el-timeline-item
              v-for="(activity, index) in getProcessLogError"
              :key="index"
              placement="top"
              type="primary"
              size="large"
              :color="checkStatus(activity).color"
            >
              <el-card>
                <div slot="header" class="clearfix" style="display: flex;">
                  <div class="header-panel" @click="showkey(index)">
                    <b> {{ activity.name }} </b>
                  </div>

                  <div class="actions">
                    <el-dropdown @command="handleCommand">
                      <span class="el-dropdown-link">
                        {{ $t('components.contextMenuActions') }}
                        <i class="el-icon-arrow-down el-icon--right" />
                      </span>

                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                          v-if="activity.isReport"
                          :command="{ ...activity, command: 'seeReport' }"
                        >
                          {{ $t('views.seeReport') }}
                        </el-dropdown-item>

                        <el-dropdown-item :command="{ ...activity, command: 'zoomIn' }">
                          {{ $t('table.ProcessActivity.zoomIn') }}
                        </el-dropdown-item>

                        <!-- TODO: add more actions -->
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </div>
                <el-collapse-transition>
                  <div v-show="(currentKey === index)">
                    <el-form label-position="top" style="padding-left: 1%;" :inline="true">
                      <el-form-item :label="$t('table.ProcessActivity.Logs')" style="margin-bottom: 0;">

                        <span v-if="activity.isReport && !isEmptyValue(activity.summary)">
                          <ul>
                            <li @click="handleCommand({ ...activity, command: 'zoomIn' })">
                              {{ activity.summary }}
                            </li>
                            <el-scrollbar wrap-class="popover-scroll">
                              <li v-for="(logItem, key) in activity.logsList" :key="key" @click="zoomIn(activity)">
                                {{ logItem.log }}
                              </li>
                            </el-scrollbar>
                          </ul>
                          <!-- {{ activity.output.description }}-->
                        </span>
                        <div v-if="isEmptyValue(activity.summary)" key="withSummary">
                          {{ $t('route.withoutLog') }}
                        </div>
                        <ul v-else>
                          <li @click="handleCommand({ ...activity, command: 'zoomIn' })">
                            {{ activity.summary }}
                          </li>
                          <el-scrollbar wrap-class="popover-scroll">
                            <li v-for="(logItem, key) in activity.logsList" :key="key" @click="zoomIn(activity)">
                              {{ logItem.log }}
                            </li>
                          </el-scrollbar>
                        </ul>
                      </el-form-item>

                      <!-- <el-form-item :label="generateTitle('Status')">
                        show only when it is error -->
                      <el-form-item v-if="!isEmptyValue(activity.panelType)" style="float: right;padding-top: 3%">
                        <el-tag type="danger">
                          {{ findTranslation(activity.panelType) }}
                        </el-tag>
                      </el-form-item>
                    </el-form>
                  </div>
                </el-collapse-transition>
                <p style="padding-left: 1%;color: cadetblue;margin: 0px;"> # {{ translateDate(activity.lastRun) }} </p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label">
            <el-badge :value="getProcessLogProcessing.length" class="item" type="info" style="color: #909399">
              Procesando
            </el-badge>
          </span>
          <h1 v-if="isEmptyValue(getProcessLogProcessing)" class="text-center">
            {{ $t('views.noProcess') }}
          </h1>
          <el-timeline v-else style="padding: 0px">
            <el-timeline-item
              v-for="(activity, index) in getProcessLogProcessing"
              :key="index"
              placement="top"
              type="primary"
              size="large"
              :color="checkStatus(activity).color"
            >
              <el-card>
                <div slot="header" class="clearfix" style="display: flex;">
                  <div class="header-panel">
                    <div class="header-panel" @click="showkey(index)">
                      <b> {{ activity.name }} </b>
                    </div>
                  </div>

                  <div class="actions">
                    <el-dropdown @command="handleCommand">
                      <span class="el-dropdown-link">
                        {{ $t('components.contextMenuActions') }}
                        <i class="el-icon-arrow-down el-icon--right" />
                      </span>

                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                          v-if="activity.isReport"
                          :command="{ ...activity, command: 'seeReport' }"
                        >
                          {{ $t('views.seeReport') }}
                        </el-dropdown-item>

                        <el-dropdown-item :command="{ ...activity, command: 'zoomIn' }">
                          {{ $t('table.ProcessActivity.zoomIn') }}
                        </el-dropdown-item>

                        <!-- TODO: add more actions -->
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </div>
                <el-collapse-transition>
                  <div v-show="(currentKey === index)">
                    <el-form label-position="top" style="padding-left: 1%;" :inline="true">
                      <el-form-item :label="$t('table.ProcessActivity.Logs')" style="margin-bottom: 0;">

                        <span v-if="activity.isReport && !isEmptyValue(activity.summary)">
                          <ul>
                            <li @click="handleCommand({ ...activity, command: 'zoomIn' })">
                              {{ activity.summary }}
                            </li>
                            <el-scrollbar wrap-class="popover-scroll">
                              <li v-for="(logItem, key) in activity.logsList" :key="key" @click="zoomIn(activity)">
                                {{ logItem.log }}
                              </li>
                            </el-scrollbar>
                          </ul>
                          <!-- {{ activity.output.description }}-->
                        </span>
                        <div v-if="isEmptyValue(activity.summary)" key="withSummary">
                          {{ $t('route.withoutLog') }}
                        </div>
                        <ul v-else>
                          <li @click="handleCommand({ ...activity, command: 'zoomIn' })">
                            {{ activity.summary }}
                          </li>
                          <el-scrollbar wrap-class="popover-scroll">
                            <li v-for="(logItem, key) in activity.logsList" :key="key" @click="zoomIn(activity)">
                              {{ logItem.log }}
                            </li>
                          </el-scrollbar>
                        </ul>
                      </el-form-item>

                      <!-- <el-form-item :label="generateTitle('Status')">
                        show only when it is error -->
                      <el-form-item v-if="!isEmptyValue(activity.panelType)" style="float: right;padding-top: 3%">
                        <el-tag type="info">
                          {{ findTranslation(activity.panelType) }}
                        </el-tag>
                      </el-form-item>
                    </el-form>
                  </div>
                </el-collapse-transition>
                <p style="padding-left: 1%;color: cadetblue;margin: 0px;"> # {{ translateDate(activity.lastRun) }} </p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div v-else key="without-process">
      <h1 class="text-center">
        {{ $t('views.noProcess') }}
      </h1>
    </div>
  </div>
  <loading-view
    v-else
    key="window-loading"
  />
</template>

<script src="./processActivity.js">
</script>

<style lang="scss" scoped src="./processActivityStyle.scss">
</style>
<style>
  .el-form-item--medium .el-form-item__label {
    line-height: 36px;
    padding: 0px;
  }
  .popover-scroll {
    max-height: 200px !important;
  }
  .el-card__body {
    padding-top: 1%;
    padding-bottom: 1%;
  }
</style>
