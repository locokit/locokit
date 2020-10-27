import AutoComplete from './AutoComplete'
// import { action } from '@storybook/addon-actions'

export default {
  title: 'components/ui/AutoComplete',
  component: AutoComplete
}

export const AutoCompleteStory = () => ({
  components: { AutoComplete },
  template: '<AutoComplete />',
  methods: { }
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

export const AutoCompleteStoryWithSuggestionsAndDropdownOpened = () => ({
  components: { AutoComplete },
  data () {
    return {
      suggestions: [],
      autocompleteModel: null
    }
  },
  template: `
    <AutoComplete
      ref="ac"
      :suggestions="suggestions"
      v-model="autocompleteModel"
      @search="searchItems"
    />
  `,
  methods: {
    searchItems () {
      this.suggestions = [...suggestions]
    }
  },
  mounted () {
    this.$refs.ac.$el.querySelector('button').click()
  }
})

AutoCompleteStory.storyName = 'AutoComplete'
