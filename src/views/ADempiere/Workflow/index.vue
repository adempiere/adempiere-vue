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
  <el-container class="panel_main">
    <el-header>
      <title-and-help
        :name="workflowFileName"
        :help="$route.meta.description"
      />
    </el-header>
    <el-main>
      <workflow-chart
        :style="size"
        :transitions="transitions"
        :states="nodoWorkflow"
        :orientation="'horizontal'"
        @state-click="onLabelClicked($event)"
        @size-change="sizeChanged"
      />
    </el-main>
  </el-container>
</template>

<script>
// When supporting the workflow, smart browser and reports,
// the ContextMenu and sticky must be placed in the layout
// import ContextMenu from '@/components/ADempiere/ContextMenu'
// import MainPanel from '@/components/ADempiere/Panel'
import TitleAndHelp from '@/components/ADempiere/TitleAndHelp'
// import Epale from './epale'
import WorkflowChart from 'vue-workflow-chart'

export default {
  name: 'Workflow',
  components: {
  //   MainPanel,
  //   ContextMenu,
    WorkflowChart,
    // Epale,
    TitleAndHelp
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      size: {
        width: '20px',
        height: '2px'
      },
      workflowMetadata: {
        node: []
      },
      isLoadedMetadata: false,
      panelType: 'workflow'
    }
  },
  computed: {
    workflowUuid() {
      return this.$route.meta.uuid
    },
    workflowFileName() {
      return this.workflowMetadata.fileName || this.$route.meta.title
    },
    getWorkflow() {
      return this.$store.getters.getWorkflowUuid(this.workflowUuid)
    },
    nodoWorkflow() {
      return this.workflowMetadata.node.map(node => {
        return {
          id: node.id,
          label: node.name
        }
      })
    }
  },
  created() {
    this.workflow()
  },
  methods: {
    workflow() {
      const workflow = this.getWorkflow
      if (workflow) {
        this.workflowMetadata = workflow
        this.isLoadedMetadata = true
      } else {
        this.$store.dispatch('getPanelAndFields', {
          containerUuid: this.workflowUuid,
          panelType: this.panelType,
          routeToDelete: this.$route
        }).then(workflowResponse => {
          this.workflowMetadata = workflowResponse
        }).finally(() => {
          this.isLoadedMetadata = true
        })
      }
    },
    onStateClick(id) {
      console.log(id)
    },
    onLabelClicked(id) {
      const node = this.nodoWorkflow.find(node => node.id === id)
      if (node) {
        this.$router.push({
          name: node.url
        }, () => {})
      }
    },
    sizeChanged(size) {
      this.size = {
        width: `${size.width}px`,
        height: `${size.height}px`
      }
    }
  }
}
</script>
<style scoped>
  .panel_main {
    height: 100%;
    width: 100%;
  }
</style>
<style lang='scss'>
@import '~vue-workflow-chart/dist/vue-workflow-chart.css';

.vue-workflow-chart-state-delete {
  color: white;
  background: red;
}

.vue-workflow-chart-transition-arrow-delete {
  fill: red;
}

.vue-workflow-chart-transition-path-delete {
  stroke: red;
}
</style>
