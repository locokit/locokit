import type { Meta, StoryObj } from '@storybook/vue3';
import { FIELD_TYPE } from '@locokit/definitions'
import FilterButton from './FilterButton.vue';

const meta: Meta<typeof FilterButton> = {
  title: 'components/ui/FilterButton',
  component: FilterButton,
};
 
export default meta;
type Story = StoryObj<typeof FilterButton>;

const columnsDefinition = [
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

const dataFromField = {
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

export const Default: Story = {
  name: 'default one',
  render: () => ({
    components: { FilterButton },
    data: () =>  ({
      columnsDefinition,
      dataFromField
    }),
    template: `
      <div id="test">
        <FilterButton
          append-to="#test"
          :columns-definition="columnsDefinition"
          :data-from-field="dataFromField"
        />
      </div>
    `
  })
}

// <docs lang="md">
// ### FilterButton

// Allows you to create one or more filters in order to format them to the API standard.

// Still in progress
// </docs>
