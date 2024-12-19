<template>
  <generic-form
    :fields
    :buttons="{
      submit: true,
      reset: false,
      cancel: false,
    }"
    :labels="{
      submit: t('locokit.components.updateGeneralForm.submit'),
    }"
    :loading="loading"
    :message="message"
    @submit="onSubmit"
  >
    <template #bottom>
      <div class="mb-4" v-if="user.email">
        <p>{{ $t('locokit.components.updateGeneralForm.email') }}</p>
        <p class="my-1 font-bold">
          {{ user.email }}
        </p>
      </div>
      <div class="mb-4" v-if="user.profile">
        <p>{{ $t('locokit.components.updateGeneralForm.role') }}</p>
        <SingleTag
          class="my-1 w-fit"
          :label="$t(`locokit.components.updateGeneralForm.${user.profile.toLowerCase()}`)"
        />
      </div>
    </template>
  </generic-form>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { FIELD_COMPONENT, FIELD_TYPE, LocoKitFormField, LocoKitMessage, LocoKitUser } from '@locokit/definitions'
import GenericForm from '@/components/commons/generic-form/generic-form.vue'
import SingleTag from '@/components/ui/single-tag/single-tag.vue'

const { t } = useI18n()

const emit = defineEmits<{
  /**
   * Emitted when the submit button has been clicked
   * and the form has been successfully validated.
   */
  submit: [
    form: {
      id: string
      username: string
      lastName: string | null
      firstName: string | null
    }
  ]
}>()

const props = withDefaults(
  defineProps<{
    /** The user object concerned by the update. */
    user: LocoKitUser
    /** Is the form loading? `true` to put it in loading state. */
    loading?: boolean
    /** A message to display into the form, just above the buttons. */
    message?: LocoKitMessage
  }>(),
  {
    loading: false,
    response: null,
  },
)

const fields = computed<LocoKitFormField[]>(() => {
  return [
    {
      id: 'username',
      label: t('locokit.components.updateGeneralForm.username'),
      type: FIELD_TYPE.TEXT,
      component: FIELD_COMPONENT.INPUT_TEXT,
      validationRules: {
        required: true,
        maxLength: 255,
      },
    },
    {
      id: 'lastName',
      label: t('locokit.components.updateGeneralForm.lastName'),
      type: FIELD_TYPE.TEXT,
      component: FIELD_COMPONENT.INPUT_TEXT,
      validationRules: {
        required: false,
        maxLength: 255,
      },
    },
    {
      id: 'firstName',
      label: t('locokit.components.updateGeneralForm.firstName'),
      type: FIELD_TYPE.TEXT,
      component: FIELD_COMPONENT.INPUT_TEXT,
      validationRules: {
        required: false,
        maxLength: 255,
      },
    },
  ]
})

const onSubmit = (values: Record<string, unknown>) => {
  emit('submit', {
    id: props.user.id,
    ...values as {
      username: string,
      lastName: string,
      firstName: string,
    }
  })
}
</script>
