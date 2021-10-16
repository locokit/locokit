// import { action } from '@storybook/addon-actions'

import Workspace from './Workspace.vue'

export default {
  title: 'views/routes/Workspace',
  component: Workspace,
}

export const defaultStory = () => ({
  components: { Workspace },
  template: '<Workspace />',
})

defaultStory.storyName = 'default'
