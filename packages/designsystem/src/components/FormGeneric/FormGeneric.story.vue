<template>
  <Story title="FormGeneric" icon="bi:wrench-adjustable">
    <Variant title="default">
      <FormGeneric @submit="logEvent('submit', $event)">
        <Field
          v-slot="{ field, meta: { valid, touched } }"
          v-model="name"
          name="name"
          type="input"
          rules="required"
          class="mb-4"
          as="div"
        >
          <PrimeInput
            v-focus
            v-bind="field"
            placeholder="name"
            :required="true"
            :class="{ 'p-invalid': !valid && touched }"
          />
          <ErrorMessage name="name" />
        </Field>
        <Field
          v-slot="{ field }"
          v-model="pseudo"
          class="mb-4"
          name="pseudo"
          type="input"
          as="div"
        >
          <PrimeInput v-bind="field" placeholder="pseudo" />
        </Field>
      </FormGeneric>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import FormGeneric from './FormGeneric.vue'
import PrimeInput from 'primevue/inputtext'
import PrimePassword from 'primevue/password'
import { Field, ErrorMessage } from 'vee-validate'
import { ref } from 'vue'
import { logEvent } from 'histoire/client'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmits<{
  (e: 'submit', name: string, pseudo: string | null): void
}>()

const name = ref()
const pseudo = ref()
</script>

<docs lang="md">
### FormGeneric

Form generic which allow to propose some current action like submit or cancel.

Allow to remain homogeneous between the different forms proposed in the application.
It's just a form wrapper.
</docs>
