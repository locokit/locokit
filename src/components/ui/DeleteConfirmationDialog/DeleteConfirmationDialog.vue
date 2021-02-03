<template>
  <lck-dialog-form
    :visible="visible"
    :header="$t('form.delete')"
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
  </lck-dialog-form>
</template>

<script>
import DialogForm from '@/components/ui/DialogForm/DialogForm.vue'

export default {
  name: 'DeleteConfirmationDialog',
  components: {
    'lck-dialog-form': DialogForm
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
