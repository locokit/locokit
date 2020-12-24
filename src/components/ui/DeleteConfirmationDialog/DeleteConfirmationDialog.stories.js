import DeleteConfirmationDialog from './DeleteConfirmationDialog'

export default {
  title: 'components/visualize/DeleteConfirmationDialog',
  component: DeleteConfirmationDialog
}

export const defaultStory = () => ({
  components: { DeleteConfirmationDialog },
  template: '<DeleteConfirmationDialog :visible="true" :value="{}" />'
})

defaultStory.storyName = 'default'
defaultStory.args = { timeoutBeforeScreenshot: 800 }

export const withElementName = () => ({
  components: { DeleteConfirmationDialog },
  data () {
    return {
      book: { text: 'Book name' }
    }
  },
  template: '<DeleteConfirmationDialog :visible="true" :value="book"/>'
})

withElementName.storyName = 'with a name'
withElementName.args = { timeoutBeforeScreenshot: 800 }

export const withElementNameAndCategory = () => ({
  components: { DeleteConfirmationDialog },
  data () {
    return {
      book: { text: 'Book name' }
    }
  },
  template: '<DeleteConfirmationDialog itemCategory="book" :visible="true" :value="book"/>'
})

withElementNameAndCategory.storyName = 'with a name and a category'
withElementNameAndCategory.args = { timeoutBeforeScreenshot: 800 }
