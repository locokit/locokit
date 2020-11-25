/* eslint-disable @typescript-eslint/camelcase */
import ProcessForm from './ProcessForm'

export default {
  title: 'components/store/process/ProcessForm',
  component: ProcessForm
}

export const defaultStory = () => (
  {
    components: { ProcessForm },
    data () {
      return {
        process: {
          id: 'uuid-v4-p1',
          text: 'process\'s title',
          url: 'http://myurl.com'
        }
      }
    },
    template: '<ProcessForm :process="process" />'
  }
)

defaultStory.storyName = 'default'
