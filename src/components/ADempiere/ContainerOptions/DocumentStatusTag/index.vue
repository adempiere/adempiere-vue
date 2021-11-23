<template>
  <el-tag
    :size="size"
    :type="tagRender.type"
    :effect="tagRender.effect"
    disable-transitions
  >
    {{ displayedValue }}
  </el-tag>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

export default defineComponent({
  name: 'DocumentStatusTag',

  props: {
    value: {
      type: String,
      default: ''
    },
    displayedValue: {
      type: [String, Number, Boolean, Date],
      default: ''
    },
    size: {
      type: String,
      default: 'medium'
    }
  },

  setup(props) {
    /**
     * add a tab depending on the status of the document
     * @param {string} status, document status key
     */
    const tagRender = computed(() => {
      let effect = 'plain'
      let type = 'info'

      switch (props.value) {
        case 'AP':
          type = 'success'
          effect = 'light'
          break

        case 'CO':
          type = 'success'
          effect = 'dark'
          break

        case '??':
        case 'DR':
          type = 'info'
          effect = 'light'
          break

        case 'CL':
          type = 'primary'
          break
        case 'IP':
          type = 'warning'
          effect = 'light'
          break

        case 'WC':
        case 'WP':
          type = 'warning'
          effect = 'dark'
          break

        case 'VO':
          type = 'danger'
          effect = 'plain'
          break

        case 'NA':
        case 'IN':
        case 'RE':
          type = 'danger'
          effect = 'light'
          break
      }

      return {
        type,
        effect
      }
    })

    return {
      tagRender
    }
  }
})
</script>
