<template>
  <Story title="Profile/UpdateUsernameForm Form" icon="bi:person-fill">
    <Variant title="default">
      <UpdateGeneralForm
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
import UpdateGeneralForm from '../../components/profile/UpdateGeneralForm/UpdateGeneralForm.vue'
</script>

<docs lang="md">
### UpdateGeneralForm

Form which allow an user to update its profile if this user is already logged.
</docs>
