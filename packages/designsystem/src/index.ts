import { type App } from 'vue'
import './styles/index.css'

/**
 * Components
 */
import SignInForm from './components/auth/SignInForm/SignInForm.vue'
import LostPasswordForm from './components/auth/LostPasswordForm/LostPasswordForm.vue'
import PasswordForm from './components/auth/PasswordForm/PasswordForm.vue'
import SignUpForm from './components/auth/SignUpForm/SignUpForm.vue'
import FormGeneric from './components/FormGeneric/FormGeneric.vue'
import SingleTag from './components/SingleTag/SingleTag.vue'
import MultiTags from './components/MultiTags/MultiTags.vue'
import WorkspaceForm from './components/WorkspaceForm/WorkspaceForm.vue'
import PredefinedColorPicker from './components/PredefinedColorPicker/PredefinedColorPicker.vue'
import UpdateGeneralForm from './components/profile/UpdateGeneralForm/UpdateGeneralForm.vue'
import UpdateEmailForm from './components/profile/UpdateEmailForm/UpdateEmailForm.vue'
import UpdatePasswordForm from './components/profile/UpdatePasswordForm/UpdatePasswordForm.vue'
import ButtonWithStatus from './components/ButtonWithStatus/ButtonWithStatus.vue'
import IdentityCard from './components/IdentityCard/IdentityCard.vue'
import FilterButton from './components/FilterButton/FilterButton.vue'
import MessageForUser from './components/MessageForUser/MessageForUser.vue'
import PickData from './components/PickData/PickData.vue'

/**
 * Layouts
 */
import LayoutBackground from './layouts/background.vue'

import { setup as setupVeeValidate } from './plugins/vee-validate'
import { i18n } from './plugins/i18n'

import Aura from '@/presets/aura'

import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice' // theme
import PrimeVue from 'primevue/config'
import { I18n } from 'vue-i18n'

export function setupLckDesignSystem(app: App, localI18n?: I18n): void {
  app.use(PrimeVue, {
    ripple: true,
    unstyled: true,
    pt: Aura,
  })
  app.use(ToastService)
  app.use(ConfirmationService)
  if (localI18n) {
    app.use(localI18n)
    setupVeeValidate(localI18n)
  } else {
    app.use(i18n)
    setupVeeValidate(i18n)
  }
}

export {
  /**
   * Components
   */
  SignInForm,
  LostPasswordForm,
  PasswordForm,
  SignUpForm,
  FormGeneric,
  SingleTag,
  MultiTags,
  WorkspaceForm,
  PredefinedColorPicker,
  UpdateGeneralForm,
  UpdateEmailForm,
  UpdatePasswordForm,
  ButtonWithStatus,
  IdentityCard,
  FilterButton,
  MessageForUser,
  PickData,

  /**
   * Layouts
   */
  LayoutBackground,

  /**
   * Utils
   */
  setupVeeValidate,
}
