import { action } from '@storybook/addon-actions'

import VerifySignup from './VerifySignup'

export default {
  title: 'routes/user/VerifySignup',
  component: VerifySignup
}

export const defaultStory = () => ({
  components: { VerifySignup },
  template: '<VerifySignup @submit="this.submit" />',
  methods: { submit: action('submit') }
})

defaultStory.storyName = 'default'
