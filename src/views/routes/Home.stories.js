import Home from './Home'
export default {
  title: 'views/routes/Home',
  component: Home
}

export const HomeStory = () => ({
  components: { Home },
  template: '<Home />'
})

HomeStory.storyName = 'default'
