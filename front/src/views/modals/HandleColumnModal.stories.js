import HandleColumnModal from './HandleColumnModal'

export default {
  title: 'views/modals/HandleColumnModal',
  component: HandleColumnModal,
}

export const createStory = () => (
  {
    components: { HandleColumnModal },
    template: '<div class="p-fluid"><HandleColumnModal :visible="true"/></div>',
  }
)

createStory.storyName = 'Create'
createStory.args = {
  waitForSelector: '.p-dialog',
}
