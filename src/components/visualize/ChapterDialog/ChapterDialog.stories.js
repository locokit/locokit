import ChapterDialog from './ChapterDialog.vue'

export default {
  title: 'components/visualize/ChapterDialog',
  component: ChapterDialog
}

export const chapterCreate = () => ({
  components: { ChapterDialog },
  template: '<ChapterDialog :visible="true" />'
})

chapterCreate.storyName = 'chapter create'
chapterCreate.args = {
  waitForSelector: '.p-dialog.p-component'
}

export const chapterEdit = () => ({
  components: { ChapterDialog },
  data () {
    return {
      chapter: {
        id: 1,
        text: 'Chapter name'
      }
    }
  },
  template: '<ChapterDialog :visible="true" :chapter="chapter" />'
})

chapterEdit.storyName = 'chapter edit'
chapterEdit.args = {
  waitForSelector: '.p-dialog.p-component'
}
