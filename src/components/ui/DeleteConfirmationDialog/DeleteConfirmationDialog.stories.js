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
defaultStory.args = {
  waitForSelector: '.p-dialog'
}

export const submittingStory = () => ({
  components: { DeleteConfirmationDialog },
  template: '<DeleteConfirmationDialog :submitting="true" :visible="true" :value="{}" />'
})

submittingStory.storyName = 'on submitting'
submittingStory.args = {
  waitForSelector: '.p-dialog'
}

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
withElementName.args = {
  waitForSelector: '.p-dialog'
}

export const withElementNameAndCategory = () => ({
  components: { DeleteConfirmationDialog },
  data () {
    return {
      book: { title: 'Book name' }
    }
  },
  template: '<DeleteConfirmationDialog itemCategory="book" :visible="true" :value="book" fieldToDisplay="title" />'
})

withElementNameAndCategory.storyName = 'with a name and a category'
withElementNameAndCategory.args = {
  waitForSelector: '.p-dialog'
}
