<template>
  <Form
    v-slot="{ meta: { valid }, resetForm }"
    class="text-left p-fluid"
    @submit="onSubmit"
  >
    <Field
      v-slot="{ field, errorMessage }"
      v-model="name"
      class="mb-4"
      name="workspaceForm.name"
      rules="required"
      as="div"
    >
      <label for="name" class="label-field-required">
        {{ $t('components.workspaceForm.name') }}
      </label>
      <PrimeInputText id="name" v-bind="field" v-focus required />
      <span
        v-if="errorMessage"
        class="p-text-error"
        role="alert"
        aria-live="assertive"
      >
        {{ errorMessage }}
      </span>
    </Field>
    <div class="flex flex-row mb-4">
      <p class="mr-1">{{ $t('components.workspaceForm.explainsSlugUse') }}</p>
      <p
        v-if="name"
        class="px-2 max-w-fit rounded bg-gray-300 text-black text-sm"
      >
        {{ autogenerateSlug }}
      </p>
    </div>
    <Field
      v-slot="{ field }"
      v-model="summary"
      class="mb-4"
      name="workspaceForm.summary"
      as="div"
    >
      <label for="summary">
        {{ $t('components.workspaceForm.summary') }}
      </label>
      <PrimeTextarea id="summary" :auto-resize="true" v-bind="field" />
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
    <div class="flex flex-row justify-between mt-4">
      <PrimeButton
        type="button"
        class="p-button-outlined !w-fit"
        icon="pi pi-times"
        :label="$t('components.workspaceForm.cancel')"
        @click="resetForm()"
      />
      <PrimeButton
        type="submit"
        class="!w-fit"
        :icon="loading ? 'pi pi-spin pi-spinner' : 'pi pi-check'"
        :label="$t('components.workspaceForm.submit')"
        :disabled="loading || !valid"
      />
    </div>
  </Form>
</template>

<script setup lang="ts">
import PrimeButton from 'primevue/button'
import PrimeTextarea from 'primevue/textarea'
import PrimeSwitch from 'primevue/inputswitch'
import PrimeInputText from 'primevue/inputtext'
import { PredefinedColorPicker } from '@locokit/designsystem'
import { Form, Field } from 'vee-validate'
import { computed, reactive, ref } from 'vue'
import { createSlug } from '../../helpers/transformText'
import { ColorScheme } from '../../helpers/color'

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(
  defineProps<{
    loading?: boolean
    logInAgain?: boolean
    displaySignUpLink?: boolean
    error?: Error | null
    signupRoute?: string
    lostPasswordRoute?: string
  }>(),
  {
    loading: () => false,
    logInAgain: () => false,
    displaySignUpLink: () => false,
    error: () => null,
    signupRoute: () => '',
    lostPasswordRoute: () => '',
  },
)

const name = ref('')
const slug = ref('')
const summary = ref('')
const color = ref('')
const icon = ref('')
const isPublic = ref(false)
const currentColor = reactive<ColorScheme>({
  backgroundColor: null,
  color: null,
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
  const bouh = {
    name: name.value,
    summary: summary.value,
    public: isPublic.value,
    settings: {
      ...currentColor,
      icon: icon.value,
    },
  }

  console.log(bouh)
  emit('submit', {
    name: name.value,
    summary: summary.value,
    public: isPublic.value,
    settings: {
      ...currentColor,
      icon: icon.value,
    },
  })
}
</script>
