// import { action } from '@storybook/addon-actions'

import WorkspaceForm from './WorkspaceForm.vue'

export default {
  title: 'components/visualize/WorkspaceForm',
  component: WorkspaceForm,
}

export const defaultStory = () => ({
  components: { WorkspaceForm },
  template: '<WorkspaceForm />',
})

defaultStory.storyName = 'default'

export const updateStory = () => ({
  components: { WorkspaceForm },
  data () {
    return {
      newWorkspace: {
        text: 'This is a great workspace',
        documentation: 'Write a documentation could help other to understand what is this workspace',
        settings: {
          color: '#fff',
          backgroundColor: '#aa7bea',
          icon: 'bi-app-indicator',
        },
      },
    }
  },
  template: '<WorkspaceForm :workspace="newWorkspace" />',
})

updateStory.storyName = 'update'
