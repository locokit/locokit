<template>
  <WithBackground>
    <PrimeCard class="flex-grow p-2 max-w-2xl">
      <template #title>
        <h1 class="text-center mb-4">{{ $t('pages.resetPassword.title') }}</h1>
      </template>
      <template #content>
        <div v-if="!formSentAndValid">
          <p class="mb-4">{{ $t('pages.resetPassword.description') }}</p>
          <PasswordForm
            :loading="loading"
            :error="error"
            :label-submit="$t('pages.resetPassword.labelSubmit')"
            @submit="resetPassword"
          />
        </div>
        <div v-else class="text-center">
          <div class="flex items-center px-3 pt-4 pb-6">
            <i
              aria-hidden="true"
              class="pi pi-check-circle p-text-success mr-4 icon-with-text-aside"
            />
            <p class="text-justify">
              {{ $t('pages.resetPassword.updatedPassword') }}
            </p>
          </div>

          <NuxtLink
            class="no-decoration-link"
            :to="{ name: ROUTES_NAMES.HOME }"
          >
            {{ $t('pages.resetPassword.homeLink') }}
          </NuxtLink>
        </div>
      </template>
    </PrimeCard>
  </WithBackground>
</template>

<script setup lang="ts">
import PrimeCard from 'primevue/card'
import { PasswordForm } from '@locokit/designsystem'
import { storeToRefs } from 'pinia'
import WithBackground from '../../layouts/WithBackground/WithBackground.vue'
import { useStoreAuth } from '../../stores/auth'
import { ROUTES_NAMES } from '../paths'
import { ref, useRoute } from '#imports'

const authStore = useStoreAuth()
const route = useRoute()

const { error } = storeToRefs(authStore)
const loading = ref(false) // check if necessary with vee-validate
const formSentAndValid = ref(false)

const resetPassword = async (data: string) => {
  await authStore.resetPasswordLong({
    token: route.query?.token as string,
    password: data,
  })
  formSentAndValid.value = !error.value
}
</script>
