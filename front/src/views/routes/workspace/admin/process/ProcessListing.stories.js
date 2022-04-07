/* eslint-disable @typescript-eslint/camelcase */
import ProcessListing from './ProcessListing'
import StoryRouter from 'storybook-vue-router'

export default {
  title: 'views/routes/workspace/admin/ProcessListing',
  component: ProcessListing,
  decorators: [
    StoryRouter(),
  ],
}

const mockProcessData = {
  limit: 10,
  total: 2,
  data: [{
    id: 'process id',
    text: 'Send an email when status change',
    enabled: true,
    url: 'You lose',
    trigger: 'UPDATE_ROW_DATA',
    settings: {
      column_id: 'uuid-v4-column',
      column: {
        text: 'This is the column target',
        value: 'uuid-v4-column',
      },
    },
    table_id: 'uuid-v4-table',
    table: {
      id: 'uuid-v4-table',
      text: 'This is the table target',
    },
    runs: [{
      createdAt: 'Time of run creation',
      status: 'SUCCESS',
      duration: '100',
      log: 'This is the log',
    }],
  }, {
    text: 'Send an SMS when a new item is added (and I\'m a long trigger text)',
    trigger: 'CREATE_ROW',
  }, {
    text: 'Generate a periodic report',
    trigger: 'CRON',
    enabled: true,
  }],
}

const parameters = {
  lckServices: {
    process: {
      find () {
        return new Promise(resolve => {
          resolve(mockProcessData)
        })
      },
      get () {
        return new Promise(resolve => {
          resolve(mockProcessData.data[0])
        })
      },
    },
    tableColumn: {
      get () {
        return new Promise(resolve => {
          resolve({
            text: 'This is the column target',
            value: 'uuid-v4-column',
          })
        })
      },
    },
  },
}

export const defaultStory = () => ({
  components: { ProcessListing },
  template: '<ProcessListing workspaceId="this-is-a-id" />',
})

defaultStory.storyName = 'default'
// defaultStory.parameters = parameters

export const withProcessesToDisplay = () => {
  return {
    components: { ProcessListing },
    template: `
      <ProcessListing
        workspaceId="this-is-a-id"
      />
    `,
  }
}
withProcessesToDisplay.storyName = 'with processes to display'
withProcessesToDisplay.parameters = parameters

export const withDetailProcessDisplayed = () => {
  return {
    components: { ProcessListing },
    template: `
      <ProcessListing
        ref="pl"
        workspaceId="this-is-a-id"
        processId="${mockProcessData.data[0].id}"
      />
    `,
    async mounted () {
      setTimeout(() => {
        const processItem = this.$refs.pl.$el.querySelector('.lck-process-item')
        processItem.click()
      }, 100)
    },
  }
}

withDetailProcessDisplayed.storyName = 'with detail process displayed'
withDetailProcessDisplayed.parameters = parameters
