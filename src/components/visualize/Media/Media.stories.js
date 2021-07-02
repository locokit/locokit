import Media from './Media'
export default {
  title: 'components/visualize/Media',
  component: Media,
}

export const withPropsStory = () => ({
  components: { Media },
  data () {
    return {
      block: {
        type: 'Media',
        title: 'Title',
        settings: {
          displayMode: 'image',
          medias: [{
            name: 'Image',
            srcURL: './themes/locokit/img/logokit-grayscale.png',
            type: 'image',
          }],
        },
      },
    }
  },
  template: '<Media v-bind="{...block}" />',
})

withPropsStory.storyName = 'with props'
