<template>
  <Story title="Authentication/Lost Password Form" icon="bi:person-fill">
    <Variant title="default">
      <LostPasswordForm @submit="logEvent('submit', { email: $event })" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import LostPasswordForm from '../../components/auth/LostPasswordForm/LostPasswordForm.vue'
import { logEvent } from 'histoire/client'
// Need to transform string to object in event so that "Histoire.dev" can interpret it correctly.
</script>

<docs lang="md">
### LostPasswordForm

Form which allow an user to report the loss of his password.
</docs>
