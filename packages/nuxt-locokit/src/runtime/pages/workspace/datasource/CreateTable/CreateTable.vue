<template>
  <div class="max-w-lg lg:h-full mx-auto px-4 lg:px-0 flex flex-col">
    <div class="my-8">
      <h1>
        {{ $t('locokit.pages.createTable.title') }}
      </h1>
    </div>
    <FormGeneric
      v-if="route.params.datasourceSlug && route.params.workspaceSlug"
      label-tk-button-submit="locokit.pages.createTable.submit"
      :response="error"
      :loading="loading"
      @submit="onSubmit"
    >
      <Field
        v-slot="{ field, errorMessage, meta: { valid, touched } }"
        v-model="name"
        class="mb-4"
        name="createTable.name"
        rules="required"
        as="div"
      >
        <label for="name" class="label-field-required">
          {{ $t('locokit.pages.createTable.name') }}
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
            {{ $t('locokit.pages.createTable.explainsSlugUse') }}
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
        name="createTable.documentation"
        as="div"
      >
        <label for="documentation">
          {{ $t('locokit.pages.createTable.documentation') }}
        </label>
        <PrimeTextarea id="documentation" :auto-resize="true" v-bind="field" />
      </Field>
    </FormGeneric>
    <MessageForUser
      v-else
      status="failed"
      custom-msg-tk-error-form="locokit.pages.createTable.noWorkspace"
    />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { Field } from 'vee-validate'
import { FormGeneric, MessageForUser } from '@locokit/designsystem'
import { useLocoKitClient } from '../../../../services/api'
import { findDatasources } from '../../../../services/datasource'
import { toSnakeCase } from '@locokit/definitions'
import { computed, useRoute } from '#imports'

const route = useRoute()
const sdkClient = useLocoKitClient()

const loading = ref(false)
const error = ref<Error | null>(null)
const name = ref()
const documentation = ref()
const currentDatasource = ref(null)

// Initialization
if (route.params.datasourceSlug && route.params.workspaceSlug) {
  const res = await findDatasources(
    {
      params: { slug: route.params.datasourceSlug as string, $eager: 'tables' },
    },
    route.params.workspaceSlug as string,
  )
  if (res.total === 1) {
    currentDatasource.value = res.data[0]
  }
}

const autogenerateSlug = computed(() => {
  if (name.value) return toSnakeCase(name.value)
  return null
})

const onSubmit = async () => {
  loading.value = true
  if (currentDatasource.value && route.params.workspaceSlug) {
    await sdkClient
      .service(
        `/workspace/${route.params.workspaceSlug}/datasource/${currentDatasource.value.slug}/table`,
      )
      .create({
        name: name.value,
        documentation: documentation.value,
        datasourceId: currentDatasource.value.id,
      })

    // Todo: Emit
  }
  loading.value = false
}
</script>
