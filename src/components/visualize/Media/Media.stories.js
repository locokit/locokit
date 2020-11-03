import Media from './Media'
export default {
  title: 'components/visualize/Media',
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
            srcURL: './img/page-construction-vlogistique.png',
            type: 'image'
          }]
        }
      }
    }
  },
  template: '<Media v-bind="{...block}" />'
})

MediaStoryWithProps.storyName = 'Media with props'
