import Page from './Page'
import { COLUMN_TYPE } from '@locokit/lck-glossary';
import Block from '@/components/visualize/Block/Block';
export default {
  title: 'views/visualize/Page',
  component: Page
}

const pageInfo = () => (
  {
    "id": "pa1",
    "text": "Nom de la page",
    "chapter_id": "ch1",
    "position": 4,
    "hidden": null,
    "containers": [
      {
        "id": "fa1",
        "text": "Container Bénéficiaires Assistance page en construction",
        "settings": null,
        "page_id": "pa1",
        "position": null,
        "blocks": [
          {
            "id": "ba1",
            "title": null,
            "position": null,
            "type": "Markdown",
            "settings": {
              "content": "Le contenu du markdown"
            },
            "container_id": "fa1"
          }
        ]
      },
      {
        "id": "cont1",
        "text": "Container Bénéficiaires",
        "settings": null,
        "page_id": "pa1",
        "position": null,
        "blocks": [
          {
            "id": "bl1",
            "title": null,
            "position": null,
            "type": "Media",
            "settings": {
              "medias": [
                {
                  "name": "Page en construction",
                  "type": "image",
                  "srcURL": "/img/page-construction-vlogistique.png"
                }
              ],
              "displayMode": "image"
            },
            "container_id": "cont1"
          }
        ]
      }
    ]
  }
)

export const pageWithBlock = () => (
  {
    components: { pageInfo },
    data () {
      return {
        page: pageInfo()
      }
    },
    template: '<Page :page="page" />'
  }
)

export const defaultStory = () => ({
  component: { Page },
  template: '<Page />'
})

defaultStory.storyName = 'default'
defaultStory.parameters = { storyshots: { disable: true } }

