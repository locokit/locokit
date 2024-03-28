<template>
  <div class="max-w-lg lg:h-full mx-auto px-4 lg:px-0 flex flex-col">
    <div class="my-8">
      <h1>
        {{ $t('pages.createDatasource.title') }}
      </h1>
    </div>
    <FormGeneric
      v-if="currentWorkspace"
      label-tk-button-submit="pages.createDatasource.submit"
      :response="error"
      :loading="loading"
      @submit="onSubmit"
    >
      <Field
        v-slot="{ field, errorMessage, meta: { valid, touched } }"
        v-model="name"
        class="mb-4"
        name="createDatasource.name"
        rules="required"
        as="div"
      >
        <label for="name" class="label-field-required">
          {{ $t('pages.createDatasource.name') }}
        </label>
        <PrimeInputText
          id="name"
          v-bind="field"
          v-focus
          :class="{ 'p-invalid': !valid && touched }"
          required
        />
        <span
          v-if="errorMessage"
          class="p-text-error"
          role="alert"
          aria-live="assertive"
        >
          {{ errorMessage }}
        </span>
        <div class="flex flex-row mb-4 mt-1">
          <p class="mr-1">
            {{ $t('pages.createDatasource.explainsSlugUse') }}
          </p>
          <p
            v-if="name"
            class="px-2 max-w-fit rounded bg-gray-300 text-black text-sm"
          >
            {{ autogenerateSlug }}
          </p>
        </div>
      </Field>
      <Field
        v-slot="{ field }"
        v-model="documentation"
        class="mb-4"
        name="createDatasource.documentation"
        as="div"
      >
        <label for="documentation">
          {{ $t('pages.createDatasource.documentation') }}
        </label>
        <PrimeTextarea id="documentation" :auto-resize="true" v-bind="field" />
      </Field>
      <Field
        v-slot="{ field }"
        v-model="client"
        class="mb-4"
        name="createDatasource.client"
        rules="required"
        as="div"
      >
        <label for="client" class="label-field-required">
          {{ $t('pages.createDatasource.client') }}
        </label>
        <PrimeDropdown
          v-bind="{
            ...field,
            onChange: ({ value: newValue }) => field.onChange(newValue),
            'model-value': field.value,
          }"
          input-id="client"
          :options="CLIENT_DATASOURCE"
          option-label="label"
          required
        >
          <template #value="slotProps">
            <span v-if="slotProps.value">
              {{ $t(`pages.createDatasource.${slotProps.value.name}`) }}
            </span>
          </template>
          <template #option="slotProps">
            <span>
              {{ $t(`pages.createDatasource.${slotProps.option.name}`) }}
            </span>
          </template>
        </PrimeDropdown>
      </Field>
      <Field
        v-slot="{ field }"
        v-model="type"
        class="mb-4"
        name="createDatasource.type"
        rules="required"
        as="div"
      >
        <label for="type" class="label-field-required">
          {{ $t('pages.createDatasource.type') }}
        </label>
        <PrimeDropdown
          v-bind="{
            ...field,
            onChange: ({ value: newValue }) => field.onChange(newValue),
            'model-value': field.value,
          }"
          input-id="type"
          :options="TYPE_DATASOURCE"
          option-label="label"
          required
        >
          <template #value="slotProps">
            <span v-if="slotProps.value">
              {{ $t(`pages.createDatasource.${slotProps.value.name}`) }}
            </span>
          </template>
          <template #option="slotProps">
            <span>
              {{ $t(`pages.createDatasource.${slotProps.option.name}`) }}
            </span>
          </template>
        </PrimeDropdown>
      </Field>
      <Field
        v-slot="{ field, errorMessage, meta: { valid, touched } }"
        v-model="connection"
        class="mb-4"
        name="createDatasource.connection"
        rules="required"
        as="div"
      >
        <label for="connection" class="label-field-required">
          {{ $t('pages.createDatasource.connection') }}
        </label>
        <PrimeInputText
          id="connection"
          v-bind="field"
          :class="{ 'p-invalid': !valid && touched }"
          required
        />
        <span
          v-if="errorMessage"
          class="p-text-error"
          role="alert"
          aria-live="assertive"
        >
          {{ errorMessage }}
        </span>
      </Field>
    </FormGeneric>
    <MessageForUser
      v-else
      status="failed"
      custom-msg-tk-error-form="pages.createDatasource.noWorkspace"
    />
  </div>
</template>
<script setup lang="ts">
import { Field } from 'vee-validate'
import { FormGeneric, MessageForUser } from '@locokit/designsystem'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useStoreWorkspaces } from '../../../../stores/workspaces'
import {
  TYPE_DATASOURCE,
  CLIENT_DATASOURCE,
} from '../../../../interfaces/toMigrate'
import { createDatasource } from '../../../../services/datasource'
import { ROUTES_NAMES } from '../../../../locokit-paths'
import { createSlug } from '../../../../helpers/transformText'
import { useRouter, computed } from '#imports'

const router = useRouter()

const workspaceStore = useStoreWorkspaces()

const { currentWorkspace } = storeToRefs(workspaceStore)

const loading = ref(false)
const error = ref<Error | null>(null)
const name = ref()
const documentation = ref()
const client = ref(CLIENT_DATASOURCE[0])
const type = ref(TYPE_DATASOURCE[0])
const connection = ref()

const autogenerateSlug = computed(() => {
  if (name.value) return createSlug(name.value)
  return null
})

const onSubmit = async () => {
  loading.value = true
  if (!currentWorkspace.value?.id) return

  const res = await createDatasource(
    {
      name: name.value,
      documentation: documentation.value,
      client: client.value.value,
      type: type.value.value,
      connection: connection.value,
      workspaceId: currentWorkspace.value.id,
    },
    currentWorkspace.value.slug,
  )
  if (res && res.id) {
    await router.push({
      name: ROUTES_NAMES.WORKSPACE.DATASOURCE.UPDATE,
      params: { workspaceSlug: res.workspaceId, datasourceSlug: res.id },
    })
  } else {
    error.value = res
  }
  loading.value = false
}
</script>
