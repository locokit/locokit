import Paragraph from './Paragraph'

export default {
  title: 'components/visualize/Paragraph',
  component: Paragraph
}

export const ParagraphStoryWithProps = () => ({
  components: { Paragraph },
  data () {
    return {
      block: {
        type: 'Paragraph',
        title: 'Titre',
        settings: {
          content: 'Je suis un texte.'
        }
      }
    }
  },
  template: '<Paragraph :block="block" />'
})

ParagraphStoryWithProps.storyName = 'Paragraph with props'
