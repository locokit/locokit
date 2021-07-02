import PageDialog from './PageDialog.vue'

export default {
  title: 'components/visualize/PageDialog',
  component: PageDialog,
}

export const pageCreateStory = () => ({
  components: { PageDialog },
  template: '<PageDialog :visible="true" />',
})

pageCreateStory.storyName = 'page create'
pageCreateStory.args = {
  waitForSelector: '.p-dialog',
}

export const pageEdit = () => ({
  components: { PageDialog },
  data () {
    return {
      page: {
        id: 1,
        text: 'Page name',
        hidden: true,
      },
    }
  },
  template: '<PageDialog :visible="true" :page="page" />',
})

pageEdit.storyName = 'page edit'
pageEdit.args = {
  waitForSelector: '.p-dialog',
}
