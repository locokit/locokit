<template>
  <div class="max-w-lg lg:h-full mx-auto px-4 lg:px-0 flex flex-col">
    <div class="my-8">
      <h1>
        {{ $t('pages.updateDatasource.title') }}
      </h1>
    </div>
    <FormGeneric
      v-if="currentWorkspace"
      label-tk-button-submit="pages.updateDatasource.submit"
      :response="response"
      :loading="loading"
      @submit="onSubmit"
    >
      <div class="mb-4">
        <label for="name">
          {{ $t('pages.updateDatasource.name') }}
        </label>
        <p>{{ currentDatasource.name }}</p>
      </div>
      <Field
        v-slot="{ field }"
        v-model="documentation"
        class="mb-4"
        name="updateDatasource.documentation"
        as="div"
      >
        <label for="documentation">
          {{ $t('pages.updateDatasource.documentation') }}
        </label>
        <PrimeTextarea id="documentation" :auto-resize="true" v-bind="field" />
      </Field>
      <Field
        v-slot="{ field }"
        v-model="client"
        class="mb-4"
        name="updateDatasource.client"
        rules="required"
        as="div"
      >
        <label for="client" class="label-field-required">
          {{ $t('pages.updateDatasource.client') }}
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
              {{ $t(`pages.updateDatasource.${slotProps.value.name}`) }}
            </span>
          </template>
          <template #option="slotProps">
            <span>
              {{ $t(`pages.updateDatasource.${slotProps.option.name}`) }}
            </span>
          </template>
        </PrimeDropdown>
      </Field>
      <Field
        v-slot="{ field }"
        v-model="type"
        class="mb-4"
        name="updateDatasource.type"
        rules="required"
        as="div"
      >
        <label for="type" class="label-field-required">
          {{ $t('pages.updateDatasource.type') }}
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
              {{ $t(`pages.updateDatasource.${slotProps.value.name}`) }}
            </span>
          </template>
          <template #option="slotProps">
            <span>
              {{ $t(`pages.updateDatasource.${slotProps.option.name}`) }}
            </span>
          </template>
        </PrimeDropdown>
      </Field>
      <Field
        v-slot="{ field, errorMessage, meta: { valid, touched } }"
        v-model="connection"
        class="mb-4"
        name="updateDatasource.connection"
        rules="required"
        as="div"
      >
        <label for="connection" class="label-field-required">
          {{ $t('pages.updateDatasource.connection') }}
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
      custom-msg-tk-error-form="pages.updateDatasource.noDatasource"
    />
  </div>
</template>
<script setup lang="ts">
import { Field } from 'vee-validate'
import PrimeInputText from 'primevue/inputtext'
import { FormGeneric, MessageForUser } from '@locokit/designsystem'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import PrimeTextarea from 'primevue/textarea'
import PrimeDropdown from 'primevue/dropdown'
import { useStoreWorkspaces } from '../../../../stores/workspaces'
import {
  TYPE_DATASOURCE,
  CLIENT_DATASOURCE,
  Datasource,
} from '../../../../interfaces/toMigrate'
import {
  findDatasources,
  patchDatasource,
} from '../../../../services/datasource'
import { useRoute } from '#imports'

const route = useRoute()

const workspaceStore = useStoreWorkspaces()
const { currentWorkspace } = storeToRefs(workspaceStore)

// Initialization
let currentDatasource: Datasource | null = null
const res = await findDatasources(
  {
    params: { slug: route.params.datasourceSlug as string },
  },
  route.params.workspaceSlug as string,
)
if (res && res.data.length === 1) {
  currentDatasource = res.data[0]
}

const loading = ref(false)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const response = ref<Error | Record<string, any> | null>(null)
const documentation = ref(currentDatasource?.documentation)
const client = ref(
  CLIENT_DATASOURCE.find((client) => client.name === currentDatasource?.client),
)
const type = ref(
  TYPE_DATASOURCE.find((type) => type.name === currentDatasource?.type),
)
const connection = ref(currentDatasource?.connection)

const onSubmit = async () => {
  loading.value = true
  if (!currentDatasource) return

  const res = await patchDatasource(
    currentDatasource.id,
    {
      documentation: documentation.value,
      client: client.value?.value as string,
      type: type.value?.value as string,
      connection: connection.value as string,
    },
    route.params.workspaceSlug as string,
  )
  response.value = res
  loading.value = false
}
</script>
