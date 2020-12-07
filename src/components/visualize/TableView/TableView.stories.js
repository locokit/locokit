import TableView from './TableView'
import { COLUMN_TYPE } from '@locokit/lck-glossary'

export default {
  title: 'components/visualize/TableView',
  component: TableView
}

/* eslint-disable @typescript-eslint/camelcase */
const definition = {
  text: 'Ensemble des vélos',
  table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
  columns: [
    {
      text: 'Nom du vélo',
      data: {},
      id: 'e065323c-1151-447f-be0f-6d2728117b38',
      settings: null,
      table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
      column_type_id: COLUMN_TYPE.STRING,
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
      column_type_id: COLUMN_TYPE.SINGLE_SELECT,
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
      column_type_id: COLUMN_TYPE.USER,
      order: null,
      filter: null,
      visible: true,
      type: {
        text: 'User',
        id: 5
      }
    }
  ]
}

/* eslint-enable @typescript-eslint/camelcase */

export const defaultStory = () => (
  {
    components: { TableView },
    template: '<TableView />'
  }
)

defaultStory.storyName = 'default'

export const withDefinitionStory = () => (
  {
    data () {
      return {
        definition
      }
    },
    components: { TableView },
    template: '<TableView :definition="definition" />'
  }
)

withDefinitionStory.storyName = 'with definition'

export const WithToolbarButtonsStory = () => (
  {
    components: { TableView },
    data () {
      return {
        definition
      }
    },
    template: `<TableView
      :definition="definition"
      addAllowed
      exportAllowed
      filterAllowed
      @update-suggestions="() => 1"
    />`
  }
)

WithToolbarButtonsStory.storyName = 'with definition and toolbar buttons'
