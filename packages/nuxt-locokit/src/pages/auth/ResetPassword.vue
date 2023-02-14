<template>
  <WithHeader>
    <div
      class="max-w-lg lg:h-full m-auto mt-8 pb-4 px-4 lg:px-0 flex flex-col justify-center"
    >
      <div class="mb-8">
        <h1 class="text-center">
          {{ $t('pages.resetPassword.title') }}
        </h1>
      </div>
      <div>
        <div v-if="!formSentAndValid">
          <p class="mb-4">
            {{ $t('pages.resetPassword.description') }}
          </p>
          <PasswordForm
            :loading="loading"
            :error="error"
            :label-submit="$t('pages.resetPassword.labelSubmit')"
            @submit="resetPassword"
          />
        </div>
        <div v-else class="text-center">
          <div class="flex items-center px-3 pt-4 pb-6">
            <i
              aria-hidden="true"
              class="bi bi-check-circle-fill p-text-success mr-4 icon-with-text-aside"
            />
            <p class="text-justify">
              {{ $t('pages.resetPassword.updatedPassword') }}
            </p>
          </div>

          <NuxtLink
            class="no-decoration-link"
            :to="{ name: ROUTES_NAMES.HOME }"
          >
            {{ $t('pages.resetPassword.homeLink') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </WithHeader>
</template>

<script setup lang="ts">
import { PasswordForm } from '@locokit/designsystem'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import WithHeader from '../../layouts/WithHeader.vue'
import { useStoreAuth } from '../../stores/auth'
import { ROUTES_NAMES } from '../../paths'
import { definePageMeta, ref, useHead, useRoute } from '#imports'

const { t } = useI18n({ useScope: 'global' })

const authStore = useStoreAuth()
const route = useRoute()

const { error } = storeToRefs(authStore)
const loading = ref(false) // check if necessary with vee-validate
const formSentAndValid = ref(false)

const resetPassword = async (data: string) => {
  await authStore.resetPasswordLong({
    token: route.query?.token as string,
    password: data,
  })
  formSentAndValid.value = !error.value
}

definePageMeta({ middleware: ['anonymous-routes'] })

useHead({
  titleTemplate: `${t('pages.resetPassword.title')} | %s`,
})
</script>
