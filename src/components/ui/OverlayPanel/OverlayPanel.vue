<template>
  <div class='lck-overlay-panel'>
    <p-button
      type="button"
      :class="classButton"
      :icon="icon"
      :label="label"
      :disabled="disabled"
      @click="toggleOverlayPanel"
    />
    <p-overlay-panel
      ref="overlayPanel"
      appendTo="body"
    >
      <slot
        name='overlay-content'
        :toggleOverlayPanel="toggleOverlayPanel"
      >
      </slot>
    </p-overlay-panel>
  </div>
</template>

<script>
import Vue from 'vue'
import Button from 'primevue/button'
import OverlayPanel from 'primevue/overlaypanel'

export default {
  name: 'LckOverlayPanel',
  components: {
    'p-button': Vue.extend(Button),
    'p-overlay-panel': Vue.extend(OverlayPanel)
  },
  props: {
    label: {
      type: String,
      default: 'No button label'
    },
    icon: {
      type: String,
      default: 'pi pi-list'
    },
    classButton: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleOverlayPanel (event) {
      this.$refs.overlayPanel.toggle(event)
    }
  }
}
</script>

<style scoped>
/* /deep/ .p-button .p-button-icon {
  line-height: 0.85rem;
  font-size: 0.85rem;
} */

/deep/ .p-button {
  width: auto;
}
</style>
