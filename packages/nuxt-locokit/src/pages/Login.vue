<template>
  <WithBackground background-image="assets/dog.jpg">
    <PrimeCard class="flex-grow p-2 max-w-2xl">
      <template #title>
        <h1 class="text-center">{{ $t('pages.login.title') }}</h1>
      </template>
      <template #content>
        <LoginForm
          :loading="false"
          :error="error"
          :display-sign-up-link="false"
          @submit="onSubmit"
        />
      </template>
    </PrimeCard>
  </WithBackground>
</template>

<script setup lang="ts">
import PrimeCard from 'primevue/card'
import { LoginForm } from '@locokit/designsystem'
import WithBackground from '../layouts/WithBackground/WithBackground.vue'
import { ref } from '#imports'

const error = ref()

const onSubmit = () => {
  console.log('Bouh')
}
</script>
