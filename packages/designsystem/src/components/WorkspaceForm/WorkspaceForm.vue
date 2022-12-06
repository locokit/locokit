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
      name="workspace.name"
      rules="required"
      as="div"
    >
      <label for="name" class="label-field-required">
        {{ $t('pages.workspace.form.name') }}
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
    <Field
      v-slot="{ errorMessage }"
      v-model="slug"
      class="mb-4"
      name="workspace.slug"
      rules="required"
      as="div"
    >
      <label for="slug">
        {{ $t('pages.workspace.form.slug') }}
      </label>
      <PrimeInputText
        id="slug"
        style="cursor: not-allowed"
        :value="autogenerateSlug"
      />
      <small id="icon-slug">
        {{ $t('pages.workspace.form.slugHelp') }}
      </small>
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
      v-slot="{ field }"
      v-model="summary"
      class="mb-4"
      name="workspace.summary"
      as="div"
    >
      <label for="summary">
        {{ $t('pages.workspace.form.summary') }}
      </label>
      <PrimeTextarea id="summary" :auto-resize="true" v-bind="field" />
    </Field>
    <Field
      v-slot="{ field }"
      v-model="color"
      class="mb-4"
      name="workspace.color"
      as="div"
    >
      <label for="color">
        {{ $t('pages.workspace.form.color') }}
      </label>
      <PrimeInputText id="color" v-bind="field" required />
    </Field>
    <Field
      v-slot="{ field }"
      v-model="icon"
      class="mb-4"
      name="workspace.icon"
      as="div"
    >
      <label for="icon">
        {{ $t('pages.workspace.form.icon') }}
      </label>
      <PrimeInputText id="icon" v-bind="field" />
      <small id="icon-help">
        {{ $t('pages.workspace.form.iconHelp') }}
      </small>
    </Field>
    <Field
      v-slot="{ field }"
      v-model="isPublic"
      class="mb-4"
      name="workspace.public"
      as="div"
    >
      <div class="flex">
        <PrimeCheckbox id="activeSQL" v-bind="field" />
        <label for="public" class="mb-0 ml-2">
          {{ $t('pages.workspace.form.public') }}
        </label>
      </div>
      <small id="activeSQL-help" class="flex">
        {{ $t('pages.workspace.form.publicHelp') }}
      </small>
    </Field>
    <div class="flex flex-row justify-between mt-4">
      <PrimeButton
        type="button"
        class="p-button-outlined !w-fit"
        icon="pi pi-times"
        :label="$t('pages.workspace.form.cancel')"
        @click="resetForm()"
      />
      <PrimeButton
        type="submit"
        class="!w-fit"
        :icon="loading ? 'pi pi-spin pi-spinner' : 'pi pi-check'"
        :label="$t('pages.workspace.form.submit')"
        :disabled="loading || !valid"
      />
    </div>
  </Form>
</template>

<script setup lang="ts">
import PrimeButton from 'primevue/button'
import PrimeTextarea from 'primevue/textarea'
import PrimeCheckbox from 'primevue/checkbox'
import PrimeInputText from 'primevue/inputtext'
import { Form, Field } from 'vee-validate'
import { computed, ref } from 'vue'
import { createSlug } from '../../helpers/transformText'

const emit = defineEmits<{
  (
    e: 'submit',
    form: {
      name: string
      summary: string | null
      public: boolean
      settings?: {
        color: string | null
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

const autogenerateSlug = computed(() => {
  if (name.value) return createSlug(name.value)
  return null
})

const onSubmit = () => {
  emit('submit', {
    name: name.value,
    summary: slug.value,
    public: isPublic.value,
    settings: {
      color: color.value,
      icon: icon.value,
    },
  })
}
</script>

<style scoped></style>
