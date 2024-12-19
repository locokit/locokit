import { FIELD_COMPONENT, FIELD_TYPE, type LocoKitFormField } from '@locokit/definitions'
import { expect, userEvent, within } from '@storybook/test'
import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import GenericForm from './generic-form.vue'

const meta: Meta<typeof GenericForm> = {
  title: 'components/forms/GenericForm',
  component: GenericForm,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof GenericForm>

export const Default: Story = {
  name: 'default one',
}

export const WithFields: Story = {
  name: 'with fields',
  render: () => ({
    setup() {
      const fields: LocoKitFormField[] = [
        {
          id: 'name',
          label: 'Name (text center aligned)',
          type: FIELD_TYPE.STRING,
          class: 'text-center',
          component: FIELD_COMPONENT.INPUT_TEXT,
          validationRules: {
            required: true,
          },
        },
        {
          id: 'pseudo',
          label: 'Pseudo (text right aligned)',
          type: FIELD_TYPE.STRING,
          class: 'text-right',
          component: FIELD_COMPONENT.INPUT_TEXT,
        },
      ]
      return { fields }
    },
    components: {
      GenericForm,
    },
    template: `
      <generic-form
        :fields="fields"
      />
    `,
  }),
}

export const WithFieldsLoading: Story = {
  name: 'loading, with fields',
  render: () => ({
    setup() {
      const fields: LocoKitFormField[] = [
        {
          id: 'name',
          label: 'Name (text center aligned)',
          type: FIELD_TYPE.STRING,
          class: 'text-center',
          component: FIELD_COMPONENT.INPUT_TEXT,
          validationRules: {
            required: true,
          },
        },
        {
          id: 'pseudo',
          label: 'Pseudo (text right aligned)',
          type: FIELD_TYPE.STRING,
          class: 'text-right',
          component: FIELD_COMPONENT.INPUT_TEXT,
        },
      ]
      const loading = ref(true)
      return { fields, loading }
    },
    components: {
      GenericForm,
    },
    template: `
      <generic-form
        :fields
        :loading
      />
    `,
  }),
}

export const WithValidationErrors: Story = {
  name: 'with validation errors',
  render: () => ({
    setup() {
      const fields: LocoKitFormField[] = [
        {
          id: 'name',
          label: 'Name (text center aligned)',
          type: FIELD_TYPE.STRING,
          class: 'text-center',
          component: FIELD_COMPONENT.INPUT_TEXT,
          validationRules: {
            required: true,
          },
        },
        {
          id: 'pseudo',
          label: 'Pseudo (text right aligned)',
          type: FIELD_TYPE.STRING,
          class: 'text-right',
          component: FIELD_COMPONENT.INPUT_TEXT,
        },
      ]
      return { fields }
    },
    components: {
      GenericForm,
    },
    template: `
      <generic-form
        :fields
      />
    `,
  }),
  play: async ({ canvasElement }) => {
    expect.assertions(3)
    const canvas = within(canvasElement)
    const submitButton = canvas.getByRole('button', { name: /Save/i })
    await expect(submitButton).toBeInTheDocument()
    await userEvent.click(submitButton)
    /**
     * now, the form has to display validation errors
     * for the input 'name'
     */
    const errorPlaceholderName = canvas.getByTestId('field-error-name')
    await expect(errorPlaceholderName).toBeInTheDocument()

    /**
     * But no for the 'pseudo' one
     * note: we use queryByTestId because getByTestId will fail
     */
    const errorPlaceholderPseudo = canvas.queryByTestId('field-error-pseudo')
    await expect(errorPlaceholderPseudo).not.toBeInTheDocument()
  },
}
