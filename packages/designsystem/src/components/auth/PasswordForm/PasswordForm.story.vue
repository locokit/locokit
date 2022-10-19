<template>
  <Story
    title="Authentication/PasswordForm"
    icon="fluent:shield-person-20-filled"
  >
    <Variant title="default">
      <PasswordForm @submit="logEvent('submit', { email: $event })" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PasswordForm from './PasswordForm.vue'
import { logEvent } from 'histoire/client'
// Need to transform string to object in event so that "Histoire.dev" can interpret it correctly.
</script>

<docs lang="md">
### PasswordForm

Form which allow an user to reset his password.
</docs>
