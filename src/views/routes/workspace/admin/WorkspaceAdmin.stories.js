// import { action } from '@storybook/addon-actions'

import WorkspaceAdmin from './WorkspaceAdmin.vue'
import StoryRouter from 'storybook-vue-router'

export default {
  title: 'views/routes/workspace/admin/WorkspaceAdmin',
  component: WorkspaceAdmin,
  decorators: [
    StoryRouter(),
  ],
}

export const defaultStory = () => ({
  components: { WorkspaceAdmin },
  template: '<WorkspaceAdmin workspaceId="1" />',
})

defaultStory.storyName = 'default'
defaultStory.parameters = {
  lckServices: {
    workspace: {
      get () {
        return new Promise(resolve => {
          resolve({
            text: 'This is a great workspace',
            documentation: 'Write a documentation could help other to understand what is this workspace',
            settings: {
              color: '#fff',
              backgroundColor: '#aa7bea',
              icon: 'bi-app-indicator',
            },
          })
        })
      },
    },
  },
}
