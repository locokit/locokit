<template>
  <lck-dialog
    :visible="visible"
    :header="$t('form.delete')"
    :isActionForm="true"
    :submitting="submitting"
    @input="$emit('input', value)"
    @close="$emit('close')"
  >
      <template v-if="value && value[fieldToDisplay]">
        <p class="lck-color-content">{{ $t('form.specificDeleteConfirmation') }}</p>
        <p class="lck-color-content"><strong>{{ itemCategory}} / {{ value[fieldToDisplay] }}</strong></p>
      </template>
      <template v-else>
        <p class="lck-color-content">{{$t('form.deleteConfirmation')}}</p>
      </template>
  </lck-dialog>
</template>

<script>
import Dialog from '@/components/ui/Dialog/Dialog.vue'

export default {
  name: 'DeleteConfirmationDialog',
  components: {
    'lck-dialog': Dialog
  },
  props: {
    itemCategory: {
      type: String,
      default: ''
    },
    submitting: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object
    },
    fieldToDisplay: {
      type: String,
      default: 'text'
    }
  }
}
</script>
