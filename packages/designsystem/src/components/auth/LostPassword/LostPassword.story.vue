<template>
  <Story title="Authentication/Lost Password Form" icon="prime:user">
    <Variant title="default">
      <LostPassword @submit="logEvent('submit', { email: $event })" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import LostPassword from './LostPassword.vue'
import { logEvent } from 'histoire/client'
// Need to transform string to object in event so that "Histoire.dev" can interpret it correctly.
</script>

<docs lang="md">
### LostPassword

Form which allow an user to report the loss of his password.
</docs>
