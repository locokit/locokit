import SingleTag from './SingleTag'

export default {
  title: 'components/SingleTag/SingleTag',
  component: SingleTag,
  decorators: [
    () => ({ template: '<div style="margin: 1em;"><story /></div>' }),
  ],
}

export const defaultStory = () => ({
  components: { SingleTag },
  template: '<SingleTag label="This is a SingleTag" color="#484848"  />',
  methods: {},
})
defaultStory.storyName = 'default'

export const SingleTagWithContent = () => ({
  components: { SingleTag },
  template:
    '<SingleTag label="This is a SingleTag" color="#ffffff" backgroundColor="var(--primary-color)" />',
  methods: {},
})
SingleTagWithContent.storyName = 'SingleTag With Content'

export const MultipleSingleTagWithContent = () => ({
  components: { SingleTag },
  template: `
    <div>
      <SingleTag label="This is a SingleTag" color="#ffffff" backgroundColor="var(--primary-color-light)" />
      <SingleTag label="This is a SingleTag" color="#ffffff" backgroundColor="var(--primary-color)" />
      <SingleTag label="This is a SingleTag" color="#ffffff" backgroundColor="var(--primary-color-dark)" />
    </div>
    `,
  methods: {},
})
MultipleSingleTagWithContent.storyName = 'Multiple SingleTag With Content'
