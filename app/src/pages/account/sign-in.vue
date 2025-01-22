<template>
  <LayoutHeader>
    <main class="bg-white dark:bg-slate-800 rounded-md max-w-[48rem] mx-auto mt-4 p-4 shadow-md">
      <h1 class="text-xl text-center font-medium mb-4">
        {{ t('app.routes.auth.login') }}
      </h1>
      <sign-in-form
        class="bg-white dark:bg-slate-800 rounded-md p-4"
        :display-lost-password-link="true"
        lost-password-route="/auth/lost-password"
        @submit="onSubmit"
      />
    </main>
  </LayoutHeader>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { SignInForm } from '@locokit/vue-components'
import LayoutHeader from '@/layouts/header.vue'
import ROUTE_NAMES from '@/router/routes'
import { useStoreAuth } from '@/stores/auth'

definePage({
  name: ROUTE_NAMES.ACCOUNT.SIGN_IN,
  meta: {
    displayHeader: true,
    displayFooter: true,
  },
})

const { t } = useI18n()
const router = useRouter()
const authStore = useStoreAuth()

async function onSubmit(credentials: { email: string; password: string }) {
  await authStore.authenticate(credentials)
  // TODO: toast something
  if (authStore.authState.isAuthenticated) {
    router.push({ name: ROUTE_NAMES.WORKSPACE.LIST })
  }
}
</script>
