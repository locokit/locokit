<template>
  <div class="max-w-lg lg:h-full mx-auto px-4 lg:px-0 flex flex-col">
    <div class="my-8">
      <h1>
        {{ $t('locokit.pages.settingsWorkspace.title') }}
      </h1>
    </div>
    <WorkspaceForm
      v-if="currentWorkspace"
      :workspace-data="currentWorkspace"
      :response="error"
      :loading="loading"
      @submit="submitWorkspace"
    />
  </div>
</template>

<script setup lang="ts">
import { WorkspaceForm } from '@locokit/designsystem'
import { storeToRefs } from 'pinia'
import { useStoreWorkspaces } from '../../../stores/workspaces'
import { patchWorkspace } from '../../../services/core/workspace'
import { ref } from '#imports'

const workspacesStore = useStoreWorkspaces()
const { currentWorkspace, loading } = storeToRefs(workspacesStore)

const error = ref()

const submitWorkspace = async (data: {
  documentation: string | null
  public: boolean
  settings?: {
    color: string | null
    backgroundColor: string | null
    icon: string | null
  }
}) => {
  if (!currentWorkspace.value?.id) return
  const res = await patchWorkspace(currentWorkspace.value.id, data)

  if (res instanceof Error) {
    error.value = res
  } else {
    await workspacesStore.updateCurrentWorkspace({
      id: currentWorkspace.value.id as string,
    })
  }
}
</script>
