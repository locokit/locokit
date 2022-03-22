// import { action } from '@storybook/addon-actions'

import WorkspaceSettings from './WorkspaceSettings.vue'

export default {
  title: 'views/routes/workspace/admin/WorkspaceSettings',
  component: WorkspaceSettings,
}

export const defaultStory = () => ({
  components: { WorkspaceSettings },
  template: '<WorkspaceSettings workspaceId="1" />',
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
            // eslint-disable-next-line @typescript-eslint/camelcase
            generate_sql: true,
            slug: 'grrreat_workspace',
          })
        })
      },
    },
  },
}
