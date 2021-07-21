import { action } from '@storybook/addon-actions'

import ResetPassword from './ResetPassword'

export default {
  title: 'views/routes/user/ResetPassword',
  component: ResetPassword,
}

export const defaultStory = () => ({
  components: { ResetPassword },
  template: '<ResetPassword @submit="this.submit" />',
  methods: { submit: action('submit') },
})

defaultStory.storyName = 'default'

export const setPasswordStory = () => ({
  components: { ResetPassword },
  template: '<ResetPassword :reset="false" @submit="this.submit" />',
  methods: { submit: action('submit') },
})

setPasswordStory.storyName = 'set a password'
