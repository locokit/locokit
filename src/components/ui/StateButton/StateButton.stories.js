/* eslint-disable @typescript-eslint/camelcase */
import StateButton from './StateButton'

export default {
  title: 'components/ui/StateButton',
  component: StateButton,
}

export const withClassesIconAndTitleStory = () => (
  {
    components: {
      StateButton,
    },
    template: `
      <StateButton
        icon="pi pi-envelope"
        title="Send an email"
        classes="p-border-success p-bg-success"
      />
    `,
  }
)

withClassesIconAndTitleStory.storyName = 'with classes, icon and title'

export const disabledStory = () => (
  {
    components: {
      StateButton,
    },
    template: `
      <StateButton
        icon="pi pi-envelope"
        title="Send an email"
        :disabled="true"
      />
    `,
  }
)

disabledStory.storyName = 'when disabled'

export const loadingStory = () => (
  {
    components: {
      StateButton,
    },
    template: `
      <StateButton
        icon="pi pi-envelope"
        title="Send an email"
        :loading="true"
      />
    `,
  }
)

loadingStory.storyName = 'during loading'

export const errorStory = () => (
  {
    components: {
      StateButton,
    },
    data () {
      return {
        error: new Error('An error to display'),
      }
    },
    template: `
      <StateButton
        icon="pi pi-envelope"
        title="Send an email"
        class="p-invalid"
        :error="error"
      />
    `,
  }
)

errorStory.storyName = 'with an error'
