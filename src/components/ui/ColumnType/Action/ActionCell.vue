<template>
  <lck-action-button
    :displayCheckIcon="displayCheckIcon"
    :settings="action"
    :content="content"
    v-on="$listeners"
  />
</template>

<script>
import Vue from 'vue'

import ActionButton from '@/components/visualize/ActionButton/ActionButton'

export default Vue.extend({
  name: 'LckActionCell',
  components: {
    'lck-action-button': ActionButton,
  },
  props: {
    displayCheckIcon: {
      type: Boolean,
      default: false,
    },
    action: {
      type: Object,
    },
    content: {
      type: Object,
    },
  },
})
</script>
