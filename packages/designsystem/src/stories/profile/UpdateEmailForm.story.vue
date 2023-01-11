<template>
  <Story title="Profile/UpdateEmailForm Form" icon="prime:user">
    <Variant title="default">
      <UpdateEmailForm
        :user="{
          id: 1,
          email: 'contact@locokit.com',
          profile: 'ADMIN',
          name: 'Companion Cube',
        }"
        @submit="logEvent('submit', $event)"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { logEvent } from 'histoire/client'

import UpdateEmailForm from '../../components/profile/UpdateEmailForm/UpdateEmailForm.vue'
</script>

<docs lang="md">
### UpdateEmailForm

Form which allow an user to update its email if this user is already logged.
</docs>
