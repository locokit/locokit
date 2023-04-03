<template>
  <div class="max-w-lg lg:h-full mx-auto px-4 lg:px-0 flex flex-col">
    <div class="my-8">
      <h1>
        {{ $t('pages.createUser.title') }}
      </h1>
    </div>
    <FormGeneric
      label-key-button-submit="pages.createUser.submit"
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
        v-model="username"
        class="mb-4"
        name="createUser.username"
        rules="required"
        as="div"
      >
        <label for="username" class="label-field-required">
          {{ $t('pages.createUser.username') }}
        </label>
        <PrimeInputText
          id="username"
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
        v-model="lastName"
        class="mb-4"
        name="createUser.lastName"
        as="div"
      >
        <label for="lastName">
          {{ $t('pages.createUser.lastName') }}
        </label>
        <PrimeInputText
          id="lastName"
          v-bind="field"
          :class="{ 'p-invalid': !valid && touched }"
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
        v-model="firstName"
        class="mb-4"
        name="createUser.firstName"
        as="div"
      >
        <label for="firstName">
          {{ $t('pages.createUser.firstName') }}
        </label>
        <PrimeInputText
          id="firstName"
          v-bind="field"
          :class="{ 'p-invalid': !valid && touched }"
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
        v-model="email"
        class="mb-4"
        name="createUser.email"
        rules="required|email"
        as="div"
      >
        <label for="email" class="label-field-required">
          {{ $t('pages.createUser.email') }}
        </label>
        <PrimeInputText
          id="email"
          type="email"
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
      <Field
        v-slot="{ field }"
        v-model="profile"
        class="mb-4"
        name="createUser.profile"
        rules="required"
        as="div"
      >
        <label for="profile" class="label-field-required">
          {{ $t('pages.createUser.profile') }}
        </label>
        <PrimeDropdown
          v-bind="{
            ...field,
            onChange: ({ value: newValue }) =>
              field.onChange.forEach((fct) => fct(newValue)),
            'model-value': field.value,
          }"
          input-id="profile"
          :options="PROFILE"
          option-label="label"
          dropdown-icon="bi-chevron-down"
          required
        >
          <template #value="slotProps">
            <span v-if="slotProps.value">
              {{ $t(`pages.createUser.${slotProps.value.label}`) }}
            </span>
          </template>
          <template #option="slotProps">
            <span>
              {{ $t(`pages.createUser.${slotProps.option.label}`) }}
            </span>
          </template>
        </PrimeDropdown>
      </Field>
    </FormGeneric>
  </div>
</template>

<script setup lang="ts">
import PrimeInputText from 'primevue/inputtext'
import PrimeDropdown from 'primevue/dropdown'
import { FormGeneric } from '@locokit/designsystem'
import { Field } from 'vee-validate'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useStoreUsers } from '../../../../stores/users'
import { PROFILE } from '../../../../interfaces/toMigrate'
import { ROUTES_NAMES } from '../../../../paths'
import { useRouter } from '#imports'

const usersStore = useStoreUsers()
const { loading, error } = storeToRefs(usersStore)
const router = useRouter()

const username = ref('')
const lastName = ref(null)
const firstName = ref(null)
const email = ref('')
const profile = ref(PROFILE[0])

const onSubmit = async () => {
  if (!profile.value) return
  const res = await usersStore.createUser({
    username: username.value,
    lastName: lastName.value,
    firstName: firstName.value,
    email: email.value,
    profile: profile.value.value,
  })

  await router.push({
    name: ROUTES_NAMES.ADMIN.USERS.RECORD,
    params: { id: res.id },
  })
}

const onReset = () => {
  username.value = ''
  lastName.value = null
  firstName.value = null
  email.value = ''
  profile.value = PROFILE[0]
}
</script>
