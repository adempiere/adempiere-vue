<template>
  <div :style="labelStyle" class="label-field">
    <span>
      {{ label }}
    </span>

    <span v-if="isMandatory" :style="'color: #f34b4b'"> * </span>

    <i class="el-icon-info" :style="iconStyle" />
  </div>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

export default defineComponent({
  name: 'LabelField',

  props: {
    isMandatory: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    isMobile: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const labelStyle = computed(() => {
      let displayStyle
      props.isMobile ? displayStyle = 'display: flex; width: auto;' : 'display: block;'
      return displayStyle + ' margin-left: 3px;'
    })

    const iconStyle = computed(() => {
      if (props.isMobile) {
        return 'margin-left: 5px; margin-top: 7px;'
      }
      return 'margin-left: -5px; padding-bottom: 6px;'
    })

    return {
      iconStyle,
      labelStyle
    }
  }
})
</script>

<style lang="scss" scoped>
.label-field {
  .el-icon-info {
    font-size: 11px;
    color: #008fd3;
  }
}
</style>
