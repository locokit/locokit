/* eslint-disable @typescript-eslint/camelcase */
import Page from './Page'

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
      text: 'Container 1',
      settings: null,
      page_id: 'pa1',
      position: null,
      blocks: [
        {
          id: 'ba1',
          position: null,
          type: 'Markdown',
          title: 'Markdown block title',
          settings: {
            content: `
# This is the title

## And the subtitle

This is the content.

We can write in *italic*, **bold**, and ***both***.
`
          },
          container_id: 'fa1'
        },
        {
          id: 'ba2',
          position: null,
          type: 'Markdown',
          title: 'Markdown block title',
          settings: {
            content: `
# This is the title

## And the subtitle

This is the content.

We can write in *italic*, **bold**, and ***both***.
`
          },
          container_id: 'fa1'
        },
        {
          id: 'ba3',
          position: null,
          type: 'Markdown',
          title: 'Markdown block title',
          settings: {
            content: `
# This is the title

## And the subtitle

This is the content.

We can write in *italic*, **bold**, and ***both***.
`
          },
          container_id: 'fa1'
        }
      ]
    },
    {
      id: 'cont1',
      text: 'Container 2',
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
                srcURL: './themes/locokit/img/logokit-grayscale.png'
              }
            ],
            displayMode: 'image'
          },
          container_id: 'cont1'
        },
        {
          id: 'bl2',
          position: null,
          type: 'Markdown',
          title: 'Markdown block title',
          settings: {
            content: `
# This is the title

## And the subtitle

This is the content.

We can write in *italic*, **bold**, and ***both***.
`
          },
          container_id: 'fa2'
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
        workspaceId: 'uuid-workspace',
        groupId: 'uuid-group',
        pageId: 'pa1'
      }
    },
    template: '<Page :chapters="chapters" :pageId="pageId" :workspaceId="workspaceId" :groupId="groupId" :editMode=true />'
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
pageWithBlock.storyName = 'with some blocks, default layout'

export const pageWithBlockCentered = () => (
  {
    components: { Page },
    data () {
      return {
        chapters: chapterInfo,
        workspaceId: 'uuid-workspace',
        groupId: 'uuid-group',
        pageId: 'pa1',
        layout: 'centered'
      }
    },
    template: '<Page :chapters="chapters" :pageId="pageId" :workspaceId="workspaceId" :groupId="groupId" :layout="layout"/>'
  }
)

pageWithBlockCentered.parameters = {
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
pageWithBlockCentered.storyName = 'with some blocks, centered layout'

export const pageWithBlockFlex = () => (
  {
    components: { Page },
    data () {
      return {
        chapters: chapterInfo,
        workspaceId: 'uuid-workspace',
        groupId: 'uuid-group',
        pageId: 'pa1',
        layout: 'flex'
      }
    },
    template: '<Page :chapters="chapters" :pageId="pageId" :workspaceId="workspaceId" :groupId="groupId" :layout="layout"/>'
  }
)

pageWithBlockFlex.parameters = {
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

pageWithBlockFlex.storyName = 'with some blocks, flex layout'
