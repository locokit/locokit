import Sidebar from './Sidebar'
import StoryRouter from 'storybook-vue-router'

export default {
  title: 'Sidebar',
  component: Sidebar,
  decorators: [
    StoryRouter()
  ]
}

const chapters = [{
  id: 1,
  text: 'Premier chapitre',
  pages: [{
    id: 1,
    text: 'Première page'
  }, {
    id: 2,
    text: 'Deuxième page'
  }]
}, {
  id: 2,
  text: 'Deuxième chapitre',
  pages: [{
    id: 3,
    text: 'Troisième page'
  }, {
    id: 4,
    text: 'Quatrième page'
  }]
}]

export const ChaptersStoryWithoutProps = () => ({
  components: { Sidebar },
  template: '<Sidebar />'
})

ChaptersStoryWithoutProps.storyName = 'Sidebar without props chapters'

export const ChaptersStoryWithProps = () => ({
  components: { Sidebar },
  data () {
    return {
      chapters
    }
  },
  template: '<Sidebar :chapters="chapters" />'
})

ChaptersStoryWithProps.storyName = 'Sidebar with props chapters'
