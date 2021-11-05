import { Application } from '../../declarations'
import { ServiceSwaggerOptions } from 'feathers-swagger'
import { JSONSchema } from 'objection'

export class SettingsModel {
  allow_signup!: boolean

  static get jsonSchema (): JSONSchema {
    return {
      type: 'object',
      properties: {
        allow_signup: { type: 'boolean' },
      },
    }
  }
}

export interface SettingsService {
  find: () => Promise<SettingsModel>
}

export class Settings implements SettingsService {
  app: Application
  localSettings: SettingsModel
  public docs: ServiceSwaggerOptions

  constructor (app: Application) {
    this.app = app
    this.localSettings = {
      allow_signup: this.app.get('authentication').signup.isAllowed === 'true',
    }

    this.docs = {
      description: 'Settings of the LocoKit platform',
      definition: SettingsModel.jsonSchema,
    }
  }

  async find (): Promise<SettingsModel> {
    return await Promise.resolve(this.localSettings)
  }
}
