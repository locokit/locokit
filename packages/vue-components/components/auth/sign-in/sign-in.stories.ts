import type { Meta } from '@storybook/vue3'
import SignIn from './sign-in.vue'

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
    signUpRoute: '/sign-up',
  },
}

export const ForgottenPasswordEnabled = {
  args: {
    displayLostPasswordLink: true,
    lostPasswordRoute: '/lost-password',
  },
}

export const WithMessage = {
  args: {
    message: {
      status: 'error',
      text: 'User is not authenticated.',
    },
  },
}
