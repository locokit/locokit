<template>
  <div
    class="
      layout-with-background
      p-d-flex
      p-jc-center
      p-ai-center
    "
    :style="{
      'background-image': 'url(' + backgroundImage + ')',
       position: 'relative'
    }"
  >
    <div
      class="p-col"
      style="max-width: 600px"
    >
      <router-link
        v-if="logoBgPrimaryURL"
        class="p-d-block p-text-center"
        to="/"
      >
        <img
          alt="logo"
          class="p-mb-4 p-mx-auto"
          :src="logoBgPrimaryURL"
        />
      </router-link>
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

<script>
import Vue from 'vue'
import Card from 'primevue/card'

export default Vue.extend({
  name: 'LayoutWithBackground',
  data () {
    return {
      // eslint-disable-next-line no-undef
      backgroundImage: LCK_THEME.HOME_BACKGROUND_IMAGE_URL,
      // eslint-disable-next-line no-undef
      logoBgPrimaryURL: LCK_THEME.LOGO_BG_PRIMARY_URL,
      // eslint-disable-next-line no-undef
      version: LCK_VERSION,
    }
  },
  components: {
    'p-card': Vue.extend(Card),
  },
})

</script>

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

::v-deep .p-card .p-card-title {
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
