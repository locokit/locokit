import { Type, querySyntax, Static, getValidator } from '@feathersjs/typebox'
import { GROUP_ROLE } from '@locokit/shared'
import { dataValidator, queryValidator } from '@/commons/validators'
import { queryStringExtend } from '@/feathers-objection'

// Schema for the basic data model (e.g. creating new entries)
export const userGroupSchema = Type.Object(
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
    $id: 'UserGroupSchema',
    additionalProperties: false,
  },
)
dataValidator.addSchema(userGroupSchema)

export type UserGroupSchema = Static<typeof userGroupSchema>

export const userGroupDataSchema = Type.Pick(userGroupSchema, ['userId', 'groupId', 'role'], {
  $id: 'UserGroupData',
})

export type UserGroupData = Static<typeof userGroupDataSchema>

export const userGroupPatchSchema = Type.Pick(userGroupDataSchema, ['role'], {
  $id: 'UserGroupPatch',
})

export type UserGroupPatch = Static<typeof userGroupPatchSchema>

export type UserGroupResult = Static<typeof userGroupSchema>

export const userGroupQuerySchema = Type.Intersect(
  [
    querySyntax(Type.Omit(userGroupSchema, ['user', 'group'])),
    querySyntax(
      Type.Object({
        'group.name': Type.Optional(
          Type.String({
            description: "Filter on related group's name",
          }),
        ),
        'group.workspaceId': Type.Optional(
          Type.String({
            description: "Filter on workspace's id",
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
        'group.workspaceId': queryStringExtend,
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

export type UserGroupQuery = Static<typeof userGroupQuerySchema>

export const userGroupDataValidator = getValidator(userGroupDataSchema, dataValidator)
export const userGroupPatchValidator = getValidator(userGroupPatchSchema, dataValidator)

// @ts-expect-error type instanciation too deep ts(2589)
export const userGroupQueryValidator = getValidator(userGroupQuerySchema, queryValidator)
