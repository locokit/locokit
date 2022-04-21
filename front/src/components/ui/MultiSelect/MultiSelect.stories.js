import LckMultiSelect from './MultiSelect'
import StoryRouter from '../../../../.storybook/storyRouterDecorator.js'

export default {
  title: 'components/ui/MultiSelect',
  component: LckMultiSelect,
}

export const defaultStory = () => ({
  components: { LckMultiSelect },
  template: '<LckMultiSelect />',
  methods: {},
})
defaultStory.storyName = 'default'

const suggestions = [{
  label: 'Option one',
  value: '1',
  color: '#484848',
  backgroundColor: '#fffbc2',
}, {
  label: 'Option two',
  value: '2',
  color: '#484848',
  backgroundColor: '#ffedc3',
}, {
  label: 'Option three',
  value: '3',
  color: '#484848',
  backgroundColor: '#ffe1d2',
}]

export const withSuggestions = () => ({
  components: { LckMultiSelect },
  data () {
    return {
      options: suggestions,
      multiselectModel: null,
    }
  },
  template: `
    <LckMultiSelect
      ref="ms"
      :options="options"
      v-model="multiselectModel"
      optionLabel="label"
      optionValue="value"
    />
  `,
  decorators: [StoryRouter],
  async mounted () {
    await this.$refs.ms.$el.click()
  },
})

withSuggestions.storyName = 'with suggestions'
withSuggestions.args = {
  waitForSelector: '.p-multiselect-panel',
}
