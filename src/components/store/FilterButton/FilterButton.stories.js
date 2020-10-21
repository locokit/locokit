import FilterButton from './FilterButton'

export default {
  title: 'FilterButton',
  component: FilterButton
}

export const defaultStory = () => (
  {
    components: { FilterButton },
    template: '<FilterButton />'
  }
)

defaultStory.storyName = 'default'

export const overlayOpenedStory = () => (
  {
    components: { FilterButton },
    template: '<FilterButton ref="fb" />',
    async mounted () {
      this.$refs.fb.$el.querySelector('button').click()
      setTimeout(() => {
        document.querySelector('.pi.pi-plus-circle').parentElement.click()
        document.querySelector('.pi.pi-plus-circle').parentElement.click()
      }, 500)
    }
  }
)

overlayOpenedStory.storyName = 'overlay opened'
