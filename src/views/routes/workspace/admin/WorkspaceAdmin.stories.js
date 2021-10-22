// import { action } from '@storybook/addon-actions'

import WorkspaceAdmin from './WorkspaceAdmin.vue'

export default {
  title: 'views/routes/WorkspaceAdmin',
  component: WorkspaceAdmin,
}

export const defaultStory = () => ({
  components: { WorkspaceAdmin },
  template: '<WorkspaceAdmin />',
})

defaultStory.storyName = 'default'
