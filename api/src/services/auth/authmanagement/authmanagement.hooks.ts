import { authenticate } from '@feathersjs/authentication'
import { HookOptions } from '@feathersjs/feathers'
import { AuthenticationManagementService } from 'feathers-authentication-management/dist'
import { iff, lowerCase, ContextFunction } from 'feathers-hooks-common'
import { Application, HookContext } from '../../../declarations'
import { enforcePasswordPolicy } from './enforcePasswordPolicy.hook'

const isAction =
  (...args: string[]): ContextFunction<boolean, HookContext> =>
  (context: HookContext): boolean =>
    args.includes(context.data.action)

const getPassword = (hook: HookContext): string => hook.data.value.password

export const hooks: HookOptions<Application, AuthenticationManagementService> = {
  before: {
    create: [
      iff(isAction('resendVerifySignup'), lowerCase('value.email')),
      iff(isAction('passwordChange', 'identityChange'), authenticate('jwt')),
      iff(isAction('identityChange'), lowerCase('value.changes.email')),
      iff<HookContext>(
        isAction(
          'passwordChange',
          'verifySignupSetPasswordLong',
          'verifySignupSetPasswordShort',
          'resetPwdLong',
          'resetPwdShort',
        ),
        enforcePasswordPolicy(getPassword),
      ),
    ],
  },
}
