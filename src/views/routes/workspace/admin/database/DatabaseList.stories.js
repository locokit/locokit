// import { action } from '@storybook/addon-actions'

import DatabaseList from './DatabaseList.vue'

export default {
  title: 'views/routes/workspace/admin/DatabaseList',
  component: DatabaseList,
}

export const defaultStory = () => ({
  components: { DatabaseList },
  template: '<DatabaseList workspaceId="1" />',
})

defaultStory.storyName = 'default'
