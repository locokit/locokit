import WithSidebar from './WithSidebar'

export default {
  title: 'layouts/with a sidebar',
  component: WithSidebar
}

export const defaultStory = () => ({
  components: { WithSidebar },
  template: '<WithSidebar />'
})

defaultStory.storyName = 'default'
