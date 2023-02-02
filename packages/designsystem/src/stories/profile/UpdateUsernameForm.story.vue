<template>
  <Story title="Profile/UpdateUsernameForm Form" icon="prime:user">
    <Variant title="default">
      <UpdateUsernameForm
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

import UpdateUsernameForm from '../../components/profile/UpdateUsernameForm/UpdateUsernameForm.vue'
</script>

<docs lang="md">
### UpdateUsernameForm

Form which allow an user to update its name/username if this user is already logged.
</docs>
