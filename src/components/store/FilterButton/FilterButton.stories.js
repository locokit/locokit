import { COLUMN_TYPE } from '@locokit/lck-glossary'
import FilterButton from './FilterButton'

export default {
  title: 'components/store/FilterButton',
  component: FilterButton,
}

export const defaultStory = () => (
  {
    components: { FilterButton },
    template: '<FilterButton />',
  }
)

defaultStory.storyName = 'default'

export const crudModeStory = () => (
  {
    components: { FilterButton },
    template: '<FilterButton :crudMode="true" />',
  }
)

crudModeStory.storyName = 'crud mode'

/* eslint-disable @typescript-eslint/camelcase */
const definitionColumn = {
  columns: [
    {
      text: 'String column',
      id: 1,
      column_type_id: COLUMN_TYPE.STRING,
    },
    {
      text: 'Boolean column',
      id: 2,
      column_type_id: COLUMN_TYPE.BOOLEAN,
    },
    {
      text: 'Number column',
      id: 3,
      column_type_id: COLUMN_TYPE.NUMBER,
    },
    {
      text: 'Float column',
      id: 4,
      column_type_id: COLUMN_TYPE.FLOAT,
    },
    {
      text: 'Relation between tables column',
      id: 5,
      column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
    },
    {
      text: 'Single select',
      id: 6,
      column_type_id: COLUMN_TYPE.SINGLE_SELECT,
    },
    {
      text: 'Multi select',
      id: 7,
      column_type_id: COLUMN_TYPE.MULTI_SELECT,
    },
    {
      text: 'Looked up column',
      id: 8,
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
    },
    {
      text: 'Date',
      id: 9,
      column_type_id: COLUMN_TYPE.DATE,
    },
  ],
}
/* eslint-enable @typescript-eslint/camelcase */
const columnsDropdownOptions = {
  6: [
    { label: 'option 1', value: 1 },
    { label: 'option 2', value: 2 },
    { label: 'option 3', value: 3 },
  ],
  7: [
    { label: 'option A', value: 1 },
    { label: 'option B', value: 2 },
    { label: 'option C', value: 3 },
  ],
}

export const selectedColumnAndActionOverlayOpenedStory = () => (
  {
    components: { FilterButton },
    data () {
      return { definitionColumn, columnsDropdownOptions }
    },
    template: '<FilterButton ref="fb" :definition="definitionColumn" :columnsDropdownOptions="columnsDropdownOptions"/>',
    async mounted () {
      // Open the panel
      await this.$refs.fb.$el.querySelector('button').click()
      // Add a new filter
      await this.$refs.fb.$el.querySelector('.pi.pi-plus-circle').parentElement.click()
      await this.$refs.fb.$el.querySelector('#column .p-dropdown-trigger').click()
      await this.$refs.fb.$el.querySelector('#column .p-dropdown-item').click()
      await this.$refs.fb.$el.querySelector('#action .p-dropdown-trigger').click()
      await this.$refs.fb.$el.querySelector('#action .p-dropdown-item').click()
    },
  }
)

selectedColumnAndActionOverlayOpenedStory.storyName = 'overlay opened with specified column and action'
selectedColumnAndActionOverlayOpenedStory.args = {
  waitForSelector: '.p-overlaypanel',
}

export const overlayOpenedStory = () => (
  {
    components: { FilterButton },
    template: '<FilterButton ref="fb" />',
    async mounted () {
      await this.$refs.fb.$el.querySelector('button').click()
      await this.$refs.fb.$el.querySelector('.pi.pi-plus-circle').parentElement.click()
      await this.$refs.fb.$el.querySelector('.pi.pi-plus-circle').parentElement.click()
    },
  }
)

overlayOpenedStory.storyName = 'overlay opened'
overlayOpenedStory.args = {
  waitForSelector: '.p-inputtext:nth-child(2)',
}
