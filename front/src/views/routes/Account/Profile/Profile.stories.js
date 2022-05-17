/* eslint-disable @typescript-eslint/camelcase */
import { GROUP_ROLE, USER_PROFILE } from '@locokit/lck-glossary'
import Vue from 'vue'
import Profile from './Profile'

import { authState } from '@/store/auth'
import '@/plugins/vee-validate'

export default {
  title: 'views/routes/account/profile/Profile',
  component: Profile,
}

export const defaultStory = () => ({
  data () {
    return { authState }
  },
  components: { Profile },
  template: '<Profile />',
  async mounted () {
    this.authState.data.user = null
    await Vue.nextTick()
  },
  beforeDestroy () {
    this.authState.data.user = null
  },
})

defaultStory.storyName = 'default'

export const withAuthUser = () => ({
  data () {
    return { authState }
  },
  components: { Profile },
  template: '<Profile />',
  async mounted () {
    this.authState.data.user = {
      id: 1,
      name: 'Mathieu DARTIGUES',
      email: 'contact@locokit.io',
      profile: USER_PROFILE.SUPERADMIN,
    }
    await Vue.nextTick()
  },
  beforeDestroy () {
    this.authState.data.user = null
  },
})

withAuthUser.storyName = 'with auth user'

export const withAuthUserAndGroup = () => ({
  data () {
    return { authState }
  },
  components: { Profile },
  template: '<Profile />',
  async mounted () {
    this.authState.data.user = {
      id: 1,
      name: 'Mathieu DARTIGUES',
      email: 'contact@locokit.io',
      profile: USER_PROFILE.SUPERADMIN,
      groups: [{
        id: 'group-id',
        name: 'An amazing group',
        uhg_role: GROUP_ROLE.ADMIN,
        aclset: {
          manager: true,
          workspace_id: 'workspace-id',
          workspace: {
            id: 'uuid-v4',
            text: 'An amazing workspace',
          },
        },
      }],
    }
    await Vue.nextTick()
  },
  beforeDestroy () {
    this.authState.data.user = null
  },
})

withAuthUserAndGroup.storyName = 'with auth user and groups'
