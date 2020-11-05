import { action } from '@storybook/addon-actions'

import LostPassword from './LostPassword'

export default {
  title: 'views/routes/user/LostPassword',
  component: LostPassword
}

export const defaultStory = () => ({
  components: { LostPassword },
  template: '<LostPassword @submit="this.submit" />',
  methods: { submit: action('submit') }
})

defaultStory.storyName = 'default'
