import Header from './Header'
import Vue from 'vue'

import StoryRouter from 'storybook-vue-router'
import { action } from '@storybook/addon-actions'

export default {
  title: 'Header',
  component: Header
}

Vue.component('RouterLink', {
  props: ['to'],
  methods: {
    log () {
      action('link target')(this.to)
    }
  },
  template: '<div class="mock-link" @click="log()"><slot>RouterLink</slot></div>'
})

export const HeaderBasicStory = () => (
  {
    components: { Header },
    template: '<Header />',
    decorators: [StoryRouter]
  }
)

HeaderBasicStory.storyName = 'Header without props'

export const HeaderStoryWithProps = () => (
  {
    components: { Header },
    template: '<Header :isAuthenticated="true"/>',
    decorators: [StoryRouter]
  }
)

HeaderStoryWithProps.storyName = 'Header with authenticated user'
