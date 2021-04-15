import Badge from './Badge'

export default {
  title: 'components/ui/Badge',
  component: Badge
}

export const defaultStory = () => ({
  components: { Badge },
  template: '<Badge />',
  methods: { }
})
defaultStory.storyName = 'default'

export const BadgeWithContent = () => ({
  components: { Badge },
  template: '<Badge label="This is a badge" color="#ffffff" backgroundColor="var(--surface-a)" />',
  methods: { }
})
BadgeWithContent.storyName = 'Badge With Content'
