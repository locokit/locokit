<template>
  <div
    class="lck-color-content"
    v-if="settings && settings.medias"
  >
    <div v-if="settings.displayMode === 'image'">
      <div
        class="lck-image-mode"
        v-for="media in settings.medias"
        :key="media.srcURL"
      >
        <img
          v-if="media.type === 'image'"
          :alt="media.name"
          :src="media.srcURL"
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { MediaSettings } from '@locokit/lck-glossary'

export default Vue.extend({
  name: 'Media',
  props: {
    settings: {
      type: Object as PropType<MediaSettings>,
      default: () => ({}),
    },
  },
})
</script>

<style lang="scss" scoped>

 .lck-image-mode {
  text-align: center;
  // max-width: 600px;
  margin: 1rem auto;
  padding: 1rem;

  & > img {
     max-width: 100%;
     height: auto;
   }
 }
</style>
