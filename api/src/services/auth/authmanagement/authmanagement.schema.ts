import { Type, Static, getValidator, StringEnum } from '@feathersjs/typebox'
import { dataValidator } from '@/commons/validators'

export const authManagementDataSchema = Type.Object(
  {
    action: StringEnum([
      'checkUnique',
      'identityChange',
      'passwordChange',
      'resendVerifySignup',
      'resetPwdLong',
      'resetPwdShort',
      'sendResetPwd',
      'verifySignupLong',
      'verifySignupShort',
      'verifySignupSetPasswordLong',
      'verifySignupSetPasswordShort',
    ]),
    value: Type.Any(),
  },
  {
    $id: 'AuthManagementData',
    additionalProperties: false,
    description:
      'Auth management service. For more documentation, please refer to https://feathers-a-m.netlify.app',
  },
)

export type AuthManagementData = Static<typeof authManagementDataSchema>

export const authManagementDataValidator = getValidator(authManagementDataSchema, dataValidator)
