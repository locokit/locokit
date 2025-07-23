import { Type, querySyntax, Static, getValidator } from '@feathersjs/typebox'
import { GROUP_ROLE } from '@locokit/definitions'
import { dataValidator, queryValidator } from '@/commons/validators'
import { queryStringExtend } from '@/feathers-objection'

// Schema for the basic data model (e.g. creating new entries)
export const workspaceUserGroupSchema = Type.Object(
  {
    id: Type.String({ format: 'uuid' }),

    userId: Type.String({ format: 'uuid' }),
    groupId: Type.String({ format: 'uuid' }),
    role: Type.String({ format: 'group-role', default: GROUP_ROLE.MEMBER }),
    createdAt: Type.String({
      format: 'date-time',
      description: 'Creation date of the user-group',
    }),
    updatedAt: Type.String({
      format: 'date-time',
      description: 'Update date of the user-group',
    }),

    /**
     * Relations (not typed due to circular dependencies)
     */
    user: Type.Optional(Type.Any()),
    group: Type.Optional(Type.Any()),
  },
  {
    $id: 'WorkspaceUserGroupSchema',
    additionalProperties: false,
  },
)
dataValidator.addSchema(workspaceUserGroupSchema)

export type UserGroupSchema = Static<typeof workspaceUserGroupSchema>

export const workspaceUserGroupDataSchema = Type.Pick(
  workspaceUserGroupSchema,
  ['userId', 'groupId', 'role'],
  {
    $id: 'WorkspaceUserGroupData',
  },
)

export type UserGroupData = Static<typeof workspaceUserGroupDataSchema>

export const workspaceUserGroupPatchSchema = Type.Pick(workspaceUserGroupDataSchema, ['role'], {
  $id: 'WorkspaceUserGroupPatch',
})

export type UserGroupPatch = Static<typeof workspaceUserGroupPatchSchema>

export type UserGroupResult = Static<typeof workspaceUserGroupSchema>

export const workspaceUserGroupQuerySchema = Type.Intersect(
  [
    querySyntax(Type.Omit(workspaceUserGroupSchema, ['user', 'group'])),
    querySyntax(
      Type.Object({
        'group.name': Type.Optional(
          Type.String({
            description: "Filter on related group's name",
          }),
        ),
        'user.username': Type.Optional(
          Type.String({
            description: "Filter on related user's name",
          }),
        ),
      }),
      {
        'group.name': queryStringExtend,
        'user.username': queryStringExtend,
      },
    ),
    Type.Object({
      $joinRelated: Type.Optional(
        Type.RegEx(/user|group|\[user,group\]|\[group,user\]/, {
          description: 'Join user-group to its relations (and nested).',
        }),
      ),
      $joinEager: Type.Optional(
        Type.RegEx(/user|group|\[user,group\]|\[group,user\]/, {
          description: 'Join user-group to its relations (and nested).',
        }),
      ),
      $eager: Type.Optional(
        Type.RegEx(/user|group|\[user,group\]|\[group,user\]/, {
          description: 'Join user-group to its relations (and nested).',
        }),
      ),
    }),
  ],
  {
    additionalProperties: false,
  },
)

export type UserGroupQuery = Static<typeof workspaceUserGroupQuerySchema>

export const workspaceUserGroupDataValidator = getValidator(
  workspaceUserGroupDataSchema,
  dataValidator,
)
export const workspaceUserGroupPatchValidator = getValidator(
  workspaceUserGroupPatchSchema,
  dataValidator,
)

// @ts-expect-error type instanciation too deep ts(2589)
export const workspaceUserGroupQueryValidator = getValidator(
  workspaceUserGroupQuerySchema,
  queryValidator,
)
