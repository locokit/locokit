import { HookContext, NextFunction } from '@/declarations'
import { authenticate } from '@feathersjs/authentication'
import { GROUP_ROLE, SERVICES, USER_PROFILE } from '@locokit/definitions'
import { Ajv, addFormats, Validator, hooks as schemaHooks } from '@feathersjs/schema'
import type { DataValidatorMap, FormatsPluginOptions } from '@feathersjs/schema'
import ajvErrors from 'ajv-errors'
import { Forbidden, NotFound } from '@feathersjs/errors/lib'
import { Type, querySyntax, getValidator, TSchema, getDataValidator } from '@feathersjs/typebox'
import { type Connexion, createAdapter, GenericAdapter } from '@locokit/engine'
import { convertLocoKitFieldTypeToTypeboxSchema } from './table-record.helpers'
import { toEagerRegExp } from '@/utils/toEagerRegExp'
import { UserGroupResult } from '@/client'
import { WorkspacePolicyTableSchema } from '../policy-table/policy-table.schema'
import { WorkspaceGroupResult } from '../group/group.schema'
import { replacePlaceholder } from './replacePlaceholder.helper'
import { ERROR_CODE } from '@/errors'
import { setLocoKitContext } from '@/hooks/locokit'
import { checkUserWorkspaceAccess } from '@/hooks/locokit/access'

const adapters: Record<string, GenericAdapter> = {}

const validators: Record<string, Validator> = {}
const validatorsData: Record<string, DataValidatorMap> = {}

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
dataValidator.addFormat('group-role', {
  type: 'string',
  validate: (x: string) => Object.keys(GROUP_ROLE).includes(x),
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
      authenticate('jwt' /*, 'public' */), // TODO: remove public auth if we don't have permission stabilized
      setLocoKitContext,
      /**
       * check user has access to the current workspace
       */
      checkUserWorkspaceAccess,
      /**
       * Compute abilities for the table, according the user membership/group
       * unless user is an ADMIN one.
       *
       * BUT ! if there is a dedicated header, we use it, even if user is an ADMIN one.
       *
       * Retrieve policy related, table rules & policy variables
       * Match variables with group-policy-variables,
       * Then compute rules to apply for filtering
       */
      async function computeAbilities(context: HookContext, next: NextFunction) {
        const { workspaceSlug, datasourceSlug, tableSlug } = context.params.route
        const groupId = context.params.headers?.['x-lck-group']

        /**
         * If no groupId is provided,
         * we check the current user is authorized to access all the data :
         * * is the current user the creator of the workspace ?
         * * is the current user a LocoKit ADMIN ?
         * if, so, this is OK
         * if not, we throw a Forbidden Error
         *
         */
        if (
          !groupId &&
          !context.params.$workspace.creator &&
          context.params.user.profile !== USER_PROFILE.ADMIN
        ) {
          throw new Forbidden('Please provide the header x-lck-group to access records.')
        }

        /**
         * Compute abilities for the group only if necessary
         * * check the x-lck-group is available if specified for the current user
         * * raise error if not
         */
        if (groupId) {
          // first step, retrieve user membership/group + group-policy-variable
          const currentMembership = context.params.$workspace.memberships?.find(
            (ug: UserGroupResult) => ug.groupId === groupId,
          )

          console.log(currentMembership)

          if (!currentMembership)
            throw new Error(
              `
        User is unauthorized to access this endpoint through the group provided.
        Please be sure to specify the right id in your request by providing the header 'x-lck-group'.
        `,
            )

          const currentGroup: WorkspaceGroupResult = currentMembership.group

          // retrieve policy table + variables : FAUX, il peut y avoir plusieurs policyTable à travers plusieurs groupes
          const table = await context.app.service(SERVICES.WORKSPACE_TABLE).find({
            query: {
              $joinEager: '[policyVariables,policyTable]',
              slug: tableSlug,
            },
            route: {
              workspaceSlug,
              datasourceSlug,
            },
          })

          if (table.total !== 1)
            throw new Error(
              `Mismatch for policy table ${workspaceSlug}:${datasourceSlug}.${tableSlug}`,
            )

          // check user has right for the method (POST/PATCH/DELETE/GET)
          const policyTable = table.data[0].policyTable as WorkspacePolicyTableSchema

          if (!policyTable)
            throw new Forbidden('Table unavailable', {
              CODE: ERROR_CODE.WS.POLICY.TABLE.UNAVAILABLE,
            })
          type Filter = {
            [key: string]: string | Filter
          }
          let filterToApply = {}
          let currentPolicy = null
          switch (context.method) {
            case 'find':
            case 'get':
              currentPolicy = policyTable.read
              break
            case 'create':
              currentPolicy = policyTable.create
              break
            case 'patch':
              currentPolicy = policyTable.patch
              break
            case 'remove':
              currentPolicy = policyTable.remove
              break
            default:
              throw new Forbidden('Method unauthorized.', {
                CODE: ERROR_CODE.WS.POLICY.TABLE.METHOD_NOT_ALLOWED,
              })
          }
          if (!currentPolicy.allow)
            throw new Forbidden('Method unauthorized.', {
              CODE: ERROR_CODE.WS.POLICY.TABLE.METHOD_NOT_ALLOWED,
            })

          const groupPolicyVariables = await context.app
            .service(SERVICES.WORKSPACE_GROUP_POLICY_VARIABLE)
            .find({
              query: {
                groupId,
                $joinEager: 'policyVariable',
                'policyVariable.policyId': currentGroup.policyId,
              },
              route: {
                workspaceSlug,
              },
            })

          const placeholders = groupPolicyVariables.data.map((gpv) => ({
            key: gpv.policyVariable.slug,
            value: gpv.value.string,
          }))
          filterToApply = replacePlaceholder(currentPolicy.filter as Filter, placeholders)

          context.params.$$filters = filterToApply
        }

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
              $eager: '[fields,relations.[toTable],lookups.[fromTable]]',
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
          const tableQueryProperties: Record<string, any> = {}

          /**
           * Identify relations of the table, from or to the current table
           */
          table.fields?.forEach((f) => {
            tableSchema[f.slug] = convertLocoKitFieldTypeToTypeboxSchema(f)
            tableQueryProperties[f.slug] = {
              $like: Type.String(),
              $notlike: Type.String(),
              $ilike: Type.String(),
              $unaccent: Type.String(),
            }
          })
          const tableRelationsNames: string =
            table.relations
              ?.reduce((acc, r) => {
                acc.push(r.settings.toTable)
                return acc
              }, [] as string[])
              .join('|') ?? ''

          const tableLookupsNames: string =
            table.lookups
              ?.reduce((acc, r) => {
                acc.push(r.settings.fromTable)
                return acc
              }, [] as string[])
              .join('|') ?? ''

          const tableRelationRegexp = toEagerRegExp(tableRelationsNames + '|' + tableLookupsNames)
          const tableQuerySchema = Type.Intersect(
            [
              querySyntax(
                Type.Object(tableSchema, {
                  additionalProperties: false,
                }),
                tableQueryProperties,
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
              additionalProperties: true,
            },
          )
          const tableResultSchema = Type.Partial(
            Type.Object(tableSchema, {
              additionalProperties: true, // TODO: do we need to be more strict ?
              $id: context.params.$$id + 'Result',
            }),
          )
          context.params.$$schema = tableQuerySchema
          context.params.$$schemaResult = tableResultSchema
        }

        await next()
      },
      async function computeValidator(context: HookContext, next: NextFunction) {
        // try to find the validator in the validators Record
        if (!validators[context.params.$$id]) {
          // TODO: is this safe as it could grow a lot in the mid term running ?
          // how does this scale ?
          validators[context.params.$$id] = getValidator(context.params.$$schema, dataValidator)
          validatorsData[context.params.$$id] = getDataValidator(
            context.params.$$schemaResult,
            dataValidator,
          )
        }

        context.params.$$validator = validators[context.params.$$id]
        context.params.$$validatorData = validatorsData[context.params.$$id]

        await next()
      },
      /**
       * compute resolver and apply default values (with dynamic variables if needed)
       *
       * useful for setting a field for a group
       *
       * TODO: how do we manage default values on a foreign table/relation ?
       */
      async function computeResolver(context: HookContext, next: NextFunction) {
        await next()
      },
      // async function computeAbilities(context: HookContext) { },
      async function validateData(context: HookContext, next: NextFunction) {
        switch (context.method) {
          case 'find':
          case 'get':
            return await schemaHooks.validateQuery(context.params.$$validator)(context, next)
          case 'create':
          case 'update':
          case 'patch':
          case 'remove':
            return await schemaHooks.validateData(context.params.$$validatorData)(context, next)
          default:
            throw new Error("Method unknown. Can't validate your call.")
        }
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
            const dsParams: Connexion = {
              // TODO: change ConnexionSQL's engine typing from 'type' to 'client' property ?
              // be careful for ConnexionBaserow as it's 'type' is 'baserow'
              type: datasource.data[0].client,
              options: datasource.data[0].connection,
            }

            switch (datasource.data[0].type) {
              case 'local':
                const schema = `ds_${datasource.data[0].id as string}`
                // const role = `${schema as string}_ro`
                dsParams.options = process.env.LCK_DATABASE_URL as string
                // TODO: enable the read only role : https://github.com/locokit/locokit/issues/243
                // actually there is an error when the ro role access to the schema inspector
                // a function pg_get_serial_sequence try to access some schemas (tiger) the role can't
                // see knex-schema-inspector/lib/dialect/postgres.ts L302
                // dsParams.role = role
                dsParams.schema = schema
                break
              case 'remote':
                // we do nothing particular
                break
              default:
                throw new Error(
                  'Other than "local/remote" type is not yet implemented for your datasource. Please ask us to create it, or create a pull request with the implementation.',
                )
            }
            adapters[adapterKey] = await createAdapter(dsParams)
          }
        }

        context.params.$$lckTable = tableSlug
        context.params.$$adapter = adapters[adapterKey]
        await next()
      },
      // async function createTransaction(context: HookContext) { },
      // filter data to only the one the user is able to access (casl ?)
      // async function resolveData(context: HookContext) { },
    ],
  },
  before: {
    all: [],
  },
  after: {},
  error: {},
}
