import LckMultiSelect from './MultiSelect'

export default {
  title: 'components/ui/MultiSelect',
  component: LckMultiSelect
}

export const defaultStory = () => ({
  components: { LckMultiSelect },
  template: '<LckMultiSelect />',
  methods: {}
})
defaultStory.storyName = 'default'

const suggestions = [{
  label: 'Option one',
  value: 1
}, {
  label: 'Option two',
  value: 2
}, {
  label: 'Option three',
  value: 3
}]

export const withSuggestions = () => ({
  components: { LckMultiSelect },
  data () {
    return {
      options: suggestions,
      multiselectModel: null
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
  mounted () {
    this.$refs.ms.$el.click()
  }
})

withSuggestions.storyName = 'with suggestions'
withSuggestions.args = { timeoutBeforeScreenshot: 1000 }
