<template>
  <div class="blockSettings">
    <div class="p-field">
      <label for="blockSettingsDisplayMode">{{ $t('pages.workspace.block.displayMode') }}</label>
      <p-dropdown
        id="blockSettingsDisplayMode"
        :options="mediaTypes"
        :value="displayMode"
        :placeholder="$t('components.datatable.placeholder')"
        @input="$emit('update:displayMode', $event)"
        optionValue="value"
        optionLabel="label"
        optionKey="value"
      />
    </div>
    <div v-if="displayMode">
      <div
        v-for="(media, index) in medias"
        :key="`media-${index}`"
        class="mediaConfiguration"
        :class="{ multiMediaConfiguration: !isBasicMedia }"
      >
        <div class="p-field">
          <label :for="`blockSettingsMediaName${index}`">{{ $t('pages.workspace.block.mediaName') }}</label>
          <p-input-text
            :id="`blockSettingsMediaName${index}`"
            :value="media.name"
            @input="$emit('update-media-name', { media, name: $event })"
          />
        </div>
        <div class="p-field">
          <label :for="`blockSettingsMediaSrcURL${index}`">{{ $t('pages.workspace.block.mediaSrcURL') }}</label>
          <p-input-text
            :id="`blockSettingsMediaSrcURL${index}`"
            :value="media.srcURL"
            @input="$emit('update-media-srcURL', { media, srcURL: $event })"
          />
        </div>
        <div class="p-field">
          <label :for="`blockSettingsMediaName${index}`">{{ $t('pages.workspace.block.mediaType') }}</label>
          <p-dropdown
            :id="`blockSettingsMediaName${index}`"
            :options="basicMediaTypes"
            :value="media.type"
            :placeholder="$t('components.datatable.placeholder')"
            @input="$emit('update-media-type', { media, type: $event })"
            optionValue="value"
            optionLabel="label"
            optionKey="value"
          />
        </div>
        <p-button
          icon="pi pi-trash"
          class="p-button-text p-button-lg deleteMediaButton"
          @click="$emit('delete-media', index)"
        />
      </div>
      <div
        v-if="!isBasicMedia || medias.length === 0"
        class="addMediaDiv"
        >
        <p-button
          icon="pi pi-plus"
          class="p-button-text addMediaButton p-button-lg"
          @click="$emit('add-media')"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { MEDIA_TYPE } from '@locokit/lck-glossary'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { TranslateResult } from 'vue-i18n'

export default {
  name: 'MediaSettingsFields',
  components: {
    'p-dropdown': Vue.extend(Dropdown),
    'p-input-text': Vue.extend(InputText),
    'p-button': Vue.extend(Button),
  },
  props: {
    displayMode: {
      type: String as Vue.PropType<MEDIA_TYPE>,
    },
    medias: {
      type: Array as Vue.PropType<{
        name: string;
        srcURL: string;
        type: MEDIA_TYPE.IMAGE | MEDIA_TYPE.VIDEO;
      }[]>,
      default: () => ([]),
    },
  },
  computed: {
    mediaTypes (): { label: TranslateResult; value: string }[] {
      return Object.entries(MEDIA_TYPE).map(mediaType => ({
        label: this.$t(`media.${mediaType[0]}`),
        value: mediaType[1],
      }))
    },
    basicMediaValues (): string [] {
      return [MEDIA_TYPE.IMAGE, MEDIA_TYPE.VIDEO]
    },
    basicMediaTypes (): { label: TranslateResult; value: string }[] {
      return this.mediaTypes.filter(
        mediaType => this.basicMediaValues.includes(mediaType.value),
      )
    },
    isBasicMedia (): boolean {
      return this.basicMediaValues.includes(this.displayMode)
    },
  },
}
</script>

<style scoped>
.mediaConfiguration {
  position: relative;
  box-shadow: 1px 1px 5px 1px rgb(200, 200, 200);
  padding: 1em;
  margin-bottom: 1em;
}

.deleteMediaButton {
  position: absolute;
  top: 0em;
  right: 0em;
}

.addMediaDiv {
  box-shadow: 1px 1px 5px 1px rgb(200, 200, 200);
  margin-bottom: 1em;
}

.addMediaButton.p-button {
  width: 100%;
  height: 100%;
}
</style>
