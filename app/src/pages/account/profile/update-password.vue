<template>
  <h1 class="mb-4 text-2xl text-primary font-bold">
    {{ t('locokit.pages.updatePassword.title') }}
  </h1>
  <update-password-form
    v-if="authStore.authState.user"
    :loading="authStore.authState.loading"
    :message="message"
    @submit="onSubmit"
  />
  <p v-else>
    {{ t('locokit.pages.updatePassword.userNotFound') }}
  </p>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import { useToast } from 'primevue/usetoast'
import { UpdatePasswordForm } from '@locokit/vue-components'
import { type LocoKitMessage } from '@locokit/definitions'
import { useStoreAuth } from '@/stores/auth'
import { sdkClient } from '@/services/sdk'
import ROUTE_NAMES from '@/router/routes'

const { t } = useI18n()

definePage({
  name: ROUTE_NAMES.ACCOUNT.PROFILE.UPDATE_PASSWORD,
})
useHead({
  titleTemplate: `${t('locokit.pages.profile.title')} | %s`,
})

const authStore = useStoreAuth()
const message = ref<LocoKitMessage | undefined>(undefined)
const toast = useToast()

async function onSubmit(data: {
  currentPassword: string
  newPassword: string
}) {
  await authStore.updatePassword({
    email: authStore.authState.user.email,
    password: data.currentPassword,
    newPassword: data.newPassword,
  })

  if (authStore.authState.error) {
    message.value = {
      status: 'error',
      text: authStore.authState.error.message,
    }
  } else {
    message.value = undefined

    toast.add({
      severity: 'success',
      summary: t('locokit.success.basic'),
      life: 3000,
    })
  }
}
</script>
