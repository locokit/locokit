import Dialog from './Dialog'

export default {
  title: 'components/ui/Dialog',
  component: Dialog
}

export const defaultStory = () => (
  {
    components: { Dialog },
    template: '<Dialog :visible="true" />'
  }
)

defaultStory.storyName = 'default'
defaultStory.args = {
  timeoutBeforeScreenshot: 2000
}

export const withHeaderAndContent = () => (
  {
    components: { Dialog },
    template: `
      <Dialog
        :visible="true"
        header="This is the header"
      >
        This is the dialog content
      </Dialog>
    `
  }
)

withHeaderAndContent.storyName = 'with header and content'
withHeaderAndContent.args = { timeoutBeforeScreenshot: 2000 }

export const withHeaderContentAndActions = () => (
  {
    components: { Dialog },
    template: `
      <Dialog
        :visible="true"
        :isActionForm="true"
        header="This is the header"
      >
        This is the dialog content
      </Dialog>
    `
  }
)

withHeaderContentAndActions.storyName = 'with header, content and actions'
withHeaderContentAndActions.args = { timeoutBeforeScreenshot: 2000 }
