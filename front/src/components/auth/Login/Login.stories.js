import { action } from '@storybook/addon-actions'

import Login from './Login'

export default {
  title: 'components/auth/Login',
  component: Login,
}

export const LoginStory = () => ({
  components: { Login },
  template: '<Login @submit="this.submit" />',
  methods: { submit: action('submit') },
})

LoginStory.storyName = 'Login'

export const LoginWithSignUpStory = () => ({
  components: { Login },
  template: '<Login @submit="this.submit" displaySignUpLink="true" />',
  methods: { submit: action('submit') },
})

LoginWithSignUpStory.storyName = 'Login with signup link'
