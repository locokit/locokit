import { Application } from '@/declarations'
import ejs from 'ejs'
import path from 'path'
import { marked } from 'marked'
import { NotificationType, NotifierOptions, User } from 'feathers-authentication-management'
import { logger } from '../../../logger'
import { SERVICES } from '@locokit/definitions'

const authMgtLogger = logger.child({ service: 'service-auth-mgmt' })

export type AuthenticationManagementAction =
  /**
   * 'verifySignup' |
   * 'resendVerifySignup' |
   * 'verifySignupSetPassword' |
   * 'sendResetPwd' |
   * 'resetPwd' |
   * 'passwordChange' |
   * 'identityChange'
   */
  | NotificationType
  /**
   * We use it when a user is created to send him/her the welcome email
   * telling him/her to verify email + set password
   */
  | 'sendVerifySignup'
  /**
   * We use it when the superadmin updates user email address
   * to send him/her the new configured email address.
   */
  | 'sendUpdatedEmailAddress'
  /**
   * We use it to inform a user that its email has been used to create / update another account.
   */
  | 'informUserConflict'
  /**
   * We use them when a user is enabled / disabled to inform him/her with an email.
   */
  | 'enableUser'
  | 'disableUser'

export type LocokitNotifier = (
  type: AuthenticationManagementAction,
  user: Partial<User>,
  notifierOptions?: NotifierOptions,
) => any

const templateFolder = '/templates/mails'

export function authManagementSettings(app: Application): {
  notifier: LocokitNotifier
  delay: number
  service: string
} {
  function getLink(type: string, hash?: string): string {
    let link = (app.get('publicURL') as string) + '/' + type
    if (hash) link += '?token=' + hash
    return link
  }

  const delayInDays = app.get('settings').signup?.verificationMailDelayDays ?? 5

  const actionOptions: Record<
    AuthenticationManagementAction,
    {
      templateFile: string
      titleFile: string
      verifySignupPath?: string
      resetPasswordPath?: string
    }
  > = {
    /**
     * Mails including a link (verify or reset)
     */
    sendResetPwd: {
      templateFile: path.join(process.cwd(), templateFolder, '/sendResetPwd/template.ejs'),
      titleFile: path.join(process.cwd(), templateFolder, '/sendResetPwd/title.ejs'),
    },
    sendVerifySignup: {
      templateFile: path.join(process.cwd(), templateFolder, '/sendVerifySignup/template.ejs'),
      titleFile: path.join(process.cwd(), templateFolder, '/sendVerifySignup/title.ejs'),
    },
    resendVerifySignup: {
      templateFile: path.join(process.cwd(), templateFolder, '/resendVerifySignup/template.ejs'),
      titleFile: path.join(process.cwd(), templateFolder, '/resendVerifySignup/title.ejs'),
    },
    /**
     * Mails for account information (enabled, password updated, or identity change)
     */
    verifySignup: {
      templateFile: path.join(process.cwd(), templateFolder, '/verifySignup/template.ejs'),
      titleFile: path.join(process.cwd(), templateFolder, '/verifySignup/title.ejs'),
    },
    verifySignupSetPassword: {
      templateFile: path.join(
        process.cwd(),
        templateFolder,
        '/verifySignupSetPassword/template.ejs',
      ),
      titleFile: path.join(process.cwd(), templateFolder, '/verifySignupSetPassword/title.ejs'),
    },
    resetPwd: {
      templateFile: path.join(process.cwd(), templateFolder, '/passwordChange/template.ejs'),
      titleFile: path.join(process.cwd(), templateFolder, '/passwordChange/title.ejs'),
    },
    passwordChange: {
      templateFile: path.join(process.cwd(), templateFolder, '/passwordChange/template.ejs'),
      titleFile: path.join(process.cwd(), templateFolder, '/passwordChange/title.ejs'),
    },
    identityChange: {
      templateFile: path.join(process.cwd(), templateFolder, '/identityChange/template.ejs'),
      titleFile: path.join(process.cwd(), templateFolder, '/identityChange/title.ejs'),
    },
    sendUpdatedEmailAddress: {
      templateFile: path.join(
        process.cwd(),
        templateFolder,
        '/sendUpdatedEmailAddress/template.ejs',
      ),
      titleFile: path.join(process.cwd(), templateFolder, '/sendUpdatedEmailAddress/title.ejs'),
    },
    enableUser: {
      templateFile: path.join(process.cwd(), templateFolder, '/enableUser/template.ejs'),
      titleFile: path.join(process.cwd(), templateFolder, '/enableUser/title.ejs'),
    },
    disableUser: {
      templateFile: path.join(process.cwd(), templateFolder, '/disableUser/template.ejs'),
      titleFile: path.join(process.cwd(), templateFolder, '/disableUser/title.ejs'),
    },
    informUserConflict: {
      templateFile: path.join(process.cwd(), templateFolder, '/informUserConflict/template.ejs'),
      titleFile: path.join(process.cwd(), templateFolder, '/informUserConflict/title.ejs'),
    },
  }

  return {
    service: app.get('authentication').service ?? 'user',
    async notifier(
      type: AuthenticationManagementAction,
      user: Partial<User>,
      notifierOptions?: {
        emailAddress?: string
      },
    ) {
      authMgtLogger.info(`notifier() type %s / user %s`, type, user.username, notifierOptions)
      const currentActionOption = actionOptions[type]
      const currentTemplateVars: {
        portalLink: string
        user: Partial<User>
        verifySignupLink?: string
        resetPasswordLink?: string
        lostPasswordLink?: string
        identityChangeLink?: string
      } = {
        portalLink: app.get('publicURL'),
        user,
      }
      switch (type) {
        case 'resendVerifySignup':
        case 'sendVerifySignup':
          currentTemplateVars.verifySignupLink = getLink(
            'auth/verify-signup',
            user.verifyToken as string,
          )
          break
        case 'sendResetPwd':
          currentTemplateVars.resetPasswordLink = getLink(
            'auth/reset-password',
            user.resetToken as string,
          )
          break
        case 'identityChange':
          currentTemplateVars.identityChangeLink = getLink(
            'auth/confirm-update-email',
            user.verifyToken as string,
          )
          break
        case 'informUserConflict':
          currentTemplateVars.lostPasswordLink = getLink('auth/lost-password')
          break
      }

      const emailText = await ejs.renderFile(currentActionOption.templateFile, currentTemplateVars)
      const emailHTML = marked.parse(emailText)

      const emailSubject = await ejs.renderFile(currentActionOption.titleFile, {
        user,
        portalName: app.get('publicPortalName'),
      })

      return await app.service(SERVICES.MISC_MAILER).create({
        to: notifierOptions?.emailAddress ?? user.email, // Use the specified email address or the user one
        subject: emailSubject,
        text: emailText,
        html: emailHTML,
      })
    },
    delay: delayInDays * 24 * 60 * 60 * 1000, // 5 days by default
  }
}
