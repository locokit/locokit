import { USER_PROFILE } from '@locokit/definitions'
import { queryStringExtend } from '@/feathers-objection'
import { Type, querySyntax, Static, getValidator } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '@/commons/validators'

// Schema for the basic data model (e.g. creating new entries)
export const userSchema = Type.Object(
  {
    id: Type.String({ format: 'uuid' }),
    firstname: Type.Optional(Type.String()),
    lastname: Type.Optional(Type.String()),
    username: Type.String(),
    avatarURL: Type.Optional(Type.String()),
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
          email: Type.Optional(Type.String()),
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

    createdAt: Type.String({
      format: 'date-time',
      description: 'Creation date of the user',
    }),
    updatedAt: Type.String({
      format: 'date-time',
      description: 'Update date of the user',
    }),
    lastConnection: Type.String({
      format: 'date-time',
      description: 'Last time the user has been connected',
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
    id: Type.String({ format: 'uuid' }),
    email: Type.String({ format: 'email' }),
    username: Type.String(),
    profile: Type.String({ format: 'user-profile', default: USER_PROFILE.MEMBER }),
  },
  {
    $id: 'WorkspaceOwnerSchema',
    additionalProperties: false,
  },
)

dataValidator.addSchema(workspaceOwnerSchema)

export const userDataSchema = Type.Object(
  {
    username: Type.String(),
    email: Type.String({ format: 'email' }),
    profile: Type.Optional(Type.String({ format: 'user-profile', default: USER_PROFILE.MEMBER })),
  },
  {
    $id: 'UserData',
    additionalProperties: false,
  },
)

export type UserData = Static<typeof userDataSchema> & {
  profile: typeof USER_PROFILE
}

export const userDataValidator = getValidator(userDataSchema, dataValidator)

// Schema for making partial updates
export const userPatchSchema = Type.Partial(
  Type.Omit(userSchema, [
    'id',
    'email',
    'blocked',
    'password',
    'profile',
    'username',
    'isVerified',
    'verifyToken',
    'verifyShortToken',
    'verifyExpires',
    'verifyChanges',
    'resetToken',
    'resetShortToken',
    'resetExpires',
    'resetAttempts',
    'createdAt',
    'updatedAt',
    'lastConnection',
  ]),
  {
    $id: 'UserPatch',
  },
)

export type UserPatch = Static<typeof userPatchSchema> & {
  profile: typeof USER_PROFILE
}

export const userPatchValidator = getValidator(userPatchSchema, dataValidator)

const userPatchAdminSchema = Type.Partial(
  Type.Omit(userSchema, ['id', 'password', 'createdAt', 'lastConnection']),
  {
    $id: 'UserPatchAdmin',
  },
)

export type UserPatchAdmin = Static<typeof userPatchAdminSchema> & {
  profile: typeof USER_PROFILE
}

export const userPatchAdminValidator = getValidator(userPatchAdminSchema, dataValidator)

export type UserResult = Static<typeof userSchema> & {
  profile: typeof USER_PROFILE
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
      {
        email: queryStringExtend,
        username: queryStringExtend,
        firstname: queryStringExtend,
        lastname: queryStringExtend,
      },
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

export type UserQuery = Static<typeof userQuerySchema>
export const userQueryValidator = getValidator(userQuerySchema, queryValidator)
