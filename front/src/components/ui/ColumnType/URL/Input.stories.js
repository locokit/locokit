import URLInput from './Input'

export default {
  title: 'components/ui/ColumnType/URL/Input',
  component: URLInput,
}

export const defaultStory = () => ({
  components: { URLInput },
  template: '<URLInput />',
})
defaultStory.storyName = 'default'

export const validURLStory = () => ({
  components: { URLInput },
  data () {
    return {
      value: 'https://www.makina-corpus.com',
    }
  },
  template: `
    <URLInput
      :value="value"
    />
  `,
})

validURLStory.storyName = 'with a valid url'

export const invalidURLStory = () => ({
  components: { URLInput },
  data () {
    return {
      value: 'www.makina-corpus.com',
    }
  },
  template: `
    <URLInput
      :value="value"
    />
  `,
})

invalidURLStory.storyName = 'with an invalid url'
