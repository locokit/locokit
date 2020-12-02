/* eslint-disable @typescript-eslint/camelcase */
import ProcessPanel from './ProcessPanel'

export default {
  title: 'components/store/ProcessPanel',
  component: ProcessPanel
}

export const defaultStory = () => (
  {
    components: { ProcessPanel },
    template: '<ProcessPanel />'
  }
)

defaultStory.storyName = 'default'

export const withProcessesByRowAndRowId = () => (
  {
    components: { ProcessPanel },
    data () {
      return {
        processTrigger: [
          {
            id: 'uuid-v4-t1',
            text: 'Trigger 1',
            trigger: 'MANUAL',
            enabled: 'true',
            maximumNumberSuccess: 1,
            table_id: 'uuid-v4-table-1',
            runs: [
              {
                id: 'uuid-v4-t1-run-1',
                text: 'Run 3',
                process_id: 'uuid-v4-t1',
                createdAt: '2020-11-22T22:00:00Z',
                status: 'SUCCESS',
                duration: 100,
                table_row_id: '17',
                log: 'This is the log'
              }, {
                id: 'uuid-v4-t1-run-2',
                text: 'Run 2',
                process_id: 'uuid-v4-t1',
                createdAt: '2020-11-22T22:00:00Z',
                status: 'WARNING',
                duration: null,
                table_row_id: '17',
                log: 'This is the log'
              }, {
                id: 'uuid-v4-t1-run-3',
                text: 'Run 1',
                process_id: 'uuid-v4-t1',
                createdAt: '2020-11-22T22:00:00Z',
                status: 'ERROR',
                duration: null,
                table_row_id: '17',
                log: 'This is the log'
              }
            ]
          }, {
            id: 'uuid-v4-t2',
            text: 'Trigger 2',
            trigger: 'CRON',
            enabled: 'true',
            table_id: 'uuid-v4-table-1'
          }, {
            id: 'uuid-v4-t3',
            text: 'Trigger 3',
            trigger: 'CREATE_ROW',
            runs: [
              {
                id: 'uuid-v4-t3-run-1',
                text: 'Run 1',
                process_id: 'uuid-v4-t3',
                createdAt: '2020-11-22T22:00:00Z',
                status: 'RUNNING',
                duration: 100,
                table_row_id: '17',
                log: 'This is the log'
              }
            ],
            enabled: 'true',
            table_id: 'uuid-v4-table-1'
          }
        ]
      }
    },
    template: '<ProcessPanel :processesByRow="processTrigger" rowId="17" />'
  }
)

withProcessesByRowAndRowId.storyName = 'with all processes according to a specific row'
