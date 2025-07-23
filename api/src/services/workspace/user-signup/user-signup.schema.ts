import { Type, Static, getValidator } from '@feathersjs/typebox'
import { dataValidator } from '@/commons/validators'

export const userSignUpDataSchema = Type.Object(
  {
    username: Type.String(),
    email: Type.String({ format: 'email' }),
  },
  {
    $id: 'UserSignUpData',
    additionalProperties: false,
  },
)

export type UserSignUpData = Static<typeof userSignUpDataSchema>

export const userSignUpResultSchema = Type.Intersect(
  [
    userSignUpDataSchema,
    Type.Object({
      token: Type.String(),
    }),
  ],
  {
    $id: 'UserSignUpResult',
    additionalProperties: false,
  },
)

export type UserSignUpResult = Static<typeof userSignUpResultSchema>

export const userSignUpDataValidator = getValidator(userSignUpDataSchema, dataValidator)
