import LookedUpTypeColumn from './LookedUpTypeColumn'

export default {
  title: 'views/modals/LookedUpTypeColumn',
  component: LookedUpTypeColumn
}

export const createStory = () => (
  {
    components: { LookedUpTypeColumn },
    template: '<div class="p-fluid"><LookedUpTypeColumn /></div>'
  }
)

createStory.storyName = 'Create'
