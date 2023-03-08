import { Type, querySyntax, Static, getValidator } from '@feathersjs/typebox'
import { dataValidator } from '@/commons/validators'
import { queryStringExtend } from '../../../feathers-objection'

// Schema for the basic data model (e.g. creating new entries)
export const roleSchema = Type.Object(
  {
    id: Type.String({ format: 'uuid' }),
    name: Type.String({
      description: 'Name of the role',
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
    manager: Type.Boolean({
      default: false,
      description: 'Is the role able to manage all the workspace ?',
    }),
    public: Type.Boolean({
      default: false,
      description: 'Is this role a public one, and could be used anonymously ?',
    }),

    workspace: Type.Optional(Type.Any()),

    groups: Type.Optional(Type.Array(Type.Any())),
  },
  {
    $id: 'RoleSchema',
    additionalProperties: false,
  },
)

export type RoleSchema = Static<typeof roleSchema>

export const roleDataSchema = Type.Omit(roleSchema, ['id', 'workspace'], {
  $id: 'RoleData',
})
export type RoleData = Static<typeof roleSchema>

export const rolePatchSchema = Type.Partial(Type.Omit(roleDataSchema, ['workspaceId']), {
  $id: 'RolePatch',
})
export type RolePatch = Static<typeof rolePatchSchema>

export type RoleResult = Static<typeof roleSchema>

export const roleQuerySchema = Type.Intersect([
  querySyntax(Type.Omit(roleSchema, ['workspace']), {
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
      'workspace:owner.name': {
        // @ts-expect-error
        $like: {
          type: 'string',
        },
        // @ts-expect-error
        $ilike: {
          type: 'string',
        },
      },
    },
  ),
  Type.Object({
    $joinRelated: Type.Optional(
      Type.RegEx(/workspace|\[workspace.owner\]|\[workspace.owner,groups\]/, {
        description: 'Join role to its relations (and nested).',
      }),
    ),
    $joinEager: Type.Optional(
      Type.RegEx(/workspace|\[workspace.owner\]|\[workspace.owner,groups\]/, {
        description: 'Join role to its relations (and nested).',
      }),
    ),
    $eager: Type.Optional(
      Type.RegEx(/workspace|\[workspace.owner\]|\[workspace.owner,groups\]/, {
        description: 'Join role to its relations (and nested).',
      }),
    ),
  }),
])

export type RoleQuery = Static<typeof roleQuerySchema>

export const roleDataValidator = getValidator(roleDataSchema, dataValidator)
