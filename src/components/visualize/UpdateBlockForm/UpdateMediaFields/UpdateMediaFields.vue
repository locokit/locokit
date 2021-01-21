<template>
  <div class="blockSettings">
    <div class="p-field">
      <label for="blockSettingsDisplayMode">{{ $t('pages.workspace.block.displayMode') }}</label>
      <p-dropdown
        id="blockSettingsDisplayMode"
        :options="mediaTypes"
        v-model="blockSettings.displayMode"
        optionValue="value"
        optionLabel="label"
        optionKey="value"
      />
    </div>
    <div v-if="blockSettings.displayMode">
      <div
        v-for="(media, index) in blockSettings.medias"
        :key="`media-${index}`"
        class="mediaConfiguration"
        :class="{ multiMediaConfiguration: !isBasicMedia }"
      >
        <div class="p-field">
          <label :for="`blockSettingsMediaName${index}`">{{ $t('pages.workspace.block.mediaName') }}</label>
          <p-inputtext
            :id="`blockSettingsMediaName${index}`"
            v-model="media.name"
          />
        </div>
        <div class="p-field">
          <label :for="`blockSettingsMediaSrcURL${index}`">{{ $t('pages.workspace.block.mediaSrcURL') }}</label>
          <p-inputtext
            :id="`blockSettingsMediaSrcURL${index}`"
            v-model="media.srcURL"
          />
        </div>
        <div class="p-field">
          <label :for="`blockSettingsMediaName${index}`">{{ $t('pages.workspace.block.mediaType') }}</label>
          <p-dropdown
            :id="`blockSettingsMediaName${index}`"
            :options="basicMediaTypes"
            v-model="media.type"
            optionValue="value"
            optionLabel="label"
            optionKey="value"
          />
        </div>
        <p-button
          icon="pi pi-trash"
          class="p-button-text p-button-lg deleteMediaButton"
          @click="removeMedia(index)"
        />
      </div>
      <div
        v-if="!isBasicMedia || blockSettings.medias.length === 0"
        class="addMediaDiv"
        >
        <p-button
          icon="pi pi-plus"
          class="p-button-text addMediaButton p-button-lg"
          @click="addNewMedia "
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { MediaSettings, MEDIA_TYPE } from '@locokit/lck-glossary'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { TranslateResult } from 'vue-i18n'

export default {
  name: 'UpdateMediaFields',
  components: {
    'p-dropdown': Vue.extend(Dropdown),
    'p-inputtext': Vue.extend(InputText),
    'p-button': Vue.extend(Button)
  },
  props: {
    blockSettings: {
      type: Object as Vue.PropType<MediaSettings>,
      required: true
    }
  },
  computed: {
    mediaTypes (): { label: TranslateResult; value: string }[] {
      return Object.entries(MEDIA_TYPE).map(mediaType => ({
        label: this.$t(`media.${mediaType[0]}`),
        value: mediaType[1]
      }))
    },
    basicMediaValues (): string [] {
      return [MEDIA_TYPE.IMAGE, MEDIA_TYPE.VIDEO]
    },
    basicMediaTypes (): { label: TranslateResult; value: string }[] {
      return this.mediaTypes.filter(
        mediaType => this.basicMediaValues.includes(mediaType.value)
      )
    },
    isBasicMedia (): boolean {
      return this.basicMediaValues.includes(this.blockSettings.displayMode)
    }
  },
  methods: {
    addNewMedia () {
      this.blockSettings.medias.push({
        name: '',
        srcURL: '',
        type: MEDIA_TYPE.IMAGE
      })
    },
    removeMedia (indexMediaToDelete: number) {
      this.blockSettings.medias.splice(indexMediaToDelete, 1)
    }
  },
  watch: {
    'blockSettings.displayMode' (newValue) {
      if (this.basicMediaValues.includes(newValue)) {
        this.blockSettings.medias.splice(1)
      }
    }
  }
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
