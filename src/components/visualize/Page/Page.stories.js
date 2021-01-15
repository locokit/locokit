import Page from './Page'

export default {
  title: 'components/visualize/Page',
  component: Page
}

export const pageCreateStory = () => ({
  components: { Page },
  template: '<Page :visible="true" />'
})

pageCreateStory.storyName = 'page create'
pageCreateStory.args = { timeoutBeforeScreenshot: 800 }

export const pageEdit = () => ({
  components: { Page },
  data () {
    return {
      page: {
        id: 1,
        text: 'Page name',
        hidden: true
      }
    }
  },
  template: '<Page :visible="true" :page="page" />'
})

pageEdit.storyName = 'page edit'
pageEdit.args = { timeoutBeforeScreenshot: 800 }
