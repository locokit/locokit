import { NotAcceptable, BadRequest, Forbidden } from '@feathersjs/errors'
import { SERVICES } from '@locokit/definitions'
import { expect, describe, beforeEach, afterEach, it, vi } from 'vitest'
import { createApp } from '@/app'
import { UserResult } from '@/services/core/user/user.schema'

/**
 * Mock the generatePassword with mock file in __mocks__
 */
vi.mock('@/utils/password.ts')

let calls: Array<[string, any]> = []
function notifierMock(type: string, user: any): void {
  calls.push([type, user])
}

describe("'auth-management' hooks for passwordChange action", () => {
  const userInfo = {
    email: 'locokit-authmngt@locokit.io',
    username: 'Someone !',
  }
  vi.mock('./authmanagement.settings.ts', () => ({
    authManagementSettings() {
      return {
        service: SERVICES.CORE_USER,
        notifier: notifierMock,
      }
    },
  }))
  const app = createApp()

  let user: UserResult
  beforeEach(async () => {
    user = await app.service(SERVICES.CORE_USER).create({
      ...userInfo,
    })
  })

  it('throw a NotAcceptable error when an action passwordChange is created with a password not matching default rules', async () => {
    expect.assertions(2)
    try {
      await app.service(SERVICES.AUTH_MANAGEMENT).create({
        action: 'passwordChange',
        // @ts-expect-error TO BE FIXED
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
      await app.service(SERVICES.AUTH_MANAGEMENT).create({
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
      expect((error as BadRequest).errors.oldPassword).toBe('Current password is incorrect.')
    }
  })

  it('accept the request of action passwordChange if created with a password matching default rules and all params', async () => {
    expect.assertions(3)
    const resAuthMngmt = await app.service(SERVICES.AUTH_MANAGEMENT).create({
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
      await app.service(SERVICES.AUTH_AUTHENTICATION).create(
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
    await app.service(SERVICES.CORE_USER).remove(user.id)
  })
})

describe("'auth-management' hooks for identityChange action", () => {
  const userInfo = {
    email: 'locokit-authmngt@locokit.io',
    username: 'Someone !',
  }
  const newEmailAddress = 'locokit-V2-authmngt@locokit.io'
  const app = createApp()

  let user: UserResult
  beforeEach(async () => {
    user = await app.service(SERVICES.CORE_USER).create({
      ...userInfo,
    })
  })

  it('throw a BadRequest error when an identityChange action is created with an incorrect password', async () => {
    expect.assertions(3)
    try {
      await app.service(SERVICES.AUTH_MANAGEMENT).create({
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
      expect((error as BadRequest).errors.password).toBe('Password is incorrect.')
    }
  })

  it('throw a BadRequest error when an identityChange action is created with an incorrect user', async () => {
    expect.assertions(3)
    try {
      await app.service(SERVICES.AUTH_MANAGEMENT).create({
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
    expect.assertions(5)
    const resIdentityChange = (await app.service(SERVICES.AUTH_MANAGEMENT).create({
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
    })) as { id: string }
    // The result is defined but the email address is not updated yet (need token verification)
    expect(resIdentityChange).toBeDefined()
    const user: UserResult = await app.service(SERVICES.CORE_USER).get(resIdentityChange.id)
    expect(user.email).toBe(userInfo.email)

    // Token verification
    const resVerifySignupLong = (await app.service(SERVICES.AUTH_MANAGEMENT).create({
      action: 'verifySignupLong',
      value: user.verifyToken as string,
    })) as { id: string; email: string }
    expect(resVerifySignupLong).toBeDefined()
    expect(resVerifySignupLong.email).toBe(newEmailAddress.toLowerCase())

    const userAfter: UserResult = await app.service(SERVICES.CORE_USER).get(resVerifySignupLong.id)
    expect(userAfter.email).toBe(newEmailAddress.toLowerCase())
  })

  afterEach(async () => {
    await app.service(SERVICES.CORE_USER).remove(user.id)
  })
})

describe("'auth-management' hooks for verifySignup / resetPwd actions", () => {
  const userInfo = {
    email: 'locokit-authmngt@locokit.io',
    username: 'Someone !',
  }
  const app = createApp()

  let user: UserResult
  beforeEach(async () => {
    user = await app.service(SERVICES.CORE_USER).create({
      ...userInfo,
    })
  })

  it('throw a NotAcceptable error when an action verifySignupSetPasswordLong is created with a password not matching default rules', async () => {
    expect.assertions(2)
    try {
      await app.service(SERVICES.AUTH_MANAGEMENT).create({
        action: 'verifySignupSetPasswordLong',
        // @ts-expect-error TO BE FIXED
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
      await app.service(SERVICES.AUTH_MANAGEMENT).create({
        action: 'verifySignupSetPasswordShort',
        // @ts-expect-error TO BE FIXED
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
      await app.service(SERVICES.AUTH_MANAGEMENT).create({
        action: 'resetPwdLong',
        // @ts-expect-error TO BE FIXED
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
      await app.service(SERVICES.AUTH_MANAGEMENT).create({
        action: 'resetPwdShort',
        // @ts-expect-error TO BE FIXED
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
    await app.service(SERVICES.AUTH_MANAGEMENT).create({
      action: 'resendVerifySignup',
      value: {
        email: 'locokit-authmngt@locokit.io',
      },
    })
    expect(calls.length).toBe(1)
    expect(calls[0][0]).toBe('resendVerifySignup')
    const token = calls[0][1].verifyToken
    expect(token).toBeDefined()

    const resAuthMngmt = await app.service(SERVICES.AUTH_MANAGEMENT).create({
      action: 'verifySignupSetPasswordLong',
      value: {
        token,
        password: 'pouetP@1',
      },
    })
    expect(resAuthMngmt).toBeDefined()

    const auth = await app.service(SERVICES.AUTH_AUTHENTICATION).create(
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
    expect(auth.user.verifyShortToken).toBeNull()
    expect(auth.user.verifyToken).toBeNull()
  })

  it('accept the request of action resendVerifySignup even if email is in uppercase', async () => {
    expect.assertions(3)
    calls = []
    await app.service(SERVICES.AUTH_MANAGEMENT).create({
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
    await app.service(SERVICES.CORE_USER).remove(user.id)
  })
})
