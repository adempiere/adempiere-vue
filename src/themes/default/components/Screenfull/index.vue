<template>
  <div>
    <svg-icon :icon-class="isFullscreen" @click="click" />
  </div>
</template>

<script>

export default {
  name: 'Screenfull',
  data() {
    return {
      elem: document.documentElement,
      isFullscreen: 'fullscreen'
    }
  },
  methods: {
    click() {
      if (document.fullscreenElement) {
        this.closeFullscreen()
        this.isFullscreen = 'fullscreen'
        return
      }
      this.openFullscreen()
      this.isFullscreen = 'exit-fullscreen'
      return
    },
    openFullscreen() {
      if (this.elem.requestFullscreen) {
        this.elem.requestFullscreen()
      } else if (this.elem.webkitRequestFullscreen) { /* Safari */
        this.elem.webkitRequestFullscreen()
      } else if (this.elem.msRequestFullscreen) { /* IE11 */
        this.elem.msRequestFullscreen()
      }
    },
    closeFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen()
      }
    }
  }
}
</script>

<style scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
