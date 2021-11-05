/* eslint-disable @typescript-eslint/camelcase */
import Process from './Process'

export default {
  title: 'components/store/process/Process',
  component: Process,
}

export const defaultStory = () => (
  {
    components: { Process },
    data () {
      return {
        process: {
          id: 'uuid-v4-p1',
          text: 'process\'s title',
          url: 'http://myurl.com',
          triggers: [{
            id: 'uuid-v4-t1',
            text: 'Trigger 1',
            table_id: 'uuid-v4-table-1',
            table: {
              text: 'My Table',
              id: 'uuid-v4-table-1',
            },
          }, {
            id: 'uuid-v4-t2',
            text: 'Trigger 2',
            table_id: 'uuid-v4-table-1',
            table: {
              text: 'My Table',
              id: 'uuid-v4-table-1',
            },
            settings: {
              on: 'CREATE_ROW',
            },
          }, {
            id: 'uuid-v4-t3',
            text: 'Trigger 3',
            table_id: 'uuid-v4-table-1',
            table: {
              text: 'My Table',
              id: 'uuid-v4-table-1',
            },
            settings: {
              on: 'UPDATE_ROW',
              column_id: 'uuid-v4-column1',
              fromValue: 'THIS VALUE',
              toValue: 'THAT VALUE',
            },
          }],
          runs: [{
            id: 'uuid-v4-run-1',
            text: 'Run 1',
            trigger_id: 'uuid-v4-t1',
            status: 'SUCCESS',
            duration: 100,
            log: `
This is the log

And it is big.

So big...

I'm lost...

At the end...

Of the log...

And,

In

Fact,

This

is

...

Game

...

Over.`,
          }, {
            id: 'uuid-v4-run-2',
            text: 'Run 2',
            trigger_id: 'uuid-v4-t2',
            status: 'SUCCESS',
            duration: 250,
            log: 'This is the log',
          }, {
            id: 'uuid-v4-run-3',
            text: 'Run 3',
            trigger_id: 'uuid-v4-t3',
            status: 'SUCCESS',
            duration: 5365,
            log: 'This is the log',
          }],
        },
      }
    },
    template: '<Process :process="process" />',
  }
)

defaultStory.storyName = 'default'
