/**
 * This file is here to export the library.
 *
 * We export all components / layouts.
 *
 */

/**
 * Components
 */
import LostPassword from './components/auth/lost-password/lost-password.vue'
import SignInForm from './components/auth/sign-in/sign-in.vue'
import MultiTag from './components/ui/multi-tag/multi-tag.vue'
import SingleTag from './components/ui/single-tag/single-tag.vue'

export const components = {
  SingleTag,
  MultiTag,
  SignInForm,
  LostPassword,
}

export { LostPassword, MultiTag, SignInForm, SingleTag }

/**
 * Layouts
 */
import LayoutBackground from './layouts/background/layout-background.vue'

export const layouts = {
  LayoutBackground,
}

export { LayoutBackground }
