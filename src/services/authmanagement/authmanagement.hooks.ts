import * as authentication from '@feathersjs/authentication'
import { HookContext } from '@feathersjs/feathers'
import hooks from 'feathers-hooks-common'
import { enforcePasswordPolicy } from '../../hooks/lck-hooks/passwords/enforcePasswordPolicy'
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks

const isAction = (...args: string[]) => (hook: HookContext) => args.includes(hook.data.action)

const getPassword = (hook: HookContext) => hook.data.value.password

export default {
  before: {
    create: [
      hooks.iff(isAction('resendVerifySignup'), hooks.lowerCase('value.email')),
      hooks.iff(
        isAction(
          'passwordChange',
          'identityChange',
        ),
        authenticate('jwt'),
        hooks.iff(
          isAction('passwordChange'),
          enforcePasswordPolicy(getPassword),
        ),
      ).else(
        hooks.iff(
          isAction(
            'verifySignupSetPasswordLong',
            'verifySignupSetPasswordShort',
            'resetPwdLong',
            'resetPwdShort',
          ),
          enforcePasswordPolicy(getPassword),
        ),
      ),
    ],
  },
}
