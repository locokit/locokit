import Header from './Header'

export default {
  title: 'Header',
  component: Header
}
export const HeaderBasicStory = () => ({
  components: { Header },
  template: '<Header />'
})

HeaderBasicStory.storyName = 'Header base'
