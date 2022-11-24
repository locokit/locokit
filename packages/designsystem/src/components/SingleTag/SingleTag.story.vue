<template>
  <Story title="Tags/SingleTag" icon="bi:tag">
    <Variant title="default">
      <SingleTag label="label" />
    </Variant>
    <Variant title="red">
      <SingleTag label="label" background-color="red" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import SingleTag from './SingleTag.vue'
</script>

<docs lang="md">
### SingleTag

Add a tag for multiselect
</docs>
