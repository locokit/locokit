import { Type, querySyntax, Static, getDataValidator, getValidator } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../../commons/validators'
import { workspaceSchema } from '../../workspace/workspace.schema'
import { workspaceOwnerSchema } from '../user/user.schema'
import { queryStringExtend } from '../../../feathers-objection'

// Schema for the basic data model (e.g. creating new entries)
export const groupSchema = Type.Object(
  {
    id: Type.String({ format: 'uuid' }),
    name: Type.String({
      description: 'Name of the group',
    }),
    documentation: Type.Optional(
      Type.String({
        description: 'Documentation',
      }),
    ),
    workspaceId: Type.String({
      format: 'uuid',
      description: 'Related workspace',
    }),
    roleId: Type.String({
      format: 'uuid',
      description: 'Related role of the workspace',
    }),

    workspace: Type.Optional(
      Type.Object(
        {
          ...workspaceSchema.properties,
        },
        {
          description: 'Related workspace',
        },
      ),
    ),
    users: Type.Optional(
      Type.Array(
        Type.Object(
          {
            ...workspaceOwnerSchema.properties,
          },
          {
            description: 'Related users of the group',
          },
        ),
      ),
    ),
    // role: Type.Ref(),
  },
  {
    $id: 'GroupSchema',
    additionalProperties: false,
  },
)
dataValidator.addSchema(groupSchema)

export type GroupSchema = Static<typeof groupSchema>

export const groupDataSchema = Type.Omit(groupSchema, ['id', 'workspace'], {
  $id: 'GroupData',
})
export type GroupData = Static<typeof groupSchema>

export const groupPatchSchema = Type.Partial(Type.Omit(groupDataSchema, ['workspaceId']))
export type GroupPatch = Static<typeof groupPatchSchema>

export type GroupResult = Static<typeof groupSchema>

export const groupQuerySchema = Type.Intersect(
  [
    querySyntax(Type.Omit(groupSchema, ['workspace', 'users']), {
      name: queryStringExtend,
    }),
    querySyntax(
      Type.Object({
        'workspace:owner.name': Type.Optional(
          Type.String({
            description: "Filter on related workspace, on the owner's name",
          }),
        ),
      }),
      {
        'workspace:owner.name': queryStringExtend,
      },
    ),
    Type.Object({
      $joinRelated: Type.Optional(
        Type.RegEx(
          /workspace|users|\[workspace.owner\]|\[workspace,users\]|\[workspace.owner,users\]/,
          {
            description: 'Join role to its relations (and nested).',
          },
        ),
      ),
      $joinEager: Type.Optional(
        Type.RegEx(
          /workspace|users|\[workspace.owner\]|\[workspace,users\]|\[workspace.owner,users\]/,
          {
            description: 'Join role to its relations (and nested).',
          },
        ),
      ),
      $eager: Type.Optional(
        Type.RegEx(
          /workspace|users|\[workspace.owner\]|\[workspace,users\]|\[workspace.owner,users\]/,
          {
            description: 'Join role to its relations (and nested).',
          },
        ),
      ),
    }),
  ],
  {
    additionalProperties: false,
  },
)

export type GroupQuery = Static<typeof groupQuerySchema>

export const groupDataValidator = getDataValidator(groupDataSchema, dataValidator)

// @ts-expect-error
export const groupQueryValidator = getValidator(groupQuerySchema, queryValidator)
