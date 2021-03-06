import Badge from './Badge'

export default {
  title: 'components/ui/Badge',
  component: Badge,
  decorators: [() => ({ template: '<div style="margin: 1em;"><story /></div>' })],
}

export const defaultStory = () => ({
  components: { Badge },
  template: '<Badge label="This is a badge" color="#484848"  />',
  methods: { },
})
defaultStory.storyName = 'default'

export const BadgeWithContent = () => ({
  components: { Badge },
  template: '<Badge label="This is a badge" color="#ffffff" backgroundColor="var(--primary-color)" />',
  methods: { },
})
BadgeWithContent.storyName = 'Badge With Content'

export const MultipleBadgesWithContent = () => ({
  components: { Badge },
  template: `
    <div>
      <Badge label="This is a badge" color="#ffffff" backgroundColor="var(--primary-color-light)" />
      <Badge label="This is a badge" color="#ffffff" backgroundColor="var(--primary-color)" />
      <Badge label="This is a badge" color="#ffffff" backgroundColor="var(--primary-color-dark)" />
    </div>
    `,
  methods: { },
})
MultipleBadgesWithContent.storyName = 'Multiple Badges With Content'
