<template>
  <WithBackground>
    <PrimeCard class="p-2">
      <template #title>
        <h1 class="text-center mb-4">{{ $t('pages.lostPassword.title') }}</h1>
      </template>
      <template #content>
        <div v-if="!formSentAndValid">
          <p class="mb-4">{{ $t('pages.lostPassword.description') }}</p>
          <LostPasswordForm
            :loading="loading"
            :error="error"
            @submit="sendResetPasswordLink"
          />
        </div>
        <div v-else class="text-center">
          <div class="flex items-center px-3 pt-4 pb-6">
            <i
              class="pi pi-check-circle p-text-success mr-4 icon-with-text-aside"
            />
            <p class="text-justify">
              {{ $t('pages.lostPassword.sendMailToResetPassword') }}
            </p>
          </div>
          <NuxtLink
            class="no-decoration-link"
            :to="{ name: ROUTES_NAMES.HOME }"
          >
            {{ $t('pages.lostPassword.homeLink') }}
          </NuxtLink>
        </div>
      </template>
    </PrimeCard>
  </WithBackground>
</template>

<script setup lang="ts">
import PrimeCard from 'primevue/card'
import { LostPasswordForm } from '@locokit/designsystem'
import { storeToRefs } from 'pinia'
import WithBackground from '../../layouts/WithBackground/WithBackground.vue'
import { useStoreAuth } from '../../stores/auth'
import { ROUTES_NAMES } from '../paths'
import { ref } from '#imports'

const authStore = useStoreAuth()

const { error } = storeToRefs(authStore)
const loading = ref(false) // check if necessary with vee-validate
const formSentAndValid = ref(false)

const sendResetPasswordLink = async (data: string) => {
  await authStore.sendLinkToResetPassword({ email: data })
  formSentAndValid.value = !error.value
}
</script>
