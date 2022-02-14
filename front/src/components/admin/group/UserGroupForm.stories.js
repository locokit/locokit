/* eslint-disable @typescript-eslint/camelcase */
import UserGroupForm from './UserGroupForm.vue'

export default {
  title: 'components/admin/group/UserGroupForm',
  component: UserGroupForm,
}

export const defaultStory = () => ({
  components: { UserGroupForm },
  data () {
    return {
      currentGroup: {
        name: 'Current group',

      }
    }
  },
  template: '<UserGroupForm :group="currentGroup" />'
})

defaultStory.storyName = 'Default story'

