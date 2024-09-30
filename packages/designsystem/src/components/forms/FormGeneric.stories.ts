import type { Meta, StoryObj } from '@storybook/vue3';
import FormGeneric from './FormGeneric.vue';
import PrimeInputText from 'primevue/inputtext'
import { Field, ErrorMessage } from 'vee-validate'
import { ref } from 'vue'

const meta: Meta<typeof FormGeneric> = {
  title: 'components/forms/FormGeneric',
  component: FormGeneric,
  tags: ['autodocs'],
}
 
export default meta;
type Story = StoryObj<typeof FormGeneric>;

export const Default: Story = {
  name: 'default one',
}

export const WithFields: Story = {
  name: 'with fields',
  render: (args) => ({
    setup() {
      const name = ref()
      const pseudo = ref()
      return {
        name,
        pseudo,
      }
    },
    components: {
      LckFormGeneric: FormGeneric,
      PField: Field,
      PErrorMessage: ErrorMessage,
      PInputText: PrimeInputText
    },
    template: `
      <lck-form-generic
      >
        <p-field
          v-slot="{ field, meta: { valid, touched } }"
          v-model="name"
          name="name"
          type="input"
          rules="required"
          class="mb-4 flex flex-col gap-2"
          as="div"
        >
          <label for="name">
            Name
          </label>
          <p-input-text
            id='name'
            v-focus
            v-bind="field"
            placeholder="name"
            :required="true"
            :class="{ 'p-invalid': !valid && touched }"
          />
          <p-error-message class="p-text-error" name="name" />
        </p-field>
        <p-field
          v-slot="{ field }"
          v-model="pseudo"
          class="mb-4 flex flex-col gap-2"
          name="pseudo"
          type="input"
          as="div"
        >
          <label for="pseudo">
            Pseudo
          </label>
          <p-input-text id="pseudo" v-bind="field" placeholder="pseudo" />
        </p-field>
      </lck-form-generic>
    `
  })
}

export const withFullButton: Story = {
  name: 'with full button',
  render: (args) => ({
    setup() {
      const name = ref()
      const pseudo = ref()
      return {
        name,
        pseudo,
      }
    },
    components: {
      LckFormGeneric: FormGeneric,
      PField: Field,
      PErrorMessage: ErrorMessage,
      PInputText: PrimeInputText
    },
    template: `
      <lck-form-generic
        :full-width-button="true"
      >
        <p-field
          v-slot="{ field, meta: { valid, touched } }"
          v-model="name"
          name="name"
          type="input"
          rules="required"
          class="mb-4 flex flex-col gap-2"
          as="div"
        >
          <p-input-text
            v-focus
            v-bind="field"
            placeholder="name"
            :required="true"
            :class="{ 'p-invalid': !valid && touched }"
          />
          <p-error-message name="name" class="p-text-error" />
        </p-field>
        <p-field
          v-slot="{ field }"
          v-model="pseudo"
          class="mb-4 flex flex-col gap-2"
          name="pseudo"
          type="input"
          as="div"
        >
          <p-input-text v-bind="field" placeholder="pseudo" />
        </p-field>
      </lck-form-generic>
      `
  })
}

// <script setup lang="ts">
// import { logEvent } from 'histoire/client'

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const emit =
//   defineEmits<(e: 'submit', name: string, pseudo: string | null) => void>()
// </script>

// <docs lang="md">
// ### FormGeneric

// Form generic which allow to propose some current action like submit or cancel.

// Allow to remain homogeneous between the different forms proposed in the application.
// It's a form wrapper.
// </docs>
