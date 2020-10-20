import { action } from '@storybook/addon-actions'
import { GROUP_ROLE, USER_PROFILE, WORKSPACE_ROLE } from '@locokit/lck-glossary'

import Profile from './Profile'

import {
  authState
} from '@/store/auth'

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
defaultStory.parameters = { storyshots: { disable: true } }

export const withAuthUser = () => ({
  components: { Profile },
  template: '<Profile @submit="this.submit" />',
  methods: { submit: action('submit') },
  mounted () {
    authState.data.user = {
      id: 1,
      name: 'Mathieu DARTIGUES',
      email: 'mathieu.dartigues@makina-corpus.com',
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
      name: 'Mathieu DARTIGUES',
      email: 'mathieu.dartigues@makina-corpus.com',
      profile: USER_PROFILE.SUPERADMIN,
      groups: [{
        id: 'group-id',
        name: 'An amazing group',
        // eslint-disable-next-line @typescript-eslint/camelcase
        workspace_role: WORKSPACE_ROLE.OWNER,
        // eslint-disable-next-line @typescript-eslint/camelcase
        uhg_role: GROUP_ROLE.ADMIN,
        // eslint-disable-next-line @typescript-eslint/camelcase
        workspace_id: 'workspace-id',
        workspace: {
          id: 'uuid-v4',
          text: 'An amazing workspace'
        }
      }]
    }
  },
  beforeDestroy () {
    authState.data.user = null
  }
})

withAuthUserAndGroup.storyName = 'with auth user and groups'
withAuthUserAndGroup.parameters = { storyshots: { disable: true } }
