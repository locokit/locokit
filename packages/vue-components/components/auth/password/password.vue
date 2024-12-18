<template>
  <generic-form
    :fields
    :loading
    :buttons="{
      submit: true,
      reset: false,
      cancel: false,
    }"
    :message="message"
    @submit="onSubmit"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
//import { regexPasswordRules } from "../../../../designsystem/src/helpers/regex.ts";
import { FIELD_COMPONENT, FIELD_TYPE, LocoKitFormField, LocoKitMessage } from "@locokit/definitions";
import GenericForm from "@/components/commons/generic-form/generic-form.vue";

const { t } = useI18n()

const emit = defineEmits<{
  /**
   * Emitted when the submit button has been clicked
   * and the form has been successfully validated.
   */
  submit: [password: string]
}>()

withDefaults(
  defineProps<{
    /** Is the form loading? `true` to put it in loading state. */
    loading?: boolean
    /** A message to display into the form, just above the buttons. */
    message?: LocoKitMessage
  }>(),
  {
    loading: false,
  },
)

const fields = computed<LocoKitFormField[]>(() => {
  return [
    {
      id: 'password',
      label: t('locokit.components.passwordForm.password'),
      //description: t('locokit.components.passwordForm.rules'),
      //class: 'mb-4 flex flex-col',
      type: FIELD_TYPE.TEXT,
      component: FIELD_COMPONENT.INPUT_PASSWORD,
      validationRules: {
        required: true,
        maxLength: 255,
        // TODO: check that input matches a regex
      },
    },
    {
      id: 'passwordCheck',
      label: t('locokit.components.passwordForm.passwordCheck'),
      type: FIELD_TYPE.TEXT,
      //class: 'mb-4 flex flex-col',
      component: FIELD_COMPONENT.INPUT_PASSWORD,
      validationRules: {
        required: true,
        maxLength: 255,
        // TODO: check that input is identical to the other field's value
      },
    },
  ]
})

const onSubmit = (values: Record<string, unknown>) => {
  emit('submit', values.password as string)
}
</script>
