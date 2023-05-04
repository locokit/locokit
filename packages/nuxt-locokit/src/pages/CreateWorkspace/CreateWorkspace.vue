<template>
  <WithHeader>
    <div class="max-w-3xl mx-auto mt-8 pb-4 px-4 lg:px-0">
      <h1 class="mb-4">
        {{ $t('pages.createWorkspace.alternativeTitle') }}
      </h1>
      <WorkspaceForm
        :response="error"
        :loading="loading"
        @submit="newWorkspace"
      />
    </div>
  </WithHeader>
</template>

<script setup lang="ts">
import { WorkspaceForm } from '@locokit/designsystem'
import { useI18n } from 'vue-i18n'
import WithHeader from '../../layouts/WithHeader.vue'
import { ROUTES_NAMES } from '../../paths'
import { createWorkspace } from '../../services/workspace'
import { useHead, useRouter, ref } from '#imports'

const { t } = useI18n({ useScope: 'global' })
const router = useRouter()
const error = ref()

const newWorkspace = async (data: {
  name: string
  documentation: string | null
  public: boolean
  settings?: {
    color: string | null
    backgroundColor: string | null
    icon: string | null
  }
}) => {
  const res = await createWorkspace(data)

  if (res instanceof Error) {
    error.value = res
  } else {
    await router.push({
      name: ROUTES_NAMES.WORKSPACES,
    })
  }
}

useHead({
  titleTemplate: `${t('pages.createWorkspace.title')} | %s`,
})
</script>
