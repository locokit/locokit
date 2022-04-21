import Header from './Header'
import Vue from 'vue'

import StoryRouter from '../../../../.storybook/storyRouterDecorator.js'
import { action } from '@storybook/addon-actions'

export default {
  title: 'components/ui/Header',
  component: Header,
}

Vue.component('RouterLink', {
  props: ['to'],
  methods: {
    log () {
      action('link target')(this.to)
    },
  },
  template: '<a class="mock-link" @click="log()"><slot>RouterLink</slot></a>',
})

export const withLogo = () => (
  {
    components: { Header },
    data () {
      return {
        // eslint-disable-next-line no-undef
        logoUrl: LCK_THEME.LOGO_BG_WHITE_URL,
        // eslint-disable-next-line no-undef
        logoMobileUrl: LCK_THEME.LOGO_MOBILE_URL,
      }
    },
    template: '<Header :logoUrl="logoUrl" :logoMobileUrl="logoMobileUrl"/>',
    decorators: [StoryRouter],
  }
)

withLogo.storyName = 'Header with logo (required)'
