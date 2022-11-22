import { PROFILE } from '@locokit/definitions'
// import { defaultDataSchema, lckSchema } from '../../../schemas/default.schema'
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

// export const userDataSchema = lckSchema({
//   $id: 'UserData',
//   type: 'object',
//   additionalProperties: false,
//   required: ['email'],
//   properties: {
//     ...defaultDataSchema.properties,
//     email: {
//       type: 'string',
//       format: 'email',
//     },
//     name: {
//       type: 'string',
//     },
//     password: {
//       type: 'string',
//     },
//     auth0Id: {
//       type: 'string',
//     },
//     profile: {
//       type: 'string',
//       format: 'user-profile',
//     },
//     blocked: {
//       type: 'boolean',
//       default: false,
//     },
//     isVerified: {
//       readOnly: true,
//       type: 'boolean',
//       default: false,
//     },
//     verifyToken: {
//       readOnly: true,
//       type: 'string',
//     },
//     verifyShortToken: {
//       readOnly: true,
//       type: 'string',
//     },
//     verifyExpires: {
//       readOnly: true,
//       type: ['string', 'number'],
//       // anyOf: [
//       //   {
//       //     type: 'string',
//       //     format: 'date-time',
//       //   },
//       //   {
//       //     type: 'number',
//       //   },
//       // ],
//       nullable: true,
//     },
//     verifyChanges: {
//       readOnly: true,
//       type: 'object',
//     },
//     resetToken: {
//       readOnly: true,
//       type: 'string',
//     },
//     resetShortToken: {
//       readOnly: true,
//       type: 'string',
//     },
//     resetExpires: {
//       readOnly: true,
//       type: ['string', 'number'],
//       // anyOf: [
//       //   {
//       //     type: 'string',
//       //     format: 'date-time',
//       //   },
//       //   {
//       //     type: 'number',
//       //   },
//       // ],
//       nullable: true,
//     },
//     resetAttempts: {
//       readOnly: true,
//       type: 'number',
//     },
//   },
// } as const)

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
  Type.Omit(userSchema, ['password'], { $id: 'UserQuery' }),
)

export type UserQuery = Static<typeof userQuerySchema> & {
  profile: PROFILE
}
