<template>
  <div class="py-3 my-2">
    <h3 class="mb-4">
      {{ $t('pages.updateUsername.title') }}
    </h3>
    <UpdateUsernameForm
      :user="authStore?.user"
      :response="response"
      :loading="loading"
      @submit="updateUsername"
    />
  </div>
</template>

<script setup lang="ts">
import { UpdateUsernameForm } from '@locokit/designsystem'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useStoreAuth } from '../../../stores/auth'
import { useHead, ref } from '#imports'

const { t } = useI18n({ useScope: 'global' })
const authStore = useStoreAuth()

const { error, loading } = storeToRefs(authStore)
const response = ref()

const updateUsername = (data: { username: string }) => {
  response.value = null

  // eslint-disable-next-line no-console
  console.log('Done it !', data)

  if (error.value !== null) {
    response.value = error.value
  }
  response.value = data
}
useHead({
  titleTemplate: `${t('pages.updateUsername.title')} | %s`,
})
</script>
