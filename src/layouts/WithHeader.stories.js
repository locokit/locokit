import WithHeader from './WithHeader'

export default {
  title: 'layouts/header',
  component: WithHeader,
}

export const defaultStory = () => ({
  components: { WithHeader },
  template: `
    <WithHeader>
      This is the main content
    </WithHeader>
  `,
})

defaultStory.storyName = 'default'
