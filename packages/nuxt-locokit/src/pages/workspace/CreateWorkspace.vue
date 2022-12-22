<template>
  <WithBanner>
    <div class="max-w-3xl mx-auto mt-8">
      <h1 class="mb-4">{{ $t('pages.createWorkspace.alternativeTitle') }}</h1>
      <WorkspaceForm @submit="newWorkspace" />
    </div>
  </WithBanner>
</template>

<script setup lang="ts">
import { WorkspaceForm } from '@locokit/designsystem'
import { useI18n } from 'vue-i18n'
import WithBanner from '../../layouts/WithBanner.vue'
import { ROUTES_NAMES } from '../../paths'
import { useStoreWorkspaces } from '../../stores/workspaces'
import { useHead, useRouter } from '#imports'

const { t } = useI18n({ useScope: 'global' })
const router = useRouter()
const workspacesStore = useStoreWorkspaces()

const newWorkspace = async (data: {
  name: string
  summary: string | null
  public: boolean
  settings?: {
    color: string | null
    backgroundColor: string | null
    icon: string | null
  }
}) => {
  // await workspacesStore.createWorkspaces(data) // Not working
  if (workspacesStore.error) {
    await router.push({
      name: ROUTES_NAMES.WORKSPACE.HOME,
    })
  }
}

useHead({
  titleTemplate: `${t('pages.createWorkspace.title')} | %s`,
})
</script>
