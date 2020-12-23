import Chapter from './Chapter'

export default {
  title: 'components/visualize/Chapter',
  component: Chapter
}

export const defaultStory = () => ({
  components: { Chapter },
  template: '<Chapter :visible="true" />'
})

defaultStory.storyName = 'chapter create'

export const chapterEdit = () => ({
  components: { Chapter },
  data () {
    return {
      chapter: {
        id: 1,
        text: 'Chapter name'
      }
    }
  },
  template: '<Chapter :visible="true" :value="chapter" />'
})

chapterEdit.storyName = 'chapter edit'
