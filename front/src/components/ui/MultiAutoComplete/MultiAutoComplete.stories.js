import MultiAutoComplete from './MultiAutoComplete'

export default {
  title: 'components/ui/MultiAutoComplete',
  component: MultiAutoComplete,
}

export const defaultStory = () => ({
  components: { MultiAutoComplete },
  template: '<MultiAutoComplete />',
  methods: { },
})
defaultStory.storyName = 'default'

const suggestions = [{
  label: 'Suggestion one',
  value: 1,
}, {
  label: 'Suggestion two',
  value: 2,
}, {
  label: 'Suggestion three',
  value: 3,
}]

export const withSuggestions = () => ({
  components: { MultiAutoComplete },
  data () {
    return {
      suggestions: [],
      autocompleteModel: [],
    }
  },
  template: `
    <MultiAutoComplete
      ref=multiAutoComplete
      :suggestions="suggestions"
      v-model="autocompleteModel"
      @search="searchItems"
    />
  `,
  methods: {
    searchItems () {
      this.suggestions = [...suggestions]
    },
  },
  mounted () {
    this.$refs.multiAutoComplete.$el.querySelector('input').value = 'Suggestion'
  },
})

withSuggestions.storyName = 'with suggestions'

export const singleLineWithValues = () => ({
  components: { MultiAutoComplete },
  data () {
    return {
      suggestions: [],
      autocompleteModel: [...suggestions],
    }
  },
  template: `
    <MultiAutoComplete
      ref=multiAutoComplete
      v-model="autocompleteModel"
      :suggestions="suggestions"
      @search="searchItems"
      :multiLine="false"
      style="width: 400px;"
    />
  `,
  methods: {
    searchItems () {
      this.suggestions = [...suggestions]
    },
  },
})

singleLineWithValues.storyName = 'single line with values'

export const multiLineWithValues = () => ({
  components: { MultiAutoComplete },
  data () {
    return {
      suggestions: [],
      autocompleteModel: [...suggestions],
    }
  },
  template: `
    <MultiAutoComplete
      ref=multiAutoComplete
      v-model="autocompleteModel"
      :suggestions="suggestions"
      @search="searchItems"
      :multiLine="true"
      style="width: 400px;"
    />
  `,
  methods: {
    searchItems () {
      this.suggestions = [...suggestions]
    },
  },
})

multiLineWithValues.storyName = 'multi line with values'
