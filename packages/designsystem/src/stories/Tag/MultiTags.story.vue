<template>
  <Story title="Tags/MultiTags" icon="bi:tags">
    <Variant title="default">
      <MultiTags :options="options" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import MultiTags from '../../components/MultiTags/MultiTags.vue'
import { COLOR_SCHEME } from '../../helpers/color'

const options = COLOR_SCHEME.slice(0, 6).map((color) => ({
  ...color,
  label: 'placeholder',
}))
</script>

<docs lang="md">
### MultiTags

Add a tags for multiselect
</docs>
