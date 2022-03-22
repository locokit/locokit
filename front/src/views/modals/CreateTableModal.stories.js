import CreateTableModal from './CreateTableModal'

export default {
  title: 'views/modals/CreateTableModal',
  component: CreateTableModal,
}

export const createStory = () => (
  {
    components: { CreateTableModal },
    template: '<div class="p-fluid"><CreateTableModal :visible="true" /></div>',
  }
)

createStory.storyName = 'Create'
createStory.args = {
  waitForSelector: '.p-dialog',
}
