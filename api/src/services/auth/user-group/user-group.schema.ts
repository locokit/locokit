import { Type, querySyntax, Static, getDataValidator } from '@feathersjs/typebox'
import { USERGROUP_PROFILE } from '@locokit/definitions'
import { dataValidator } from '../../../commons/validators'

// Schema for the basic data model (e.g. creating new entries)
export const userGroupSchema = Type.Object(
  {
    userId: Type.String({ format: 'uuid' }),
    groupId: Type.String({ format: 'uuid' }),
    userGroupRole: Type.String({ format: 'user-group-profile', default: USERGROUP_PROFILE.MEMBER }),

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

export const userGroupDataSchema = Type.Omit(userGroupSchema, ['user', 'group'], {
  $id: 'UsesrGroupData',
})
export type UserGroupData = Static<typeof userGroupSchema>

export const userGroupPatchSchema = Type.Never()
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
        'user.name': Type.Optional(
          Type.String({
            description: "Filter on related user's name",
          }),
        ),
      }),
      {
        'group.name': {
          // @ts-expect-error
          $like: {
            type: 'string',
          },
          // @ts-expect-error
          $ilike: {
            type: 'string',
          },
        },
        'user.name': {
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
        Type.RegEx(/user|group|\[user,group\]|\[group,user\]/, {
          description: 'Join role to its relations (and nested).',
        }),
      ),
      $joinEager: Type.Optional(
        Type.RegEx(/user|group|\[user,group\]|\[group,user\]/, {
          description: 'Join role to its relations (and nested).',
        }),
      ),
      $eager: Type.Optional(
        Type.RegEx(/user|group|\[user,group\]|\[group,user\]/, {
          description: 'Join role to its relations (and nested).',
        }),
      ),
    }),
  ],
  {
    additionalProperties: false,
  },
)

export type UserGroupQuery = Static<typeof userGroupQuerySchema>

export const userGroupDataValidator = getDataValidator(userGroupDataSchema, dataValidator)
