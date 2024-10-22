<template>
  <WithHeader>
    <div
      class="max-w-lg h-full flex flex-col flex-wrap md:justify-center pb-4 px-4 md:m-auto mt-8"
    >
      <div class="mb-8">
        <h1 class="text-center">{{ $t('locokit.pages.signIn.title') }}</h1>
      </div>
      <SignInForm
        :loading="loading"
        :response="error"
        :display-sign-up-link="false"
        :lost-password-route="ROUTES_PATH.AUTH.LOST_PASSWORD"
        @submit="authenticate"
      />
    </div>
  </WithHeader>
</template>

<script setup lang="ts">
import { SignInForm } from '@locokit/designsystem'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import WithHeader from '../../layouts/WithHeader.vue'
import { useStoreAuth } from '../../stores/auth'
import { ROUTES_PATH, ROUTES_NAMES } from '../../locokit-paths'
import { definePageMeta, useHead, useRouter } from '#imports'

const { t } = useI18n({ useScope: 'global' })

const router = useRouter()
const authStore = useStoreAuth()

const { error, loading } = storeToRefs(authStore)

const authenticate = async (data: { email: string; password: string }) => {
  await authStore.authenticate(data)

  if (authStore.isAuthenticated) {
    await router.push({
      name: ROUTES_NAMES.WORKSPACE.WORKSPACES,
    })
  }
}

definePageMeta({ middleware: ['anonymous-routes'] })

useHead({
  titleTemplate: `${t('locokit.pages.signIn.title')} | %s`,
})
</script>
