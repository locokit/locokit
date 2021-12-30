/* eslint-disable @typescript-eslint/camelcase */
import DataDetail from './DataDetail'
import { COLUMN_TYPE } from '@locokit/lck-glossary'

export default {
  title: 'components/store/DataDetail',
  component: DataDetail,
  parameters: {
    docs: {
      description: `
        This component represent the detailed presentation of data,
        for a particular row of the LCK Datatable component.
      `,
    },
  },
}

export const defaultStory = () => (
  {
    components: { 'lck-data-detail': DataDetail },
    template: '<lck-data-detail workspaceId="1" />',
  }
)

defaultStory.storyName = 'default'

const tableViewData = {
  definitionReadOnly: {
    text: 'Ensemble des vélos',
    table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
    columns: [
      {
        text: 'Nom du vélo',
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
        id: '3a659ea1-446f-4755-8db9-583a204279cc',
        settings: {
          values: {
            first: {
              color: '#ef1',
              label: 'En maintenance',
            },
            second: {
              color: '#ef1',
              label: 'En utilisation',

            },
            third: {
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
      }, {
        text: 'Date',
        id: 'b9058b15-44b7-4cd9-a121-a942b69a0434',
        settings: null,
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
        column_type_id: COLUMN_TYPE.DATE,
        order: null,
        filter: null,
        displayed: true,
      }, {
        text: 'Textarea',
        id: '413bf240-b8fb-4a5b-87eb-074bef2ee21a',
        settings: null,
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
        column_type_id: COLUMN_TYPE.TEXT,
        order: null,
        filter: null,
        displayed: true,
      },
    ],
  },
  definitionEditable: {
    text: 'Ensemble des vélos',
    table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
    columns: [
      {
        text: 'Nom du vélo',
        id: 'e065323c-1151-447f-be0f-6d2728117b38',
        settings: null,
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
        column_type_id: COLUMN_TYPE.STRING,
        order: null,
        filter: null,
        displayed: true,
        editable: true,
        type: {
          text: 'String',
          id: 3,
        },
      }, {
        text: 'État du vélo',
        id: '3a659ea1-446f-4755-8db9-583a204279cc',
        settings: {
          values: {
            first: {
              color: '#ef1',
              label: 'En maintenance',
            },
            second: {
              color: '#ef1',
              label: 'En utilisation',

            },
            third: {
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
        editable: true,
        type: {
          text: 'Single select',
          id: 9,
        },
      }, {
        text: 'Fournisseur',
        id: 'bde4bbbd-2584-447f-acff-f434f53619da',
        settings: null,
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
        column_type_id: COLUMN_TYPE.USER,
        order: null,
        filter: null,
        displayed: true,
        editable: true,
        type: {
          text: 'User',
          id: 5,
        },
      }, {
        text: 'Date',
        id: 'b9058b15-44b7-4cd9-a121-a942b69a0434',
        settings: null,
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
        column_type_id: COLUMN_TYPE.DATE,
        order: null,
        filter: null,
        displayed: true,
        editable: true,
      }, {
        text: 'Textarea',
        id: '413bf240-b8fb-4a5b-87eb-074bef2ee21a',
        settings: null,
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
        column_type_id: COLUMN_TYPE.TEXT,
        order: null,
        filter: null,
        displayed: true,
        editable: true,
      },
    ],
  },
  row: {
    text: 'Vélo n° 42',
    data: {
      '3a659ea1-446f-4755-8db9-583a204279cc': 'first',
      'b9058b15-44b7-4cd9-a121-a942b69a0434': new Date('2020-10-30'),
      'bde4bbbd-2584-447f-acff-f434f53619da': {
        value: 'AMSTERDAMAIR',
        reference: 4,

      },
      'e065323c-1151-447f-be0f-6d2728117b38': 'Trek',
      '413bf240-b8fb-4a5b-87eb-074bef2ee21a': 'Welcome at home, \nthis is a multi line text\nand it works',
      'e065323c-1151-447f-be0f-6d2728117b39': 'SRID=4326;POLYGON((1.4 45.75,2 45.6,1.9 45.3,1.4 45.75))',
    },
    id: '38ed19db-588d-4ca1-8ab3-c8b17d60db2d',
    table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
  },
}

export const withDefinitionAndRow = () => (
  {
    components: { 'lck-data-detail': DataDetail },
    data () {
      return {
        definition: tableViewData.definitionReadOnly,
        row: tableViewData.row,
      }
    },
    template: `
    <lck-data-detail
      :definition="definition"
      :row="row"
      workspaceId="1"
    />
    `,
  }
)

withDefinitionAndRow.storyName = 'with definition and row'

export const withEditableColumnsAndRow = () => (
  {
    components: { 'lck-data-detail': DataDetail },
    data () {
      return {
        definition: tableViewData.definitionEditable,
        row: tableViewData.row,
      }
    },
    template: `
    <lck-data-detail
      :definition="definition"
      :row="row"
      workspaceId="1"
    />
    `,
  }
)

withEditableColumnsAndRow.storyName = 'with editable columns and row'

export const withEditableColumnsAndRowStateSaving = () => (
  {
    components: { 'lck-data-detail': DataDetail },
    data () {
      return {
        definition: tableViewData.definitionEditable,
        row: tableViewData.row,
        cellState: {
          rowId: '38ed19db-588d-4ca1-8ab3-c8b17d60db2d',
          columnId: 'e065323c-1151-447f-be0f-6d2728117b38',
          waiting: true,
          isValid: null,
        },
      }
    },
    template: `
    <lck-data-detail
      :definition="definition"
      :row="row"
      :cellState="cellState"
      workspaceId="1"
    />
    `,
  }
)

withEditableColumnsAndRowStateSaving.storyName = 'with edit state saving'

export const withEditableColumnsAndRowStateOK = () => (
  {
    components: { 'lck-data-detail': DataDetail },
    data () {
      return {
        definition: tableViewData.definitionEditable,
        row: tableViewData.row,
        cellState: {
          rowId: '38ed19db-588d-4ca1-8ab3-c8b17d60db2d',
          columnId: 'e065323c-1151-447f-be0f-6d2728117b38',
          waiting: false,
          isValid: true,
        },
      }
    },
    template: `
    <lck-data-detail
      :definition="definition"
      :row="row"
      :cellState="cellState"
      workspaceId="1"
    />
    `,
  }
)

withEditableColumnsAndRowStateOK.storyName = 'with edit state ok'

export const withEditableColumnsAndRowStateError = () => (
  {
    components: { 'lck-data-detail': DataDetail },
    data () {
      return {
        definition: tableViewData.definitionEditable,
        row: tableViewData.row,
        cellState: {
          rowId: '38ed19db-588d-4ca1-8ab3-c8b17d60db2d',
          columnId: 'e065323c-1151-447f-be0f-6d2728117b38',
          waiting: false,
          isValid: false,
        },
      }
    },
    template: `
      <lck-data-detail
        :definition="definition"
        :row="row"
        :cellState="cellState"
        workspaceId="1"
      />
    `,
  }
)

withEditableColumnsAndRowStateError.storyName = 'with edit state error'

const singleSelectOption1UUID = '1efa77d0-c07a-4d3e-8677-2c19c6a26ecd'
const singleSelectOption2UUID = 'c1d336fb-438f-4709-963f-5f159c147781'
const singleSelectOption3UUID = '4b50ce84-2450-47d7-9409-2f319b547efd'

/* eslint-disable @typescript-eslint/camelcase */
const definitionWithLookedUpColumns = {
  text: 'Test des lookup-columns',
  table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
  columns: [
    {
      text: 'Looked_up boolean',
      id: 'e065323c-1151-447f-be0f-6d2728117b38',
      settings: {
        localField: 'a065323c-1151-447f-be0f-6d2728117b30',
        foreignField: 'd065323c-1151-447f-be0f-6d2728117b31',
      },
      table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      order: null,
      filter: null,
      displayed: true,
      parents: [
        {
          text: 'Boolean',
          id: 'd065323c-1151-447f-be0f-6d2728117b31',
          settings: null,
          table_id: '000c21e6-5339-4748-903f-8c77e21314cf',
          column_type_id: COLUMN_TYPE.BOOLEAN,
          order: null,
          filter: null,
          displayed: true,
          parents: [],
        },
      ],
    },
    {
      text: 'Looked_up string',
      id: 'e165323c-1151-447f-be0f-6d2728117b38',
      settings: {
        localField: 'a065323c-1151-447f-be0f-6d2728117b30',
        foreignField: 'd165323c-1151-447f-be0f-6d2728117b31',
      },
      table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      order: null,
      filter: null,
      displayed: true,
      parents: [
        {
          text: 'String',
          id: 'd165323c-1151-447f-be0f-6d2728117b31',
          settings: null,
          table_id: '000c21e6-5339-4748-903f-8c77e21314cf',
          column_type_id: COLUMN_TYPE.STRING,
          order: null,
          filter: null,
          displayed: true,
          parents: [],
        },
      ],
    },
    {
      text: 'Looked_up number',
      id: 'e265323c-1151-447f-be0f-6d2728117b38',
      settings: {
        localField: 'a065323c-1151-447f-be0f-6d2728117b30',
        foreignField: 'd265323c-1151-447f-be0f-6d2728117b31',
      },
      table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      order: null,
      filter: null,
      displayed: true,
      parents: [
        {
          text: 'Number',
          id: 'd265323c-1151-447f-be0f-6d2728117b31',
          settings: null,
          table_id: '000c21e6-5339-4748-903f-8c77e21314cf',
          column_type_id: COLUMN_TYPE.NUMBER,
          order: null,
          filter: null,
          displayed: true,
          parents: [],
        },
      ],
    },
    {
      text: 'Looked_up float',
      id: 'e365323c-1151-447f-be0f-6d2728117b38',
      settings: {
        localField: 'a065323c-1151-447f-be0f-6d2728117b30',
        foreignField: 'd365323c-1151-447f-be0f-6d2728117b31',
      },
      table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      order: null,
      filter: null,
      displayed: true,
      parents: [
        {
          text: 'Float',
          id: 'd365323c-1151-447f-be0f-6d2728117b31',
          settings: null,
          table_id: '000c21e6-5339-4748-903f-8c77e21314cf',
          column_type_id: COLUMN_TYPE.FLOAT,
          order: null,
          filter: null,
          displayed: true,
          parents: [],
        },
      ],
    },
    {
      text: 'Looked_up date',
      id: 'e465323c-1151-447f-be0f-6d2728117b38',
      settings: {
        localField: 'a065323c-1151-447f-be0f-6d2728117b30',
        foreignField: 'd465323c-1151-447f-be0f-6d2728117b31',
      },
      table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      order: null,
      filter: null,
      displayed: true,
      parents: [
        {
          text: 'Date',
          id: 'd465323c-1151-447f-be0f-6d2728117b31',
          settings: null,
          table_id: '000c21e6-5339-4748-903f-8c77e21314cf',
          column_type_id: COLUMN_TYPE.DATE,
          order: null,
          filter: null,
          displayed: true,
          parents: [],
        },
      ],
    },
    {
      text: 'Looked_up user',
      id: 'e565323c-1151-447f-be0f-6d2728117b38',
      settings: {
        localField: 'a065323c-1151-447f-be0f-6d2728117b30',
        foreignField: 'd565323c-1151-447f-be0f-6d2728117b31',
      },
      table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      order: null,
      filter: null,
      displayed: true,
      parents: [
        {
          text: 'User',
          id: 'd565323c-1151-447f-be0f-6d2728117b31',
          settings: null,
          table_id: '000c21e6-5339-4748-903f-8c77e21314cf',
          column_type_id: COLUMN_TYPE.USER,
          order: null,
          filter: null,
          displayed: true,
          parents: [],
        },
      ],
    },
    {
      text: 'Looked_up group',
      id: 'e665323c-1151-447f-be0f-6d2728117b38',
      settings: {
        localField: 'a065323c-1151-447f-be0f-6d2728117b30',
        foreignField: 'd665323c-1151-447f-be0f-6d2728117b31',
      },
      table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      order: null,
      filter: null,
      displayed: true,
      parents: [
        {
          text: 'Group',
          id: 'd665323c-1151-447f-be0f-6d2728117b31',
          settings: null,
          table_id: '000c21e6-5339-4748-903f-8c77e21314cf',
          column_type_id: COLUMN_TYPE.GROUP,
          order: null,
          filter: null,
          displayed: true,
          parents: [],
        },
      ],
    },
    {
      text: 'Looked_up relation between tables',
      id: 'e765323c-1151-447f-be0f-6d2728117b38',
      settings: {
        localField: 'a065323c-1151-447f-be0f-6d2728117b30',
        foreignField: 'd765323c-1151-447f-be0f-6d2728117b31',
      },
      table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      order: null,
      filter: null,
      displayed: true,
      parents: [
        {
          text: 'Relation between tables',
          id: 'd765323c-1151-447f-be0f-6d2728117b31',
          settings: null,
          table_id: '000c21e6-5339-4748-903f-8c77e21314cf',
          column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
          order: null,
          filter: null,
          displayed: true,
          parents: [],
        },
      ],
    },
    {
      text: 'Looked_up single select',
      id: 'e865323c-1151-447f-be0f-6d2728117b38',
      settings: {
        localField: 'a065323c-1151-447f-be0f-6d2728117b30',
        foreignField: 'd865323c-1151-447f-be0f-6d2728117b31',
      },
      table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      order: null,
      filter: null,
      displayed: true,
      parents: [
        {
          text: 'Single select',
          id: 'd865323c-1151-447f-be0f-6d2728117b31',
          settings: {
            values: {
              [singleSelectOption1UUID]: {
                label: 'Option 1',
                color: '#ffffff',
                backgroundColor: '#007734',
              },
              [singleSelectOption2UUID]: {
                label: 'Option 2',
                color: '#ffffff',
                backgroundColor: '#883477',
              },
              [singleSelectOption3UUID]: {
                label: 'Option 3',
                color: '#ffffff',
                backgroundColor: '#003477',
              },
            },
          },
          table_id: '000c21e6-5339-4748-903f-8c77e21314cf',
          column_type_id: COLUMN_TYPE.SINGLE_SELECT,
          order: null,
          filter: null,
          displayed: true,
          parents: [],
        },
      ],
    },
    {
      text: 'Looked_up multi select',
      id: 'e965323c-1151-447f-be0f-6d2728117b38',
      settings: {
        localField: 'a065323c-1151-447f-be0f-6d2728117b30',
        foreignField: 'd965323c-1151-447f-be0f-6d2728117b31',
      },
      table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      order: null,
      filter: null,
      displayed: true,
      parents: [
        {
          text: 'Multi select',
          id: 'd965323c-1151-447f-be0f-6d2728117b31',
          settings: {
            values: {
              [singleSelectOption1UUID]: {
                label: 'Option 1',
                value: 1,
                color: '#484848',
                backgroundColor: '#fffbc2',
              },
              [singleSelectOption2UUID]: {
                label: 'Option 2',
                value: 2,
                color: '#484848',
                backgroundColor: '#ffedc3',
              },
              [singleSelectOption3UUID]: {
                label: 'Option 3',
                value: 3,
                color: '#484848',
                backgroundColor: '#ffe1d2',
              },
            },
          },
          table_id: '000c21e6-5339-4748-903f-8c77e21314cf',
          column_type_id: COLUMN_TYPE.MULTI_SELECT,
          order: null,
          filter: null,
          displayed: true,
          parents: [],
        },
      ],
    },
    {
      text: 'Looked_up formula',
      id: 'e105323c-1151-447f-be0f-6d2728117b38',
      settings: {
        localField: 'a065323c-1151-447f-be0f-6d2728117b30',
        foreignField: 'd105323c-1151-447f-be0f-6d2728117b31',
      },
      table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      order: null,
      filter: null,
      displayed: true,
      parents: [
        {
          text: 'Formula',
          id: 'd105323c-1151-447f-be0f-6d2728117b31',
          settings: null,
          table_id: '000c21e6-5339-4748-903f-8c77e21314cf',
          column_type_id: COLUMN_TYPE.FORMULA,
          order: null,
          filter: null,
          displayed: true,
          parents: [],
        },
      ],
    },
    {
      text: 'Looked_up file',
      id: 'e115323c-1151-447f-be0f-6d2728117b38',
      settings: {
        localField: 'a065323c-1151-447f-be0f-6d2728117b30',
        foreignField: 'd115323c-1151-447f-be0f-6d2728117b31',
      },
      table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      order: null,
      filter: null,
      displayed: true,
      parents: [
        {
          text: 'File',
          id: 'd115323c-1151-447f-be0f-6d2728117b31',
          settings: null,
          table_id: '000c21e6-5339-4748-903f-8c77e21314cf',
          column_type_id: COLUMN_TYPE.FORMULA,
          order: null,
          filter: null,
          displayed: true,
          parents: [],
        },
      ],
    },
    {
      text: 'Looked_up multi user',
      id: 'e125323c-1151-447f-be0f-6d2728117b38',
      settings: {
        localField: 'a065323c-1151-447f-be0f-6d2728117b30',
        foreignField: 'd125323c-1151-447f-be0f-6d2728117b31',
      },
      table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      order: null,
      filter: null,
      displayed: true,
      parents: [
        {
          text: 'Multi user',
          id: 'd125323c-1151-447f-be0f-6d2728117b31',
          settings: null,
          table_id: '000c21e6-5339-4748-903f-8c77e21314cf',
          column_type_id: COLUMN_TYPE.MULTI_USER,
          order: null,
          filter: null,
          displayed: true,
          parents: [],
        },
      ],
    },
    {
      text: 'Looked_up text',
      id: 'e135323c-1151-447f-be0f-6d2728117b38',
      settings: {
        localField: 'a065323c-1151-447f-be0f-6d2728117b30',
        foreignField: 'd135323c-1151-447f-be0f-6d2728117b31',
      },
      table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      order: null,
      filter: null,
      displayed: true,
      parents: [
        {
          text: 'Text',
          id: 'd135323c-1151-447f-be0f-6d2728117b31',
          settings: null,
          table_id: '000c21e6-5339-4748-903f-8c77e21314cf',
          column_type_id: COLUMN_TYPE.TEXT,
          order: null,
          filter: null,
          displayed: true,
          parents: [],
        },
      ],
    },
    {
      text: 'Looked_up url',
      id: 'e145323c-1151-447f-be0f-6d2728117b38',
      settings: {
        localField: 'a065323c-1151-447f-be0f-6d2728117b30',
        foreignField: 'd145323c-1151-447f-be0f-6d2728117b31',
      },
      table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      order: null,
      filter: null,
      displayed: true,
      parents: [
        {
          text: 'URL',
          id: 'd145323c-1151-447f-be0f-6d2728117b31',
          settings: null,
          table_id: '000c21e6-5339-4748-903f-8c77e21314cf',
          column_type_id: COLUMN_TYPE.URL,
          order: null,
          filter: null,
          displayed: true,
          parents: [],
        },
      ],
    },
  ],
}

const rowLookedUpColumn = {
  text: 'Vélo n° 42',
  data: {
    'e065323c-1151-447f-be0f-6d2728117b38': {
      reference: 'a015323c-1151-447f-be0f-6d2728117b38',
      value: true,
    },
    'e165323c-1151-447f-be0f-6d2728117b38': {
      reference: 'a015323c-1151-447f-be0f-6d2728117b38',
      value: 'My first string',
    },
    'e265323c-1151-447f-be0f-6d2728117b38': {
      reference: 'a015323c-1151-447f-be0f-6d2728117b38',
      value: 10,
    },
    'e365323c-1151-447f-be0f-6d2728117b38': {
      reference: 'a015323c-1151-447f-be0f-6d2728117b38',
      value: 10.5,
    },
    'e465323c-1151-447f-be0f-6d2728117b38': {
      reference: 'a015323c-1151-447f-be0f-6d2728117b38',
      value: new Date('2021-01-15'),
    },
    'e565323c-1151-447f-be0f-6d2728117b38': {
      reference: 'u015323c-1151-447f-be0f-6d2728117b38',
      value: 'User 1',
    },
    'e665323c-1151-447f-be0f-6d2728117b38': {
      reference: 'g015323c-1151-447f-be0f-6d2728117b38',
      value: 'Group 1',
    },
    'e765323c-1151-447f-be0f-6d2728117b38': {
      reference: 'a015323c-1151-447f-be0f-6d2728117b38',
      value: 'RBT 1',
    },
    'e865323c-1151-447f-be0f-6d2728117b38': {
      reference: 'a015323c-1151-447f-be0f-6d2728117b38',
      value: singleSelectOption1UUID,
    },
    'e965323c-1151-447f-be0f-6d2728117b38': {
      reference: 'a015323c-1151-447f-be0f-6d2728117b38',
      value: [singleSelectOption1UUID, singleSelectOption2UUID],
    },
    'e105323c-1151-447f-be0f-6d2728117b38': {
      reference: 'a015323c-1151-447f-be0f-6d2728117b38',
      value: 'My formula',
    },
    'e115323c-1151-447f-be0f-6d2728117b38': {
      reference: 'a015323c-1151-447f-be0f-6d2728117b38',
      value: 'File',
    },
    'e125323c-1151-447f-be0f-6d2728117b38': {
      reference: ['u015323c-1151-447f-be0f-6d2728117b38', 'u115323c-1151-447f-be0f-6d2728117b38'],
      value: 'User 1, User 2',
    },
    'e135323c-1151-447f-be0f-6d2728117b38': {
      reference: 'a015323c-1151-447f-be0f-6d2728117b38',
      value: 'My text to display...',
    },
    'e145323c-1151-447f-be0f-6d2728117b38': {
      reference: 'a015323c-1151-447f-be0f-6d2728117b38',
      value: 'http://myurl.com',
    },
  },
  id: '38ed19db-588d-4ca1-8ab3-c8b17d60db2d',
  table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
}

export const withLookedUpColumns = () => (
  {
    components: { 'lck-data-detail': DataDetail },
    data () {
      return {
        definition: definitionWithLookedUpColumns,
        row: rowLookedUpColumn,
      }
    },
    template: `
    <lck-data-detail
      :definition="definition"
      :row="row"
      workspaceId="wsed19db-588d-4ca1-8ab3-c8b17d60db2d"
    />
    `,
  }
)

withLookedUpColumns.storyName = 'with looked up columns'

const definitionWithConditionalDisplay = {
  text: 'Testing conditional display',
  table_id: '0076b18b-5c85-4587-bff7-bba95f7361ca',
  columns: [
    {
      text: 'Text',
      id: 'e065323c-1151-447f-be0f-6d2728117b38',
      table_id: '0076b18b-5c85-4587-bff7-bba95f7361ca',
      column_type_id: COLUMN_TYPE.STRING,
      order: null,
      filter: null,
      displayed: true,
      editable: true,
    },
    {
      text: 'Boolean / Checkbox',
      id: 'e165323c-1151-447f-be0f-6d2728117b38',
      table_id: '0076b18b-5c85-4587-bff7-bba95f7361ca',
      column_type_id: COLUMN_TYPE.BOOLEAN,
      order: null,
      filter: null,
      displayed: true,
      editable: true,
    },
    {
      text: 'Conditional text if previous boolean is checked',
      id: '882326b8-b634-4ebb-aeb3-a2a2aa082c11',
      table_id: '0076b18b-5c85-4587-bff7-bba95f7361ca',
      column_type_id: COLUMN_TYPE.TEXT,
      order: null,
      filter: null,
      displayed: true,
      editable: true,
      display_conditions: [{
        field_id: 'e165323c-1151-447f-be0f-6d2728117b38',
        operator: '$eq',
        value: true,
      }],
    },
    {
      text: 'Conditional text if previous boolean is not checked',
      id: 'cf1ad5b7-54d0-46a2-9bd2-8b1ecf059c42',
      table_id: '0076b18b-5c85-4587-bff7-bba95f7361ca',
      column_type_id: COLUMN_TYPE.TEXT,
      order: null,
      filter: null,
      displayed: true,
      editable: true,
      display_conditions: [{
        field_id: 'e165323c-1151-447f-be0f-6d2728117b38',
        operator: '$ne', // here we use $ne, because if field is pristine, it could be null
        value: true,
      }],
    },
    {
      text: 'Status',
      id: 'b15bfe13-b18b-40ca-9637-1611c789b7c2',
      settings: {
        values: {
          first: {
            label: 'Done',
          },
          second: {
            label: 'Out of order',

          },
          third: {
            label: 'For other case (third), please specify in next field.',
          },
          fourth: {
            label: 'For other case (fourth), please specify in next field.',
          },
        },
      },
      table_id: '0076b18b-5c85-4587-bff7-bba95f7361ca',
      column_type_id: COLUMN_TYPE.SINGLE_SELECT,
      order: null,
      filter: null,
      displayed: true,
      editable: true,
    },
    {
      text: 'Conditional text if previous single select is third / fourth value',
      id: '87e6fd3e-d016-4509-bfe5-89796812cc17',
      table_id: '0076b18b-5c85-4587-bff7-bba95f7361ca',
      column_type_id: COLUMN_TYPE.TEXT,
      order: null,
      filter: null,
      displayed: true,
      editable: true,
      display_conditions: [{
        field_id: 'b15bfe13-b18b-40ca-9637-1611c789b7c2',
        operator: '$in',
        value: ['third', 'fourth'],
      }],
    },
  ],
}

export const withConditionalDisplay = () => (
  {
    components: { 'lck-data-detail': DataDetail },
    data () {
      return {
        definition: definitionWithConditionalDisplay,
        row: {
          data: {},
        },
      }
    },
    template: `
    <lck-data-detail
      :definition="definition"
      :row="row"
      workspaceId="wsed19db-588d-4ca1-8ab3-c8b17d60db2d"
    />
    `,
  }
)
withConditionalDisplay.storyName = 'with conditional display'
