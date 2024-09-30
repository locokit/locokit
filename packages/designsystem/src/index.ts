import { type App } from 'vue'
import './styles/index.css'

/**
 * Components
 */
import FormGeneric from './components/forms/FormGeneric.vue'
import SignInForm from './components/forms/auth/SignInForm/SignInForm.vue'
import LostPasswordForm from './components/forms/auth/LostPasswordForm/LostPasswordForm.vue'
import PasswordForm from './components/forms/auth/PasswordForm/PasswordForm.vue'
import SignUpForm from './components/forms/auth/SignUpForm/SignUpForm.vue'
import SingleTag from './components/ui/SingleTag/SingleTag.vue'
import MultiTags from './components/ui/MultiTags/MultiTags.vue'
import WorkspaceForm from './components/data/WorkspaceForm/WorkspaceForm.vue'
import PredefinedColorPicker from './components/ui/PredefinedColorPicker/PredefinedColorPicker.vue'
import UpdateGeneralForm from './components/forms/profile/UpdateGeneralForm/UpdateGeneralForm.vue'
import UpdateEmailForm from './components/forms/profile/UpdateEmailForm/UpdateEmailForm.vue'
import UpdatePasswordForm from './components/forms/profile/UpdatePasswordForm/UpdatePasswordForm.vue'
import ButtonWithStatus from './components/ui/ButtonWithStatus/ButtonWithStatus.vue'
import IdentityCard from './components/data/IdentityCard/IdentityCard.vue'
import FilterButton from './components/ui/FilterButton/FilterButton.vue'
import MessageForUser from './components/data/MessageForUser/MessageForUser.vue'
import PickData from './components/ui/PickData/PickData.vue'

/**
 * Layouts
 */
import LayoutBackground from './layouts/background.vue'

import { setup as setupVeeValidate } from './plugins/vee-validate'
import { i18n } from './plugins/i18n'
import { definePluginPrime } from './plugins/primevue'
import { I18n } from 'vue-i18n'

export function setupLckDesignSystem(app: App, localI18n?: I18n): void {
  definePluginPrime(app)
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
