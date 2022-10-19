<template>
  <WithBackground background-image="../../assets/dog.jpg">
    <PrimeCard class="flex-grow p-2 max-w-2xl">
      <template #title>
        <h1 class="text-center">{{ $t('pages.login.title') }}</h1>
      </template>
      <template #content>
        <LoginForm
          :loading="false"
          :error="error"
          :display-sign-up-link="false"
          lost-password-route="lost-password"
          @submit="onSubmit"
        />
      </template>
    </PrimeCard>
  </WithBackground>
</template>

<script setup lang="ts">
import PrimeCard from 'primevue/card'
import { LoginForm } from '@locokit/designsystem'
import WithBackground from '../../layouts/WithBackground/WithBackground.vue'
import { ref } from '#imports'
// import { Ref } from 'vue'
// import { ROUTES } from './paths'

const error = ref()

const onSubmit = () => {
  console.log('Bouh')
}

// const authenticate = async function (
//   data: Ref<{ email: string; password: string }>,
// ) {
//   console.log(data)
//   await authStore.authenticate(data.value)
//   if (authStore.isAuthenticated) {
//     router.push({
//       name: ROUTES.WORKSPACE.HOME,
//     })
//   }
// }
</script>
