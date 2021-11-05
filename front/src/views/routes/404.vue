<template>
  <div
    class="p-d-flex p-flex-column p-jc-center p-ai-center h-full"
    :style="{
      'background-image': 'url(' + backgroundImage + ')',
       position: 'relative'
    }"
  >
    <h1>{{ $t('pages.404.title') }}</h1>
    <br/>
    <router-link to="/">
      {{ $t('pages.404.link') }}
    </router-link>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'Page404',
  data () {
    return {
      // eslint-disable-next-line no-undef
      backgroundImage: LCK_THEME.PAGE_404_BACKGROUND_IMAGE_URL,
    }
  },
})

</script>

<style scoped>
div {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: bottom;
  height: 100%;
  text-shadow: 0px 0px 3px #fff;
}

</style>
