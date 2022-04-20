/* eslint-disable @typescript-eslint/camelcase */

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
defaultStory.parameters = {
  lckServices: {
    workspace: {
      get () {
        return new Promise(resolve => {
          resolve({
            id: 'workspace1_id',
            text: 'Workspace 1',
            databases: [
              {
                id: 'database1_id',
                text: 'Database 1',
                workspace_id: 'workspace1_id',
                tables: [
                  {
                    id: 'table1_id',
                    text: 'Table 1',
                  },
                  {
                    id: 'table2_id',
                    text: 'Table 2',
                  },
                ],
              },
            ],
          })
        })
      },
    },
  },
}
