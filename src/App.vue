<template>
  <div id="app">
    <!--<modal-idle
      v-if="isSession && isIdle"
      :is-idle="isIdle"
    />-->
    <router-view />
  </div>
</template>

<script>
import { defineComponent, computed, nextTick, onUnmounted } from 'vue'

export default defineComponent({
  setup() {
    const isIdle = computed(() => {
      return ''
      // return store.state.idleVue.isIdle
    })

    const isSession = computed(() => {
      return ''
      // return store.getters['user/getIsSession']
    })

    function getWindowWidth() {
      return ''
      // store.dispatch('setWidth', document.documentElement.clientWidth)
    }

    function getWindowHeight() {
      return ''
      // store.dispatch('setWidth', document.documentElement.clientWidth)
    }

    onUnmounted(() => {
      nextTick(() => {
        window.addEventListener('resize', getWindowWidth)
        window.addEventListener('resize', getWindowHeight)
      })
    })

    return {
      isIdle,
      isSession,
      // function
      getWindowWidth,
      getWindowHeight

    }
  }
})
</script>

<!-- <script>
// components and mixins
// import ModalIdle from './components/ADempiere/ModalIdle'

export default {
  name: 'App',
  // components: { ModalIdle },
  computed: {
    isIdle() {
      return this.$store.state.idleVue.isIdle
    },
    isSession() {
      return this.$store.getters['user/getIsSession']
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.getWindowWidth)
      window.addEventListener('resize', this.getWindowHeight)

      this.getWindowWidth()
      this.getWindowHeight()
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getWindowWidth)
    window.removeEventListener('resize', this.getWindowHeight)
  },
  methods: {
    getWindowWidth(event) {
      console.log({ getWindowWidth: event }, document.documentElement.clientWidth)
      // this.$store.dispatch('setWidth', document.documentElement.clientWidth)
    },
    getWindowHeight(event) {
      console.log({ getWindowHeight: event })
      // this.$store.dispatch('setHeight', document.documentElement.clientHeight)
    }
  }
}
</script> -->
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  color: #2c3e50;
}
</style>
