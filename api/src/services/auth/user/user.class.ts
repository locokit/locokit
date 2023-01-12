import { ObjectionService } from '../../../feathers-objection'
import type { KnexAdapterParams } from '@feathersjs/knex'
import type { UserData, UserResult, UserQuery } from './user.schema'

export interface UserParams extends KnexAdapterParams<UserQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class UserService extends ObjectionService<
  UserResult,
  UserData,
  UserParams
> {}
