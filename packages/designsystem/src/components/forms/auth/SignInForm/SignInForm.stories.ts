import SignInForm from './SignInForm.vue';
import type { Meta } from '@storybook/vue3'

const meta: Meta<typeof SignInForm> = {
  title: 'components/auth/login-form',
  component: SignInForm,
  tags: ['autodocs'],
}

export default meta;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default = {
  args: {
  },
}

export const Loading = {
  args: {
    loading: true
  }
}
export const ErrorFromServer = {
  args: {
    error: {
      name: 'NotAuthenticated'
    }
  }
}

// <docs lang="md">
// ### SignInForm

// Form which allow an user to sign in if his account is already created.

// Allow also to access the lost password form or to access the registration form.
// </docs>
