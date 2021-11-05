import { action } from '@storybook/addon-actions'

import SignUp from './SignUp'

export default {
  title: 'components/auth/SignUp',
  component: SignUp,
}

export const defaultStory = () => ({
  components: { SignUp },
  template: '<SignUp @submit="this.submit" />',
  methods: { submit: action('submit') },
})

defaultStory.storyName = 'default'
