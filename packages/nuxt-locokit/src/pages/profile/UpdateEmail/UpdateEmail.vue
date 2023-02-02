<template>
  <div class="py-3 my-2">
    <h3 class="mb-4">
      {{ $t('pages.updateEmail.title') }}
    </h3>
    <UpdateEmailForm :user="authStore?.user" @submit="updateEmail" />
  </div>
</template>

<script setup lang="ts">
import { UpdateEmailForm } from '@locokit/designsystem'
import { useI18n } from 'vue-i18n'
import { useStoreAuth } from '../../../stores/auth'
import { useHead } from '#imports'

const { t } = useI18n({ useScope: 'global' })
const authStore = useStoreAuth()

const updateEmail = (data: { newEmail: string; password: string }) => {
  // eslint-disable-next-line no-console
  console.log('Done it !', data)
}

useHead({
  titleTemplate: `${t('pages.updateEmail.title')} | %s`,
})
</script>
