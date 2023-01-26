<template>
  <Story title="WorkspaceForm" icon="bi:clipboard-check-fill">
    <Variant title="default">
      <WorkspaceForm @submit="logEvent('submit', $event)" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { logEvent } from 'histoire/client'
import WorkspaceForm from '../components/WorkspaceForm/WorkspaceForm.vue'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmits<{
  (
    e: 'submit',
    form: {
      name: string
      summary: string | null
      public: boolean
      settings?: {
        color: string | null
        backgroundColor: string | null
        icon: string | null
      }
    },
  ): void
}>()
</script>

<docs lang="md">
### WorkspaceForm

Allow to creat a new workspace
</docs>
