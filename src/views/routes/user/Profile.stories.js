import { action } from '@storybook/addon-actions'
import { USER_PROFILE, WORKSPACE_ROLE } from '@locokit/lck-glossary'

import Profile from './Profile'

import {
  authState
} from '../../../store/auth'

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

export const withAuthUser = () => ({
  components: { Profile },
  template: '<Profile @submit="this.submit" />',
  methods: { submit: action('submit') },
  mounted () {
    authState.data.user = {
      email: 'mathieu.dartigues@makina-corpus.com',
      id: 1,
      name: 'Mathieu DARTIGUES',
      profile: USER_PROFILE.SUPERADMIN
    }
  }
})

withAuthUser.storyName = 'with auth user'

export const withAuthUserAndGroup = () => ({
  components: { Profile },
  template: '<Profile @submit="this.submit" />',
  methods: { submit: action('submit') },
  mounted () {
    authState.data.user = {
      id: 1,
      email: 'mathieu.dartigues@makina-corpus.com',
      name: 'Mathieu DARTIGUES',
      profile: USER_PROFILE.SUPERADMIN,
      groups: [{
        name: 'An amazing group',
        // eslint-disable-next-line @typescript-eslint/camelcase
        workspace_role: WORKSPACE_ROLE.OWNER,
        workspace: {
          id: 'uuid-v4',
          text: 'An amazing workspace'
        }
      }]
    }
  }
})

withAuthUserAndGroup.storyName = 'with auth user and groups'
