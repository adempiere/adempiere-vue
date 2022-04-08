<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
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
  <el-container
    class="view-base"
    style="height: max-content !important;"
  >
    <el-header style="height: 39px;">
      <!-- TODO: Add action menu -->
    </el-header>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card
            v-if="isLoaded"
            key="form-loaded"
            class="content-collapse"
            :style="isEmptyValue(metadata.fieldsList) ? 'height: max-content !important;' : ''"
          >
            <title-and-help
              :name="metadata.name"
              :help="metadata.help"
            />

            <!-- emulated component form -->
            <div class="wrapper">
              <el-form
                label-position="top"
                label-width="200px"
              >
                <el-row>
                  <field
                    v-for="(fieldMetadata) in fieldsList"
                    :key="fieldMetadata.columnName"
                    :metadata-field="fieldMetadata"
                  />
                </el-row>
              </el-form>
            </div>
            <!-- emulated component form -->

          </el-card>

          <loading-view
            v-else
            key="form-loading"
          />
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
// components and mixins
import FormMixin from '@theme/components/ADempiere/Form/formMixin'
import LoadingView from '@theme/components/ADempiere/LoadingView/index.vue'
import TitleAndHelp from '@theme/components/ADempiere/TitleAndHelp'

// constants
import fieldsList from './fieldsList.js'

export default {
  name: 'TestView',

  components: {
    LoadingView,
    TitleAndHelp
  },

  mixins: [
    FormMixin
  ],

  props: {
    metadata: {
      type: Object,
      default: () => {
        return {
          containerUuid: 'Test-View',
          name: 'Test View'
        }
      }
    }
  },

  data() {
    return {
      fieldsList,
      isCustomForm: true,
      unsubscribe: () => {}
    }
  },

  created() {
    this.unsubscribe = this.subscribeChanges()
  },

  beforeDestroy() {
    this.unsubscribe()
  },

  methods: {
    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'addActionKeyPerformed') {
          console.log(mutation)
        }
      })
    }
  }
}
</script>

<style>
  .el-card__body {
    padding-top: 0px !important;
    padding-right: 20px;
    padding-bottom: 20px;
    padding-left: 20px;
  }
</style>
<style scoped >
  .el-card {
    width: 100% !important;
    height: 100% !important;
  }

  .center{
    text-align: center;
  }
</style>
