/* eslint-disable @typescript-eslint/camelcase */
import { GROUP_ROLE, USER_PROFILE } from '@locokit/lck-glossary'
import Vue from 'vue'
import Group from './Group'

import { authState } from '@/store/auth'
import '@/plugins/vee-validate'
import Profile from '@/views/routes/Account/Profile/Profile'

export default {
  title: 'views/routes/account/group/Group',
  component: Group,
}

export const defaultStory = () => ({
  data () {
    return { authState }
  },
  components: { Group },
  template: '<Group />',
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
  components: { Group },
  template: '<Group />',
  async mounted () {
    this.authState.data.user = {
      id: 1,
      name: 'Mathieu DARTIGUES',
      email: 'contact@locokit.io',
      profile: USER_PROFILE.SUPERADMIN,
      groups: [],
    }
    await Vue.nextTick()
  },
  beforeDestroy () {
    this.authState.data.user = null
  },
})

withAuthUser.storyName = 'withAuthUser'

export const withAuthUserAndGroup = () => ({
  data () {
    return { authState }
  },
  components: { Group },
  template: '<Group />',
  async mounted () {
    this.authState.data.user = {
      id: 1,
      name: 'Mathieu DARTIGUES',
      email: 'contact@locokit.io',
      profile: USER_PROFILE.SUPERADMIN,
      groups: [{
        id: 'group-id',
        name: 'An amazing group',
        aclset: {
          manager: true,
          workspace_id: 'workspace-id',
          workspace: {
            id: 'uuid-v4',
            text: 'An amazing workspace',
          },
        },
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
