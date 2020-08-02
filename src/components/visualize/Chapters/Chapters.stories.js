import Chapters from './Chapters'
import StoryRouter from 'storybook-vue-router'

export default {
  title: 'Chapters',
  component: Chapters,
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
  components: { Chapters },
  template: '<Chapters />'
})

ChaptersStoryWithoutProps.storyName = 'Chapters without props'

export const ChaptersStoryWithProps = () => ({
  components: { Chapters },
  data () {
    return {
      chapters
    }
  },
  template: '<Chapters :chapters="chapters" />'
})

ChaptersStoryWithProps.storyName = 'Chapters with props'
