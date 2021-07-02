import Home from './Home'
export default {
  title: 'views/routes/Home',
  component: Home,
}

export const defaultStory = () => ({
  components: { Home },
  template: '<Home />',
})

defaultStory.storyName = 'default'
defaultStory.parameters = { storyshots: { disable: true } }
