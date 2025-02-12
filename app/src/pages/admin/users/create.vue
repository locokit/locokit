<template>
  <div class="max-w-lg lg:h-full mx-auto px-4 lg:px-0 flex flex-col">
    <h1 class="mb-4 text-2xl text-primary font-bold"><!-- my-8 -->
      {{ $t('locokit.pages.createUser.title') }}
    </h1>
    <generic-form
      :fields
      :loading
      :message
      @submit="onSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
//import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import { useToast } from 'primevue/usetoast'
import { GenericForm } from '@locokit/vue-components'
import {
  FIELD_COMPONENT,
  FIELD_TYPE,
  SERVICES,
  USER_PROFILE,
  type LocoKitFormField,
  type LocoKitMessage,
} from '@locokit/definitions'
import { sdkClient } from '@/services/sdk'
import ROUTE_NAMES from '@/router/routes'

const { t } = useI18n()

definePage({
  name: ROUTE_NAMES.ADMIN.USERS.CREATE,
})
useHead({
  titleTemplate: `${t('locokit.pages.admin.title')} | %s`,
})

//const router = useRouter()
const toast = useToast()
const loading = ref(false)
const message = ref<LocoKitMessage | null>(null)

const fields = computed<LocoKitFormField[]>(() => {
  return [
    {
      id: 'username',
      label: t('locokit.pages.createUser.username'),
      type: FIELD_TYPE.TEXT,
      component: FIELD_COMPONENT.INPUT_TEXT,
      validationRules: {
        required: true,
        maxLength: 255,
      },
    },
    {
      id: 'lastName',
      label: t('locokit.pages.createUser.lastName'),
      type: FIELD_TYPE.TEXT,
      component: FIELD_COMPONENT.INPUT_TEXT,
      validationRules: {
        required: false,
        maxLength: 255,
      },
    },
    {
      id: 'firstName',
      label: t('locokit.pages.createUser.firstName'),
      type: FIELD_TYPE.TEXT,
      component: FIELD_COMPONENT.INPUT_TEXT,
      validationRules: {
        required: false,
        maxLength: 255,
      },
    },
    {
      id: 'email',
      label: t('locokit.pages.createUser.email'),
      type: FIELD_TYPE.EMAIL,
      component: FIELD_COMPONENT.INPUT_EMAIL,
      validationRules: {
        required: true,
        maxLength: 255,
      },
    },
    {
      id: 'profile',
      label: t('locokit.pages.createUser.profile'),
      type: FIELD_TYPE.SINGLE_SELECT,
      component: FIELD_COMPONENT.SINGLE_SELECT,
      source: {
        options: [
          USER_PROFILE.MEMBER,
          USER_PROFILE.CREATOR,
          USER_PROFILE.ADMIN,
        ],
      },
      validationRules: {
        required: true,
      },
    },
  ]
})

async function onSubmit(values: Record<string, unknown>) {
  loading.value = true

  try {
    const user = await sdkClient.service(SERVICES.CORE_USER).create({
      username: values.username,
      lastName: values.lastName,
      firstName: values.firstName,
      email: values.email,
      profile: values.profile,
    })

    message.value = null

    toast.add({
      severity: 'success',
      summary: t('locokit.success.basic'),
      life: 3000,
    })

    // await router.push({
    //   name: ROUTE_NAMES.ADMIN.USERS.RECORD,
    //   params: { id: user.id },
    // })
  } catch (err) {
    message.value = {
      status: 'error',
      text: (err as Error).message,
    }
  }

  loading.value = false
}
</script>
