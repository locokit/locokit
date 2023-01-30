import { USER_PROFILE } from '@locokit/definitions'
import { Type, querySyntax, Static } from '@feathersjs/typebox'
import { dataValidator } from '../../../schemas/validators'

// Schema for the basic data model (e.g. creating new entries)
export const userSchema = Type.Object(
  {
    id: Type.Number(),
    name: Type.String(),
    nickname: Type.String(),
    avatarURL: Type.String(),
    email: Type.String({ format: 'email' }),
    password: Type.Optional(Type.String()),
    profile: Type.String({ format: 'user-profile', default: USER_PROFILE.MEMBER }),
    blocked: Type.Optional(Type.Boolean({ default: false })),
    isVerified: Type.ReadonlyOptional(Type.Boolean({ default: false })),
    verifyToken: Type.ReadonlyOptional(Type.String()),
    verifyShortToken: Type.ReadonlyOptional(Type.String()),
    verifyExpires: Type.ReadonlyOptional(
      Type.Union([Type.String({ format: 'date-time' }), Type.Number()]),
    ),
    verifyChanges: Type.ReadonlyOptional(
      Type.Object(
        {
          email: Type.String(),
        },
        { additionalProperties: true },
      ),
    ),
    resetToken: Type.ReadonlyOptional(Type.String()),
    resetShortToken: Type.ReadonlyOptional(Type.String()),
    resetExpires: Type.ReadonlyOptional(
      Type.Union([Type.String({ format: 'date-time' }), Type.Number()]),
    ),
    resetAttempts: Type.ReadonlyOptional(Type.Number()),

    createdAt: Type.Date({ description: 'Creation date of the user' }),
    updatedAt: Type.Date({ description: 'Update date of the user' }),
    lastConnection: Type.Date({
      description: 'Last time the user has been connectedCreation date of the user',
    }),
    workspaces: Type.Optional(Type.Array(Type.Any())),
  },
  {
    $id: 'UserSchema',
    additionalProperties: false,
  },
)

export const workspaceOwnerSchema = Type.Object(
  {
    id: Type.Number(),
    email: Type.String({ format: 'email' }),
    name: Type.String(),
    profile: Type.String({ format: 'user-profile', default: USER_PROFILE.MEMBER }),
  },
  {
    $id: 'WorkspaceOwnerSchema',
    additionalProperties: false,
  },
)

dataValidator.addSchema(workspaceOwnerSchema)

export const userDataSchema = Type.Omit(userSchema, ['id'], {
  $id: 'UserData',
})

export type UserData = Static<typeof userDataSchema> & {
  profile: USER_PROFILE
}

// Schema for making partial updates
export const userPatchSchema = Type.Partial(
  Type.Omit(userDataSchema, [
    'password',
    'verifyExpires',
    'verifyChanges',
    'resetExpires',
    'verifyToken',
    'verifyShortToken',
    'resetToken',
    'resetShortToken',
    'resetAttempts',
    'createdAt',
    'updatedAt',
    'lastConnection',
  ]),
)

export type UserPatch = Static<typeof userPatchSchema> & {
  profile: USER_PROFILE
}

export type UserResult = Static<typeof userSchema> & {
  profile: USER_PROFILE
}

export const userQuerySchema = Type.Intersect(
  [
    querySyntax(
      Type.Omit(userSchema, [
        'password',
        'verifyExpires',
        'verifyChanges',
        'resetExpires',
        'verifyToken',
        'verifyShortToken',
        'resetToken',
        'resetShortToken',
        'resetAttempts',
        'createdAt',
        'updatedAt',
        'lastConnection',
      ]),
    ),
    Type.Object({
      $joinRelated: Type.Optional(
        Type.RegEx(/workspaces/, {
          description: 'Join role to its relations (and nested).',
        }),
      ),
      $joinEager: Type.Optional(
        Type.RegEx(/workspaces/, {
          description: 'Join role to its relations (and nested).',
        }),
      ),
      $eager: Type.Optional(
        Type.RegEx(/workspaces/, {
          description: 'Join role to its relations (and nested).',
        }),
      ),
    }),
  ],
  { $id: 'UserQuery', additionalProperties: false },
)

export type UserQuery = Static<typeof userQuerySchema> & {
  profile: USER_PROFILE
}
