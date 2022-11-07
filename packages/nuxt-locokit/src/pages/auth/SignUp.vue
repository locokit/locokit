<template>
  <WithBackground>
    <PrimeCard class="flex-grow p-2 max-w-2xl">
      <template #title>
        <h1 class="text-center mb-4">{{ $t('pages.signUp.title') }}</h1>
      </template>
      <template #content>
        <div v-if="!formSentAndValid">
          <p class="mb-4">{{ $t('pages.signUp.description') }}</p>
          <SignUpForm :error="error" :loading="loading" @submit="signUp" />
        </div>
        <div v-else class="text-center">
          <div class="flex items-center px-3 pt-4 pb-6">
            <i
              aria-hidden="true"
              class="pi pi-check-circle p-text-success mr-4 icon-with-text-aside"
            />
            <p class="text-justify">
              {{ $t('pages.signUp.sendMailToCompleteAccount') }}
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
import { SignUpForm } from '@locokit/designsystem'
import { storeToRefs } from 'pinia'
import WithBackground from '../../layouts/WithBackground.vue'
import { ROUTES_NAMES } from '../paths'
import { useStoreAuth } from '../../stores/auth'
import { ref } from '#imports'

const authStore = useStoreAuth()

const { error } = storeToRefs(authStore)
const loading = ref(false) // check if necessary with vee-validate
const formSentAndValid = ref(false)

const signUp = async (data: { email: string; name: string }) => {
  await authStore.signUp(data)
  formSentAndValid.value = !error.value
}
</script>
