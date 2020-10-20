import Error from './Error'
// import { action } from '@storybook/addon-actions'

export default {
  title: 'components/ui/Error',
  component: Error
}

export const defaultStory = () => ({
  components: { Error },
  template: '<Error />'
})

defaultStory.storyName = 'default'
