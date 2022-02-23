import { Conflict, Forbidden } from '@feathersjs/errors'
import { USER_PROFILE } from '@locokit/lck-glossary/src'
import { ServiceSwaggerOptions } from 'feathers-swagger'
import { JSONSchema } from 'objection'

import { Application } from '../../declarations'
import { User } from '../../models/user.model'
import { AuthenticationManagementAction, authManagementSettings } from '../authmanagement/authmanagement.settings'
import { SettingsModel } from '../settings/settings.class'

class SignUpModel {
  email!: string
  name!: string

  static get jsonSchema (): JSONSchema {
    return {
      type: 'object',
      properties: {
        email: { type: 'string' },
        name: { type: 'string' },
      },
    }
  }
}

export interface SignUpService {
  create: (credentials: SignUpModel) => Promise<SignUpModel>
}

export class SignUp implements SignUpService {
  app: Application
  public docs: ServiceSwaggerOptions

  constructor (app: Application) {
    this.app = app
    this.docs = {
      description: 'Signup service, allow user to create an account',
      definition: SignUpModel.jsonSchema,
    }
  }

  async create (credentials: SignUpModel): Promise<SignUpModel> {
    // Check that the registration is allowed
    const appSettings: SettingsModel = await this.app.service('settings').find()
    if (!appSettings.allow_signup) throw new Forbidden()

    // Create a creator user with the specified credentials
    try {
      await this.app.service('user').create({
        name: credentials.name,
        email: credentials.email,
        profile: USER_PROFILE.CREATOR,
      })
    } catch (error) {
      // Don't throw an error if an existing user is already using the e-mail address but send an e-mail message
      // to the matching user
      if (error instanceof Conflict) {
        await authManagementSettings(this.app as Application).notifier(
          AuthenticationManagementAction.informUserConflict,
          credentials as User,
        )
      } else {
        throw error
      }
    }
    return credentials
  }
}
