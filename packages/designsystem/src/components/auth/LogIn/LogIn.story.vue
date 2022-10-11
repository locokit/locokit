<template>
  <Story title="Authentication/Login Form" icon="prime:user">
    <Variant title="default">
      <LogIn @submit="logEvent('submit', $event)" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { logEvent } from 'histoire/client'

import LogIn from './LogIn.vue'
</script>

<docs lang="md">
### LogIn

Form which allow an user to log in if his account is already created.

Allow also to access the lost password form or to access the registration form.
</docs>
