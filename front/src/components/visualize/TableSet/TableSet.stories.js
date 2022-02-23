import TableSet from './TableSet'
import { COLUMN_TYPE } from '@locokit/lck-glossary/src'

export default {
  title: 'components/visualize/TableSet',
  component: TableSet,
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
      displayed: true,
      type: {
        text: 'String',
        id: 3,
      },
    }, {
      text: 'État du vélo',
      data: {},
      id: '3a659ea1-446f-4755-8db9-583a204279cc',
      settings: {
        values: {
          1: {
            color: '#ef1',
            label: 'En maintenance',

          },
          2: {
            color: '#ef1',
            label: 'En utilisation',

          },
          3: {
            color: '#ef1',
            label: 'Stocké',

          },
        },
      },
      table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
      column_type_id: COLUMN_TYPE.SINGLE_SELECT,
      order: null,
      filter: null,
      displayed: true,
      type: {
        text: 'Single select',
        id: 9,
      },
    }, {
      text: 'Fournisseur',
      data: {},
      id: 'bde4bbbd-2584-447f-acff-f434f53619da',
      settings: null,
      table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
      column_type_id: COLUMN_TYPE.USER,
      order: null,
      filter: null,
      displayed: true,
      type: {
        text: 'User',
        id: 5,
      },
    },
  ],
}

const content = {
  total: 2,
  limit: 10,
  data: [
    {
      text: 'Vélo n° 42',
      data: {
        '3a659ea1-446f-4755-8db9-583a204279cc': 1,
        'bde4bbbd-2584-447f-acff-f434f53619da': {
          value: 'AMSTERDAMAIR',
          reference: 4,

        },
        'e065323c-1151-447f-be0f-6d2728117b38': 'Trek',

      },
      id: '38ed19db-588d-4ca1-8ab3-c8b17d60db2d',
      table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
    }, {
      text: 'Vélo n° YYYY',
      data: {
        '3a659ea1-446f-4755-8db9-583a204279cc': 2,
        'bde4bbbd-2584-447f-acff-f434f53619da': {
          value: 'CYCLABLE ENTREPRISE',
          reference: 3,

        },
        'e065323c-1151-447f-be0f-6d2728117b38': 'Btwin',

      },
      id: 'cd57a998-1775-4d13-b493-2cbdf7c54e4c',
      table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
    },
  ],
}

/* eslint-enable @typescript-eslint/camelcase */

export const defaultStory = () => (
  {
    components: { TableSet },
    template: '<TableSet workspaceId="w1" :userId="1" groupId="g1" />',
  }
)

defaultStory.storyName = 'default'

export const withDefinitionStory = () => (
  {
    data () {
      return {
        definition,
      }
    },
    components: { TableSet },
    template: '<TableSet :definition="definition" workspaceId="w1" :userId="1" groupId="g1"  />',
  }
)

withDefinitionStory.storyName = 'with definition'

export const withDefinitionAndContentStory = () => (
  {
    data () {
      return {
        definition,
        content,
      }
    },
    components: { TableSet },
    template: '<TableSet :definition="definition" :content="content" workspaceId="w1" :userId="1" groupId="g1" />',
  }
)

withDefinitionAndContentStory.storyName = 'with definition and content'

export const WithDefinitionAndToolbarButtonsStory = () => (
  {
    components: { TableSet },
    data () {
      return {
        definition,
      }
    },
    template: `<TableSet
      :definition="definition"
      addAllowed
      exportAllowed
      filterAllowed
      groupId="g1"
      :userId="1"
      workspaceId="w1"
      @update-suggestions="() => 1"
    />`,
  }
)

WithDefinitionAndToolbarButtonsStory.storyName = 'with definition and toolbar buttons'

export const WithDefAndContentAndToolbarButtonsStory = () => (
  {
    components: { TableSet },
    data () {
      return {
        definition,
        content,
      }
    },
    template: `<TableSet
      :definition="definition"
      :content="content"
      addAllowed
      exportAllowed
      filterAllowed
      groupId="g1"
      :userId="1"
      workspaceId="w1"
      @update-suggestions="() => 1"
    />`,
  }
)

WithDefAndContentAndToolbarButtonsStory.storyName = 'with definition and content and toolbar buttons'
