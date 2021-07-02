import { action } from '@storybook/addon-actions'

import LostPassword from './LostPassword'

export default {
  title: 'components/auth/LostPassword',
  component: LostPassword,
}

export const defaultStory = () => ({
  components: { LostPassword },
  template: '<LostPassword @submit="this.submit" />',
  methods: { submit: action('submit') },
})

defaultStory.storyName = 'default'

export const loadingStory = () => ({
  components: { LostPassword },
  template: '<LostPassword @submit="this.submit" :loading="true" />',
  methods: { submit: action('submit') },
})

loadingStory.storyName = 'loading'

export const errorStory = () => ({
  components: { LostPassword },
  data () {
    return {
      error: new Error('This is an error'),
    }
  },
  template: '<LostPassword @submit="this.submit" :error="error" />',
  methods: { submit: action('submit') },
})

errorStory.storyName = 'error'
