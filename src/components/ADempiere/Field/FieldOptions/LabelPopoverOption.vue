<template>
  <div class="label-popover-option" :style="textStyle">
    <i
      v-if="!option.svg"
      :class="option.icon"
      style="font-weight: bolder;"
    />
    <svg-icon
      v-else
      :icon-class="option.icon"
      :style="iconWrapperStyle"
    />

    <span>
      <b class="label">
        {{ option.name }}
      </b>
    </span>
  </div>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

export default defineComponent({
  name: 'LabelPopoverOption',

  props: {
    option: {
      type: Object,
      default: () => ({})
    },
    isMobile: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const iconWrapperStyle = computed(() => {
      if (props.isMobile) {
        return {
          'margin-right': '6px'
        }
      }
      return {
        'margin-left': '5px',
        'margin-right': '13px'
      }
    })

    const textStyle = computed(() => {
      if (props.isMobile) {
        return {
          'font-size': '130%',
          'margin': '7px'
        }
      }
      return ''
    })

    return {
      iconWrapperStyle,
      textStyle
    }
  }

})
</script>

<style lang="scss">
.label-popover-option {
  .svg-icon-wrapper {
    margin-left: 5px;
    margin-right: 13px;
  }
}
</style>
