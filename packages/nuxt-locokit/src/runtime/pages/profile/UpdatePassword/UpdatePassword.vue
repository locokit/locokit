<template>
  <div class="py-3 my-2">
    <h3 class="mb-4">
      {{ $t('pages.updatePassword.title') }}
    </h3>
    <UpdatePasswordForm
      v-if="user"
      :response="response"
      :loading="loading"
      @submit="updatePassword"
    />
    <p v-else>{{ $t('pages.updatePassword.userNotFound') }}</p>
  </div>
</template>

<script setup lang="ts">
import { UpdatePasswordForm } from '@locokit/designsystem'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useStoreAuth } from '../../../stores/auth'
import { ref, useHead } from '#imports'

const { t } = useI18n({ useScope: 'global' })
const authStore = useStoreAuth()

const { error, loading, user } = storeToRefs(authStore)
const response = ref()

const updatePassword = async (data: {
  currentPassword: string
  newPassword: string
}) => {
  response.value = null
  const res = await authStore.updatePassword({
    email: user.value.email,
    password: data.currentPassword,
    newPassword: data.newPassword,
  })

  if (error.value !== null) {
    response.value = error.value
  } else {
    response.value = res
  }
}

useHead({
  titleTemplate: `${t('pages.updatePassword.title')} | %s`,
})
</script>
