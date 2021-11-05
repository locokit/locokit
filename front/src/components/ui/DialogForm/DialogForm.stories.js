import DialogForm from './DialogForm'

export default {
  title: 'components/ui/DialogForm',
  component: DialogForm,
}

export const defaultStory = () => (
  {
    components: { DialogForm },
    template: '<DialogForm :visible="true" />',
  }
)

defaultStory.storyName = 'default'
defaultStory.args = {
  waitForSelector: '.p-dialog.p-component',

}

export const withHeaderAndContent = () => (
  {
    components: { DialogForm },
    data () {
      return {
        currentData: {
          id: 1,
          text: 'Hello world',
        },
      }
    },
    template: `
      <DialogForm
        :visible="true"
        header="This is the header"
      >
        <div class="p-field">
          <label for="example"> Input Label</label>
          <input
            id="example"
            name="example"
            type="text"
          />
        </div>
      </DialogForm>
    `,
  }
)

withHeaderAndContent.storyName = 'with header and content'
withHeaderAndContent.args = {
  waitForSelector: '.p-dialog.p-component',
}

export const withHeaderContentAndActions = () => (
  {
    components: { DialogForm },
    data () {
      return {
        currentData: {
          id: 1,
          text: 'Hello world',
        },
      }
    },
    template: `
      <DialogForm
        :visible="true"
        :isActionForm="true"
        header="This is the header"
      >
        <div class="p-field">
          <label for="example"> Input Label</label>
          <input
            id="example"
            name="example"
            type="text"
          />
        </div>
      </DialogForm>
    `,
  }
)

withHeaderContentAndActions.storyName = 'with header, content and actions'
withHeaderContentAndActions.args = {
  waitForSelector: '.p-dialog.p-component',
}
