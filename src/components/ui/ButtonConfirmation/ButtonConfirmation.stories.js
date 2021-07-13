/* eslint-disable @typescript-eslint/camelcase */
import ButtonConfirmation from './ButtonConfirmation'

export default {
  title: 'components/ui/ButtonConfirmation',
  component: ButtonConfirmation,
}

export const defaultStory = () => (
  {
    components: {
      ButtonConfirmation,
    },
    template: '<ButtonConfirmation />',
  }
)

defaultStory.storyName = 'default'

export const withClassStory = () => (
  {
    components: {
      ButtonConfirmation,
    },
    template: `<ButtonConfirmation
      first-level-icon="pi pi-trash"
      second-level-icon="pi pi-exclamation-circle"

      first-level-class="p-button-rounded p-button-danger p-button-text"
      second-level-class="p-button-rounded p-button-danger p-button-plain"

      first-level-tooltip="Click to delete an item"
      second-level-tooltip="Confirm to delete !"
    />`,
  }
)

defaultStory.storyName = 'with icon + class + tooltip'
