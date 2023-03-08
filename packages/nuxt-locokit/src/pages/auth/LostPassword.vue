<template>
  <WithBackground>
    <PrimeCard class="p-2">
      <template #title>
        <h1 class="text-center mb-4">
          {{ $t('pages.lostPassword.alternativeTitle') }}
        </h1>
      </template>
      <template #content>
        <div v-if="!formSentAndValid">
          <p class="mb-4">{{ $t('pages.lostPassword.description') }}</p>
          <LostPasswordForm
            :loading="loading"
            :error="error"
            :sign-in-route="ROUTES_PATH.AUTH.SIGN_IN"
            @submit="sendResetPasswordLink"
          />
        </div>
        <div v-else class="text-center">
          <div class="flex items-center px-3 pt-4 pb-6">
            <i
              aria-hidden="true"
              class="bi bi-check-circle-fill p-text-success mr-4 icon-with-text-aside"
            />
            <p class="text-justify">
              {{ $t('pages.lostPassword.sendMailToResetPassword') }}
            </p>
          </div>
          <NuxtLink
            class="flex justify-center"
            :to="{ name: ROUTES_NAMES.HOME }"
          >
            <i class="bi bi-house-fill mr-2" />
            <p>{{ $t('pages.lostPassword.homeLink') }}</p>
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
import { useI18n } from 'vue-i18n'
import WithBackground from '../../layouts/WithBackground.vue'
import { useStoreAuth } from '../../stores/auth'
import { ROUTES_NAMES, ROUTES_PATH } from '../../paths'
import { definePageMeta, ref, useHead } from '#imports'

const { t } = useI18n({ useScope: 'global' })

const authStore = useStoreAuth()

const { error } = storeToRefs(authStore)
const loading = ref(false) // check if necessary with vee-validate
const formSentAndValid = ref(false)

const sendResetPasswordLink = async (data: string) => {
  await authStore.sendLinkToResetPassword({ email: data })
  formSentAndValid.value = !error.value
}

definePageMeta({ middleware: ['anonymous-routes'] })

useHead({
  titleTemplate: `${t('pages.lostPassword.title')} | %s`,
})
</script>
