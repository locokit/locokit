<template>
  <Story title="Authentication/SignIn Form" icon="bi:person-fill">
    <Variant title="default">
      <SignInForm @submit="logEvent('submit', $event)" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { logEvent } from 'histoire/client'

import SignInForm from '../../components/auth/SignInForm/SignInForm.vue'
</script>

<docs lang="md">
### SignInForm

Form which allow an user to sign in if his account is already created.

Allow also to access the lost password form or to access the registration form.
</docs>
