<template>
  <NuxtLayout name="with-background" :background-image="backgroundImage">
    <div class="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 mx-4">
      <p-card>
        <template #title>
          <p class="text-center font-medium text-gray-500 my-4">
            {{ $t('pages.login.title') }}
          </p>
          <p class="text-gray-500 font-medium text-sm my-4">
            {{ $t('pages.login.subtitle') }}
          </p>
        </template>
        <template #content>
          <lck-login
            class="p-mt-4"
            :loading="authState.loading"
            :error="authState.error"
            :display-sign-up-link="appState.allowSignUp"
            @submit="authenticate"
          />
        </template>
      </p-card>
    </div>

    <div class="absolute bottom-0 right-0 p-2 drop-shadow-2xl">
      {{ version }}
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue'
import PCard from 'primevue/card'
// import LckLogin from '..//designsystem/src/components/auth/LogIn/LoginForm.vue'
import { useRouter } from 'vue-router'
import { useStoreAuth } from '../../store/auth'
import { ROUTES } from '../paths'

const authStore = useStoreAuth()
const router = useRouter()

const authState = ref({
  loading: false,
  error: null as null | Error,
  data: {
    expiredToken: false,
    isAuthenticated: false,
  },
})
const appState = ref({
  allowSignUp: false,
})

const LCK_THEME = {
  HOME_BACKGROUND_IMAGE_URL: '',
  LOGO_BG_PRIMARY_URL:
    'https://demo.locokit.io/themes/locokit/img/logo-dark.svg',
}
const LCK_VERSION = '0.8.0'

const backgroundImage = LCK_THEME.HOME_BACKGROUND_IMAGE_URL
const version = LCK_VERSION

const authenticate = async function (
  data: Ref<{ email: string; password: string }>,
) {
  console.log(data)
  await authStore.authenticate(data.value)
  if (authStore.isAuthenticated) {
    router.push({
      name: ROUTES.WORKSPACE.HOME,
    })
  }
}
</script>

<style scoped>
.p-error {
  font-weight: var(--font-weight-bold);
  position: relative;
  transition: opacity 0.5s ease-in-out;
  color: var(--color-error);
}
</style>
