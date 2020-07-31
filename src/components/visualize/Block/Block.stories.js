import Block from './Block'

export default {
  title: 'Block',
  component: Block
}
export const BlockStoryWithoutProps = () => (
  {
    components: { Block },
    template: '<Block />'
  }
)

BlockStoryWithoutProps.storyName = 'Block without props'

/* eslint-disable @typescript-eslint/camelcase */
const blockTableView = {
  id: 1,
  title: 'My TableView\'s block',
  type: 'TableView',
  definition: {
    text: 'Ensemble des vélos',
    table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
    columns: [
      {
        text: 'Nom du vélo',
        data: {},
        id: 'e065323c-1151-447f-be0f-6d2728117b38',
        settings: null,
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
        column_type_id: 3,
        order: null,
        filter: null,
        visible: true,
        type: {
          text: 'String',
          id: 3
        }
      }, {
        text: 'État du vélo',
        data: {},
        id: '3a659ea1-446f-4755-8db9-583a204279cc',
        settings: {
          values: {
            1: {
              color: '#ef1',
              label: 'En maintenance'

            },
            2: {
              color: '#ef1',
              label: 'En utilisation'

            },
            3: {
              color: '#ef1',
              label: 'Stocké'

            }
          }
        },
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
        column_type_id: 9,
        order: null,
        filter: null,
        visible: true,
        type: {
          text: 'Single select',
          id: 9
        }
      }, {
        text: 'Fournisseur',
        data: {},
        id: 'bde4bbbd-2584-447f-acff-f434f53619da',
        settings: null,
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
        column_type_id: 5,
        order: null,
        filter: null,
        visible: true,
        type: {
          text: 'User',
          id: 5
        }
      }
    ]
  },
  content: {
    total: 2,
    limit: 10,
    data: [
      {
        text: 'Vélo n° 42',
        data: {
          '3a659ea1-446f-4755-8db9-583a204279cc': 1,
          'bde4bbbd-2584-447f-acff-f434f53619da': {
            value: 'AMSTERDAMAIR',
            reference: 4

          },
          'e065323c-1151-447f-be0f-6d2728117b38': 'Trek'

        },
        id: '38ed19db-588d-4ca1-8ab3-c8b17d60db2d',
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf'
      }, {
        text: 'Vélo n° YYYY',
        data: {
          '3a659ea1-446f-4755-8db9-583a204279cc': 2,
          'bde4bbbd-2584-447f-acff-f434f53619da': {
            value: 'CYCLABLE ENTREPRISE',
            reference: 3

          },
          'e065323c-1151-447f-be0f-6d2728117b38': 'Btwin'

        },
        id: 'cd57a998-1775-4d13-b493-2cbdf7c54e4c',
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf'
      }
    ]
  }
}
/* eslint-enable @typescript-eslint/camelcase */

export const BlockTableViewStory = () => (
  {
    components: { Block },
    data () {
      return {
        block: blockTableView
      }
    },
    template: '<Block :block="block" />'
  }
)

BlockTableViewStory.storyName = 'Block with TableView'

export const BlockParagraphStory = () => (
  {
    components: { Block },
    data () {
      return {
        block: {
          type: 'Paragraph',
          title: 'Titre',
          settings: {
            content: 'Je suis un texte.'
          }
        }
      }
    },
    template: '<Block :block="block" />'
  }
)

BlockParagraphStory.storyName = 'Block with Paragraph (Text)'

export const BlockMarkownStory = () => (
  {
    components: { Block },
    data () {
      return {
        block: {
          type: 'Markdown',
          title: 'Futur Markdown',
          settings: {
            content: "En cours d'implémentation"
          }
        }
      }
    },
    template: '<Block :block="block" />'
  }
)

BlockMarkownStory.storyName = 'Block with Markdown'

export const BlockTypeNotKnownStory = () => (
  {
    components: { Block },
    data () {
      return {
        block: {
          type: 'NotKnown',
          title: 'Not Known'
        }
      }
    },
    template: '<Block :block="block" />'
  }
)

BlockTypeNotKnownStory.storyName = 'Block with unknown type'
