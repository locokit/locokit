import WithBackground from './WithBackground'

export default {
  title: 'layouts/background',
  component: WithBackground,
}

export const defaultStory = () => ({
  components: { WithBackground },
  template: '<WithBackground />',
})

defaultStory.storyName = 'default'

export const withSlotTitle = () => ({
  components: { WithBackground },
  template: `
    <WithBackground>
      <template #title>
        This is a title
      </template>
    </WithBackground>
  `,
})

withSlotTitle.storyName = 'with slot title'

export const withAllSlots = () => ({
  components: { WithBackground },
  template: `
    <WithBackground>
      <template #header>
        This is a header
      </template>
      <template #title>
        This is a title
      </template>
      This is the main part
      <template #footer>
        This is a footer
      </template>
    </WithBackground>
  `,
})

withAllSlots.storyName = 'with all slots'
