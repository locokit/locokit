/* eslint-disable no-case-declarations */
import { Application } from '../../declarations'
import { User as LckUser } from '../../models/user.model'
import ejs from 'ejs'
import path from 'path'
import makeDebug from 'debug'

const debug = makeDebug('lck:service:authMgnt:settings')

export enum AuthenticationManagementAction {
  verifySignup = 'verifySignup',
  resendVerifySignup = 'resendVerifySignup',
  verifySignupSetPassword = 'verifySignupSetPassword',
  sendResetPwd = 'sendResetPwd',
  resetPwd = 'resetPwd',
  passwordChange = 'passwordChange',
  identityChange = 'identityChange',
  /**
   * This value is not in the official documentation.
   * We use it when a user is created to send him/her the welcome email
   * telling him/her to verify email + set password
   */
  sendVerifySignup = 'sendVerifySignup',
}

const templateFolder = '/templates/mails'

export function authManagementSettings (app: Application) {
  function getLink (type: string, hash: string): string {
    return app.get('publicUrl') as string + '/' + type + '?token=' + hash
  }

  const actionOptions: Record<AuthenticationManagementAction, {
    templateFile: string
    titleFile: string
    verifySignupPath?: string
    resetPasswordPath?: string
  }> = {
    /**
     * Mails including a link (verify or reset)
     */
    [AuthenticationManagementAction.sendResetPwd]: {
      templateFile: path.join(process.cwd(), templateFolder, '/sendResetPwd/template.ejs'),
      titleFile: path.join(process.cwd(), templateFolder, '/sendResetPwd/title.ejs'),
    },
    [AuthenticationManagementAction.sendVerifySignup]: {
      templateFile: path.join(process.cwd(), templateFolder, '/sendVerifySignup/template.ejs'),
      titleFile: path.join(process.cwd(), templateFolder, '/sendVerifySignup/title.ejs'),
    },
    [AuthenticationManagementAction.resendVerifySignup]: {
      templateFile: path.join(process.cwd(), templateFolder, '/resendVerifySignup/template.ejs'),
      titleFile: path.join(process.cwd(), templateFolder, '/resendVerifySignup/title.ejs'),
    },
    /**
     * Mails for account information (enabled, password updated, or identity change)
     */
    [AuthenticationManagementAction.verifySignup]: {
      templateFile: path.join(process.cwd(), templateFolder, '/verifySignup/template.ejs'),
      titleFile: path.join(process.cwd(), templateFolder, '/verifySignup/title.ejs'),
    },
    [AuthenticationManagementAction.verifySignupSetPassword]: {
      templateFile: path.join(process.cwd(), templateFolder, '/verifySignupSetPassword/template.ejs'),
      titleFile: path.join(process.cwd(), templateFolder, '/verifySignupSetPassword/title.ejs'),
    },
    [AuthenticationManagementAction.resetPwd]: {
      templateFile: path.join(process.cwd(), templateFolder, '/passwordChange/template.ejs'),
      titleFile: path.join(process.cwd(), templateFolder, '/passwordChange/title.ejs'),
    },
    [AuthenticationManagementAction.passwordChange]: {
      templateFile: path.join(process.cwd(), templateFolder, '/passwordChange/template.ejs'),
      titleFile: path.join(process.cwd(), templateFolder, '/passwordChange/title.ejs'),
    },
    [AuthenticationManagementAction.identityChange]: {
      templateFile: path.join(process.cwd(), templateFolder, '/identityChange/template.ejs'),
      titleFile: path.join(process.cwd(), templateFolder, '/identityChange/title.ejs'),
    },
  }

  return {
    service: '/user',
    async notifier (
      type: AuthenticationManagementAction,
      user: LckUser,
    ) {
      debug('notifier', type, user)
      const currentActionOption = actionOptions[type]
      const currentTemplateVars: {
        portalLink: string
        user: LckUser
        verifySignupLink?: string
        resetPasswordLink?: string
      } = {
        portalLink: app.get('publicUrl'),
        user,
      }
      switch (type) {
        case AuthenticationManagementAction.resendVerifySignup:
        case AuthenticationManagementAction.sendVerifySignup:
          currentTemplateVars.verifySignupLink = getLink('verify-signup', user.verifyToken)
          break
        case AuthenticationManagementAction.sendResetPwd:
          currentTemplateVars.resetPasswordLink = getLink('reset-password', user.resetToken)
          break
      }

      const emailText = await ejs.renderFile(currentActionOption.templateFile, currentTemplateVars)

      const emailSubject = await ejs.renderFile(
        currentActionOption.titleFile, {
          user,
          portalName: app.get('publicPortalName'),
        })

      return await app.service('mailer').create({
        to: user.email,
        subject: emailSubject,
        text: emailText,
      })
    },
  }
}
