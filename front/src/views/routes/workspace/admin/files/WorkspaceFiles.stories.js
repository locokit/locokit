/* eslint-disable @typescript-eslint/camelcase */
// import { action } from '@storybook/addon-actions'

import WorkspaceFiles from './WorkspaceFiles.vue'

export default {
  title: 'views/routes/workspace/admin/WorkspaceFiles',
  component: WorkspaceFiles,
}

export const defaultStory = () => ({
  components: { WorkspaceFiles },
  template: '<WorkspaceFiles workspaceId="1" />',
})

defaultStory.storyName = 'default'
defaultStory.parameters = {
  lckServices: {
    attachment: {
      find () {
        return new Promise(resolve => {
          resolve({
            total: 120,
            limit: 10,
            skip: 0,
            data: [{
              id: 1,
              ext: 'pdf',
              filename: 'file1.pdf',
              filepath: 'file1-path',
              mime: 'application/pdf',
              thumbnail: false,
              size: 12300,
              workspace_id: 'w1',
              createdAt: '2022-03-29T09:48:00.156',
              updatedAt: '2022-03-29T10:48:00.156',
            }, {
              id: 2,
              ext: 'pdf',
              filename: 'file2.pdf',
              filepath: 'file2-path',
              mime: 'application/pdf',
              thumbnail: false,
              size: 12300,
              workspace_id: 'w1',
              createdAt: '2022-03-29T09:48:00.156',
              updatedAt: '2022-03-29T10:48:00.156',
            }],
          })
        })
      },
    },
  },
}
