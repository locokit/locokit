<template>
  <p-button
    class="action-button"
    v-if="settings"
    :label="settings.label"
    :class="settings.classButton"
    :icon="loading ? 'pi pi-spin pi-spinner' : settings.icon"
    :disabled="loading || isHidden"
    @click="onClick(settings)"
  />
  <span v-else-if="displayCheckIcon"><i class="action-condition-checked bi bi-check"/></span>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { LckTableRow } from '@/services/lck-api/definitions'
import {
  ACTION_BUTTON_TYPE,
  ActionButtonSettings,
} from '@locokit/lck-glossary/src'

import Button from 'primevue/button'

export default Vue.extend({
  name: 'ActionButton',
  components: {
    'p-button': Vue.extend(Button),
  },
  props: {
    displayCheckIcon: {
      type: Boolean,
      default: false,
    },
    content: {
      type: Object as PropType<{ data: LckTableRow[] | LckTableRow }>,
    },
    settings: {
      type: Object as PropType<ActionButtonSettings>,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isHidden () {
      return (
        this.settings?.displayFieldId &&
        this.row?.data[this.settings.displayFieldId] !== (this.settings.displayFieldConditionQuery === 'true')
      )
    },
    row () {
      if (this.content && Array.isArray(this.content.data)) {
        // Case for ActionButton block
        return this.content.data[0]
      }
      // Case for ActionButton in DataTable
      return this.content
    },
  },
  methods: {
    onClick (settings: ActionButtonSettings) {
      switch (settings.action) {
        case ACTION_BUTTON_TYPE.PAGE_DETAIL_TO:
          this.$emit('go-to-page-detail', {
            pageDetailId: settings.pageDetailId,
            pageQueryFieldId: settings.pageQueryFieldId,
            rowData: this.row,
          })
          break
        case ACTION_BUTTON_TYPE.PROCESS_TRIGGER:
          this.$emit('create-process-run', {
            processId: settings.processId,
            typePageTo: settings.typePageTo,
            pageRedirectId: settings.pageRedirectId,
            pageQueryFieldId: settings.pageQueryFieldId,
            notificationSuccessTitle: settings.notificationSuccessTitle,
            notificationSuccessDescription: settings.notificationSuccessDescription,
            notificationErrorTitle: settings.notificationErrorTitle,
            notificationErrorDescription: settings.notificationErrorDescription,
            rowData: this.row,
          })
          break
      }
    },
  },
})
</script>

<style>
.lck-action-button {
  text-align: center;
}
</style>

<style lang="scss" scoped>
.action-button.primary {
  background-color: var(--primary-color);
}
.action-button.secondary {
  background-color: var(--secondary-color);
  &:hover {
    background-color: var(--secondary-color-light);
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
