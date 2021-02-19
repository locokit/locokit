<template>
  <div style="height: 100%">
    <slot/>
  </div>
</template>

<script>
import '../src/plugins/primevue'

export default {
  name: 'StorybookThemeWrapper'
}
</script>

<style src="../public/assets/css/theme.css"></style>

<style>
#root,
html,
body {
  height: 100%;
  padding: unset !important;
  margin: unset !important;
}
</style>
<style lang="scss" src="@/styles/main.scss"></style>

<style lang="scss" scoped>
header {
  height: 4rem;
}
</style>
