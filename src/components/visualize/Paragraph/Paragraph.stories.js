import Paragraph from './Paragraph'

export default {
  title: 'Paragraph',
  component: Paragraph
}

export const ParagraphStoryWithoutProps = () => ({
  components: { Paragraph },
  template: '<Paragraph />'
})

ParagraphStoryWithoutProps.storyName = 'Paragraph without props'

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
