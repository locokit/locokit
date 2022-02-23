/* eslint-disable @typescript-eslint/camelcase */
import { COLUMN_TYPE } from '@locokit/lck-glossary/src'

import ColumnForm from './ColumnForm.vue'

export default {
  title: 'components/store/ColumnForm',
  component: ColumnForm,
}

const columns = [
  {
    text: 'Nom du vélo',
    id: 'e065323c-1151-447f-be0f-6d2728117b38',
    settings: null,
    table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
    column_type_id: COLUMN_TYPE.STRING,
    order: null,
    filter: null,
    displayed: true,
    transmitted: true,
    type: {
      text: 'String',
      id: 3,
    },
    validation: {
      required: true,
    },
  }, {
    text: 'État du vélo',
    id: '3a659ea1-446f-4755-8db9-583a204279cc',
    settings: {
      values: {
        1: {
          color: '#ef1',
          label: 'En maintenance',

        },
        2: {
          color: '#ef1',
          label: 'En utilisation',

        },
        3: {
          color: '#ef1',
          label: 'Stocké',

        },
      },
    },
    table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
    column_type_id: COLUMN_TYPE.SINGLE_SELECT,
    order: null,
    filter: null,
    displayed: true,
    transmitted: false,
    type: {
      text: 'Single select',
      id: 9,
    },
  },
]

export const stringColumnStory = () => ({
  components: { ColumnForm },
  data () {
    return {
      column: columns[0],
    }
  },
  template: '<ColumnForm :column="column" />',
})

export const submittingStringColumnStory = () => ({
  components: { ColumnForm },
  data () {
    return {
      column: columns[0],
    }
  },
  template: '<ColumnForm :column="column" :submitting="true" />',
})

submittingStringColumnStory.storyName = 'String column when submitting'

export const singleSelectColumnStory = () => ({
  components: { ColumnForm },
  data () {
    return {
      column: columns[1],
    }
  },
  template: '<ColumnForm :column="column" />',
})

singleSelectColumnStory.storyName = 'Single select column'
