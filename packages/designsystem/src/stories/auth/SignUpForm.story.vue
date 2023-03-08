<template>
  <Story title="Authentication/SignUp" icon="bi:person-fill">
    <Variant title="default">
      <SignUpForm @submit="logEvent('submit', $event)" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { logEvent } from 'histoire/client'

import SignUpForm from '../../components/auth/SignUpForm/SignUpForm.vue'
</script>

<docs lang="md">
### SignUp

Allow an user to sign up.
</docs>
