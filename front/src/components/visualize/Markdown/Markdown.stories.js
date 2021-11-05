import Markdown from './Markdown'

export default {
  title: 'components/visualize/Markdown',
  component: Markdown,
}

export const defaultStory = () => ({
  components: { Markdown },
  data () {
    return {
      block: {
        type: 'Markdown',
        title: 'Futur Markdown',
        settings: {
          content: 'This is the content.',
        },
      },
    }
  },
  template: '<Markdown v-bind="{...block}" />',
})

defaultStory.storyName = 'default'

export const markdownDemonstration = () => ({
  components: { Markdown },
  data () {
    return {
      block: {
        type: 'Markdown',
        title: 'Futur Markdown',
        settings: {
          content: `
# This is the title

## And the subtitle

This is the content.

We can write in *italic*, **bold**, and ***both***.

|Head 1|Head2|
|------|-----|
|And with table | too |
`,
        },
      },
    }
  },
  template: '<Markdown v-bind="{...block}" />',
})

markdownDemonstration.storyName = 'with a markdown demo'
