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
            event: 'MANUAL',
            enabled: 'true',
            table_id: 'uuid-v4-table-1',
            executions: [
              {
                id: 'uuid-v4-run-1',
                text: 'Run 1',
                trigger_id: 'uuid-v4-t1',
                createdAt: '2020-11-22T22:00:00Z',
                status: 'SUCCESS',
                duration: 100,
                table_row_id: 17,
                log: 'This is the log'
              }, {
                id: 'uuid-v4-run-2',
                text: 'Run 1',
                trigger_id: 'uuid-v4-t1',
                createdAt: '2020-11-22T22:00:00Z',
                status: 'ERROR',
                duration: null,
                table_row_id: 17,
                log: 'This is the log'
              }
            ]
          }, {
            id: 'uuid-v4-t2',
            text: 'Trigger 2',
            event: 'CRON',
            enabled: 'true',
            table_id: 'uuid-v4-table-1'
          }, {
            id: 'uuid-v4-t3',
            text: 'Trigger 3',
            event: 'CREATE_ROW',
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
