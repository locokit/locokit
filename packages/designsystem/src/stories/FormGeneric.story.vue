<template>
  <Story title="FormGeneric" icon="bi:wrench-adjustable">
    <Variant title="default">
      <FormGeneric
        @cancel="logEvent('cancel', $event)"
        @submit="logEvent('submit', $event)"
      >
        <Field
          v-slot="{ field, meta: { valid, touched } }"
          v-model="name"
          name="name"
          type="input"
          rules="required"
          class="mb-4"
          as="div"
        >
          <PrimeInputText
            v-focus
            v-bind="field"
            placeholder="name"
            :required="true"
            :class="{ 'p-invalid': !valid && touched }"
          />
          <ErrorMessage class="p-text-error" name="name" />
        </Field>
        <Field
          v-slot="{ field }"
          v-model="pseudo"
          class="mb-4"
          name="pseudo"
          type="input"
          as="div"
        >
          <PrimeInputText v-bind="field" placeholder="pseudo" />
        </Field>
      </FormGeneric>
    </Variant>
    <Variant title="withFullButton">
      <FormGeneric
        :full-width-button="true"
        @cancel="logEvent('cancel', $event)"
        @submit="logEvent('submit', $event)"
      >
        <Field
          v-slot="{ field, meta: { valid, touched } }"
          v-model="name"
          name="name"
          type="input"
          rules="required"
          class="mb-4"
          as="div"
        >
          <PrimeInputText
            v-focus
            v-bind="field"
            placeholder="name"
            :required="true"
            :class="{ 'p-invalid': !valid && touched }"
          />
          <ErrorMessage name="name" class="p-text-error" />
        </Field>
        <Field
          v-slot="{ field }"
          v-model="pseudo"
          class="mb-4"
          name="pseudo"
          type="input"
          as="div"
        >
          <PrimeInputText v-bind="field" placeholder="pseudo" />
        </Field>
      </FormGeneric>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import FormGeneric from '../components/FormGeneric/FormGeneric.vue'
import PrimeInputText from 'primevue/inputtext'
import { Field, ErrorMessage } from 'vee-validate'
import { ref } from 'vue'
import { logEvent } from 'histoire/client'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit =
  defineEmits<(e: 'submit', name: string, pseudo: string | null) => void>()

const name = ref()
const pseudo = ref()
</script>

<docs lang="md">
### FormGeneric

Form generic which allow to propose some current action like submit or cancel.

Allow to remain homogeneous between the different forms proposed in the application.
It's a form wrapper.
</docs>
