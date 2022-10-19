<template>
  <WithBackground background-image="../../assets/dog.jpg">
    <PrimeCard class="flex-grow p-2 max-w-2xl">
      <template #title>
        <h1 class="text-center">{{ $t('pages.lostPassword.title') }}</h1>
      </template>
      <template #content>
        <div v-if="!resetOK">
          <p class="mb-4">{{ $t('pages.lostPassword.description') }}</p>
          <LostPasswordForm
            class="p-mt-4"
            :loading="loading"
            :error="error"
            :send-reset-ok="resetOK"
            @submit="sendResetPasswordLink"
          />
        </div>
        <div v-else class="text-center">
          <div class="flex items-center px-3 pb-3">
            <i
              style="font-size: 2em"
              class="pi pi-check-circle p-text-success mr-4"
            ></i>
            <p class="text-justify">
              {{ $t('pages.lostPassword.sendMailConfirmed') }}
            </p>
          </div>
          <NuxtLink to="/">
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
import WithBackground from '../../layouts/WithBackground/WithBackground.vue'
import { ref } from '#imports'

const error = ref(null)
const loading = ref(false) // check if necessary with vee-validate
const resetOK = ref(false)

const sendResetPasswordLink = () => {
  console.log('Bouh')
}
</script>
