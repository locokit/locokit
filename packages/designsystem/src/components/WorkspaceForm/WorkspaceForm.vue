<template>
  <FormGeneric
    label-tk-button-submit="components.workspaceForm.submit"
    :response="response"
    :loading="loading"
    @submit="onSubmit"
  >
    <div v-if="workspaceData?.name" class="mb-4">
      <label for="name" class="label-field-required">
        {{ $t('components.workspaceForm.name') }}
      </label>
      <PrimeInputText id="name" v-model="name" :disabled="true" />
    </div>
    <Field
      v-else
      v-slot="{ field, errorMessage, meta: { valid, touched } }"
      v-model="name"
      class="mb-4"
      name="workspaceForm.name"
      rules="required"
      as="div"
    >
      <label for="name" class="label-field-required">
        {{ $t('components.workspaceForm.name') }}
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
      <div class="flex flex-row mb-4">
        <p class="mr-1">{{ $t('components.workspaceForm.explainsSlugUse') }}</p>
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
      name="workspaceForm.documentation"
      as="div"
    >
      <label for="documentation">
        {{ $t('components.workspaceForm.documentation') }}
      </label>
      <PrimeTextarea id="documentation" :auto-resize="true" v-bind="field" />
    </Field>
    <Field
      v-slot="{ field }"
      v-model="currentColor"
      class="mb-4"
      name="workspaceForm.currentColor"
      as="div"
    >
      <PredefinedColorPicker
        :current-color="currentColor"
        v-bind="field"
        @update:current-color="updateColor"
      />
    </Field>
    <Field
      v-slot="{ field }"
      v-model="icon"
      class="mb-4"
      name="workspaceForm.icon"
      as="div"
    >
      <label for="icon">
        {{ $t('components.workspaceForm.icon') }}
      </label>
      <PrimeInputText
        id="icon"
        :placeholder="$t('components.workspaceForm.iconPlaceholder')"
        v-bind="field"
      />
      <small id="icon-help">
        {{ $t('components.workspaceForm.iconHelp') }}
      </small>
    </Field>
    <Field
      v-slot="{ field }"
      class="mb-4 flex flex-col"
      type="checkbox"
      name="workspaceForm.public"
      as="div"
    >
      <label for="public">{{ $t('components.workspaceForm.public') }}</label>
      <PrimeSwitch
        id="public"
        v-bind="field"
        v-model="isPublic"
        :true-value="true"
        :false-value="false"
      />
      <small id="public-help" class="flex">
        {{ $t('components.workspaceForm.publicHelp') }}
      </small>
    </Field>
  </FormGeneric>
</template>

<script setup lang="ts">
import PrimeTextarea from 'primevue/textarea'
import PrimeSwitch from 'primevue/inputswitch'
import PrimeInputText from 'primevue/inputtext'
import FormGeneric from '../FormGeneric/FormGeneric.vue'
import PredefinedColorPicker from '../PredefinedColorPicker/PredefinedColorPicker.vue'
import { Field } from 'vee-validate'
import { computed, reactive, ref } from 'vue'
import { createSlug } from '../../helpers/transformText'
import { ColorScheme } from '../../helpers/color'

const emit = defineEmits<{
  (
    e: 'submit',
    form: {
      name: string
      documentation: string | null
      public: boolean
      settings?: {
        color: string | null
        backgroundColor: string | null
        icon: string | null
      }
    },
  ): void
}>()

const props = withDefaults(
  defineProps<{
    loading?: boolean
    response?: Error | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    workspaceData?: Record<string, any> | null | undefined
  }>(),
  {
    loading: false,
    response: null,
    workspaceData: null,
  },
)

const name = ref(props.workspaceData?.name)
const documentation = ref(props.workspaceData?.documentation)
const icon = ref(props.workspaceData?.settings.icon)
const isPublic = ref(props.workspaceData?.public)
const currentColor = reactive<ColorScheme>({
  backgroundColor: props.workspaceData?.settings?.backgroundColor,
  color: props.workspaceData?.settings?.color,
})

const updateColor = (newValue: ColorScheme) => {
  currentColor.color = newValue.color
  currentColor.backgroundColor = newValue.backgroundColor
}

const autogenerateSlug = computed(() => {
  if (name.value) return createSlug(name.value)
  return null
})

const onSubmit = () => {
  emit('submit', {
    name: name.value,
    documentation: documentation.value,
    public: isPublic.value,
    settings: {
      ...currentColor,
      icon: icon.value,
    },
  })
}
</script>
