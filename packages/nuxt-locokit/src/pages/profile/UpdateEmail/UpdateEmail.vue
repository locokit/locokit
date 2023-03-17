<template>
  <div class="py-3 my-2">
    <h3 class="mb-4">
      {{ $t('pages.updateEmail.title') }}
    </h3>
    <UpdateEmailForm
      v-if="user"
      :user="user"
      :response="response"
      :loading="loading"
      @submit="updateEmail"
    />
    <p v-else>{{ $t('pages.updateEmail.userNotFound') }}</p>
  </div>
</template>

<script setup lang="ts">
import { UpdateEmailForm } from '@locokit/designsystem'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useStoreAuth } from '../../../stores/auth'
import { ref, useHead } from '#imports'

const { t } = useI18n({ useScope: 'global' })
const authStore = useStoreAuth()

const { error, loading, user } = storeToRefs(authStore)
const response = ref()

const updateEmail = async (data: { newEmail: string; password: string }) => {
  response.value = null

  const res = await authStore.updateEmail({
    email: user.value.email,
    newEmail: data.newEmail,
    password: data.password,
  })

  if (error.value !== null) {
    response.value = error.value
  } else {
    response.value = res
  }
}

useHead({
  titleTemplate: `${t('pages.updateEmail.title')} | %s`,
})
</script>
