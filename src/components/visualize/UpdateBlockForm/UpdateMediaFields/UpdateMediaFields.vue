<template>
  <div class="p-field">
    <label for="blockSettingsDisplayMode">{{ $t('pages.workspace.block.displayMode') }}</label>
    <p-dropdown
      id="blockSettingsDisplayMode"
      optionValue="value"
      optionLabel="label"
      optionKey="value"
      v-model="blockSettings.displayMode"
      :options="mediaTypes"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { MediaSettings, MEDIA_TYPE } from '@locokit/lck-glossary'
import Dropdown from 'primevue/dropdown'
import { TranslateResult } from 'vue-i18n'
// import Textarea from 'primevue/textarea'
// displayMode: MEDIA_TYPE;
// medias: {
//     name: string;
//     srcURL: string;
//     type: MEDIA_TYPE.IMAGE | MEDIA_TYPE.VIDEO;
// }[];
export default {
  name: 'UpdateMediaFields',
  components: {
    'p-dropdown': Vue.extend(Dropdown)
  },
  props: {
    blockSettings: {
      type: Object as Vue.PropType<MediaSettings>,
      default: () => ({})
    }
  },
  computed: {
    mediaTypes () {
      const mediaTypes: { label: TranslateResult; value: string }[] = []
      for (const mediaValue in MEDIA_TYPE) {
        mediaTypes.push({
          label: this.$t(`media.${mediaValue}`),
          value: MEDIA_TYPE[mediaValue]
        })
      }
      return mediaTypes
    }
  }
}
</script>

<style>
</style>
