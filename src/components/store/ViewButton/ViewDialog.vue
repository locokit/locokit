<template>
  <lck-dialog
    :visible.sync="visible"
    :header="
      currentData.id
      ? $t('components.datatable.toolbar.views.editLabel')
      : $t('components.datatable.toolbar.views.createLabel')
    "
    @input="$emit('input', currentData)"
  >
    <label for="viewTextField">
      {{ $t('components.datatable.toolbar.views.viewTextLabel') }}</label>
    <p-input-text
      id="viewTextField"
      v-model="currentData.text"
    />
  </lck-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import Dialog from '@/components/ui/Dialog/Dialog.vue'
import InputText from 'primevue/inputtext'

export default {
  name: 'ViewDialog',
  components: {
    'lck-dialog': Vue.extend(Dialog),
    'p-input-text': Vue.extend(InputText)
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
      handler (newValue) {
        this.currentData = {
          ...newValue
        }
      },
      immediate: true
    }
  }
}
</script>
