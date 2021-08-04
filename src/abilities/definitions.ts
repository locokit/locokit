/**
 * Load of all ressources we want to manage with CASL
 */
import { workspace } from '../models/workspace.model'
import { LckAttachment } from '../models/attachment.model'
import { block } from '../models/block.model'
import { Chapter } from '../models/chapter.model'
import { container } from '../models/container.model'
import { database } from '../models/database.model'
import { Group } from '../models/group.model'
import { User } from '../models/user.model'
import { page } from '../models/page.model'
import { Table } from '../models/table.model'
import { TableColumn } from '../models/tablecolumn.model'
import { TableRow } from '../models/tablerow.model'
import { TableView } from '../models/tableview.model'
import { ProcessRun } from '../models/process_run.model'
import { Process } from '../models/process.model'
import { TableColumnRelation } from '../models/tablecolumnrelation.model'

import { Ability, AbilityClass, createAliasResolver, InferSubjects } from '@casl/ability'

/**
 * Definition of Actions / Subjects, related to CASL vocabulary
 * see https://casl.js.org/v5/en/guide/intro#basics
 */
export type Actions = 'find' | 'get' | 'create' | 'update' | 'patch' | 'remove' | 'manage' | 'read' | 'delete'
export type Subjects = InferSubjects<
   typeof workspace |
   typeof LckAttachment |
   typeof block |
   typeof Chapter |
   typeof container |
   typeof database |
   typeof Group |
   typeof User |
   typeof page |
   typeof ProcessRun |
   typeof Process |
   typeof Table |
   typeof TableColumn |
   typeof TableRow |
   typeof TableColumnRelation |
   typeof TableView |
'all', true>

export type AppAbility = Ability<[Actions, Subjects]>
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AppAbility = Ability as AbilityClass<AppAbility>

export const resolveAction = createAliasResolver({
  update: 'patch', // define the same rules for update & patch
  read: ['get', 'find'], // use 'read' as a equivalent for 'get' & 'find'
  delete: 'remove', // use 'delete' or 'remove'
})
