<template>
  <div
    class="
      layout-with-background
      flex-1
      flex
      justify-center
      items-center
      relative
    "
    :style="{
      'background-image': 'url(' + backgroundImage + ')',
    }"
  >
    <div
      class="p-col"
      style="max-width: 600px"
    >
      <a
        class="p-d-block p-text-center"
        to="/"
      >
        <img
          alt="logo"
          :src="logoBgPrimaryURL"
          class="p-mb-4 p-mx-auto"
        />
      </a>

      <p-card class="p-col">
        <template slot="title">
          <slot name="title"></slot>
        </template>
        <template slot="header">
          <slot name="header"></slot>
        </template>
        <template slot="content">
          <slot>
            This is the main content of the content card.
          </slot>
        </template>
        <template slot="footer">
          <slot name="footer"></slot>
        </template>
      </p-card>
    </div>

    <div class="version-block p-p-2">
      {{ version }}
    </div>

  </div>

</template>

<script setup lang="ts">
import PCard from 'primevue/card'

const LCK_THEME = {
  HOME_BACKGROUND_IMAGE_URL: 'https://tailwindcss.com/_next/static/media/sarah-dayan.a8ff3f1095a58085a82e3bb6aab12eb2.jpg',
  LOGO_BG_PRIMARY_URL: 'https://tailwindcss.com/_next/static/media/sarah-dayan.a8ff3f1095a58085a82e3bb6aab12eb2.jpg'
}
const LCK_VERSION = '0.8.0'

const backgroundImage = LCK_THEME.HOME_BACKGROUND_IMAGE_URL
const logoBgPrimaryURL = LCK_THEME.LOGO_BG_PRIMARY_URL
const version = LCK_VERSION

</script>

<style src="../index.css"></style>

<style scoped>

.layout-with-background {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  min-height: 100%;
  flex-grow: 1;
  background-color: var(--primary-color);
}

.version-block {
  position: absolute;
  right: 0;
  bottom: 0;
  color: var(--color-white);
}

:deep(.p-card .p-card-title) {
  text-align: center;
}

img {
  max-width: 100%;
}

@media only screen and (max-device-width: 480px) {
  img {
    max-width: 90%;
  }
}
</style>
