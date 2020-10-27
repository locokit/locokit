import { action } from '@storybook/addon-actions'

import Profile from './Profile'

export default {
  title: 'routes/user/Profile',
  component: Profile
}

export const defaultStory = () => ({
  components: { Profile },
  template: '<Profile @submit="this.submit" />',
  methods: { submit: action('submit') }
})

defaultStory.storyName = 'default'
