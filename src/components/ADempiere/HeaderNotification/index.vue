<template>
  <el-badge
    :value="processNotifications.length"
    :hidden="processNotifications.length === 0"
    type="primary"
    class="item"
    style="vertical-align: baseline;"
  >
    <el-popover
      placement="bottom"
      width="400"
      trigger="click"
    >
      <el-table
        :data="processNotifications"
        :highlight-current-row="true"
        @cell-click="handleCurrentChange"
      >
        <el-table-column prop="name" :label="$t('navbar.badge.Notifications')" />

        <el-table-column
          fixed="right"
          width="50"
        >
          <template slot="header">
            <el-button
              icon="el-icon-delete"
              type="text"
              @click.native.prevent="deleteAll()"
            />
          </template>

          <template slot-scope="scope">
            <el-button
              icon="el-icon-close"
              type="text"
              size="small"
              @click.native.prevent="deleteRow(scope.$index, processNotifications)"
            />
          </template>
        </el-table-column>

        <el-table-column
          width="50"
        >
          <template slot="header">
            <!-- <el-button"
              type="text"
              @click="handleCurrentChange()"
            > -->
            <svg-icon icon-class="tree-table" />
            <!-- </el-button> -->
          </template>
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              style="color: black"
              @click="openProcess(scope.$index, getRecordNotification)"
            >
              <svg-icon icon-class="tree-table" />
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-button
        slot="reference"
        type="text"
        icon="el-icon-bell"
        style="float: left;color: #000000;font-size: 121%;font-weight: 615!important;padding-top: 14px;"
      />
    </el-popover>
  </el-badge>
</template>

<script>
export default {
  name: 'HeaderNotification',

  data() {
    return {
      currentRow: null
    }
  },
  computed: {
    processNotifications() {
      // TODO: Add process runs
      return []
      /*
      return this.$store.getters.getNotificationProcess.map(item => {
        if (item.typeActivity) {
          return {
            ...item,
            name: item.name + ' ' + item.quantityActivities
          }
        }
        return item
      })
      */
    }
  },
  watch: {
    show(value) {
      if (value) {
        document.body.addEventListener('click', this.close)
      } else {
        document.body.removeEventListener('click', this.close)
      }
    }
  },
  methods: {
    close() {
      this.$refs.badge && this.$refs.badge.blur()
      this.options = []
      this.show = false
    },
    handleCurrentChange(notification, val, index, rows) {
      if (!this.isEmptyValue(notification.typeActivity) && notification.typeActivity) {
        return ''
      }

      if (val !== null) {
        let options = {
          name: 'ProcessActivity'
        }
        if (notification && notification.isReport && val.className !== 'procesActivity') {
          options = {
            name: 'Report Viewer',
            params: {
              reportUuid: notification.reportUuid,
              instanceUuid: notification.instanceUuid,
              fileName: notification.download
            }
          }
        }

        this.$router.push(options, () => {})
      }
    },
    openProcess(index, rows) {
      this.$router.push({
        name: '8e51c232-fb40-11e8-a479-7a0060f0aa01'
      }, () => {})
      this.deleteRow(index, this.processNotifications)
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    deleteAll() {
      // rows.splice(index, rows.lenght)
      this.processNotifications.splice(0)
    }
  }
}
</script>

<style>
  .el-badge__content.is-fixed {
    position: absolute;
    top: 6px;
    right: 10px;
    -webkit-transform: translateY(-50%) translateX(100%);
    transform: translateY(-50%) translateX(100%);
  }
</style>
