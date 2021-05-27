<template>
  <div>
    <p-button
      class="p-button-sm action-button"
      v-if="settings && !isHidden"
      :label="settings.label"
      :class="settings.classButton"
      :icon="settings.icon"
      @click="onClick(settings)"
    />
    <span v-else><i class="action-condition-checked bi bi-check"/></span>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { LckTableRow } from '@/services/lck-api/definitions'
import {
  ACTION_BUTTON_TYPE,
  ActionButtonSettings
} from '@locokit/lck-glossary'

import Button from 'primevue/button'

export default Vue.extend({
  name: 'ActionButton',
  components: {
    'p-button': Vue.extend(Button)
  },
  props: {
    content: {
      type: Object as PropType<LckTableRow>
    },
    settings: {
      type: Object as PropType<ActionButtonSettings>,
      required: true
    }
  },
  computed: {
    isHidden () {
      if (this.settings.options && this.settings.options.displayFieldId && !!this.settings.options.displayFieldConditionQuery && this.content[this.settings.options.displayFieldId] !== this.settings.options.displayFieldConditionQuery) return true
      return false
    }
  },
  methods: {
    onClick (settings: ActionButtonSettings) {
      switch (settings.action) {
        case ACTION_BUTTON_TYPE.PAGE_DETAIL_TO:
          this.$emit('go-to-page-detail', {
            pageDetailId: settings.pageDetailId,
            pageQueryFieldId: settings.pageQueryFieldId
          })
          break
        case ACTION_BUTTON_TYPE.PROCESS_TRIGGER:
          this.$emit('create-process-run', { processId: settings.processId })
          break
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.action-button.primary {
  background-color: var(--primary-color);
}
.action-button.secondary {
  background-color: var(--secondary-color);
  &:hover {
    background-color: var(--secondary-color-lighten);
  }
}
.action-button.danger {
  background-color: var(--color-error);
  &:hover {
    background-color: var(--color-error);
  }
}
.action-button.warning {
  background-color: var(--color-warning);
  &:hover {
    background-color: var(--color-warning);
  }
}
.action-button.success {
  background-color: var(--color-success);
  &:hover {
    background-color: var(--color-success);
  }
}

.action-condition-checked {
  color: var(--color-success);
}
</style>
