<template>
  <Story title="Authentication/SignUp" icon="prime:user">
    <Variant title="default">
      <SignUp @submit="logEvent('submit', $event)" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { logEvent } from 'histoire/client'

import SignUp from './SignUp.vue'
</script>

<docs lang="md">
### SignUp

Allow an user to sign up.
</docs>
