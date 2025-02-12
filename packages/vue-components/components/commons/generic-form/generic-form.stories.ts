import { ref } from 'vue'
import type { Meta, StoryContext, StoryObj } from '@storybook/vue3'
import { expect, fn, screen, userEvent, waitFor, within } from '@storybook/test'
import PrimeButton from 'primevue/button'
import {
  FIELD_COMPONENT,
  FIELD_TYPE,
  type LocoKitFormField,
  type LocoKitFormFieldAutocomplete
} from '@locokit/definitions'
import GenericForm from './generic-form.vue'
import { AutoCompleteCompleteEvent } from 'primevue'

const meta: Meta<typeof GenericForm> = {
  title: 'components/forms/GenericForm',
  component: GenericForm,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof GenericForm>

export const Default: Story = {}

export const WithFields: Story = {
  render: () => ({
    setup() {
      const fields: LocoKitFormField[] = [
        {
          id: 'name',
          label: 'Name (text center aligned)',
          description: 'This is the description on a single line',
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
          description: ['This is the description', 'on a multi', 'line'],
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
  name: 'Loading',
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

export const WithInitialValues: Story = {
  render: () => ({
    setup() {
      const fields: LocoKitFormField[] = [
        {
          id: 'name',
          label: 'Name (text center aligned)',
          type: FIELD_TYPE.STRING,
          component: FIELD_COMPONENT.INPUT_TEXT,
          validationRules: {
            required: true,
          },
        },
        {
          id: 'pseudo',
          label: 'Pseudo (text right aligned)',
          type: FIELD_TYPE.STRING,
          component: FIELD_COMPONENT.INPUT_TEXT,
        },
      ]
      const initialValues1 = {
        name: 'My name 1',
        pseudo: 'My pseudo 1',
      }
      const initialValues2 = {
        name: 'My name 2',
        pseudo: 'My pseudo 2',
      }
      const initialValues = ref(initialValues1)
      function setInitialValues1() {
        initialValues.value = initialValues1
      }
      function setInitialValues2() {
        initialValues.value = initialValues2
      }
      return { fields, initialValues, setInitialValues1, setInitialValues2 }
    },
    components: {
      GenericForm,
      PrimeButton,
    },
    template: `
      <PrimeButton @click="setInitialValues1" label="Set 1" />
      <PrimeButton @click="setInitialValues2" label="Set 2" />
      <generic-form
        :fields
        :initial-values
      />
    `,
  }),
}

export const WithValidationErrors: Story = {
  args: {
    fields: [
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
    ] as LocoKitFormField[],
  },
}

export const WithAllSortsOfField: Story = {
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
        {
          id: 'date',
          label: 'Date',
          type: FIELD_TYPE.DATE,
          component: FIELD_COMPONENT.INPUT_DATE,
        },
        {
          id: 'datetime',
          label: 'Date time',
          type: FIELD_TYPE.DATETIME,
          component: FIELD_COMPONENT.INPUT_DATETIME,
        },
        {
          id: 'number',
          label: 'Number',
          type: FIELD_TYPE.NUMBER,
          component: FIELD_COMPONENT.INPUT_NUMBER,
        },
        {
          id: 'textarea',
          label: 'Textarea',
          type: FIELD_TYPE.TEXT,
          component: FIELD_COMPONENT.TEXTAREA,
        },
        {
          id: 'select',
          label: 'Single select',
          type: FIELD_TYPE.STRING,
          component: FIELD_COMPONENT.SINGLE_SELECT,
          source: {
            options: [
              {
                fieldLabel: 'Label 1',
                fieldValue: 'Value 1',
              },
              {
                fieldLabel: 'Label 2',
                fieldValue: 'Value 2',
                fieldTextColor: '#098912',
              },
              {
                fieldLabel: 'Label 3',
                fieldValue: 'Value 3',
              },
              {
                fieldLabel: 'Label 4',
                fieldValue: 'Value 4',
                fieldBackgroundColor: '#336611',
              },
            ],
            label: 'fieldLabel',
            value: 'fieldValue',
            colorFields: {
              text: 'fieldTextColor',
              background: 'fieldBackgroundColor',
            },
          },
        },
        {
          id: 'autocomplete',
          label: 'Autocomplete field',
          type: FIELD_TYPE.STRING,
          component: FIELD_COMPONENT.AUTOCOMPLETE,
          source: {
            table: 'myTable',
            label: 'fieldLabel',
            value: 'fieldValue',
          },
        },
        {
          id: 'toggle',
          label: 'Toggle switch field',
          type: FIELD_TYPE.BOOLEAN,
          component: FIELD_COMPONENT.TOGGLE_SWITCH,
        },
      ]
      const autocompleteSuggestions = ref([])
      const buttonPosition = 'block'
      return { fields, autocompleteSuggestions, buttonPosition }
    },
    components: {
      GenericForm,
    },
    methods: {
      onComplete(f: LocoKitFormFieldAutocomplete, event: { query: string }) {
        this.autocompleteSuggestions = [
          {
            fieldLabel: 'Suggestion 1',
            fieldValue: 'value1',
          },
          {
            fieldLabel: 'Suggestion 2',
            fieldValue: 'value2',
          },
          {
            fieldLabel: 'Suggestion 3',
            fieldValue: 'value3',
          },
          {
            fieldLabel: 'Suggestion 4',
            fieldValue: 'value4',
          },
        ]
      },
    },
    template: `
      <generic-form
        :fields
        :autocomplete-suggestions="autocompleteSuggestions"
        :button-position="buttonPosition"
        @complete="onComplete"
      />
    `,
  }),
}

export const AutocompleteFields: Story = {
  args: {
    buttonPosition: 'block',
    autocompleteSuggestions: [
      { fieldLabel: 'Suggestion 1', fieldValue: 'value1' },
      { fieldLabel: 'Suggestion 2', fieldValue: 'value2' },
    ],
    initialValues: {
      with_initial_value: { fieldLabel: 'Suggestion 2', fieldValue: 'value2' },
    },
    fields: [
      {
        id: 'default',
        label: 'An autocomplete field by default',
        type: FIELD_TYPE.STRING,
        component: FIELD_COMPONENT.AUTOCOMPLETE,
        source: {
          table: 'myTable',
          label: 'fieldLabel',
          value: 'fieldValue',
        },
      },
      {
        id: 'without_free_input',
        label: 'An autocomplete field without free input',
        description: "This field will be emptied if you do not select one of the suggestions.",
        type: FIELD_TYPE.STRING,
        component: FIELD_COMPONENT.AUTOCOMPLETE,
        freeInput: false,
        source: {
          table: 'myTable',
          label: 'fieldLabel',
          value: 'fieldValue',
        },
      },
      {
        id: 'with_initial_value',
        label: 'An autocomplete field with an initial value',
        type: FIELD_TYPE.STRING,
        component: FIELD_COMPONENT.AUTOCOMPLETE,
        source: {
          table: 'myTable',
          label: 'fieldLabel',
          value: 'fieldValue',
        },
      },
    ] as LocoKitFormField[],
    onSubmit: fn(),
  },
  render: (args) => ({
    components: { GenericForm },
    setup() {
      args.onComplete = fn().mockImplementation(
        (
          event: AutoCompleteCompleteEvent,
          field: LocoKitFormFieldAutocomplete,
          values: Record<string, unknown>
        ) => {
          if (field.id === 'default') {
            args.autocompleteSuggestions = [
              { fieldLabel: 'Suggestion 3', fieldValue: 'value3' },
              { fieldLabel: 'Suggestion 4', fieldValue: 'value4' },
            ]
          } else {
            args.autocompleteSuggestions = [
              { fieldLabel: 'Suggestion 5', fieldValue: 'value5' },
              { fieldLabel: 'Suggestion 6', fieldValue: 'value6' },
            ]
          }
        }
      )

      return { args };
    },
    template: '<generic-form v-bind="args" />',
  }),
  play: async ({ args, canvasElement }: StoryContext) => {
    const canvas = within(canvasElement)
    const user = userEvent.setup({ delay: 80 })

    let listbox = screen.queryByRole('listbox', { name: /option list/i })
    await expect(listbox).not.toBeInTheDocument()

    const defaultInput = canvas.getByRole('combobox', { name: /by default$/i })
    await user.type(defaultInput, 'test')

    await waitFor(() => {
      expect(args.onComplete).toHaveBeenLastCalledWith(
        expect.objectContaining({ query: 'test' }),
        expect.objectContaining({
          id: 'default',
          label: 'An autocomplete field by default',
          type: FIELD_TYPE.STRING,
          component: FIELD_COMPONENT.AUTOCOMPLETE,
          source: {
            table: 'myTable',
            label: 'fieldLabel',
            value: 'fieldValue',
          },
        }),
        {
          default: 'test',
          without_free_input: undefined,
          with_initial_value: 'value2',
        }
      )
    })

    listbox = await screen.findByRole('listbox', { name: /option list/i })
    await expect(listbox).toBeInTheDocument()

    let options = within(listbox).getAllByRole('option')
    await expect(options).toHaveLength(2)
    await expect(options[0]).toHaveTextContent("Suggestion 3")
    await expect(options[1]).toHaveTextContent("Suggestion 4")

    const restrictedInput = canvas.getByRole('combobox', { name: /without free input$/i })
    await user.type(restrictedInput, 'test')

    listbox = await screen.findByRole('listbox', { name: /option list/i })
    await expect(listbox).toBeInTheDocument()

    options = within(listbox).getAllByRole('option')
    await expect(options).toHaveLength(2)
    await expect(options[0]).toHaveTextContent("Suggestion 5")
    await expect(options[1]).toHaveTextContent("Suggestion 6")

    const thirdInput = canvas.getByRole('combobox', { name: /with an initial value$/i })
    await user.click(thirdInput)

    await waitFor(() => {
      expect(listbox).not.toBeInTheDocument()
    })

    await user.type(thirdInput, '{Control>}a{/Control}{Backspace}test')

    listbox = await screen.findByRole('listbox', { name: /option list/i })
    await expect(listbox).toBeInTheDocument()

    options = within(listbox).getAllByRole('option')
    await expect(options).toHaveLength(2)
    await expect(options[0]).toHaveTextContent("Suggestion 5")
    await expect(options[1]).toHaveTextContent("Suggestion 6")

    await user.click(options[0])

    await waitFor(() => {
      expect(listbox).not.toBeInTheDocument()
    })

    await expect(thirdInput).toHaveValue("Suggestion 5")

    const saveButton = canvas.getByRole('button', { name: /Save/i })
    await user.click(saveButton)

    await waitFor(() => {
      expect(args.onSubmit).toHaveBeenCalledWith({
        default: 'test',
        without_free_input: '',
        with_initial_value: 'value5',
      })
    })
  },
}

export const WithConditionalDisplayedFields: Story = {}
