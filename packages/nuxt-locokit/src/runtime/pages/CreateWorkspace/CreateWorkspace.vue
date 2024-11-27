<template>
  <WithHeader>
    <div class="max-w-3xl mx-auto mt-8 pb-4 px-4 lg:px-0">
      <h1 class="mb-4">
        {{ $t('locokit.pages.createWorkspace.alternativeTitle') }}
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
import { storeToRefs } from 'pinia'
import WithHeader from '../../layouts/WithHeader.vue'
import { ROUTES_NAMES } from '../../locokit-paths'
import { createWorkspace } from '../../services/core/workspace'
import { useStoreWorkspaces } from '../../stores/workspaces'
import { useHead, useRouter, ref } from '#imports'

const { t } = useI18n({ useScope: 'global' })
const router = useRouter()
const workspacesStore = useStoreWorkspaces()
const { loading } = storeToRefs(workspacesStore)

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
    await workspacesStore.updateWorkspaces()
    await router.push({
      name: ROUTES_NAMES.WORKSPACE.WORKSPACES,
    })
  }
}

useHead({
  titleTemplate: `${t('locokit.pages.createWorkspace.title')} | %s`,
})
</script>
