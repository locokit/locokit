import Paragraph from './Paragraph'

export default {
  title: 'components/visualize/Paragraph',
  component: Paragraph,
}

export const withPropsStory = () => ({
  components: { Paragraph },
  data () {
    return {
      block: {
        type: 'Paragraph',
        title: 'Titre',
        settings: {
          content: 'I am a paragraph.',
        },
      },
    }
  },
  template: '<Paragraph v-bind="{...block}" />',
})

withPropsStory.storyName = 'with props'

export const withoutContentStory = () => ({
  components: { Paragraph },
  data () {
    return {
      block: {
        type: 'Paragraph',
        title: 'Titre',
      },
    }
  },
  template: '<Paragraph :block="block" />',
})

withoutContentStory.storyName = 'without content'
