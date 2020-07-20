import Markdown from './Markdown'

export default {
  title: 'Markdown',
  component: Markdown
}

export const MarkdownStoryWithoutProps = () => ({
  components: { Markdown },
  template: '<Markdown />'
})

MarkdownStoryWithoutProps.storyName = 'Markdown without props'

export const MarkdownStoryWithProps = () => ({
  components: { Markdown },
  data () {
    return {
      block: {
        type: 'Markdown',
        text: 'Futur Markdown'
      }
    }
  },
  template: '<Markdown :block="block" />'
})

MarkdownStoryWithProps.storyName = 'Markdown with props'
