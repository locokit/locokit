import { lckClient } from '@/services/lck-api'
import { LckSettings } from '@/services/lck-api/definitions'

class AppData {
  hasBurgerMenu = false
  allowSignUp = false
}
export const appState: AppData = {
  hasBurgerMenu: false,
  allowSignUp: false,
}

export async function loadApplicationSettings () {
  try {
    const applicationSettings: LckSettings = await lckClient.service('settings').find()
    appState.allowSignUp = applicationSettings.allow_signup
  } catch (e) {
    console.error(e)
  }
}
