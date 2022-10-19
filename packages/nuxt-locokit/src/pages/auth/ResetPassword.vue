<template>
  <WithBackground background-image="../../assets/dog.jpg">
    <PrimeCard class="flex-grow p-2 max-w-2xl">
      <template #title>
        <h1 class="text-center">{{ $t('pages.resetPassword.title') }}</h1>
      </template>
      <template #content>
        <div v-if="!resetOK">
          <p class="mb-4">{{ $t('pages.resetPassword.description') }}</p>
          <PasswordForm
            class="p-mt-4"
            :loading="loading"
            :error="error"
            :label-submit="$t('pages.resetPassword.labelSubmit')"
            @submit="resetPassword"
          />
        </div>
        <div v-else>
          <p>
            {{ $t('pages.resetPassword.resetOK') }}
          </p>

          <NuxtLink to="/">
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
import WithBackground from '../../layouts/WithBackground/WithBackground.vue'
import { ref } from '#imports'

const error = ref(null)
const loading = ref(false) // check if necessary with vee-validate
const resetOK = ref(false)

const resetPassword = () => {
  console.log('Bouh')
}
</script>
