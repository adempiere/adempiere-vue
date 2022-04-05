<template>
  <a v-if="isExternal" :href="to" target="_blank" rel="noopener">
    <slot />
  </a>
  <router-link v-else v-slot="{ navigate }" :to="to" custom>
    <span role="link" @click="navigate" @keypress.enter="navigate">
      <slot />
    </span>
  </router-link>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  props: {
    to: {
      type: Object,
      required: true
    }
  },
  computed: {
    isExternal() {
      return isExternal(this.to)
    },
    type() {
      if (this.isExternal) {
        return 'a'
      }
      return 'router-link'
    }
  },
  methods: {
    linkProps(to) {
      if (this.isExternal) {
        return {
          href: to,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        to: to
      }
    }
  }
}
</script>
