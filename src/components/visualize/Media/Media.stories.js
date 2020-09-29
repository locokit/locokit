import Media from './Media'
export default {
  title: 'Media',
  component: Media
}

export const MediaStoryWithProps = () => ({
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
            srcURL: 'IAmALinkToAnImage',
            type: 'image'
          }]
        }
      }
    }
  },
  template: '<Media :block="block" />'
})

MediaStoryWithProps.storyName = 'Media with props'
