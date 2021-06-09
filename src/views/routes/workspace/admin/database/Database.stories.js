// import { action } from '@storybook/addon-actions'

import Database from './Database.vue'

export default {
  title: 'views/routes/Database',
  component: Database
}

export const defaultStory = () => ({
  components: { Database },
  template: '<Database databaseId="1" groupId="your-group-id" />'
})

defaultStory.storyName = 'default'
