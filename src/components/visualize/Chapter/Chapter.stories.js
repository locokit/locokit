import Chapter from './Chapter'

export default {
  title: 'Chapter',
  component: Chapter
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

export const ChapterStoryWithoutProps = () => ({
  components: { Chapter },
  template: '<Chapter />'
})

ChapterStoryWithoutProps.storyName = 'Chapter without props'

export const ChapterStoryWithProps = () => ({
  components: { Chapter },
  data () {
    return {
      chapters
    }
  },
  template: '<Chapter :chapters="chapters" />'
})

ChapterStoryWithProps.storyName = 'Chapter with props'
