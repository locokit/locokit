import Chapter from './Chapter'

export default {
  title: 'components/visualize/Chapter',
  component: Chapter
}

export const chapterCreate = () => ({
  components: { Chapter },
  template: '<Chapter :visible="true" />'
})

chapterCreate.storyName = 'chapter create'
chapterCreate.args = { timeoutBeforeScreenshot: 800 }

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
  template: '<Chapter :visible="true" :chapter="chapter" />'
})

chapterEdit.storyName = 'chapter edit'
chapterEdit.args = { timeoutBeforeScreenshot: 800 }
