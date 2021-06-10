<template>
  <lck-action-button
    :displayCheckIcon="displayCheckIcon"
    :settings="action"
    :content="content"
    @go-to-page-detail="$emit('go-to-page-detail', {...$event, rowData: content })"
    @create-process-run="$emit('create-process-run', {...$event, rowData: content })"
  />
</template>

<script>
import Vue from 'vue'

import ActionButton from '@/components/visualize/ActionButton/ActionButton'

export default Vue.extend({
  name: 'LckActionCell',
  components: {
    'lck-action-button': ActionButton
  },
  props: {
    displayCheckIcon: {
      type: Boolean,
      default: false
    },
    action: {
      type: Object
    },
    content: {
      type: Object
    }
  }
})
</script>
