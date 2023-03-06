<template>
  <Story title="Profile/UpdatePasswordForm Form" icon="bi:shield-lock-fill">
    <Variant title="default">
      <UpdatePasswordForm
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

import UpdatePasswordForm from '../../components/profile/UpdatePasswordForm/UpdatePasswordForm.vue'
</script>

<docs lang="md">
### UpdatePasswordForm

Allow user to update its password
</docs>
