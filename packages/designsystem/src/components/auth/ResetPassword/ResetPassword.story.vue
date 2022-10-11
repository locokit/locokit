<template>
  <Story
    title="Authentication/ResetPassword"
    icon="fluent:shield-person-20-filled"
  >
    <Variant title="default">
      <ResetPassword @submit="logEvent('submit', { email: $event })" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import ResetPassword from './ResetPassword.vue'
import { logEvent } from 'histoire/client'
// Need to transform string to object in event so that "Histoire.dev" can interpret it correctly.
</script>

<docs lang="md">
### ResetPassword

Form which allow an user to reset his password.
</docs>
