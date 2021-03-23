import { Service } from '@feathersjs/feathers'
import { lckClient } from './client'
import {
  LckBlock,
  LckChapter,
  LckContainer,
  LckDatabase,
  LckGroup,
  LckPage,
  LckProcess,
  LckProcessRun,
  LckTable,
  LckTableColumn,
  LckTableRow,
  LckTableView,
  LckTableViewColumn,
  LckUser,
  LckWorkspace,
  LckAttachment,
  LckUpload
} from './definitions'

export const lckServices = {
  workspace: lckClient.service('workspace') as Service<LckWorkspace>,
  /**
   * Storage
   */
  upload: lckClient.service('upload') as Service<LckUpload>,
  attachment: lckClient.service('attachment') as Service<LckAttachment>,
  /**
   * Database
   */
  database: lckClient.service('database') as Service<LckDatabase>,
  table: lckClient.service('table') as Service<LckTable>,
  tableColumn: lckClient.service('column') as Service<LckTableColumn>,
  tableView: lckClient.service('view') as Service<LckTableView>,
  tableRow: lckClient.service('row') as Service<LckTableRow>,
  tableViewColumn: lckClient.service('table-view-has-table-column') as Service<LckTableViewColumn>,
  /**
   * Visualization
   */
  chapter: lckClient.service('chapter') as Service<LckChapter>,
  page: lckClient.service('page') as Service<LckPage>,
  container: lckClient.service('container') as Service<LckContainer>,
  block: lckClient.service('block') as Service<LckBlock>,
  /**
   * Process
   */
  process: lckClient.service('process') as Service<LckProcess>,
  processRun: lckClient.service('process-run') as Service<LckProcessRun>,
  /**
   * User
   */
  user: lckClient.service('user') as Service<LckUser>,
  group: lckClient.service('group') as Service<LckGroup>
}
