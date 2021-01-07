<template>
  <lck-dialog
    :visible="visible"
    :header="$t('form.delete')"
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

<script lang="ts">
import Dialog from '@/components/ui/Dialog/Dialog.vue'

export default {
  name: 'DeleteConfirmationDialog',
  components: {
    'lck-dialog': Dialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object
    },
    itemCategory: {
      type: String,
      default: ''
    }
  }
}
</script>
