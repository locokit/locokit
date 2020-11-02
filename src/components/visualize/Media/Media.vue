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
import { BlockMedia } from '@locokit/lck-glossary'

export default Vue.extend({
  name: 'Media',
  props: {
    settings: {
      type: Object as PropType<BlockMedia>,
      default: () => ({})
    }
  }
})
</script>

<style lang="scss" scoped>
 .lck-image-mode {
  text-align: center;

  & > img {
     max-width: 100%;
     height: auto;
   }
 }
</style>
