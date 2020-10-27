<template>
  <div
    class="p-d-flex p-flex-column p-jc-center p-ai-center h-full"
  >
    <h1>{{ $t('pages.404.title') }}</h1>
    <br/>
    <router-link to="/">
      {{ $t('pages.404.link') }}
    </router-link>
    <img :src="backgroundImage" class="p-mt-4" />
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'Page404',
  data () {
    return {
    // eslint-disable-next-line no-undef
      backgroundImage: LCK_SETTINGS.PAGE_404_BACKGROUND_IMAGE_URL
    }
  }
})

</script>
