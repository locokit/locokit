<template>
  <WithBackground background-image="../../assets/dog.jpg">
    <PrimeCard class="flex-grow p-2 max-w-2xl">
      <template #title>
        {{ $t('pages.signUp.title') }}
      </template>
      <template #content>
        <div v-if="!signUpOk">
          <p class="mb-4">{{ $t('pages.signUp.description') }}</p>
          <SignUpForm :error="error" :loading="loading" @submit="signUp" />
        </div>
        <div v-else class="text-center">
          <div class="flex items-center px-3 pb-3">
            <i
              style="font-size: 2em"
              class="pi pi-check-circle p-text-success mr-4"
            ></i>
            <p class="text-justify">{{ $t('pages.signUp.signUpOk') }}</p>
          </div>
          <NuxtLink to="/">
            {{ $t('pages.signUp.homeLink') }}
          </NuxtLink>
        </div>
      </template>
    </PrimeCard>
  </WithBackground>
</template>

<script setup lang="ts">
import PrimeCard from 'primevue/card'
import { SignUpForm } from '@locokit/designsystem'
import WithBackground from '../../layouts/WithBackground/WithBackground.vue'
import { ref } from '#imports'

const error = ref()
const loading = ref(false) // check if necessary with vee-validate
const signUpOk = ref(false)

const signUp = () => {
  console.log('Bouh')
}
</script>
