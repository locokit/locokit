/* eslint-disable @typescript-eslint/no-unused-vars */
import { action } from '@storybook/addon-actions'
import ProcessListing from './ProcessListing'

const resultToSend = {
  total: 0,
  limit: 10,
  data: []
}

export default {
  title: 'views/routes/workspace/admin/ProcessListing',
  component: ProcessListing
}

export const defaultStory = () => ({
  components: { ProcessListing },
  template: '<ProcessListing />'
})

defaultStory.storyName = 'default'

export const withProcessesToDisplay = () => {
  return {
    components: { ProcessListing },
    template: `
      <ProcessListing
        workspaceId="this-is-a-id"
      />
    `
  }
}

withProcessesToDisplay.storyName = 'with processes to display'
withProcessesToDisplay.parameters = {
  lckServices: {
    data: {
      limit: 10,
      total: 2,
      data: [{
        text: 'First process'
      }, {
        text: 'Second process'
      }]
    }
  }
}
