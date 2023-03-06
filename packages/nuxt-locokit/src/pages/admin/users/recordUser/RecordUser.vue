<template>
  <div class="max-w-md lg:h-full mx-auto px-4 lg:px-0 flex flex-col">
    <div class="my-8">
      <h1>
        {{ $t('pages.recordUser.title') }}
      </h1>
    </div>
    <div v-if="!currentUser">
      <p>{{ $t('pages.recordUser.noUserFound') }}</p>
      <p>{{ $t('error.redundantError') }}</p>
    </div>
    <div v-else>
      <div class="flex flex-col mb-8">
        <PrimeConfirmDialog />
        <div class="flex flex-row justify-around">
          <div class="flex flex-col">
            <span>{{ $t('pages.recordUser.blocking') }}</span>
            <PrimeButton
              class="p-button-rounded p-button-outlined"
              icon="bi-envelope"
              :label="$t('pages.recordUser.send')"
              @click="confirmBlockingUser"
            />
          </div>
          <div class="flex flex-col">
            <span>{{ $t('pages.recordUser.inviting') }}</span>
            <PrimeButton
              class="p-button-rounded p-button-outlined"
              icon="bi-envelope"
              :label="$t('pages.recordUser.resend')"
              @click="confirmSendVerifySignup"
            />
          </div>
        </div>
        <div
          v-if="
            (errorUserStore && errorUserStore.name) ||
            (errorAuthStore && errorAuthStore.name)
          "
          class="mt-4 p-text-error"
          role="alert"
          aria-live="assertive"
        >
          <p>
            {{ $t('error.basic') }}
          </p>
          <p>{{ $t('error.redundantError') }}</p>
        </div>
      </div>
      <div>
        <FormGeneric
          label-button-submit="pages.recordUser.submit"
          :response="errorUserStore"
          :loading="loading"
          color-submit-button="secondary"
          :full-width-button="true"
          icon-submit-button="bi-check-2"
          :reset-form-with-empty-value="false"
          @submit="onSubmit"
          @reset="onReset"
        >
          <div class="mb-4">
            <label for="id">
              {{ $t('pages.recordUser.id') }}
            </label>
            <PrimeInputText id="id" v-model="currentUser.id" :disabled="true" />
          </div>
          {{ loading }}

          <Field
            v-slot="{ field, errorMessage, meta: { valid, touched } }"
            v-model="currentUser.username"
            class="mb-4"
            name="recordUser.username"
            rules="required"
            as="div"
          >
            <label for="username" class="label-field-required">
              {{ $t('pages.recordUser.username') }}
            </label>
            <PrimeInputText
              id="username"
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
            v-slot="{ field, errorMessage, meta: { valid, touched } }"
            v-model="currentUser.lastName"
            class="mb-4"
            name="recordUser.lastName"
            as="div"
          >
            <label for="lastName">
              {{ $t('pages.recordUser.lastName') }}
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
            v-model="currentUser.firstName"
            class="mb-4"
            name="recordUser.firstName"
            as="div"
          >
            <label for="firstName">
              {{ $t('pages.recordUser.firstName') }}
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
            v-model="currentUser.email"
            class="mb-4"
            name="recordUser.email"
            rules="required|email"
            as="div"
          >
            <label for="email" class="label-field-required">
              {{ $t('pages.recordUser.email') }}
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
            name="recordUser.profile"
            rules="required"
            as="div"
          >
            <label for="profile" class="label-field-required">
              {{ $t('pages.recordUser.profile') }}
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
                  {{ $t(`pages.recordUser.${slotProps.value.label}`) }}
                </span>
              </template>
              <template #option="slotProps">
                <span>
                  {{ $t(`pages.recordUser.${slotProps.option.label}`) }}
                </span>
              </template>
            </PrimeDropdown>
          </Field>
          <div class="mb-4 flex flex-col">
            <label for="isVerified">
              {{ $t('pages.recordUser.isVerified') }}
            </label>
            <PrimeSwitch
              id="isVerified"
              v-model="currentUser.isVerified"
              :true-value="true"
              :false-value="false"
              :disabled="true"
            />
          </div>
          <div class="mb-4 flex flex-col">
            <label for="isBlocked">
              {{ $t('pages.recordUser.isBlocked') }}
            </label>
            <PrimeSwitch
              id="isBlocked"
              v-model="currentUser.blocked"
              :true-value="true"
              :false-value="false"
              :disabled="true"
            />
          </div>
        </FormGeneric>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PrimeButton from 'primevue/button'
import PrimeSwitch from 'primevue/inputswitch'
import PrimeInputText from 'primevue/inputtext'
import PrimeDropdown from 'primevue/dropdown'
import PrimeConfirmDialog from 'primevue/confirmdialog'
import { FormGeneric } from '@locokit/designsystem'
import { Field } from 'vee-validate'
import { storeToRefs } from 'pinia'
import { useConfirm } from 'primevue/useconfirm'
import { useI18n } from 'vue-i18n'
import { useStoreUsers } from '../../../../stores/users'
import { PROFILE, ProfileType, User } from '../../../../interfaces/toMigrate'
import { useStoreAuth } from '../../../../stores/auth'
import { useRoute, ref, computed } from '#imports'

const route = useRoute()
const usersStore = useStoreUsers()
const { loading, error: errorUserStore } = storeToRefs(usersStore)
const authStore = useStoreAuth()
const { error: errorAuthStore } = storeToRefs(authStore)
const { t } = useI18n()

const currentUser = ref<User>()
const confirm = useConfirm()

currentUser.value = await usersStore.getUser(route.params.id as string)

const profile = computed<ProfileType>({
  get() {
    return PROFILE.find(
      ({ value }) => value === currentUser.value?.profile,
    ) as ProfileType
  },
  set(newValue) {
    if (!currentUser.value || !newValue || !newValue.value) return
    currentUser.value = {
      ...currentUser.value,
      profile: newValue.value,
    }
  },
})

const blockUser = async () => {
  if (!currentUser.value) return
  await usersStore.blockAccountUser(
    currentUser.value.id,
    currentUser.value.isVerified,
  )
}

const confirmBlockingUser = () => {
  if (!currentUser.value) return
  confirm.require({
    message: t('pages.recordUser.messageBlockingUser', {
      username: currentUser.value.username,
    }),
    header: t('pages.recordUser.confirmation'),
    icon: 'bi bi-exclamation-triangle-fill',
    accept: () => {
      blockUser()
    },
  })
}

const sendVerifySignup = async () => {
  if (!currentUser.value) return
  await authStore.sendEmailVerifySignup(currentUser.value.email)
}

const confirmSendVerifySignup = () => {
  if (!currentUser.value) return
  confirm.require({
    message: t('pages.recordUser.messageResendVerifySignup', {
      username: currentUser.value.username,
    }),
    header: t('pages.recordUser.confirmation'),
    icon: 'bi bi-exclamation-triangle-fill',
    accept: () => {
      sendVerifySignup()
    },
  })
}

const onSubmit = async () => {
  if (!currentUser.value) return
  await usersStore.patchUser(currentUser.value.id, {
    username: currentUser.value.username,
    lastName: currentUser.value.lastName,
    firstName: currentUser.value.firstName,
    email: currentUser.value.email,
    profile: currentUser.value.profile,
  })
}

const onReset = async () => {
  currentUser.value = await usersStore.getUser(route.params.id as string)
}
</script>
