<template>
  <WithHeader>
    <div
      class="max-w-lg h-full flex flex-col flex-wrap md:justify-center md:m-auto mt-8"
    >
      <div class="mb-8">
        <h1 class="text-center">
          {{ $t('pages.signUp.title') }}
        </h1>
      </div>
      <div>
        <div v-if="!formSentAndValid">
          <p class="mb-4">{{ $t('pages.signUp.description') }}</p>
          <SignUpForm :loading="loading" :error="error" @submit="signUp" />
        </div>
        <div v-else class="text-center">
          <div class="flex items-center px-3 pt-4 pb-6">
            <i
              aria-hidden="true"
              class="bi bi-check-circle-fill p-text-success mr-4 icon-with-text-aside"
            />
            <p class="text-justify">
              {{ $t('pages.signUp.sendMailToCompleteAccount') }}
            </p>
          </div>
          <NuxtLink
            class="no-decoration-link"
            :to="{ name: ROUTES_NAMES.HOME }"
          >
            {{ $t('pages.signUp.homeLink') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </WithHeader>
</template>

<script setup lang="ts">
import { SignUpForm } from '@locokit/designsystem'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import WithHeader from '../../layouts/WithHeader.vue'
import { ROUTES_NAMES } from '../../locokit-paths'
import { useStoreAuth } from '../../stores/auth'
import { definePageMeta, ref, useHead } from '#imports'

const { t } = useI18n({ useScope: 'global' })
const authStore = useStoreAuth()

const { error, loading } = storeToRefs(authStore)
const formSentAndValid = ref(false)

const signUp = async (data: { email: string; username: string }) => {
  await authStore.signUp(data)
  formSentAndValid.value = !error.value
}

definePageMeta({ middleware: ['anonymous-routes'] })

useHead({
  titleTemplate: `${t('pages.signUp.title')} | %s`,
})
</script>
