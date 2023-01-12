import { PROFILE } from '@locokit/definitions'
import { Type, querySyntax, Static } from '@feathersjs/typebox'

// Schema for the basic data model (e.g. creating new entries)
export const userSchema = Type.Object(
  {
    id: Type.Number(),
    email: Type.String({ format: 'email' }),
    name: Type.String(),
    password: Type.Optional(Type.String()),
    auth0Id: Type.Optional(Type.String()),
    profile: Type.String({ format: 'user-profile', default: PROFILE.MEMBER }),
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
  },
  {
    $id: 'UserSchema',
    additionalProperties: false,
  },
)

export const userDataSchema = Type.Omit(userSchema, ['id', 'auth0Id'], {
  $id: 'UserData',
})

export type UserData = Static<typeof userDataSchema> & {
  profile: PROFILE
}

// Schema for making partial updates
export const userPatchSchema = Type.Partial(userDataSchema)

export type UserPatch = Static<typeof userPatchSchema> & {
  profile: PROFILE
}

export type UserResult = Static<typeof userSchema> & {
  profile: PROFILE
}

export const userQuerySchema = querySyntax(
  Type.Omit(
    userSchema,
    ['password', 'verifyExpires', 'verifyChanges', 'resetExpires'],
    { $id: 'UserQuery' },
  ),
)

export type UserQuery = Static<typeof userQuerySchema> & {
  profile: PROFILE
}
