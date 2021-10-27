// import { action } from '@storybook/addon-actions'

import DatabaseList from './DatabaseList.vue'

export default {
  title: 'views/routes/DatabaseList',
  component: DatabaseList,
}

export const defaultStory = () => ({
  components: { DatabaseList },
  template: '<DatabaseList databaseId="1" groupId="your-group-id" />',
})

defaultStory.storyName = 'default'
