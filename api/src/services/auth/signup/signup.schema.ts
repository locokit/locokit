import { Type, Static, getValidator } from '@feathersjs/typebox'
import { dataValidator } from '@/commons/validators'

export const signUpDataSchema = Type.Object(
  {
    username: Type.String(),
    email: Type.String({ format: 'email' }),
    firstName: Type.Optional(Type.String()),
    lastName: Type.Optional(Type.String()),
  },
  {
    $id: 'SignUpData',
    additionalProperties: false,
  },
)

export type SignUpData = Static<typeof signUpDataSchema>

export const signUpDataValidator = getValidator(signUpDataSchema, dataValidator)
