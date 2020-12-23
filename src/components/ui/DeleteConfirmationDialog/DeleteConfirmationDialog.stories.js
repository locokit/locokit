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
