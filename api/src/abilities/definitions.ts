/**
 * Load of all ressources we want to manage with CASL
 */
/**
 * user
 * group
 * (organization ?)
 * workspace
 * datasource
 *
 * media
 *
 * application
 *
 * automation
 *
 */
// import { Workspace } from '../models/workspace.model'
// import { LckAttachment } from '../models/attachment.model'
// import { Block } from '../models/block.model'
// import { Chapter } from '../models/chapter.model'
// import { Container } from '../models/container.model'
// import { Database } from '../models/database.model'
// import { Group } from '../models/group.model'
// import { User } from '../models/user.model'
// import { Page } from '../models/page.model'
// import { Table } from '../models/table.model'
// import { TableColumn } from '../models/tablecolumn.model'
// import { TableRow } from '../models/tablerow.model'
// import { TableView } from '../models/tableview.model'
// import { ProcessRun } from '../models/process_run.model'
// import { Process } from '../models/process.model'
// import { TableColumnRelation } from '../models/tablecolumnrelation.model'

// import { UsersResult } from '../services/users/users.schema'
import { WorkspaceService } from '@/services/core/workspace/workspace.class'

import {
  AbilityClass,
  createAliasResolver,
  InferSubjects,
  PureAbility,
  Ability,
} from '@casl/ability'

/**
 * Definition of Actions / Subjects, related to CASL vocabulary
 * see https://casl.js.org/v5/en/guide/intro#basics
 */
export type Actions =
  | 'find'
  | 'get'
  | 'create'
  | 'update'
  | 'patch'
  | 'remove'
  | 'manage'
  | 'read'
  | 'delete'
export type Subjects = InferSubjects<
  'all' | 'user' | 'group' | 'workspace' | 'datasource' | typeof WorkspaceService,
  true
>

export type AppAbility = Ability<[Actions, Subjects]>
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AppAbility = PureAbility as AbilityClass<AppAbility>

export const resolveAction = createAliasResolver({
  update: 'patch', // define the same rules for update & patch
  read: ['get', 'find'], // use 'read' as an equivalent for 'get' & 'find'
  delete: 'remove', // use 'delete' or 'remove'
})
