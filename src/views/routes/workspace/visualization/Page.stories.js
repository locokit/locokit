import Page from './Page'
import { lckHelpers } from '@/services/lck-api'

export default {
  title: 'views/visualize/Page',
  component: Page
}

const chapterInfo = [
  {
    id: 'ch1',
    text: 'Fournisseur',
    createdAt: '2020-10-14T13:38:58.355Z',
    updatedAt: '2020-10-14T13:38:58.355Z',
    workspace_id: 'ws1',
    pages: [
      {
        id: 'pa1',
        text: 'Demandes',
        createdAt: '2020-10-14T13:38:58.355Z',
        updatedAt: '2020-10-14T13:38:58.355Z',
        chapter_id: 'ch1',
        position: null,
        hidden: null
      }
    ]
  }
]

const pageInfo = {
  id: 'pa1',
  text: 'Nom de la page',
  chapter_id: 'ch1',
  position: 4,
  hidden: null,
  containers: [
    {
      id: 'fa1',
      text: 'Container Bénéficiaires Assistance page en construction',
      settings: null,
      page_id: 'pa1',
      position: null,
      blocks: [
        {
          id: 'ba1',
          title: null,
          position: null,
          type: 'Markdown',
          settings: {
            content: 'Le contenu du markdown'
          },
          container_id: 'fa1'
        }
      ]
    },
    {
      id: 'cont1',
      text: 'Container Bénéficiaires',
      settings: null,
      page_id: 'pa1',
      position: null,
      blocks: [
        {
          id: 'bl1',
          title: null,
          position: null,
          type: 'Media',
          settings: {
            medias: [
              {
                name: 'Page en construction',
                type: 'image',
                srcURL: '/img/page-construction-vlogistique.png'
              }
            ],
            displayMode: 'image'
          },
          container_id: 'cont1'
        }
      ]
    }
  ]
}

export const defaultStory = () => ({
  component: { Page },
  template: '<Page />'
})

defaultStory.storyName = 'default'
defaultStory.parameters = { storyshots: { disable: true } }

export const pageWithBlock = () => (
  {
    components: { Page },
    data () {
      return {
        chapters: chapterInfo,
        pageId: 'pa1'
      }
    },
    template: '<Page :chapters="chapters" :pageId="pageId" :editMode=true />'
  }
)
pageWithBlock.parameters = {
  lckServices: {
    page: {
      get () {
        return new Promise(resolve => {
          resolve(pageInfo)
        })
      }
    }
  }
}
