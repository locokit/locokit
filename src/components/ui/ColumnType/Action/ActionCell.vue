<template>
  <div>
    <lck-action-button
      :settings="settings"
      :content="content"
      @go-to-page-detail="$emit('go-to-page-detail', {...$event, rowId: content.id })"
      @create-process-run="$emit('create-process-run', {...$event, rowId: content.id })"
    />
  </div>
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
    action: {
      type: Object
    },
    content: {
      type: Object
    }
  },
  computed: {
    settings () {
      const { displayFieldConditionQuery, displayFieldId, ...data } = this.action
      return { ...data, options: { displayFieldConditionQuery, displayFieldId } }
    }
  }
})
</script>

<style scoped>

</style>
