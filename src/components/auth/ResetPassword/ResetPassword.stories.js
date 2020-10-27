import { action } from '@storybook/addon-actions'

import ResetPassword from './ResetPassword'

export default {
  title: 'components/auth/ResetPassword',
  component: ResetPassword
}

export const defaultStory = () => ({
  components: { ResetPassword },
  template: '<ResetPassword @submit="this.submit" />',
  methods: { submit: action('submit') }
})

defaultStory.storyName = 'default'

export const passwordMismatch = () => ({
  components: { ResetPassword },
  template: '<ResetPassword ref="rp" @submit="this.submit" />',
  methods: { submit: action('submit') },
  async mounted () {
    this.$refs.rp.password = 'pouet'
    this.$refs.rp.passwordCheck = 'azeaze'
    await this.$nextTick()
    this.$refs.rp.$el.querySelector('button').click()
  }
})

passwordMismatch.storyName = 'password mismatch'
