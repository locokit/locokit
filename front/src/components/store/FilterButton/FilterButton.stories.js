import { COLUMN_TYPE } from '@locokit/lck-glossary'
import FilterButton from './FilterButton'
import Vue from 'vue'

export default {
  title: 'components/store/FilterButton',
  component: FilterButton,
}

const Template = (args, { argTypes }) => ({
  components: { FilterButton },
  props: Object.keys(argTypes),
  template: '<FilterButton v-bind="$props" />',
})

export const DefaultStory = Template.bind({})
DefaultStory.storyName = 'default'

export const CrudModeStory = Template.bind({})
CrudModeStory.storyName = 'crud mode'
CrudModeStory.args = {
  crudMode: true,
}

/* eslint-disable @typescript-eslint/camelcase */
const definitionColumn = {
  columns: [
    {
      text: 'String column',
      id: '1',
      column_type_id: COLUMN_TYPE.STRING,
    },
    {
      text: 'Boolean column',
      id: '2',
      column_type_id: COLUMN_TYPE.BOOLEAN,
    },
    {
      text: 'Number column',
      id: '3',
      column_type_id: COLUMN_TYPE.NUMBER,
    },
    {
      text: 'Float column',
      id: 4,
      column_type_id: COLUMN_TYPE.FLOAT,
    },
    {
      text: 'Relation between tables column',
      id: '5',
      column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
    },
    {
      text: 'Single select',
      id: '6',
      column_type_id: COLUMN_TYPE.SINGLE_SELECT,
    },
    {
      text: 'Multi select',
      id: '7',
      column_type_id: COLUMN_TYPE.MULTI_SELECT,
    },
    {
      text: 'Looked up column',
      id: '8',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
    },
    {
      text: 'Date',
      id: '9',
      column_type_id: COLUMN_TYPE.DATE,
    },
  ],
}
/* eslint-enable @typescript-eslint/camelcase */
const columnsDropdownOptions = {
  6: [
    {
      label: 'option 1',
      value: 1,
      color: '#484848',
      backgroundColor: '#fffbc2',
      position: 1,
    },
    {
      label: 'option 2',
      value: 2,
      color: '#484848',
      backgroundColor: '#ffedc3',
      position: 2,
    },
    {
      label: 'option 3',
      value: 3,
      color: '#484848',
      backgroundColor: '#ffe1d2',
      position: 3,
    },
  ],
  7: [
    {
      label: 'option A',
      value: 1,
      color: '#484848',
      backgroundColor: '#fffbc2',
      position: 1,
    },
    {
      label: 'option B',
      value: 2,
      color: '#484848',
      backgroundColor: '#ffedc3',
      position: 2,
    },
    {
      label: 'option C',
      value: 3,
      color: '#484848',
      backgroundColor: '#ffe1d2',
      position: 3,
    },
  ],
}

const TemplateWithRef = (args, { argTypes }) => ({
  components: { FilterButton },
  props: Object.keys(argTypes),
  template: '<FilterButton ref="fb" v-bind="$props" />',
  async mounted () {
    // Open the panel
    this.$refs.fb.$el.querySelector('button').click()
    // Delay
    await Vue.nextTick()
    // Add a new filter
    await document.body.querySelector('button > .bi.bi-plus-circle').click()
    await document.body.querySelector('#column .p-dropdown-trigger').click()
    await Vue.nextTick()

    // await document.body.querySelector('#column .p-dropdown-item').click()
    // await document.body.querySelector('#action .p-dropdown-trigger').click()
    // await document.body.querySelector('#action .p-dropdown-item').click()
  },
})

export const SelectedColumnAndActionOverlayOpenedStory = TemplateWithRef.bind({})
SelectedColumnAndActionOverlayOpenedStory.storyName = 'overlay opened with specified column and action'
SelectedColumnAndActionOverlayOpenedStory.args = {
  waitForSelector: '.p-inputtext:nth-child(2)',
  definition: definitionColumn,
  columnsDropdownOptions,
}

const TemplateWithManyFiltersOpened = (args, { argTypes }) => ({
  components: { FilterButton },
  props: Object.keys(argTypes),
  template: '<FilterButton ref="fb" v-bind="$props" />',
  async mounted () {
    // Open the panel
    this.$refs.fb.$el.querySelector('button').click()
    // Delay
    await Vue.nextTick()
    // Add a new filter
    await document.body.querySelector('button > .bi.bi-plus-circle').click()
    await document.body.querySelector('button > .bi.bi-plus-circle').click()
    await document.body.querySelector('button > .bi.bi-plus-circle').click()
    await document.body.querySelector('button > .bi.bi-plus-circle').click()
    await document.body.querySelector('button > .bi.bi-plus-circle').click()
    await document.body.querySelector('button > .bi.bi-plus-circle').click()
    await document.body.querySelector('button > .bi.bi-plus-circle').click()
    await document.body.querySelector('button > .bi.bi-plus-circle').click()
    await document.body.querySelector('button > .bi.bi-plus-circle').click()
  },
})

export const OverlayOpenedStory = TemplateWithManyFiltersOpened.bind({})
OverlayOpenedStory.storyName = 'overlay opened'
OverlayOpenedStory.args = {
  waitForSelector: '.p-inputtext:nth-child(2)',
  definition: definitionColumn,
  columnsDropdownOptions,
}
