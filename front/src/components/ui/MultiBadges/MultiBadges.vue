<template>
  <div>
    <lck-badge
      v-for="option in options"
      :backgroundColor="option.backgroundColor"
      :color="option.color"
      :key="option.value"
      :label="option.label"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'

import LckBadge from '@/components/ui/Badge/Badge.vue'
import { SelectValue } from '@/services/lck-api/definitions'

export default Vue.extend({
  name: 'LckMultiBadges',
  components: {
    'lck-badge': LckBadge,
  },
  props: {
    options: {
      type: Array,
      default: () => [],
    } as PropOptions<SelectValue[]>,
  },
})

</script>
