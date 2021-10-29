import { Application } from '../../declarations'

export interface SettingsModel {
  allow_signup: boolean
}

export interface SettingsService {
  find: () => Promise<SettingsModel>
}

export class Settings implements SettingsService {
  app: Application
  localSettings: SettingsModel

  constructor (app: Application) {
    this.app = app
    this.localSettings = {
      allow_signup: this.app.get('authentication').allowSignUp === 'true',
    }
  }

  async find (): Promise<SettingsModel> {
    return await Promise.resolve(this.localSettings)
  }
}
