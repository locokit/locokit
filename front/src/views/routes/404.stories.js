import { action } from '@storybook/addon-actions'

import Page404 from './404.vue'

export default {
  title: 'views/routes/404',
  component: Page404,
}

export const defaultStory = () => ({
  components: { Page404 },
  template: '<Page404 @submit="this.submit" />',
  methods: { submit: action('submit') },
})

defaultStory.storyName = 'default'
