import { ObjectionService } from '../../../feathers-objection'
import { KnexAdapterParams } from '@feathersjs/knex'
import type { UserData, UserResult, UserQuery } from './user.schema'

export interface UserParams extends KnexAdapterParams<UserQuery> {}

export class UserService extends ObjectionService<
  UserResult,
  UserData,
  UserParams
> {}
