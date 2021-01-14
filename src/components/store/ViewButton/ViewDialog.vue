<template>
  <lck-dialog
    :visible.sync="visible"
    :header="
      currentData.id
      ? $t('components.datatable.toolbar.views.editLabel')
      : $t('components.datatable.toolbar.views.createLabel')
    "
    @input="$emit('input', currentData)"
    @close="$emit('close')"
    :isActionForm="true"
  >
    <div class="p-field">
      <label for="viewTextField">
        {{ $t('components.datatable.toolbar.views.viewTextLabel') }}</label>
      <p-input-text
        id="viewTextField"
        v-model="currentData.text"
      />
    </div>
    <div class="p-field">
      <label for="viewLockedField">
        {{ $t('components.datatable.toolbar.views.viewLockedLabel') }}</label>
      <p-toggle-button
        id="viewLockedField"
        v-model="currentData.locked"
        :onLabel="$t('components.datatable.toolbar.views.viewLockedLabelOn')" onIcon="pi pi-lock"
        :offLabel="$t('components.datatable.toolbar.views.viewLockedLabelOff')" offIcon="pi pi-unlock"
        iconPos="right"
      />
    </div>
  </lck-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import Dialog from '@/components/ui/Dialog/Dialog.vue'
import InputText from 'primevue/inputtext'
import ToggleButton from 'primevue/togglebutton'

export default {
  name: 'ViewDialog',
  components: {
    'lck-dialog': Vue.extend(Dialog),
    'p-input-text': Vue.extend(InputText),
    'p-toggle-button': Vue.extend(ToggleButton)
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      currentData: {}
    }
  },
  watch: {
    value: {
      handler (newValue: {}) {
        this.currentData = {
          ...newValue
        }
      },
      immediate: true
    }
  }
}
</script>
