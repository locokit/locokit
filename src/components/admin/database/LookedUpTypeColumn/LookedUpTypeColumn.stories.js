import LookedUpTypeColumn from './LookedUpTypeColumn'

export default {
  title: 'components/admin/database/LookedUpTypeColumn',
  component: LookedUpTypeColumn
}

export const createStory = () => (
  {
    components: { LookedUpTypeColumn },
    template: '<LookedUpTypeColumn />'
  }
)

createStory.storyName = 'Create'
