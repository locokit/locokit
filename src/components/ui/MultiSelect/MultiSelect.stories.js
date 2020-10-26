import LCKMultiSelect from './MultiSelect'

export default {
  title: 'MultiSelect',
  component: LCKMultiSelect
}

export const MultiSelectStory = () => ({
  components: { LCKMultiSelect },
  template: '<LCKMultiSelect />',
  methods: {}
})

const suggestions = [{
  label: 'Suggestion one',
  value: 1
}, {
  label: 'Suggestion two',
  value: 2
}, {
  label: 'Suggestion three',
  value: 3
}]

export const MultiSelectStoryWithSuggestions = () => ({
  components: { LCKMultiSelect },
  data () {
    return {
      options: suggestions,
      multiselectModel: null
    }
  },
  template: `
    <LCKMultiSelect
      :options="options"
      :filter="true"
      v-model="multiselectModel"
      optionLabel="label"
    />
  `
})

MultiSelectStory.storyName = 'MultiSelect'
