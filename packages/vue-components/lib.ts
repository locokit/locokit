/**
 * This file is here to export the library.
 *
 * We export all components / layouts.
 *
 */

/**
 * Components
 */
import GenericForm from './components/commons/generic-form/generic-form.vue'
import LostPassword from './components/auth/lost-password/lost-password.vue'
import MultiTag from './components/ui/multi-tag/multi-tag.vue'
import Password from './components/auth/password/password.vue'
import SignInForm from './components/auth/sign-in/sign-in.vue'
import SignUpForm from './components/auth/sign-up/sign-up.vue'
import SingleTag from './components/ui/single-tag/single-tag.vue'
import UpdateEmailForm from './components/profile/update-email/update-email.vue'
import UpdateGeneralForm from './components/profile/update-general/update-general.vue'
import UpdatePasswordForm from './components/profile/update-password/update-password.vue'

export const components = {
  GenericForm,
  LostPassword,
  MultiTag,
  Password,
  SignInForm,
  SignUpForm,
  SingleTag,
  UpdateEmailForm,
  UpdateGeneralForm,
  UpdatePasswordForm,
}

export {
  GenericForm,
  LostPassword,
  MultiTag,
  Password,
  SignInForm,
  SignUpForm,
  SingleTag,
  UpdateEmailForm,
  UpdateGeneralForm,
  UpdatePasswordForm,
}

/**
 * Layouts
 */
import LayoutBackground from './layouts/background/layout-background.vue'

export const layouts = {
  LayoutBackground,
}

export { LayoutBackground }
