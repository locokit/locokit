<template>
  <div class="py-3 my-2">
    <h3 class="mb-4">
      {{ $t('pages.updateUsername.title') }}
    </h3>
    <UpdateUsernameForm :user="authStore?.user" @submit="updateUsername" />
  </div>
</template>

<script setup lang="ts">
import { UpdateUsernameForm } from '@locokit/designsystem'
import { useI18n } from 'vue-i18n'
import { useStoreAuth } from '../../../stores/auth'
import { useHead } from '#imports'

const { t } = useI18n({ useScope: 'global' })
const authStore = useStoreAuth()

const updateUsername = (data: { username: string }) => {
  // eslint-disable-next-line no-console
  console.log('Done it !', data)
}
useHead({
  titleTemplate: `${t('pages.updateUsername.title')} | %s`,
})
</script>
