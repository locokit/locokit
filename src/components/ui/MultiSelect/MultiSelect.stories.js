import LckMultiSelect from './MultiSelect'

export default {
  title: 'components/ui/MultiSelect',
  component: LckMultiSelect
}

export const MultiSelectStory = () => ({
  components: { LckMultiSelect },
  template: '<LckMultiSelect />',
  methods: {}
})

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

export const MultiSelectStoryWithSuggestions = () => ({
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
    />
  `,
  mounted () {
    this.$refs.ms.$el.click()
  }
})

MultiSelectStory.storyName = 'MultiSelect'
