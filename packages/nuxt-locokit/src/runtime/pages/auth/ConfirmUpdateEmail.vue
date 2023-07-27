<template>
  <WithHeader>
    <div
      class="max-w-lg h-full flex flex-col flex-wrap md:justify-center md:m-auto mt-8"
    >
      <div class="mb-8">
        <h1 class="text-center">
          {{ $t('pages.confirmUpdateEmail.title') }}
        </h1>
      </div>
      <div class="mb-8">
        <div v-if="route.query.token && !error">
          <p>
            {{ $t('pages.confirmUpdateEmail.message') }}
          </p>
        </div>
        <div v-else>
          <p>{{ $t('pages.confirmUpdateEmail.errorMessage') }}</p>
        </div>
      </div>
      <div>
        <div class="flex justify-end">
          <NuxtLink :to="{ name: ROUTES_NAMES.AUTH.SIGN_IN }">
            <PrimeButton
              class="p-button-rounded p-button-secondary"
              :label="$t('pages.confirmUpdateEmail.signIn')"
              icon="bi bi-person-badge"
            />
          </NuxtLink>
        </div>
      </div>
    </div>
  </WithHeader>
</template>

<script setup lang="ts">
import PrimeButton from 'primevue/button'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import WithHeader from '../../layouts/WithHeader.vue'
import { useStoreAuth } from '../../stores/auth'
import { ROUTES_NAMES } from '../../paths'
import { useHead, useRoute } from '#imports'

const { t } = useI18n({ useScope: 'global' })
const route = useRoute()
const authStore = useStoreAuth()
const { error } = storeToRefs(authStore)

if (route.query.token) {
  authStore.confirmUpdateEmail(route.query.token as string)
}

useHead({
  titleTemplate: `${t('pages.confirmUpdateEmail.title')} | %s`,
})
</script>
