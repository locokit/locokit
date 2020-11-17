import { lckClient } from './client'

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
