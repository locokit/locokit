import Mail from 'nodemailer/lib/mailer'
import { Application } from '../../declarations'
import { User as LckUser } from '../../models/user.model'

export enum AuthenticationManagementAction {
  verifySignup = 'verifySignup',
  resendVerifySignup = 'resendVerifySignup',
  verifySignupSetPassword = 'verifySignupSetPassword',
  sendResetPwd = 'sendResetPwd',
  resetPwd = 'resetPwd',
  passwordChange = 'passwordChange',
  identityChange = 'identityChange',
}

export function accountService (app: Application) {
  function getLink (type: string, hash: string) {
    return app.get('publicUrl') + '/#/' + type + '?token=' + hash
  }

  async function sendEmail (email: Mail.Options) {
    try {
      const resultSendEmail = await app.service('mailer').create(email)
      console.log('Sent email', resultSendEmail)
    } catch (err) {
      console.log('Error sending email', err)
    }
  }

  return {
    service: '/user',
    async notifier (
      type: AuthenticationManagementAction,
      user: LckUser
    ) {
      let email: Mail.Options
      switch (type) {
        case AuthenticationManagementAction.resendVerifySignup: // sending the user the verification email
          email = {
            to: user.email,
            subject: 'Verify Signup',
            text: `
              Your account has been created.

              We need to confirm your email.

              Please follow the link

              ${getLink('verify-signup', user.verifyToken as string)}

              to confirm your email is correct and you are a human.
            `
          }
          return await sendEmail(email)

        case AuthenticationManagementAction.verifySignup: // confirming verification
          email = {
            to: user.email,
            subject: 'Confirm Signup',
            text: `
              Your account has been created.

              We need to confirm your email.

              Please follow the link

              ${getLink('verify-signup', user.verifyToken as string)}

              to confirm your email is correct and you are a human.
            `
          }
          return await sendEmail(email)

        case AuthenticationManagementAction.verifySignupSetPassword: // confirming verification
          email = {
            to: user.email,
            subject: 'Account enabled',
            text: `
              Your account is enabled.

              You can now connect to the platform by clicking on the following link :

              ${app.get('publicUrl')}

              Welcome on board !
            `
          }
          return await sendEmail(email)

        case AuthenticationManagementAction.sendResetPwd:
          email = {
            to: user.email,
            subject: 'Reset password temporary link',
            text: `
              You ask for resetting your password.

              Please follow the link

              ${getLink('reset-password', user.resetToken as string)}

              to update your password.
            `
          }
          return await sendEmail(email)

        case AuthenticationManagementAction.resetPwd:
          email = {
            to: user.email,
            subject: 'Password reset',
            text: `
              Your password has been reset.

              If this action was not from you, please contact us quickly to avoid an impersonation.
            `
          }
          return await sendEmail(email)

        case AuthenticationManagementAction.passwordChange:
          email = {
            to: user.email,
            subject: 'Password updated',
            text: `
            Your password has been updated.

            If this action was not from you, please contact us quickly to avoid an impersonation.
          `
          }
          return await sendEmail(email)

        case AuthenticationManagementAction.identityChange:
          // tokenLink = getLink('verifyChanges', user.verifyToken as string)
          email = {
            to: user.email,
            subject: 'Verify Changes',
            text: `
            Your account has been updated.

            If this action was not from you, please contact us quickly to avoid an impersonation.
          `
          }
          return await sendEmail(email)
      }
    }
  }
}
