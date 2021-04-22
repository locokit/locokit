import { Group } from '../models/group.model'
import { workspace } from '../models/workspace.model'

export const VERB = {
  FIND: 'find',
  GET: 'get',
  CREATE: 'create',
  UPDATE: 'update',
  PATCH: 'patch',
  REMOVE: 'remove',
}

export const RESOURCE = {
  USER: 'USER',
  GROUP: Group.tableName,
  WORKSPACE: workspace.tableName,
  DATABASE: 'DATABASE',
  TABLE: 'TABLE',
  RECORD: 'GROUP',
  FIELD: 'FIELD',
  VIEW: 'VIEW',
  PROCESS: 'PROCESS',
  CHAPTER: 'CHAPTER',
  PAGE: 'PAGE',
  CONTAINER: 'CONTAINER',
  BLOCK: 'BLOCK',
}
