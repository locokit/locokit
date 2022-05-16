import { action } from '@storybook/addon-actions'
import { GROUP_ROLE, USER_PROFILE } from '@locokit/lck-glossary'
import Vue from 'vue'
import Profile from './Profile'

import { authState } from '@/store/auth'
import '@/plugins/vee-validate'

export default {
  title: 'views/routes/user/Profile',
  component: Profile,
}

export const defaultStory = () => ({
  data () {
    return { authState }
  },
  components: { Profile },
  template: '<Profile @submit="this.submit" />',
  methods: { submit: action('submit') },
  async mounted () {
    this.authState.data.user = null
    await Vue.nextTick()
  },
})

defaultStory.storyName = 'default'
// defaultStory.parameters = { storyshots: { disable: true } }

export const withAuthUser = () => ({
  data () {
    return { authState }
  },
  components: { Profile },
  template: '<Profile @submit="this.submit" />',
  methods: { submit: action('submit') },
  async mounted () {
    this.authState.data.user = {
      id: 1,
      name: 'Mathieu DARTIGUES',
      email: 'mathieu.dartigues@makina-corpus.com',
      profile: USER_PROFILE.SUPERADMIN,
    }
    await Vue.nextTick()
  },
})

withAuthUser.storyName = 'with auth user'
// withAuthUser.parameters = { storyshots: { disable: true } }

export const withAuthUserAndGroup = () => ({
  data () {
    return { authState }
  },
  components: { Profile },
  template: '<Profile @submit="this.submit" />',
  methods: { submit: action('submit') },
  async mounted () {
    this.authState.data.user = {
      id: 1,
      name: 'Mathieu DARTIGUES',
      email: 'mathieu.dartigues@makina-corpus.com',
      profile: USER_PROFILE.SUPERADMIN,
      groups: [{
        id: 'group-id',
        name: 'An amazing group',
        aclset: {
          manager: true,
          // eslint-disable-next-line @typescript-eslint/camelcase
          workspace_id: 'workspace-id',
          workspace: {
            id: 'uuid-v4',
            text: 'An amazing workspace',
          },
        },
        // eslint-disable-next-line @typescript-eslint/camelcase
        uhg_role: GROUP_ROLE.ADMIN,
      }],
    }
    await Vue.nextTick()
  },
  beforeDestroy () {
    this.authState.data.user = null
  },
})

withAuthUserAndGroup.storyName = 'with auth user and groups'
// withAuthUserAndGroup.parameters = { storyshots: { disable: true } }
