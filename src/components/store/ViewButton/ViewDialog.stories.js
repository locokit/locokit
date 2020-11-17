import ViewDialog from './ViewDialog'

export default {
  title: 'components/store/View/ViewDialog',
  component: ViewDialog
}

export const defaultStory = () => (
  {
    components: { ViewDialog },
    template: '<ViewDialog :visible="true"/>'
  }
)

defaultStory.storyName = 'default'
defaultStory.args = { timeoutBeforeScreenshot: 1000 }

export const updateStory = () => (
  {
    components: { ViewDialog },
    data () {
      return {
        currentData: {
          id: 1,
          text: 'Hello world'
        }
      }
    },
    template: `
      <ViewDialog
        :visible="true"
        :value="currentData"
      />
    `
  }
)

updateStory.storyName = 'update view'
updateStory.args = { timeoutBeforeScreenshot: 1000 }
