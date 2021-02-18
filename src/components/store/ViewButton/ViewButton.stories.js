import ViewButton from './ViewButton'

export default {
  title: 'components/store/View/ViewButton',
  component: ViewButton
}

export const defaultStory = () => (
  {
    components: { ViewButton },
    template: '<ViewButton />'
  }
)

defaultStory.storyName = 'default'

export const overlayOpenedStory = () => (
  {
    components: { ViewButton },
    template: '<ViewButton ref="vb" />',
    mounted () {
      this.$refs.vb.$el.querySelector('button').click()
    }
  }
)

overlayOpenedStory.storyName = 'overlay opened'
overlayOpenedStory.args = { timeoutBeforeScreenshot: 2000 }

export const overlayOpenedStoryWithViews = () => (
  {
    components: { ViewButton },
    data () {
      return {
        views: [{
          id: 1,
          text: 'First view'
        }, {
          id: 2,
          text: 'Second view'
        }, {
          id: 3,
          text: 'Second view',
          locked: true
        }],
        value: '1'
      }
    },
    template: '<ViewButton ref="vb" :views="views" v-model="value" />',
    mounted () {
      this.$refs.vb.$el.querySelector('button').click()
    }
  }
)

overlayOpenedStoryWithViews.storyName = 'overlay opened with views'
overlayOpenedStoryWithViews.args = { timeoutBeforeScreenshot: 2000 }
