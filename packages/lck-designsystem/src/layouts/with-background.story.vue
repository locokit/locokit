<template>
  <Story title="With background">
    <Variant title="default">
      <div class="flex">
        <with-background />
      </div>
    </Variant>
    <Variant title="slot title">
      <with-background>
        <template #title>
          This is a title
        </template>
      </with-background>
    </Variant>
    <Variant title="all slots">
      <with-background>
        <template #header>
          This is a header
        </template>
        <template #title>
          This is a title
        </template>
        This is the main part
        <template #footer>
          This is a footer
        </template>
      </with-background>
    </Variant>

  </Story>
</template>

<script setup lang="ts">
import WithBackground from './with-background.vue'
</script>
