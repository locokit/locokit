import type { Meta, StoryContext, StoryObj } from '@storybook/vue3'
import { expect, fn, screen, userEvent, waitFor, within } from '@storybook/test'
import { FIELD_TYPE } from '@locokit/definitions'
import FilterBuilder from './filter-builder.vue'

const meta: Meta<typeof FilterBuilder> = {
  title: 'components/ui/filter-builder',
  component: FilterBuilder,
  parameters: {
    docs: {
      story: { height: '15rem' },
    },
  },
}
export default meta

const fieldsDefinition = [
  {
    slug: 'string_field',
    name: 'String field',
    type: FIELD_TYPE.STRING,
  },
  {
    slug: 'long-name',
    name: 'Field with super mega long name',
    type: FIELD_TYPE.STRING,
  },
  {
    slug: 'boolean_field',
    name: 'Boolean field',
    type: FIELD_TYPE.BOOLEAN,
  },
  {
    slug: 'number_field',
    name: 'Number field',
    type: FIELD_TYPE.NUMBER,
  },
  {
    slug: 'float_field',
    name: 'Float field',
    type: FIELD_TYPE.FLOAT,
  },
  {
    slug: 'single_select_field',
    name: 'Single select field',
    type: FIELD_TYPE.SINGLE_SELECT,
  },
  {
    slug: 'multi_select_field',
    name: 'Multi select field',
    type: FIELD_TYPE.MULTI_SELECT,
  },
  {
    slug: 'date_field',
    name: 'Date field',
    type: FIELD_TYPE.DATE,
  },
  {
    slug: 'date_time_field',
    name: 'Date time field',
    type: FIELD_TYPE.DATETIME,
  },
  {
    slug: 'user_field',
    name: 'User field',
    type: FIELD_TYPE.USER,
  },
]

const fieldOptions = {
  single_select_field: {
    options: [
      { label: 'Choice One', value: 'c1' },
      { label: 'Choice Two', value: 'c2' },
      { label: 'Choice Three', value: 'c3' },
    ],
  },
  multi_select_field: {
    options: [
      { label: 'Choice One', value: 'c1' },
      { label: 'Choice Two', value: 'c2' },
      { label: 'Choice Three', value: 'c3' },
    ],
  },
}

type Story = StoryObj<typeof FilterBuilder>

export const Default: Story = {
  args: {
    fieldsDefinition: fieldsDefinition,
    fieldOptions: fieldOptions,
    onSubmitFilters: fn(),
    onResetFilters: fn(),
  },
  play: async ({ args, canvasElement }: StoryContext) => {
    const canvas = within(canvasElement)
    let user = userEvent.setup({ delay: 80 })

    // 1. Test the initial state.
    const toggleButton = canvas.getByRole('button', { name: /[0-9]+ filters?/i })
    let popover = screen.queryByRole('dialog')

    await expect(toggleButton).toBeInTheDocument()
    await expect(toggleButton).toHaveTextContent(/0 filter/i)
    await expect(popover).not.toBeInTheDocument()

    // 2. Test the opening of the filters edition panel.
    await user.click(toggleButton)
    popover = await screen.findByRole('dialog')

    // 3. Test the panel (popover) initial state.
    const fieldSelect1 = within(popover).getByRole('combobox', { name: /Field/i })
    const ruleSelect1 = within(popover).getByRole('combobox', { name: /Rule/i })

    await expect(fieldSelect1).not.toHaveAttribute('aria-disabled', 'true')
    await expect(fieldSelect1).not.toHaveValue()
    await expect(ruleSelect1).toHaveAttribute('aria-disabled', 'true')
    await expect(ruleSelect1).not.toHaveValue()

    // 4. Test the definition of a first filter for a string type field.
    // 4.1. Select a field
    await user.click(fieldSelect1)
    const fieldListbox1 = await screen.findByRole('listbox', { name: /fields list/i })

    const fieldOption1 = within(fieldListbox1).getByRole('option', { name: /String/ })
    await user.click(fieldOption1)

    await waitFor(() => {
      expect(ruleSelect1).toHaveAttribute('aria-disabled', 'false')
    })

    // 4.2. Select a rule
    await user.click(ruleSelect1)
    const ruleListbox1 = await screen.findByRole('listbox', { name: /rules list/i })

    const ruleOption1 = within(ruleListbox1).getByRole('option', { name: 'match' })
    await user.click(ruleOption1)

    const valueField1 = await within(popover).findByRole('textbox', { name: /Value/i })
    await expect(valueField1).toBeInTheDocument()

    // 4.3. Define the filter value
    await user.type(valueField1, 'test')

    // 5. Test the definition of a thri filter for a number type field.
    const addFilterButton = within(popover).getByRole('button', { name: /add a filter/i })
    await user.click(addFilterButton)

    const fieldSelect2 = await within(popover).findByRole('combobox', { name: /Field to consider for filter #2/i })
    const ruleSelect2 = within(popover).getByRole('combobox', { name: /Rule to apply for filter #2/i })

    await expect(fieldSelect2).not.toHaveAttribute('aria-disabled', 'true')
    await expect(fieldSelect2).not.toHaveValue()
    await expect(ruleSelect2).toHaveAttribute('aria-disabled', 'true')
    await expect(ruleSelect2).not.toHaveValue()

    // 5.1. Select a field
    await user.click(fieldSelect2)
    const fieldListbox2 = await screen.findByRole('listbox', { name: /fields list/i })

    const fieldOption2 = within(fieldListbox2).getByRole('option', { name: /number/i })
    await user.click(fieldOption2)

    await waitFor(() => {
      expect(ruleSelect2).toHaveAttribute('aria-disabled', 'false')
    })

    // 5.2. Select a rule
    await user.click(ruleSelect2)
    const ruleListbox2 = await screen.findByRole('listbox', { name: /rules list/i })

    const ruleOption2 = within(ruleListbox2).getByRole('option', { name: 'is greater than' })
    await user.click(ruleOption2)

    const valueField2 = await within(popover).findByRole('spinbutton', { name: /Reference value for filter #2/i })
    await expect(valueField2).toBeInTheDocument()

    // 5.3. Define the filter value
    await user.type(valueField2, '42')

    // 6. Test the definition of a third filter for a boolean type field.
    await user.click(addFilterButton)

    const fieldSelect3 = await within(popover).findByRole('combobox', { name: /Field to consider for filter #3/i })
    const ruleSelect3 = within(popover).getByRole('combobox', { name: /Rule to apply for filter #3/i })

    await expect(fieldSelect3).not.toHaveAttribute('aria-disabled', 'true')
    await expect(fieldSelect3).not.toHaveValue()
    await expect(ruleSelect3).toHaveAttribute('aria-disabled', 'true')
    await expect(ruleSelect3).not.toHaveValue()

    // 6.1. Select a field
    await user.click(fieldSelect3)
    const fieldListbox3 = await screen.findByRole('listbox', { name: /fields list/i })

    const fieldOption3 = within(fieldListbox3).getByRole('option', { name: /boolean/i })
    await user.click(fieldOption3)

    await waitFor(() => {
      expect(ruleSelect3).toHaveAttribute('aria-disabled', 'false')
    })

    // 6.2. Select a rule
    await user.click(ruleSelect3)
    const ruleListbox3 = await screen.findByRole('listbox', { name: /rules list/i })

    const ruleOption3 = within(ruleListbox3).getByRole('option', { name: 'is false' })
    await user.click(ruleOption3)

    // 7. Test the definition of a third filter for a date type field.
    await user.click(addFilterButton)

    const fieldSelect4 = await within(popover).findByRole('combobox', { name: /Field to consider for filter #4/i })
    const ruleSelect4 = within(popover).getByRole('combobox', { name: /Rule to apply for filter #4/i })

    await expect(fieldSelect4).not.toHaveAttribute('aria-disabled', 'true')
    await expect(fieldSelect4).not.toHaveValue()
    await expect(ruleSelect4).toHaveAttribute('aria-disabled', 'true')
    await expect(ruleSelect4).not.toHaveValue()

    // 7.1. Select a field
    await user.click(fieldSelect4)
    const fieldListbox4 = await screen.findByRole('listbox', { name: /fields list/i })

    const fieldOption4 = within(fieldListbox4).getByRole('option', { name: /date field/i })
    await user.click(fieldOption4)

    await waitFor(() => {
      expect(ruleSelect4).toHaveAttribute('aria-disabled', 'false')
    })

    // 7.2. Select a rule
    await user.click(ruleSelect4)
    const ruleListbox4 = await screen.findByRole('listbox', { name: /rules list/i })

    const ruleOption4 = within(ruleListbox4).getByRole('option', { name: 'is earlier than' })
    await user.click(ruleOption4)

    const valueField4 = await within(popover).findByRole('combobox', { name: /Reference value for filter #4/i })
    await expect(valueField4).toBeInTheDocument()

    // 7.3. Define the filter value
    await user.click(valueField4)

    const date = new Date()
    date.setDate(15)
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)

    await waitFor(() => {
      const datePicker = screen.queryByRole('dialog', { name: /choose date/i })
      expect(datePicker).toBeInTheDocument()
    })

    const datePicker = screen.getByRole('dialog', { name: /choose date/i })
    const day15 = within(datePicker).getByText('15', { selector: 'span' })
    await user.click(day15)

    await waitFor(() => {
      expect(valueField4).toHaveValue(date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }))
    })

    // 8. Test the definition of a third filter for a select type field.
    await user.click(addFilterButton)

    const fieldSelect5 = await within(popover).findByRole('combobox', { name: /Field to consider for filter #5/i })
    const ruleSelect5 = within(popover).getByRole('combobox', { name: /Rule to apply for filter #5/i })

    await expect(fieldSelect5).not.toHaveAttribute('aria-disabled', 'true')
    await expect(fieldSelect5).not.toHaveValue()
    await expect(ruleSelect5).toHaveAttribute('aria-disabled', 'true')
    await expect(ruleSelect5).not.toHaveValue()

    // 8.1. Select a field
    await user.click(fieldSelect5)
    const fieldListbox5 = await screen.findByRole('listbox', { name: /fields list/i })

    const fieldOption5 = within(fieldListbox5).getByRole('option', { name: /multi select field/i })
    await user.click(fieldOption5)

    await waitFor(() => {
      expect(ruleSelect5).toHaveAttribute('aria-disabled', 'false')
    })

    // 8.2. Select a rule
    await user.click(ruleSelect5)
    const ruleListbox5 = await screen.findByRole('listbox', { name: /rules list/i })

    const ruleOption5 = within(ruleListbox5).getByRole('option', { name: /contains at least/i })
    await user.click(ruleOption5)

    const valueField5 = await within(popover).findByRole('combobox', { name: /Reference value for filter #5/i })
    await expect(valueField5).toBeInTheDocument()
    // The "value field" we found is the <input> used in background of the
    // Prime MultiSelect component and it turns out to be rather passive:
    // clicking on it does not open the option list.
    // So we need to find the parent to click on.
    const multiSelect = valueField5.closest(`#value-4`)

    // 8.3. Define the filter value
    await user.click(multiSelect as Element)

    await waitFor(() => {
      const optionList = screen.queryByRole('listbox', { name: /option list/i })
      expect(optionList).toBeInTheDocument()
    })

    const optionList = screen.getByRole('listbox', { name: /option list/i })
    await user.click(within(optionList).getByRole('option', { name: /choice one/i }))
    await user.click(within(optionList).getByRole('option', { name: /choice three/i }))

    // 9. Apply filters
    const validateButton = within(popover).getByRole('button', { name: /validate/i })
    await user.click(validateButton)

    await waitFor(() => {
      expect(args.onSubmitFilters).toHaveBeenCalledWith([
        {
          field: {
            name: "String field",
            slug: 'string_field',
            type: FIELD_TYPE.STRING,
          },
          rule: {
            label: "match",
            operator: '$ilike',
            valuePrefix: '%',
            valueSuffix: '%',
          },
          value: 'test',
          logicalOperator: '$and',
        },
        {
          field: {
            name: "Number field",
            slug: 'number_field',
            type: FIELD_TYPE.NUMBER,
          },
          rule: {
            label: "isGreaterThan",
            operator: '$gt',
          },
          value: 42,
          logicalOperator: '$and',
        },
        {
          field: {
            name: "Boolean field",
            slug: 'boolean_field',
            type: FIELD_TYPE.BOOLEAN,
          },
          rule: {
            label: "isFalse",
            operator: '$eq',
            predefinedValue: false,
          },
          value: false,
          logicalOperator: '$and',
        },
        {
          field: {
            name: "Date field",
            slug: 'date_field',
            type: FIELD_TYPE.DATE,
          },
          rule: {
            label: "isEarlierThan",
            operator: '$lt',
          },
          value: date,
          logicalOperator: '$and',
        },
        {
          field: {
            name: "Multi select field",
            slug: 'multi_select_field',
            type: FIELD_TYPE.MULTI_SELECT,
          },
          rule: {
            label: "any",
            operator: '$any',
          },
          value: [
            { label: "Choice One", value: 'c1' },
            { label: "Choice Three", value: 'c3' },
          ],
          logicalOperator: '$and',
        },
      ])
      expect(toggleButton).toHaveTextContent(/5 filter/i)
      expect(popover).not.toBeInTheDocument()
    })

    // 10. Reset filters
    user = userEvent.setup({ delay: 160 })
    await user.click(toggleButton)

    await waitFor(() => {
      popover = screen.queryByRole('dialog')
      expect(popover).toBeInTheDocument()
    })

    const resetButton = within(popover).getByRole('button', { name: /reset/i })
    await user.click(resetButton)

    await waitFor(() => {
      expect(args.onResetFilters).toHaveBeenCalled()

      expect(toggleButton).toHaveTextContent(/0 filter/i)
      expect(fieldSelect2).not.toBeInTheDocument()
      expect(ruleSelect2).not.toBeInTheDocument()
      expect(fieldSelect3).not.toBeInTheDocument()
      expect(ruleSelect3).not.toBeInTheDocument()
      expect(fieldSelect4).not.toBeInTheDocument()
      expect(ruleSelect4).not.toBeInTheDocument()

      popover = popover as HTMLElement // For the linter
      const fieldSelect = within(popover).getByRole('combobox', { name: /Field/i })
      const ruleSelect = within(popover).getByRole('combobox', { name: /Rule/i })

      expect(fieldSelect).not.toHaveValue()
      expect(ruleSelect).toHaveAttribute('aria-disabled', 'true')
    })
  },
}

export const WithPredefinedFilters: Story = {
  args: {
    fieldsDefinition: fieldsDefinition,
    fieldOptions: fieldOptions,
    currentFilters: [
      {
        field: {
          name: "String field",
          slug: 'string_field',
          type: FIELD_TYPE.STRING,
        },
        rule: {
          label: "match",
          operator: '$ilike',
          valuePrefix: '%',
          valueSuffix: '%',
        },
        value: 'test',
        logicalOperator: '$and',
      },
      {
        field: {
          name: "Date field",
          slug: 'date_field',
          type: FIELD_TYPE.DATE,
        },
        rule: {
          label: "isEarlierThan",
          operator: '$lt',
        },
        value: new Date(2050, 0, 1),
        logicalOperator: '$and',
      },
      {
        field: {
          name: "Multi select field",
          slug: 'multi_select_field',
          type: FIELD_TYPE.MULTI_SELECT,
        },
        rule: {
          label: "any",
          operator: '$any',
        },
        value: [
          { label: "Choice One", value: 'c1' },
          { label: "Choice Three", value: 'c3' },
        ],
        logicalOperator: '$and',
      },
    ],
    onSubmitFilters: fn(),
  },
  play: async ({ args, canvasElement }: StoryContext) => {
    const canvas = within(canvasElement)
    const user = userEvent.setup({ delay: 80 })

    const toggleButton = canvas.getByRole('button', { name: /[0-9]+ filters?/i })
    await expect(toggleButton).toBeInTheDocument()
    await expect(toggleButton).toHaveTextContent(/3 filter/i)
    await user.click(toggleButton)

    const popover = await screen.findByRole('dialog')
    const validateButton = within(popover).getByRole('button', { name: /validate/i })
    await user.click(validateButton)

    await waitFor(() => {
      expect(args.onSubmitFilters).toHaveBeenCalledWith(args.currentFilters)
      expect(toggleButton).toHaveTextContent(/3 filter/i)
      expect(popover).not.toBeInTheDocument()
    })
  },
}
