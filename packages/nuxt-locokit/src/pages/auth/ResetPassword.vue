<template>
  <WithHeader>
    <div
      class="h-full flex flex-col flex-wrap md:justify-center md:m-auto mt-8"
    >
      <div class="mb-8">
        <h1 class="text-center">
          {{ $t('pages.resetPassword.title') }}
        </h1>
      </div>
      <div v-if="route.query.token" class="max-w-lg mx-auto">
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
        <div v-else class="text-center max-w-lg">
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
            :to="{ name: ROUTES_NAMES.AUTH.SIGN_IN }"
          >
            {{ $t('pages.resetPassword.signIn') }}
          </NuxtLink>
        </div>
      </div>
      <div v-else class="max-w-2xl mx-auto">
        <MessageForUser
          status="failed"
          custom-msg-error-form="pages.resetPassword.missingToken"
        />
      </div>
    </div>
  </WithHeader>
</template>

<script setup lang="ts">
import { PasswordForm, MessageForUser } from '@locokit/designsystem'
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
  if (route.query.token) {
    await authStore.resetPasswordLong({
      token: route.query.token as string,
      password: data,
    })
    formSentAndValid.value = !error.value
  }
}

definePageMeta({ middleware: ['anonymous-routes'] })

useHead({
  titleTemplate: `${t('pages.resetPassword.title')} | %s`,
})
</script>
