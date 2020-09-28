<template>
  <div class="lck-color-content" v-if="block.settings && block.settings.medias">
    <div v-if="block.settings.displayMode === 'image'">
      <div
        class="lck-image-mode"
        v-for="media in block.settings.medias"
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
import { BlockMedia } from '@/types/block'

export default Vue.extend({
  name: 'Media',
  props: {
    block: {
      type: Object as PropType<BlockMedia>,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
 .lck-image-mode {
  text-align: center;
  & > img {
     max-width:100%;
     height: auto;
   }
 }
</style>
