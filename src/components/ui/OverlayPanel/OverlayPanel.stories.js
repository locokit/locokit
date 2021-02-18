import OverlayPanel from './OverlayPanel'

export default {
  title: 'components/ui/OverlayPanel',
  component: OverlayPanel
}

export const defaultStory = () => (
  {
    components: { OverlayPanel },
    template: '<OverlayPanel />'
  }
)

defaultStory.storyName = 'default'

export const overlayOpenedStory = () => (
  {
    components: {
      'lck-overlaypanel': OverlayPanel
    },
    template: `
      <lck-overlaypanel label="Hello there" ref="op">
        <template #overlay-content>
          This is the content of the overlay panel.
        </template>
      </lck-overlaypanel>
    `,
    mounted () {
      this.$refs.op.$el.querySelector('button').click()
    }
  }
)

overlayOpenedStory.storyName = 'overlay opened'
overlayOpenedStory.args = { timeoutBeforeScreenshot: 2000 }
