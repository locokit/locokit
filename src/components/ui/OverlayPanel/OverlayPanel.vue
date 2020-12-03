<template>
  <div class='lck-overlay-panel' @click="onOverlayPanelClick">
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
      :appendTo="appendTo"
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
      default () {
        return this.$t('components.overlayPanel.defaultLabel')
      }
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
    },
    appendTo: {
      type: String,
      default: 'body'
    }
  },
  methods: {
    toggleOverlayPanel (event) {
      this.$refs.overlayPanel.toggle(event)
    },
    onOverlayPanelClick (event) {
      if (event?.target?.className.indexOf('p-datepicker') > -1) {
        event.stopPropagation()
      }
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
