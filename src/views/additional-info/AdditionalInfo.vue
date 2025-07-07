<template>
  <div class="additional-info-container">
    <h1>{{ $t('additionalInfo.title') }}</h1>
    <p>{{ $t('additionalInfo.message') }}</p>
  </div>
</template>

<script>
export default {
  name: 'AdditionalInfo'
}
</script>

<style scoped>
.additional-info-container {
  padding: 20px;
}
</style>
