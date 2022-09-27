import { resolve } from '@feathersjs/schema'
import type { HookContext } from '../../declarations'

import type { WData, WPatch, WResult, WQuery } from './w.schema'
import {
  wDataSchema,
  wPatchSchema,
  wResultSchema,
  wQuerySchema,
} from './w.schema'

// Resolver for the basic data model (e.g. creating new entries)
export const wDataResolver = resolve<WData, HookContext>({
  schema: wDataSchema,
  validate: 'before',
  properties: {},
})

// Resolver for making partial updates
export const wPatchResolver = resolve<WPatch, HookContext>({
  schema: wPatchSchema,
  validate: 'before',
  properties: {},
})

// Resolver for the data that is being returned
export const wResultResolver = resolve<WResult, HookContext>({
  schema: wResultSchema,
  validate: false,
  properties: {},
})

// Resolver for query properties
export const wQueryResolver = resolve<WQuery, HookContext>({
  schema: wQuerySchema,
  validate: 'before',
  properties: {},
})

// Export all resolvers in a format that can be used with the resolveAll hook
export const wResolvers = {
  result: wResultResolver,
  data: {
    create: wDataResolver,
    update: wDataResolver,
    patch: wPatchResolver,
  },
  query: wQueryResolver,
}
