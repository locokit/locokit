<template>
  <div class="max-w-lg lg:h-full mx-auto p-3 lg:px-0 flex flex-col">
    <h2 class="mb-4 text-2xl text-primary">
      {{ $t('locokit.pages.createGroup.title') }}
    </h2>
    <generic-form
      :fields
      :loading
      :message
      :autocomplete-suggestions="suggestions"
      @complete="onComplete"
      @submit="onSubmit"
      class="rounded-xl border border-surface-300 bg-white p-4"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, defineEmits, ref } from 'vue'
//import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import type { AutoCompleteCompleteEvent } from 'primevue/autocomplete'
import { useToast } from 'primevue/usetoast'
import { GenericForm } from '@locokit/vue-components'
import {
  FIELD_COMPONENT,
  FIELD_TYPE,
  type LocoKitFormField,
  type LocoKitFormFieldAutocomplete,
  type LocoKitMessage,
} from '@locokit/definitions'
import ROUTE_NAMES from '@/router/routes'
import { useGroup } from '@/composables/useGroup'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()
const { createGroup, findPolicies } = useGroup(route.params.wsslug)
const emit = defineEmits(['group-created'])

definePage({
  name: ROUTE_NAMES.WORKSPACE.ADMIN.GROUPS.CREATE,
})
useHead({
  titleTemplate: `${t('locokit.pages.workspace.groups')} | %s`,
})

//const router = useRouter()
const toast = useToast()
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
      id: 'policy',
      label: t('locokit.pages.createGroup.policy'),
      type: FIELD_TYPE.ID_UUID,
      component: FIELD_COMPONENT.AUTOCOMPLETE,
      freeInput: false,
      source: {
        table: 'policy',
        value: 'id',
        label: 'name',
      },
      validationRules: {
        required: true,
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
  _values: Record<string, unknown>,
) {
  try {
    switch (field.id) {
      case 'policy':
        suggestions.value = await findPolicies(event.query)
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
    await createGroup({
      name: values.name,
      policyId: values.policy,
      documentation: values.documentation,
    })

    message.value = null

    toast.add({
      severity: 'success',
      summary: t('locokit.success.basic'),
      life: 3000,
    })

    emit('group-created')
  } catch (err) {
    message.value = {
      status: 'error',
      text: (err as Error).message,
    }
  }

  loading.value = false
}
</script>
