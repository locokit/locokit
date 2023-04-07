<template>
  <div class="max-w-lg lg:h-full mx-auto px-4 lg:px-0 flex flex-col">
    <div class="my-8">
      <h1>
        {{ $t('pages.createGroup.title') }}
      </h1>
    </div>
    <FormGeneric
      label-tk-button-submit="pages.createGroup.submit"
      :response="error"
      :loading="loading"
      color-submit-button="secondary"
      :full-width-button="true"
      icon-submit-button="bi-check-2"
      :reset-form-with-empty-value="false"
      @submit="onSubmit"
      @reset="onReset"
    >
      <Field
        v-slot="{ field, errorMessage, meta: { valid, touched } }"
        v-model="name"
        class="mb-4"
        name="createGroup.name"
        rules="required"
        as="div"
      >
        <label for="name" class="label-field-required">
          {{ $t('pages.createGroup.name') }}
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
      </Field>
      <Field
        v-slot="{ field, errorMessage, meta: { valid, touched } }"
        v-model="workspace"
        class="mb-4"
        name="createGroup.workspace"
        rules="required"
        as="div"
      >
        <label for="workspace" class="label-field-required">
          {{ $t('pages.createGroup.workspace') }}
        </label>
        <PrimeAutoComplete
          v-bind="{
            ...field,
            onChange: ({ value: newValue }) =>
              field.onChange.forEach((fct) => fct(newValue)),
            'model-value': field.value,
          }"
          input-id="workspace"
          :placeholder="$t('pages.createGroup.search')"
          :empty-search-message="$t('pages.createGroup.emptyResult')"
          :suggestions="suggestedWorkspaces"
          option-label="name"
          :class="{ 'p-invalid': !valid && touched }"
          force-selection
          @complete="searchWorkspaces"
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
      <Field
        v-slot="{ field, errorMessage, meta: { valid, touched } }"
        v-model="policy"
        class="mb-4"
        name="createGroup.policy"
        rules="required"
        as="div"
      >
        <label for="policy" class="label-field-required">
          {{ $t('pages.createGroup.policy') }}
        </label>
        <PrimeAutoComplete
          v-bind="{
            ...field,
            onChange: ({ value: newValue }) =>
              field.onChange.forEach((fct) => fct(newValue)),
            'model-value': field.value,
          }"
          input-id="policy"
          :placeholder="$t('pages.createGroup.search')"
          :empty-search-message="$t('pages.createGroup.emptyResult')"
          :suggestions="suggestedPolicies"
          option-label="name"
          :class="{ 'p-invalid': !valid && touched }"
          force-selection
          @complete="searchPolicies"
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
  </div>
</template>

<script setup lang="ts">
import PrimeInputText from 'primevue/inputtext'
import PrimeAutoComplete from 'primevue/autocomplete'
import { FormGeneric } from '@locokit/designsystem'
import { Field } from 'vee-validate'
import { ref } from 'vue'
import { ROUTES_NAMES } from '../../../../paths'
import { createGroup } from '../../../../services/group'
import { Policy, Workspace } from '../../../../interfaces/toMigrate'
import { findWorkspaces } from '../../../../services/workspace'
import { findPolicy } from '../../../../services/policy'
import { useStoreGroups } from '../../../../stores/groups'
import { useRouter } from '#imports'

const router = useRouter()
const groupsStore = useStoreGroups()

const loading = ref(false)
const error = ref<Error | null>(null)
const name = ref('')
const workspace = ref<Workspace | null>(null)
const policy = ref<Policy | null>(null)
const suggestedWorkspaces = ref<Workspace[] | null>(null)
const suggestedPolicies = ref<Policy[] | null>(null)

const onSubmit = async () => {
  loading.value = true
  if (!workspace.value || !policy.value) return
  const res = await createGroup({
    name: name.value,
    workspaceId: workspace.value.id,
    roleId: policy.value.id,
  })

  if (res && res.id) {
    await groupsStore.updateGroups()
    await router.push({
      name: ROUTES_NAMES.ADMIN.GROUPS.RECORD,
      params: { id: res.id },
    })
  } else {
    error.value = res
  }
  loading.value = false
}

const onReset = () => {
  name.value = ''
  workspace.value = null
  policy.value = null
}

const searchWorkspaces = async (event: {
  originalEvent: Event
  query: string
}) => {
  suggestedWorkspaces.value = (
    await findWorkspaces({
      params: {
        name: {
          $ilike: `%${event.query}%`,
        },
      },
    })
  ).data
}
const searchPolicies = async (event: {
  originalEvent: Event
  query: string
}) => {
  suggestedPolicies.value = (
    await findPolicy({
      params: {
        name: {
          $ilike: `%${event.query}%`,
        },
      },
    })
  ).data
}
</script>
