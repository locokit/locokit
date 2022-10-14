import { NotAcceptable, BadRequest, Forbidden } from '@feathersjs/errors'
import { app } from '../../app'
import { UsersResult } from '../users/users.schema'

/**
 * Mock the generatePassword with mock file in __mocks__
 */
jest.mock('../../hooks/lck-hooks/passwords/generatePassword.ts')

let calls: Array<[string, any]> = []
function notifierMock(type: string, user: any): void {
  calls.push([type, user])
}
jest.mock('./authmanagement.settings.ts', () => ({
  authManagementSettings() {
    return {
      service: '/user',
      notifier: notifierMock,
    }
  },
}))

describe("'authManagement' hooks for passwordChange action", () => {
  const userInfo = {
    email: 'locokit-authmngt@locokit.io',
    name: 'Someone !',
  }
  let user: UsersResult
  beforeEach(async () => {
    user = await app.services.users.create({
      ...userInfo,
    })
  })

  it('throw a NotAcceptable error when an action passwordChange is created with a password not matching default rules', async () => {
    expect.assertions(2)
    try {
      await app.service('auth-management').create({
        action: 'passwordChange',
        value: {
          password: 'pouet',
        },
      })
    } catch (error) {
      expect(error instanceof NotAcceptable).toBe(true)
      expect(((error as NotAcceptable).data as any).failedRules).toStrictEqual([
        'min',
        'uppercase',
        'digits',
        'symbols',
      ])
    }
  })
  it('throw a BadRequest error when an action passwordChange is created with a password matching default rules but bad oldPassword is sent', async () => {
    expect.assertions(3)
    try {
      await app.service('auth-management').create({
        action: 'passwordChange',
        value: {
          user: {
            email: 'locokit-authmngt@locokit.io',
          },
          oldPassword: 'pouetpouet',
          password: 'pouetP@0',
        },
      })
    } catch (error) {
      expect(error instanceof BadRequest).toBe(true)
      expect((error as BadRequest).errors.oldPassword).toBeDefined()
      expect((error as BadRequest).errors.oldPassword).toBe(
        'Current password is incorrect.',
      )
    }
  })

  it('accept the request of action passwordChange if created with a password matching default rules and all params', async () => {
    expect.assertions(3)
    const resAuthMngmt = await app.service('auth-management').create({
      action: 'passwordChange',
      value: {
        user: {
          email: 'locokit-authmngt@locokit.io',
        },
        oldPassword: 'pouetP@0',
        password: 'pouetP@1',
      },
    })

    expect(resAuthMngmt).toBeDefined()
    /**
     * We check the password is well changed,
     * but we won't be able to login as the account is not verified.
     */
    try {
      await app.service('authentication').create(
        {
          strategy: 'local',
          email: userInfo.email,
          password: 'pouetP@1',
        },
        {},
      )
    } catch (error: any) {
      expect(error instanceof Forbidden).toBe(true)
      expect(error.message).toBe("User email is not verified. You can't login.")
    }
  })

  afterEach(async () => {
    await app.services.user.remove(user.id)
  })
})

describe("'authManagement' hooks for identityChange action", () => {
  const userInfo = {
    email: 'locokit-authmngt@locokit.io',
    name: 'Someone !',
  }
  const newEmailAddress = 'locokit-V2-authmngt@locokit.io'

  let user: User
  beforeEach(async () => {
    user = await app.services.user.create({
      ...userInfo,
    })
  })

  it('throw a BadRequest error when an identityChange action is created with an incorrect password', async () => {
    expect.assertions(3)
    try {
      await app.service('auth-management').create({
        action: 'identityChange',
        value: {
          user: {
            email: userInfo.email,
          },
          password: 'pouetpouet',
          changes: {
            email: newEmailAddress,
          },
        },
      })
    } catch (error) {
      expect(error instanceof BadRequest).toBe(true)
      expect((error as BadRequest).errors.password).toBeDefined()
      expect((error as BadRequest).errors.password).toBe(
        'Password is incorrect.',
      )
    }
  })

  it('throw a BadRequest error when an identityChange action is created with an incorrect user', async () => {
    expect.assertions(3)
    try {
      await app.service('auth-management').create({
        action: 'identityChange',
        value: {
          user: {
            email: 'locokit-authmngt-unknown@locokit.io',
          },
          password: 'pouetpouet',
          changes: {
            email: newEmailAddress,
          },
        },
      })
    } catch (error) {
      expect(error instanceof BadRequest).toBe(true)
      expect((error as BadRequest).message).toBeDefined()
      expect((error as BadRequest).message).toBe('User not found.')
    }
  })

  it('accept the request when an identityChange action is created with correct user and password ', async () => {
    expect.assertions(4)
    const resIdentityChange = await app.service('auth-management').create({
      action: 'identityChange',
      value: {
        user: {
          email: userInfo.email,
        },
        password: 'pouetP@0',
        changes: {
          email: newEmailAddress,
        },
      },
    })
    // The result is defined but the email address is not updated yet (need token verification)
    expect(resIdentityChange).toBeDefined()
    const user: User = await app.service('user').get(resIdentityChange.id)
    expect(user.email).toBe(userInfo.email)

    // Token verification
    const resVerifySignupLong: User = await app
      .service('authManagement')
      .create({
        action: 'verifySignupLong',
        value: user.verifyToken,
      })
    expect(resVerifySignupLong).toBeDefined()
    expect(resVerifySignupLong.email).toBe(newEmailAddress.toLowerCase())
  })

  afterEach(async () => {
    await app.services.user.remove(user.id)
  })
})

describe("'authManagement' hooks for verifySignup / resetPwd actions", () => {
  const userInfo = {
    email: 'locokit-authmngt@locokit.io',
    name: 'Someone !',
  }
  let user: User
  beforeEach(async () => {
    user = await app.services.user.create({
      ...userInfo,
    })
  })

  it('throw a NotAcceptable error when an action verifySignupSetPasswordLong is created with a password not matching default rules', async () => {
    expect.assertions(2)
    try {
      await app.service('auth-management').create({
        action: 'verifySignupSetPasswordLong',
        value: {
          password: 'pouet',
        },
      })
    } catch (error) {
      expect(error instanceof NotAcceptable).toBe(true)
      expect(((error as NotAcceptable).data as any).failedRules).toStrictEqual([
        'min',
        'uppercase',
        'digits',
        'symbols',
      ])
    }
  })
  it('throw a NotAcceptable error when an action verifySignupSetPasswordShort is created with a password not matching default rules', async () => {
    expect.assertions(2)
    try {
      await app.service('auth-management').create({
        action: 'verifySignupSetPasswordShort',
        value: {
          password: 'pouet',
        },
      })
    } catch (error) {
      expect(error instanceof NotAcceptable).toBe(true)
      expect(((error as NotAcceptable).data as any).failedRules).toStrictEqual([
        'min',
        'uppercase',
        'digits',
        'symbols',
      ])
    }
  })
  it('throw a NotAcceptable error when an action resetPwdLong is created with a password not matching default rules', async () => {
    expect.assertions(2)
    try {
      await app.service('auth-management').create({
        action: 'resetPwdLong',
        value: {
          password: 'pouet',
        },
      })
    } catch (error) {
      expect(error instanceof NotAcceptable).toBe(true)
      expect(((error as NotAcceptable).data as any).failedRules).toStrictEqual([
        'min',
        'uppercase',
        'digits',
        'symbols',
      ])
    }
  })
  it('throw a NotAcceptable error when an action resetPwdShort is created with a password not matching default rules', async () => {
    expect.assertions(2)
    try {
      await app.service('auth-management').create({
        action: 'resetPwdShort',
        value: {
          password: 'pouet',
        },
      })
    } catch (error) {
      expect(error instanceof NotAcceptable).toBe(true)
      expect(((error as NotAcceptable).data as any).failedRules).toStrictEqual([
        'min',
        'uppercase',
        'digits',
        'symbols',
      ])
    }
  })

  it('accept the request of action verifySignupSetPasswordLong if created with a password matching default rules and all params', async () => {
    expect.assertions(9)
    calls = []
    await app.service('auth-management').create({
      action: 'resendVerifySignup',
      value: {
        email: 'locokit-authmngt@locokit.io',
      },
    })
    expect(calls.length).toBe(1)
    expect(calls[0][0]).toBe('resendVerifySignup')
    const token = calls[0][1].verifyToken
    expect(token).toBeDefined()

    const resAuthMngmt = await app.service('auth-management').create({
      action: 'verifySignupSetPasswordLong',
      value: {
        token,
        password: 'pouetP@1',
      },
    })
    expect(resAuthMngmt).toBeDefined()

    const auth = await app.service('authentication').create(
      {
        strategy: 'local',
        email: userInfo.email,
        password: 'pouetP@1',
      },
      {},
    )
    expect(auth).toBeDefined()
    expect(auth.accessToken).toBeDefined()
    expect(auth.user.isVerified).toBe(true)
    expect(auth.user.verifyShortToken).not.toBeDefined()
    expect(auth.user.verifyToken).not.toBeDefined()
  })

  it('accept the request of action resendVerifySignup even if email is in uppercase', async () => {
    expect.assertions(3)
    calls = []
    await app.service('auth-management').create({
      action: 'resendVerifySignup',
      value: {
        email: 'LOCOKIT-authmngt@locokit.io',
      },
    })
    expect(calls.length).toBe(1)
    expect(calls[0][0]).toBe('resendVerifySignup')
    const token = calls[0][1].verifyToken
    expect(token).toBeDefined()
  })

  afterEach(async () => {
    await app.services.user.remove(user.id)
  })
})
