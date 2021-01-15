<template>
  <lck-dialog
    :visible="visible"
    :submitting="submitting"
    :header="$t('form.delete')"
    :isActionForm="true"
    @input="$emit('input', value)"
    @close="$emit('close')"
  >
    <p>
      <template v-if="value && value.text">
        {{ $t('form.specificDeleteConfirmation') }} <em>{{ itemCategory }} {{ value.text }}</em>.
      </template>
      <template v-else>{{$t('form.deleteConfirmation')}}</template>
    </p>
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
    }
  }
}
</script>
