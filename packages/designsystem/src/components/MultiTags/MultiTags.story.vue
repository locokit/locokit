<template>
  <Story title="Tags/MultiTags" icon="bi:tags">
    <Variant title="default">
      <MultiTags :options="options" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import MultiTags from './MultiTags.vue'

const options = [
  {
    label: 'label',
    color: 'yellow',
    backgroundColor: 'grey',
    position: 4,
  },
  {
    label: 'label2',
    color: 'white',
    backgroundColor: 'black',
    position: 1,
  },
  {
    label: 'label3',
    color: 'white',
    backgroundColor: 'black',
    position: 1,
  },
]
</script>

<docs lang="md">
### MultiTags

Add a tags for multiselect
</docs>
