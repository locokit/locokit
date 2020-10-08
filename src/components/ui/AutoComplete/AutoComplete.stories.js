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

AutoCompleteStory.storyName = 'AutoComplete'
