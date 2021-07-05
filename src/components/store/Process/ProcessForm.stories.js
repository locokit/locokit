/* eslint-disable @typescript-eslint/camelcase */
import ProcessForm from './ProcessForm'

export default {
  title: 'components/store/process/ProcessForm',
  component: ProcessForm,
}

export const defaultStory = () => (
  {
    components: { ProcessForm },
    data () {
      return {
        process: {
          id: 'uuid-v4-t1',
          text: 'Trigger 1',
          table_id: 'uuid-v4-table-1',
          table: {
            text: 'My Table',
            id: 'uuid-v4-table-1',
          },
          trigger: 'CREATE_ROW',
          enabled: true,
        },
      }
    },
    template: '<ProcessForm :process="process" />',
  }
)

defaultStory.storyName = 'default'

export const submittingStory = () => (
  {
    components: { ProcessForm },
    data () {
      return {
        process: {
          id: 'uuid-v4-t1',
          text: 'Trigger 1',
          table_id: 'uuid-v4-table-1',
          table: {
            text: 'My Table',
            id: 'uuid-v4-table-1',
          },
          trigger: 'CREATE_ROW',
          enabled: false,
        },
      }
    },
    template: '<ProcessForm :process="process" :submitting="true"/>',
  }
)

submittingStory.storyName = 'submitting'
