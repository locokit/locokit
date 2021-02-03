<template>
  <lck-dialog-form
    :visible="visible"
    :header="$t('form.delete')"
    :submitting="submitting"
    @input="$emit('input', value)"
    @close="$emit('close')"
  >
    <p>
      <template v-if="value && value.text">
        {{ $t('form.specificDeleteConfirmation') }} <strong>{{ itemCategory }} {{ value.text }}</strong>.
      </template>
      <template v-else>{{$t('form.deleteConfirmation')}}</template>
    </p>
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
    }
  }
}
</script>
