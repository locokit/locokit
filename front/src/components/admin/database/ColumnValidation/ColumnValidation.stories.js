/* eslint-disable @typescript-eslint/camelcase */
import { COLUMN_TYPE } from '@locokit/lck-glossary'

import ColumnValidation from './ColumnValidation.vue'

export default {
  title: 'components/admin/database/ColumnValidation',
  component: ColumnValidation,
}

export const requiredColumnStory = () => ({
  components: { ColumnValidation },
  data () {
    return {
      columnValidation: {
        required: true,
      },
      columnType: COLUMN_TYPE.STRING,
    }
  },
  template: '<ColumnValidation :columnValidation="columnValidation" :columnType="columnType" />',
})

requiredColumnStory.storyName = 'Required column validation'

export const notRequiredColumnStory = () => ({
  components: { ColumnValidation },
  data () {
    return {
      columnValidation: {
        validation: {},
      },
      columnType: null,
    }
  },
  template: '<ColumnValidation :columnValidation="columnValidation" :columnType="columnType" />',
})

notRequiredColumnStory.storyName = 'Not required column validation'
