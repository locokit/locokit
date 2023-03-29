import { resolve, Resolver } from '@feathersjs/schema'
import { getValidator } from '@feathersjs/typebox'
import type { HookContext } from '../../../declarations'
import { queryValidator } from '@/commons/validators'
import { groupDispatchResolver } from '../group/group.resolver'
import { userDispatchResolver } from '../../core/user/user.resolver'
import { UserGroupQuery, userGroupQuerySchema, UserGroupSchema } from './user-group.schema'

// Resolver for the basic data model (e.g. creating new entries)
export const userGroupCreateResolver = resolve<UserGroupSchema, HookContext>({})

export const userGroupDefaultResolver = resolve<UserGroupSchema, HookContext>({})

export const userGroupDispatchResolver: Resolver<UserGroupSchema, HookContext> = resolve<
  UserGroupSchema,
  HookContext
>({
  /**
   * This resolver is used for the relation workspace
   * We need to use the dispatch resolver to avoid send sensible data
   *
   * The relation `workspace` is fetched when used in a find/get + $joinRelated
   */
  async group(group, _data, context) {
    console.log('userGroup dispatch', group)
    if (group) return await groupDispatchResolver.resolve(group, context)
  },
  async user(user, _data, context) {
    console.log('userGroup dispatch', user)
    if (user) return await userDispatchResolver.resolve(user, context)
  },
})

// Resolver for query properties
export const userGroupQueryResolver = resolve<UserGroupQuery, HookContext>({})

// @ts-expect-error
export const userGroupQueryValidator = getValidator(userGroupQuerySchema, queryValidator)

// Export all resolvers in a format that can be used with the resolveAll hook
export const userGroupResolvers = {
  result: userGroupDefaultResolver,
  dispatch: userGroupDispatchResolver,
  data: {
    create: userGroupCreateResolver,
    update: userGroupDefaultResolver,
    patch: userGroupDefaultResolver,
  },
  query: userGroupQueryResolver,
}
