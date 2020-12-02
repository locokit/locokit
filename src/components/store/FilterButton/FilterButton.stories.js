import Vue from 'vue'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import FilterButton from './FilterButton'

export default {
  title: 'components/store/FilterButton',
  component: FilterButton
}

export const defaultStory = () => (
  {
    components: { FilterButton },
    template: '<FilterButton />'
  }
)

defaultStory.storyName = 'default'

/* eslint-disable @typescript-eslint/camelcase */
const definitionColumn = [
  {
    text: 'String column',
    id: 1,
    column_type_id: COLUMN_TYPE.STRING
  },
  {
    text: 'Boolean column',
    id: 2,
    column_type_id: COLUMN_TYPE.BOOLEAN
  },
  {
    text: 'Number column',
    id: 3,
    column_type_id: COLUMN_TYPE.NUMBER
  },
  {
    text: 'Float column',
    id: 4,
    column_type_id: COLUMN_TYPE.FLOAT
  },
  {
    text: 'Relation between tables column',
    id: 5,
    column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES
  },
  {
    text: 'Single select',
    id: 6,
    column_type_id: COLUMN_TYPE.SINGLE_SELECT
  },
  {
    text: 'Multi select',
    id: 7,
    column_type_id: COLUMN_TYPE.MULTI_SELECT
  },
  {
    text: 'Looked up column',
    id: 8,
    column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN
  },
  {
    text: 'Date',
    id: 9,
    column_type_id: COLUMN_TYPE.DATE
  }
]
/* eslint-enable @typescript-eslint/camelcase */
const dropdownOptionsColumns = {
  6: {
    dropdownOptions: [
      { label: 'option 1', value: 1 },
      { label: 'option 2', value: 2 },
      { label: 'option 3', value: 3 }
    ]
  },
  7: {
    dropdownOptions: [
      { label: 'option A', value: 1 },
      { label: 'option B', value: 2 },
      { label: 'option C', value: 3 }
    ]
  }
}

export const selectedColumnAndActionOverlayOpenedStory = () => (
  {
    components: { FilterButton },
    data () {
      return { definitionColumn, dropdownOptionsColumns }
    },
    template: '<FilterButton ref="fb" :columns="definitionColumn" :dropdownOptionsColumns="dropdownOptionsColumns"/>',
    mounted () {
      // Open the panel
      this.$refs.fb.$el.querySelector('button').click()
      setTimeout(async () => {
        // Add a new filter
        document.querySelector('.pi.pi-plus-circle').parentElement.click()
        await Vue.nextTick()
        // Select a column
        document.querySelector('#column .p-dropdown-trigger').click()
        await Vue.nextTick()
        document.querySelector('#column .p-dropdown-item').click()
        await Vue.nextTick()
        // Select an action
        document.querySelector('#action .p-dropdown-trigger').click()
        await Vue.nextTick()
        document.querySelector('#action .p-dropdown-item').click()
        await Vue.nextTick()
      }, 500)
    }
  }
)

selectedColumnAndActionOverlayOpenedStory.storyName = 'overlay opened with specified column and action'
selectedColumnAndActionOverlayOpenedStory.args = { timeoutBeforeScreenshot: 1000 }

export const overlayOpenedStory = () => (
  {
    components: { FilterButton },
    template: '<FilterButton ref="fb" />',
    async mounted () {
      this.$refs.fb.$el.querySelector('button').click()
      setTimeout(() => {
        document.querySelector('.pi.pi-plus-circle').parentElement.click()
        document.querySelector('.pi.pi-plus-circle').parentElement.click()
      }, 500)
    }
  }
)

overlayOpenedStory.storyName = 'overlay opened'
overlayOpenedStory.args = { timeoutBeforeScreenshot: 1000 }
