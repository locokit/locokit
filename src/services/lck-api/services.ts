import { Params, Service } from '@feathersjs/feathers'
import { FileExtension, MimeType } from 'file-type/browser'
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
  LckTableAction,
  LckAclSet,
  LckAclTable,
  LckSettings,
  LckSignUp,
} from './definitions'

interface ServiceUpload {
  create (data: Partial<{
    uri: string;
    fileName: string;
    ext: FileExtension;
    mime: MimeType;
  }>, params?: Params): Promise<LckAttachment>;
}

interface SettingsService {
  find: () => Promise<LckSettings>;
}

interface SignUpService {
  create: (credentials: LckSignUp) => Promise<LckSignUp>;
}

export const lckServices = {
  /**
   * Workspace
   */
  workspace: lckClient.service('workspace') as Service<LckWorkspace>,
  /**
   * Storage
   */
  upload: lckClient.service('upload') as ServiceUpload,
  attachment: lckClient.service('attachment') as Service<LckAttachment>,
  /**
   * Database
   */
  database: lckClient.service('database') as Service<LckDatabase>,
  table: lckClient.service('table') as Service<LckTable>,
  tableColumn: lckClient.service('column') as Service<LckTableColumn>,
  tableView: lckClient.service('view') as Service<LckTableView>,
  tableAction: lckClient.service('action') as Service<LckTableAction>,
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
   * Acl
   */
  aclset: lckClient.service('aclset') as Service<LckAclSet>,
  acltable: lckClient.service('acltable') as Service<LckAclTable>,
  /**
   * User
   */
  user: lckClient.service('user') as Service<LckUser>,
  group: lckClient.service('group') as Service<LckGroup>,
  /**
   * Settings
   */
  settings: lckClient.service('settings') as SettingsService,
  /**
   * Signup
   */
  signup: lckClient.service('signup') as SignUpService,
}
