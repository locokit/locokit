import Header from './Header'
import Vue from 'vue'

import StoryRouter from 'storybook-vue-router'
import { action } from '@storybook/addon-actions'

export default {
  title: 'components/ui/Header',
  component: Header
}

Vue.component('RouterLink', {
  props: ['to'],
  methods: {
    log () {
      action('link target')(this.to)
    }
  },
  template: '<a class="mock-link" @click="log()"><slot>RouterLink</slot></a>'
})

export const HeaderStoryWithProps = () => (
  {
    components: { Header },
    template: '<Header logoUrl="/img/logo-bg-white.png" />',
    decorators: [StoryRouter]
  }
)

HeaderStoryWithProps.storyName = 'Header with logo (required)'
