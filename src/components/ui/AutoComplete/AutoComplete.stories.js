import AutoComplete from './AutoComplete'
// import { action } from '@storybook/addon-actions'

export default {
  title: 'AutoComplete',
  component: AutoComplete
}

export const AutoCompleteStory = () => ({
  components: { AutoComplete },
  template: '<AutoComplete />',
  methods: { }
})

const suggestions = [{
  label: 'One suggestion',
  value: 1
}, {
  label: 'Two suggestion',
  value: 2
}, {
  label: 'Three suggestion',
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
  // render () {
  //   return <AutoComplete
  //     vModel={this.autocompleteModel}
  //     suggestions={this.suggestions}
  //     vOn:search={this.searchItems}
  //   />
  // },
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
