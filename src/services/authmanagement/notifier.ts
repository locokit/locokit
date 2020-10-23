import Mail from 'nodemailer/lib/mailer'
import { Application } from '../../declarations'
import { User as LckUser } from '../../models/user.model'

export enum AuthenticationManagementAction {
  verifySignup = 'verifySignup',
  resendVerifySignup = 'resendVerifySignup',
  sendResetPwd = 'sendResetPwd',
  resetPwd = 'resetPwd',
  passwordChange = 'passwordChange',
  identityChange = 'identityChange',
}

export function accountService (app: Application) {
  function getLink (type: string, hash: string) {
    const url = 'http://localhost:3030/' + type + '?token=' + hash
    return url
  }

  function sendEmail (email: Mail.Options) {
    return app.service('mailer').create(email).then(function (result) {
      console.log('Sent email', result)
    }).catch(err => {
      console.log('Error sending email', err)
    })
  }

  return {
    notifier (
      type: AuthenticationManagementAction,
      user: LckUser
    ) {
      let tokenLink
      let email: Mail.Options
      switch (type) {
        case AuthenticationManagementAction.resendVerifySignup: // sending the user the verification email
          tokenLink = getLink('verify', user.verifyToken as string)
          email = {
            to: user.email,
            subject: 'Verify Signup',
            text: `
              Your account has been created.

              We need to confirm your email.

              Please follow the link

              ${tokenLink}

              to confirm your email is correct and you are a human.
            `
          }
          return sendEmail(email)

        case AuthenticationManagementAction.verifySignup: // confirming verification
          tokenLink = getLink('verify', user.verifyToken as string)
          email = {
            to: user.email,
            subject: 'Confirm Signup',
            text: `
              Your account has been created.

              We need to confirm your email.

              Please follow the link

              ${tokenLink}

              to confirm your email is correct and you are a human.
            `
          }
          return sendEmail(email)

        case AuthenticationManagementAction.sendResetPwd:
          tokenLink = getLink('reset', user.resetToken as string)
          email = {
            to: user.email,
            subject: 'Verify Signup',
            text: `
              You ask for resetting your password.

              Please follow the link

              ${tokenLink}

              to update your password.
            `
          }
          return sendEmail(email)

        case AuthenticationManagementAction.resetPwd:
          tokenLink = getLink('reset', user.resetToken as string)
          email = {
            to: user.email,
            subject: 'Reset password',
            text: `
              You ask for resetting your password.

              Please follow the link

              ${tokenLink}

              to update your password.
            `
          }
          return sendEmail(email)

        case AuthenticationManagementAction.passwordChange:
          email = {
            to: user.email,
            subject: 'Password updated',
            text: 'Your password has been updated'
          }
          return sendEmail(email)

        case AuthenticationManagementAction.identityChange:
          tokenLink = getLink('verifyChanges', user.verifyToken as string)
          email = {
            to: user.email,
            subject: 'Verify Changes',
            text: 'Your account has been updated'
          }
          return sendEmail(email)
      }
    }
  }
}
