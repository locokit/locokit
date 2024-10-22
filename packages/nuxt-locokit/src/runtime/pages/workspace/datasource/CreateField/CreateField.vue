<template>
  <div>
    <FormGeneric
      v-if="route.params.datasourceSlug && tableSlug"
      label-tk-button-submit="locokit.components.createField.submit"
      label-tk-button-reset="locokit.components.createField.resetAndCancel"
      :response="error"
      :loading="loading"
      @submit="onSubmit"
      @reset="$emit('reset')"
    >
      <Field
        v-slot="{ field, errorMessage, meta: { valid, touched } }"
        v-model="name"
        class="mb-4"
        name="createField.name"
        rules="required"
        as="div"
      >
        <label for="name" class="label-field-required">
          {{ $t('locokit.components.createField.name') }}
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
            {{ $t('locokit.components.createField.explainsSlugUse') }}
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
        name="createField.documentation"
        as="div"
      >
        <label for="documentation">
          {{ $t('locokit.components.createField.documentation') }}
        </label>
        <PrimeTextarea id="documentation" :auto-resize="true" v-bind="field" />
      </Field>
      <Field
        v-slot="{ field }"
        v-model="type"
        class="mb-4"
        name="createField.type"
        as="div"
      >
        <label for="type">
          {{ $t('locokit.components.createField.type') }}
        </label>
        <PrimeDropdown
          v-bind="{
            ...field,
            onChange: ({ value: newValue }) => field.onChange(newValue),
            'model-value': field.value,
          }"
          input-id="type"
          :options="typeField"
          option-label="label"
          required
        >
          <template #value="slotProps">
            <div v-if="slotProps.value" class="flex items-baseline">
              <i :class="slotProps.value.icon" class="mr-2" />
              <span v-if="slotProps.value">
                {{
                  $t(`locokit.commons.fieldType.${slotProps.value.name}.name`)
                }}
              </span>
            </div>
          </template>
          <template #option="slotProps">
            <div class="flex items-baseline">
              <i :class="slotProps.option.icon" class="mr-2" />
              <span>
                {{
                  $t(`locokit.commons.fieldType.${slotProps.option.name}.name`)
                }}
              </span>
            </div>
          </template>
        </PrimeDropdown>
        <div class="flex flex-col">
          <span v-if="type" class="text-sm/7">
            {{ $t(`locokit.commons.fieldType.${type.name}.description`) }}
          </span>
        </div>
      </Field>
      <Field class="mb-4" name="createField.unique" as="div">
        <label for="unique">
          {{ $t('locokit.components.createField.unique') }}
        </label>
        <PrimeCheckbox
          id="unique"
          v-model="unique"
          class="self-center ml-2"
          binary
          :class="{ 'p-invalid': !valid && touched }"
        />
      </Field>
      <Field class="mb-4" name="createField.nullable" as="div">
        <label for="nullable">
          {{ $t('locokit.components.createField.nullable') }}
        </label>
        <PrimeCheckbox
          id="nullable"
          v-model="nullable"
          binary
          class="self-center ml-2"
          :class="{ 'p-invalid': !valid && touched }"
        />
      </Field>
    </FormGeneric>
    <MessageForUser
      v-else
      status="failed"
      custom-msg-tk-error-form="locokit.components.createField.noTable"
    />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { Field } from 'vee-validate'
import { FormGeneric, MessageForUser } from '@locokit/designsystem'
import { FIELD_TYPE } from '@locokit/definitions'
import { useLocoKitClient } from '../../../../services/api'
import { createSlug } from '../../../../helpers/transformText'
import { getFieldIconClass } from '../../../../helpers/field'
import { computed, useRoute } from '#imports'

defineEmits(['reset'])

const route = useRoute()
const sdkClient = useLocoKitClient()

const loading = ref(false)
const error = ref<Error | null>(null)
const name = ref()
const documentation = ref()
const type = ref()
const unique = ref()
const defaultValue = ref()
// const foreign = ref()
// const primary = ref()
const nullable = ref()
// const maxLength = ref()

const props = withDefaults(
  defineProps<{
    fields: Record<string, any>[] | null
    tableSlug: string
  }>(),
  {
    fields: () => [],
  },
)

// Initialization

// Needed for user input support
const lastPositionKnown = computed(() => {
  if (props.fields && props.fields.length > 0) {
    return props.fields.reduce((acc, field) => {
      if (field.position > acc) {
        acc = field.position
      }
      return acc
    }, 0)
  }
  return 0
})

const typeField = Object.values(FIELD_TYPE).map((type: string) => ({
  name: type.toLowerCase(),
  value: type,
  icon: getFieldIconClass(type),
}))

const autogenerateSlug = computed(() => {
  if (name.value) return createSlug(name.value)
  return null
})

const onSubmit = async () => {
  loading.value = true
  if (props.tableSlug && route.params.workspaceSlug) {
    await sdkClient
      .service(
        `/workspace/${route.params.workspaceSlug}/datasource/${route.params.datasourceSlug}/table/${props.tableSlug}/field`,
      )
      .create({
        name: name.value,
        type: type.value.value,
        documentation: documentation.value,
        position: lastPositionKnown.value + 1,
        settings: {
          unique: unique.value,
          default: defaultValue.value,
          nullable: nullable.value,
        },
      })

    // Todo: Emit
  }
  loading.value = false
}
</script>
