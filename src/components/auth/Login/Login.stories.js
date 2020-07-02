import { linkTo } from '@storybook/addon-links'

import Login from './Login'

export default {
  title: 'Login',
  component: Login
}

export const LoginStory = () => ({
  components: { Login },
  template: '<Login />',
  methods: { action: linkTo('Button') }
})

LoginStory.story = {
  name: 'Login'
}
