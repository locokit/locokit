<template>
  <h1 class="mb-4 text-2xl text-primary font-bold">
    {{ t('locokit.pages.updateEmail.title') }}
  </h1>
  <update-email-form
    v-if="authStore.authState.user"
    :current-email="authStore.authState.user.email"
    :loading="authStore.authState.loading"
    :message="message"
    @submit="onSubmit"
  />
  <p v-else>
    {{ t('locokit.pages.updateEmail.userNotFound') }}
  </p>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import { useToast } from 'primevue/usetoast'
import { UpdateEmailForm } from '@locokit/vue-components'
import { type LocoKitMessage } from '@locokit/definitions'
import { useStoreAuth } from '@/stores/auth'
import ROUTE_NAMES from '@/router/routes'

const { t } = useI18n()

definePage({
  name: ROUTE_NAMES.ACCOUNT.PROFILE.UPDATE_EMAIL,
})
useHead({
  titleTemplate: `${t('locokit.pages.profile.title')} | %s`,
})

const authStore = useStoreAuth()
const message = ref<LocoKitMessage | undefined>(undefined)
const toast = useToast()

async function onSubmit(data: { newEmail: string; password: string }, reset: () => void) {
  await authStore.updateEmail({
    email: authStore.authState.user.email,
    newEmail: data.newEmail,
    password: data.password,
  })

  if (authStore.authState.error) {
    message.value = {
      status: 'error',
      text: authStore.authState.error.message,
    }
  } else {
    message.value = {
      status: 'success',
      text: t('locokit.pages.updateEmail.successMessage'),
    }

    toast.add({
      severity: 'success',
      summary: t('locokit.success.basic'),
      life: 3000,
    })
  }
}
</script>
