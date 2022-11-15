import { resolve } from '@feathersjs/schema'
import type { HookContext } from '../../../declarations'

import type {
  DatasourceData,
  DatasourcePatch,
  DatasourceResult,
  DatasourceQuery,
} from './datasource.schema'
import {
  datasourceDataSchema,
  datasourcePatchSchema,
  datasourceResultSchema,
  datasourceQuerySchema,
} from './datasource.schema'

// Resolver for the basic data model (e.g. creating new entries)
export const datasourceDataResolver = resolve<DatasourceData, HookContext>({
  schema: datasourceDataSchema,
  validate: 'before',
  properties: {},
})

// Resolver for making partial updates
export const datasourcePatchResolver = resolve<DatasourcePatch, HookContext>({
  schema: datasourcePatchSchema,
  validate: 'before',
  properties: {},
})

// Resolver for the data that is being returned
export const datasourceResultResolver = resolve<DatasourceResult, HookContext>({
  schema: datasourceResultSchema,
  validate: false,
  properties: {},
})

// Resolver for query properties
export const datasourceQueryResolver = resolve<DatasourceQuery, HookContext>({
  schema: datasourceQuerySchema,
  validate: 'before',
  properties: {},
})

// Export all resolvers in a format that can be used with the resolveAll hook
export const datasourceResolvers = {
  result: datasourceResultResolver,
  data: {
    create: datasourceDataResolver,
    update: datasourceDataResolver,
    patch: datasourcePatchResolver,
  },
  query: datasourceQueryResolver,
}
