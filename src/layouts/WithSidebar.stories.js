import WithSidebar from './WithSidebar'

export default {
  title: 'layouts/sidebar',
  component: WithSidebar,
}

export const defaultStory = () => ({
  components: { WithSidebar },
  template: '<WithSidebar />',
})

defaultStory.storyName = 'default'
