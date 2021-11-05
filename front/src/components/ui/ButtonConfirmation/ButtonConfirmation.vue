<template>
  <p-button
    v-if="state === 0"
    @click="state = 1"
    :class="firstLevelClass"
    :icon="firstLevelIcon"
    v-tooltip="firstLevelTooltip"
  />
  <p-button
    v-else-if="state === 1"
    @click="$emit('confirm')"
    :class="secondLevelClass"
    :icon="secondLevelIcon"
    v-tooltip="secondLevelTooltip"
  />
</template>

<script type="ts">
import Vue from 'vue'

import Button from 'primevue/button'

export default Vue.extend({
  name: 'LckButtonConfirmation',
  components: {
    'p-button': Button,
  },
  props: {
    firstLevelIcon: {
      type: String,
      default: 'pi pi-check',
    },
    firstLevelClass: {
      type: String,
      default: 'p-button-rounded p-button-warning',
    },
    firstLevelTooltip: {
      type: String,
      default: 'p-button-rounded p-button-warning',
    },
    secondLevelIcon: {
      type: String,
      default: 'pi pi-check',
    },
    secondLevelClass: {
      type: String,
      default: 'p-button-rounded p-button-danger',
    },
    secondLevelTooltip: {
      type: String,
      default: 'p-button-rounded p-button-danger',
    },
  },
  data () {
    return {
      /**
       * Button state
       * 0: initial
       * 1: waiting confirmation
       */
      state: 0,
    }
  },
  watch: {
    /**
     * When the state become '1',
     * we keep this state during 5s max.
     * After that, we return to the initial state
     */
    state (newState) {
      if (newState === 1) {
        setTimeout(() => {
          this.state = 0
        }, 5000)
      }
    },
  },
})
</script>
