/* eslint-disable @typescript-eslint/camelcase */
import Form from './Form'
import InputText from 'primevue/inputtext'

export default {
  title: 'components/ui/Form',
  component: Form
}

export const defaultStory = () => (
  {
    components: {
      Form,
      'p-input-text': InputText
    },
    data () {
      return {
        item: {
          text: 'Hello world'
        }
      }
    },
    template: `
      <Form>
        <p>
        Here we are in the slot. We add what we want.
        </p>
        <div class="p-field">
          <label for="text">
            This is a text input
          </label>
          <p-input-text
            id="text"
            type="text"
            v-model="item.text"
          />
        </div>
      </Form>
    `
  }
)

defaultStory.storyName = 'default'

export const submittingStory = () => (
  {
    components: {
      Form,
      'p-input-text': InputText
    },
    data () {
      return {
        item: {
          text: 'Hello world'
        }
      }
    },
    template: `
      <Form :submitting="true">
        <p>
        Here we are in the slot. We add what we want.
        </p>
        <div class="p-field">
          <label for="text">
            This is a text input
          </label>
          <p-input-text
            id="text"
            type="text"
            v-model="item.text"
          />
        </div>
      </Form>
    `
  }
)

submittingStory.storyName = 'submitting'

export const withoutCancelButtonStory = () => (
  {
    components: {
      Form,
      'p-input-text': InputText
    },
    data () {
      return {
        item: {
          text: 'Hello world'
        }
      }
    },
    template: `
      <Form :displayCancelButton="false">
        <p>
        Here we are in the slot. We add what we want.
        </p>
        <div class="p-field">
          <label for="text">
            This is a text input
          </label>
          <p-input-text
            id="text"
            type="text"
            v-model="item.text"
          />
        </div>
      </Form>
    `
  }
)

withoutCancelButtonStory.storyName = 'without the cancel button'

export const withLargeButtonsStory = () => (
  {
    components: {
      Form,
      'p-input-text': InputText
    },
    data () {
      return {
        item: {
          text: 'Hello world'
        }
      }
    },
    template: `
      <Form :fullWidthButton="true">
        <p>
        Here we are in the slot. We add what we want.
        </p>
        <div class="p-field">
          <label for="text">
            This is a text input
          </label>
          <p-input-text
            id="text"
            type="text"
            v-model="item.text"
          />
        </div>
      </Form>
    `
  }
)

withLargeButtonsStory.storyName = 'with large buttons'

export const disableFormStory = () => (
  {
    components: {
      Form,
      'p-input-text': InputText
    },
    data () {
      return {
        item: {
          text: 'Hello world'
        }
      }
    },
    template: `
      <Form :canSubmit="false">
        <p>
        Here we are in the slot. We add what we want.
        </p>
        <div class="p-field">
          <label for="text">
            This is a text input
          </label>
          <p-input-text
            id="text"
            type="text"
            v-model="item.text"
          />
        </div>
      </Form>
    `
  }
)

disableFormStory.storyName = 'non-submissible form'
