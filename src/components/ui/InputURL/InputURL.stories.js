import InputURL from './InputURL'

export default {
  title: 'components/ui/InputURL',
  component: InputURL
}

export const defaultStory = () => ({
  components: { InputURL },
  template: '<InputURL />'
})
defaultStory.storyName = 'default'

export const validURLStory = () => ({
  components: { InputURL },
  data () {
    return {
      value: 'https://www.makina-corpus.com'
    }
  },
  template: `
    <InputURL
      :value="value"
    />
  `
})

validURLStory.storyName = 'with a valid url'

export const invalidURLStory = () => ({
  components: { InputURL },
  data () {
    return {
      value: 'www.makina-corpus.com'
    }
  },
  template: `
    <InputURL
      :value="value"
    />
  `
})

invalidURLStory.storyName = 'with an invalid url'
