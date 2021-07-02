import WithToolbar from './WithToolbar'

export default {
  title: 'layouts/toolbar',
  component: WithToolbar,
}

export const defaultStory = () => ({
  components: { WithToolbar },
  template: `
    <WithToolbar>
      <template #toolbar>
        This is the toolbar slot
      </template>
      This is the main content
    </WithToolbar>
  `,
})

defaultStory.storyName = 'default'
