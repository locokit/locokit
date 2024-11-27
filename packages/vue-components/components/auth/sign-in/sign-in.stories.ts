import SignIn from './sign-in.vue'
import type { Meta } from '@storybook/vue3'

const meta: Meta<typeof SignIn> = {
  title: 'components/auth/sign-in',
  component: SignIn,
}

export default meta

export const Default = {
  args: {},
}

export const Loading = {
  args: {
    loading: true,
  },
}
export const SignUpEnabled = {
  args: {
    displaySignUpLink: true,
    signupRoute: '/sign-up',
  },
}
export const ErrorFromServer = {
  args: {
    error: {
      name: 'NotAuthenticated',
    },
  },
}

// <docs lang="md">
// ### sign-in

// Form which allow an user to sign in if his account is already created.

// Allow also to access the lost password form or to access the registration form.
// </docs>
