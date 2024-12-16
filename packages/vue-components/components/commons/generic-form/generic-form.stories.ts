import { FIELD_COMPONENT, FIELD_TYPE, type LocoKitFormField } from '@locokit/definitions'
import { expect, userEvent, within } from '@storybook/test'
import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import GenericForm from './generic-form.vue'
import { LocoKitFormFieldAutocomplete } from '@locokit/definitions/dist/fieldType'

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

export const WithInitialValues: Story = {
  name: 'with initial values',
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
      const initialValues = {
        name: 'My name',
        pseudo: 'My pseudo',
      }
      return { fields, initialValues }
    },
    components: {
      GenericForm,
    },
    template: `
      <generic-form
        :fields
        :initial-values
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
}

export const WithAllSortsOfFields: Story = {
  name: 'with all sorts of fields',
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
      return { fields, autocompleteSuggestions }
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
        @complete="onComplete"
      />
    `,
  }),
}

export const WithConditionalDisplayedFields: Story = {}
