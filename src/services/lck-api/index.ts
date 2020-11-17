/* eslint-disable @typescript-eslint/camelcase */
import feathers from '@feathersjs/feathers'
import rest from '@feathersjs/rest-client'
import auth from '@feathersjs/authentication-client'
import { getValue, LckColumn, LckColumnView, LckRow } from './helpers'

const lckClient = feathers()

// Connect to a different URL
const restClient = rest(LCK_SETTINGS.API_URL)

// Configure an AJAX library (see below) with that client
lckClient.configure(restClient.fetch(window.fetch))
lckClient.configure(auth({
  storageKey: LCK_SETTINGS.STORAGE_KEY
}))
// Connect to the `http://feathers-api.com/messages` service
// const messages = lckClient.service('messages')

// lckClient.service('messages').create({
//   text: 'A new message'
// })

export const lckServices = {
  /**
   * Database part
   */
  database: lckClient.service('database'),
  table: lckClient.service('table'),
  tableColumn: lckClient.service('column'),
  tableView: lckClient.service('view'),
  tableRow: lckClient.service('row'),
  tableViewColumn: lckClient.service('table-view-has-table-column'),
  /**
   * Visualization
   */
  visuChapter: lckClient.service('chapter'),
  visuPage: lckClient.service('page'),
  visuContainer: lckClient.service('container'),
  visuBlock: lckClient.service('block'),
  /**
   * User
   */
  user: lckClient.service('user'),
  group: lckClient.service('group')
}

export const lckHelpers = {
  async exportTableRowData (tableViewId: string, filters: []) {
    const rowsPerRequest = 20
    const { columns } = await lckServices.tableView.get(tableViewId, {
      query: {
        $eager: 'columns'
      }
    }) as { columns: LckColumnView[]}
    columns.sort((a, b) => a.position - b.position)
    const query: Record<string, string | number | object> = {
      table_view_id: tableViewId,
      $limit: rowsPerRequest,
      $skip: 0,
      $sort: {
        createdAt: 1
      }
    }
    filters.forEach((f: { req: string; value: string }) => {
      query[f.req] = f.value
    })
    const { data: allData, total } = await lckServices.tableRow.find({ query })
    for (let i = rowsPerRequest; i < total; i = i + rowsPerRequest) {
      query.$skip = i
      const { data } = await lckServices.tableRow.find({
        query
      })
      allData.push(...data)
    }
    let exportCSV = columns.map(c => '"' + c.text + '"').join(',') + '\n'
    exportCSV += allData.map(
      (currentRow: LckRow) =>
        columns.map((currentColumn: LckColumn) =>
          '"' + getValue(
            currentColumn,
            currentRow.data[currentColumn.id]
          ) + '"'
        ).join(',')
    ).join('\n')
    return exportCSV
  }

}

export default lckClient
