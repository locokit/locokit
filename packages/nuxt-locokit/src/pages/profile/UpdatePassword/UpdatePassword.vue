<template>
  <div class="py-3 my-2">
    <h3 class="mb-4">
      {{ $t('pages.updatePassword.title') }}
    </h3>
    <UpdatePasswordForm @submit="updatePassword" />
  </div>
</template>

<script setup lang="ts">
import { UpdatePasswordForm } from '@locokit/designsystem'
import { useI18n } from 'vue-i18n'
import { useHead } from '#imports'

const { t } = useI18n({ useScope: 'global' })

const updatePassword = (data: {
  currentPassword: string
  newPassword: string
}) => {
  // eslint-disable-next-line no-console
  console.log('Done it !', data)
}

useHead({
  titleTemplate: `${t('pages.updatePassword.title')} | %s`,
})
</script>
