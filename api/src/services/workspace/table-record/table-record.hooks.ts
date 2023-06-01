import { HookContext, NextFunction } from '@/declarations'
import { authenticate } from '@feathersjs/authentication'
import { SERVICES, USER_PROFILE } from '@locokit/definitions'
import { BaserowAdapter } from '@locokit/engine/adapters/baserow'
import { SQLAdapter } from '@locokit/engine/adapters/sql'
import { Ajv, addFormats, Validator, hooks as schemaHooks } from '@feathersjs/schema'
import type { FormatsPluginOptions } from '@feathersjs/schema'
import ajvErrors from 'ajv-errors'
import { NotFound } from '@feathersjs/errors/lib'
import { Type, querySyntax, getValidator, TSchema } from '@feathersjs/typebox'
import { createAdapter } from '@locokit/engine'
import { convertLocoKitFieldTypeToTypeboxSchema } from './table-record.helpers'
import { toEagerRegExp } from '@/utils/toEagerRegExp'

const adapters: Record<string, BaserowAdapter | SQLAdapter> = {}

const validators: Record<string, Validator> = {}

export const formats: FormatsPluginOptions = [
  'date-time',
  'time',
  'date',
  'email',
  'hostname',
  'ipv4',
  'ipv6',
  'uri',
  'uri-reference',
  'uuid',
  'uri-template',
  'json-pointer',
  'relative-json-pointer',
  'regex',
]
export const dataValidator = ajvErrors(
  addFormats(
    new Ajv({
      allErrors: true,
      coerceTypes: true,
      allowUnionTypes: true,
    }),
    formats,
  ),
)
dataValidator.addFormat('user-profile', {
  type: 'string',
  validate: (x: string) => Object.keys(USER_PROFILE).includes(x),
})

/**
 * * know the user (it can be public, or better, apikey)
 * * check the user have access to this table
 * * retrieve acls
 * * compute which records the user has access
 * * filter records before retrieving them
 * * compute allowed query params, according to the acls (with the group) or retrieve them from a cache (key : ws/group/ds/table)
 * * validate query params (adjust by field)
 * * resolve query params (with filter previously computed)
 * * apply query params with a $and
 * * retrieve result
 * * resolve result according to acls
 * * validate result
 * * return result
 */
export const tableRecordHooks = {
  around: {
    all: [
      authenticate('jwt', 'public'),
      async function checkPermission(context: HookContext, next: NextFunction) {
        await next()
      },
      async function computeTypeBoxSchema(context: HookContext, next: NextFunction) {
        const { workspaceSlug, datasourceSlug, tableSlug } = context.params.route
        // console.log(workspaceSlug, datasourceSlug, tableSlug, context.params.query)
        context.params.$$id =
          'WS_' +
          (workspaceSlug as string) +
          '_DS_' +
          (datasourceSlug as string) +
          '_TBL_' +
          (tableSlug as string)

        // if validator already exist, we don't need to compute the typebox schema
        if (!validators[context.params.$$id]) {
          const tableResponse = await context.app.service(SERVICES.WORKSPACE_TABLE).find({
            query: {
              slug: tableSlug,
              $eager: '[fields,relations.[toTable]]',
            },
            route: {
              workspaceSlug,
              datasourceSlug,
            },
          })

          if (tableResponse.total !== 1)
            throw new NotFound(
              'Table ' +
                (tableSlug as string) +
                ' not found in workspace ' +
                (workspaceSlug as string),
            )

          const table = tableResponse.data[0]
          const tableSchema: Record<string, TSchema> = {}

          table.fields?.forEach((f) => {
            tableSchema[f.slug] = convertLocoKitFieldTypeToTypeboxSchema(f)
          })
          const tableRelationsNames: string =
            table.relations
              ?.reduce((acc, r) => {
                // console.log(r.settings)
                acc.push(r.settings.toTable)
                return acc
              }, [] as string[])
              .join('|') ?? ''
          const tableRelationRegexp = toEagerRegExp(tableRelationsNames)
          // console.log(tableRelationsNames, tableRelationRegexp)

          const tableQuerySchema = Type.Intersect(
            [
              querySyntax(
                Type.Object(tableSchema, {
                  additionalProperties: false,
                }),
              ),
              Type.Object(
                {
                  $joinRelated: Type.Optional(Type.RegEx(tableRelationRegexp)),
                  $joinEager: Type.Optional(Type.RegEx(tableRelationRegexp)),
                  $eager: Type.Optional(Type.RegEx(tableRelationRegexp)),
                },
                {
                  additionalProperties: false,
                },
              ),
            ],
            {
              $id: context.params.$$id,
              additionalProperties: false,
            },
          )
          context.params.$$schema = tableQuerySchema
        }

        await next()
      },
      async function computeValidator(context: HookContext, next: NextFunction) {
        // try to find the validator in the validators Record
        if (!validators[context.params.$$id]) {
          // TODO: is this safe as it could grow a lot in the mid term running ?
          // how does this scale ?
          validators[context.params.$$id] = getValidator(context.params.$$schema, dataValidator)
        }
        context.params.$$validator = validators[context.params.$$id]
        await next()
      },
      // async function computeResolver(context: HookContext) { },
      // async function computeAbilities(context: HookContext) { },
      async function applyValidator(context: HookContext, next: NextFunction) {
        return await schemaHooks.validateQuery(context.params.$$validator)(context, next)
      },
      // async function applyResolver(context: HookContext) { },
      async function createAdapterIfNeeded(context: HookContext, next: NextFunction) {
        // console.log('[createAdapterIfNeeded]', context.params.route)
        const {
          workspaceSlug,
          datasourceSlug,
          tableSlug,
        }: {
          workspaceSlug: string
          datasourceSlug: string
          tableSlug: string
        } = context.params.route

        // console.log('[createAdapterIfNeeded]', workspaceSlug, datasourceSlug)

        const adapterKey = 'w_' + workspaceSlug + '_ds_' + datasourceSlug

        /**
         * Check if the adapter already exist
         */
        if (!adapters[adapterKey]) {
          // console.log('[createAdapterIfNeeded] Adapter need to be created.')

          /**
           * Find the datasource
           */
          const datasource = await context.app.service(SERVICES.WORKSPACE_DATASOURCE).find({
            query: {
              slug: datasourceSlug,
            },
            route: {
              workspaceSlug,
            },
          })
          if (datasource.total === 1) {
            // console.log('[createAdapterIfNeeded] Adapter being created...', datasource.data)

            /**
             * Create the adapter
             */
            adapters[adapterKey] = await createAdapter({
              type: datasource.data[0].client,
              options: datasource.data[0].connection,
            })
          }
        }

        context.params.$$lckTable = tableSlug
        context.params.$$adapter = adapters[adapterKey]
        await next()
      },
      // async function createTransaction(context: HookContext) { },
      // async function validateData(context: HookContext) { },
      // async function resolveData(context: HookContext) { },
    ],
  },
  before: {
    all: [],
  },
  after: {},
  error: {},
}
