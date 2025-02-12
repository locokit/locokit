<template>
  <div class="max-w-lg lg:h-full mx-auto px-4 lg:px-0 flex flex-col">
    <h1 class="mb-4 text-2xl text-primary font-bold">
      {{ $t('locokit.pages.createGroup.title') }}
    </h1>
    <generic-form
      :fields
      :loading
      :message
      :autocomplete-suggestions="suggestions"
      @complete="onComplete"
      @submit="onSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
//import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import type { Paginated } from '@feathersjs/feathers'
import type { AutoCompleteCompleteEvent } from 'primevue/autocomplete'
import { useToast } from 'primevue/usetoast'
import { GenericForm } from '@locokit/vue-components'
import {
  FIELD_COMPONENT,
  FIELD_TYPE,
  SERVICES,
  type LocoKitFormField,
  type LocoKitFormFieldAutocomplete,
  type LocoKitMessage,
} from '@locokit/definitions'
import type { PolicyResult, WorkspaceResult } from '@locokit/sdk'
import { sdkClient } from '@/services/sdk'
import { findWorkspaces } from '@/services/core/workspace'
import { findPolicies } from '@/services/core/policy'
import { useStoreGroups } from '@/stores/groups'
import ROUTE_NAMES from '@/router/routes'

const { t } = useI18n()

definePage({
  name: ROUTE_NAMES.ADMIN.GROUPS.CREATE,
})
useHead({
  titleTemplate: `${t('locokit.pages.admin.title')} | %s`,
})

//const router = useRouter()
const toast = useToast()
const groupsStore = useStoreGroups()
const loading = ref(false)
const message = ref<LocoKitMessage | null>(null)
const suggestions = ref<unknown[]>([])

const fields = computed<LocoKitFormField[]>(() => {
  return [
    {
      id: 'name',
      label: t('locokit.pages.createGroup.name'),
      type: FIELD_TYPE.STRING,
      component: FIELD_COMPONENT.INPUT_TEXT,
      validationRules: {
        required: true,
        maxLength: 255,
      },
    },
    {
      id: 'workspace',
      label: t('locokit.pages.createGroup.workspace'),
      type: FIELD_TYPE.ID_UUID,
      component: FIELD_COMPONENT.AUTOCOMPLETE,
      freeInput: false,
      source: {
        table: 'lck_workspace',
        value: 'id',
        label: 'name',
      },
      validationRules: {
        required: true,
        //maxLength: 255,
      },
    },
    {
      id: 'policy',
      label: t('locokit.pages.createGroup.policy'),
      type: FIELD_TYPE.ID_UUID,
      component: FIELD_COMPONENT.AUTOCOMPLETE,
      freeInput: false,
      source: {
        table: 'lck_policy',
        value: 'id',
        label: 'name',
      },
      validationRules: {
        required: true,
        //maxLength: 255,
      },
    },
    {
      id: 'documentation',
      label: t('locokit.pages.createGroup.documentation'),
      type: FIELD_TYPE.TEXT,
      component: FIELD_COMPONENT.TEXTAREA,
      validationRules: {
        required: false,
      },
    },
  ]
})

async function onComplete(
  event: AutoCompleteCompleteEvent,
  field: LocoKitFormFieldAutocomplete,
  values: Record<string, unknown>
) {
  try {
    const params: Record<string, unknown> = {}

    switch (field.id) {
      case 'workspace':
        if (event.query) {
          params.name = { $ilike: `%${event.query}%` }
        }

        const workspaces = await findWorkspaces({ params, sort: { name: 1 } }) as Paginated<WorkspaceResult>

        suggestions.value = workspaces.data
        break

      case 'policy':
        if (!values.workspace) {
          suggestions.value = []

          return
        }

        params.workspaceId = values.workspace
        if (event.query) {
          params.name = { $ilike: `%${event.query}%` }
        }

        const policies = await findPolicies({ params, sort: { name: 1 } }) as Paginated<PolicyResult>

        suggestions.value = policies.data
        break
    }
  } catch (e) {
    message.value = {
      status: 'error',
      text: (e as Error).message,
    }
  }
}

async function onSubmit(values: Record<string, unknown>) {
  loading.value = true

  try {
    const group = await sdkClient.service(SERVICES.CORE_GROUP).create({
      name: values.name,
      workspaceId: values.workspace,
      policyId: values.policy,
      documentation: values.documentation,
    })

    message.value = null

    toast.add({
      severity: 'success',
      summary: t('locokit.success.basic'),
      life: 3000,
    })

    await groupsStore.fetchGroups()

    // await router.push({
    //   name: ROUTE_NAMES.ADMIN.GROUPS.RECORD,
    //   params: { id: group.id },
    // })
  } catch (err) {
    message.value = {
      status: 'error',
      text: (err as Error).message,
    }
  }

  loading.value = false
}
</script>
