<template>
  <div class="py-3 my-2">
    <h3 class="mb-4">
      {{ $t('pages.updateGeneral.title') }}
    </h3>
    <UpdateGeneralForm
      v-if="user"
      :user="user"
      :response="response"
      :loading="loading"
      @submit="updateUsername"
    />
    <p v-else>{{ $t('pages.updateGeneral.userNotFound') }}</p>
  </div>
</template>

<script setup lang="ts">
import { UpdateGeneralForm } from '@locokit/designsystem'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useStoreAuth } from '../../../stores/auth'
import { useHead, ref } from '#imports'

const { t } = useI18n({ useScope: 'global' })
const authStore = useStoreAuth()

const { error, loading, user } = storeToRefs(authStore)
const response = ref()

const updateUsername = async ({
  id,
  username,
  firstName,
  lastName,
}: {
  id: string
  username: string
  firstName: string | null
  lastName: string | null
}) => {
  response.value = null

  const res = await authStore.patchCurrentUser(id, {
    lastName,
    firstName,
    username,
  })

  if (error.value !== null) {
    response.value = error.value
  } else {
    response.value = res
  }
}
useHead({
  titleTemplate: `${t('pages.updateGeneral.title')} | %s`,
})
</script>
