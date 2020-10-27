import Markdown from './Markdown'

export default {
  title: 'components/visualize/Markdown',
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
        title: 'Futur Markdown',
        settings: {
          content: 'This is the content.'
        }
      }
    }
  },
  template: '<Markdown :block="block" />'
})

MarkdownStoryWithProps.storyName = 'Markdown with props'
