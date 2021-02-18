/* eslint-disable @typescript-eslint/camelcase */
import ProcessListing from './ProcessListing'

export default {
  title: 'views/routes/workspace/admin/ProcessListing',
  component: ProcessListing
}

export const defaultStory = () => ({
  components: { ProcessListing },
  template: '<ProcessListing />'
})

defaultStory.storyName = 'default'

export const withProcessesToDisplay = () => {
  return {
    components: { ProcessListing },
    template: `
      <ProcessListing
        workspaceId="this-is-a-id"
      />
    `
  }
}

withProcessesToDisplay.storyName = 'with processes to display'
withProcessesToDisplay.parameters = {
  lckServices: {
    process: {
      find () {
        return new Promise(resolve => {
          resolve({
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
                  id: 'uuid-v4-column'
                }
              },
              table_id: 'uuid-v4-table',
              table: {
                id: 'uuid-v4-table',
                text: 'This is the table target'
              },
              runs: [{
                createdAt: 'Time of run creation',
                status: 'SUCCESS',
                duration: '100',
                log: 'This is the log'
              }]
            }, {
              text: 'Send an SMS when a new item is added (and I\'m a long trigger text)',
              trigger: 'CREATE_ROW'
            }, {
              text: 'Generate a periodic report',
              trigger: 'CRON',
              enabled: true
            }]
          })
        })
      }
    }
  }
}

export const withDetailProcessDisplayed = () => {
  return {
    components: { ProcessListing },
    template: `
      <ProcessListing
        ref="pl"
        workspaceId="this-is-a-id"
      />
    `,
    async mounted () {
      setTimeout(() => {
        const processItem = this.$refs.pl.$el.querySelector('.lck-process-item')
        processItem.click()
      }, 100)
    }
  }
}

withDetailProcessDisplayed.storyName = 'with detail process displayed'
withDetailProcessDisplayed.args = { timeoutBeforeScreenshot: 2000 }
withDetailProcessDisplayed.parameters = {
  lckServices: {
    process: {
      find () {
        return new Promise(resolve => {
          resolve({
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
                  value: 'uuid-v4-column'
                }
              },
              table_id: 'uuid-v4-table',
              table: {
                value: 'uuid-v4-table',
                text: 'This is the table target'
              },
              runs: [{
                createdAt: 'Time of run creation',
                status: 'SUCCESS',
                duration: '100',
                log: 'This is the log'
              }]
            }, {
              text: 'Send an SMS when a new item is added (and I\'m a long trigger text)',
              trigger: 'CREATE_ROW'
            }, {
              text: 'Generate a periodic report',
              trigger: 'CRON',
              enabled: true
            }]
          })
        })
      }
    },
    tableColumn: {
      get () {
        return new Promise(resolve => {
          resolve({
            text: 'This is the column target',
            value: 'uuid-v4-column'
          })
        })
      }
    }
  }
}
