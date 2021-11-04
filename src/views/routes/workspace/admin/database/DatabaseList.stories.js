// import { action } from '@storybook/addon-actions'

import DatabaseList from './DatabaseList.vue'
import StoryRouter from 'storybook-vue-router'

export default {
  title: 'views/routes/workspace/admin/DatabaseList',
  component: DatabaseList,
  decorators: [
    StoryRouter(),
  ],
}

export const defaultStory = () => ({
  components: { DatabaseList },
  template: '<DatabaseList workspaceId="1" />',
})

defaultStory.storyName = 'default'
