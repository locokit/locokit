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
      `
    }
  }
}

export const defaultStory = () => (
  {
    components: { 'lck-data-detail': DataDetail },
    template: '<lck-data-detail />'
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
          id: 3
        }
      }, {
        text: 'État du vélo',
        id: '3a659ea1-446f-4755-8db9-583a204279cc',
        settings: {
          values: {
            first: {
              color: '#ef1',
              label: 'En maintenance'
            },
            second: {
              color: '#ef1',
              label: 'En utilisation'

            },
            third: {
              color: '#ef1',
              label: 'Stocké'

            }
          }
        },
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
        column_type_id: COLUMN_TYPE.SINGLE_SELECT,
        order: null,
        filter: null,
        displayed: true,
        type: {
          text: 'Single select',
          id: 9
        }
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
          id: 5
        }
      }, {
        text: 'Date',
        id: 'b9058b15-44b7-4cd9-a121-a942b69a0434',
        settings: null,
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
        column_type_id: COLUMN_TYPE.DATE,
        order: null,
        filter: null,
        displayed: true
      }, {
        text: 'Textarea',
        id: '413bf240-b8fb-4a5b-87eb-074bef2ee21a',
        settings: null,
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
        column_type_id: COLUMN_TYPE.TEXT,
        order: null,
        filter: null,
        displayed: true
      }
    ]
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
          id: 3
        }
      }, {
        text: 'État du vélo',
        id: '3a659ea1-446f-4755-8db9-583a204279cc',
        settings: {
          values: {
            first: {
              color: '#ef1',
              label: 'En maintenance'
            },
            second: {
              color: '#ef1',
              label: 'En utilisation'

            },
            third: {
              color: '#ef1',
              label: 'Stocké'
            }
          }
        },
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
        column_type_id: COLUMN_TYPE.SINGLE_SELECT,
        order: null,
        filter: null,
        displayed: true,
        editable: true,
        type: {
          text: 'Single select',
          id: 9
        }
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
          id: 5
        }
      }, {
        text: 'Date',
        id: 'b9058b15-44b7-4cd9-a121-a942b69a0434',
        settings: null,
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
        column_type_id: COLUMN_TYPE.DATE,
        order: null,
        filter: null,
        displayed: true,
        editable: true
      }, {
        text: 'Textarea',
        id: '413bf240-b8fb-4a5b-87eb-074bef2ee21a',
        settings: null,
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
        column_type_id: COLUMN_TYPE.TEXT,
        order: null,
        filter: null,
        displayed: true,
        editable: true
      }
    ]
  },
  row: {
    text: 'Vélo n° 42',
    data: {
      '3a659ea1-446f-4755-8db9-583a204279cc': 'first',
      'b9058b15-44b7-4cd9-a121-a942b69a0434': '2020-10-30',
      'bde4bbbd-2584-447f-acff-f434f53619da': {
        value: 'AMSTERDAMAIR',
        reference: 4

      },
      'e065323c-1151-447f-be0f-6d2728117b38': 'Trek',
      '413bf240-b8fb-4a5b-87eb-074bef2ee21a': 'Welcome at home, \nthis is a multi line text\nand it works'

    },
    id: '38ed19db-588d-4ca1-8ab3-c8b17d60db2d',
    table_id: '163c21e6-5339-4748-903f-8c77e21314cf'
  }
}

export const withDefinitionAndRow = () => (
  {
    components: { 'lck-data-detail': DataDetail },
    data () {
      return {
        definition: tableViewData.definitionReadOnly,
        row: tableViewData.row
      }
    },
    template: `
    <lck-data-detail
      :definition="definition"
      :row="row"
    />
    `
  }
)

withDefinitionAndRow.storyName = 'with definition and row'

export const withEditableColumnsAndRow = () => (
  {
    components: { 'lck-data-detail': DataDetail },
    data () {
      return {
        definition: tableViewData.definitionEditable,
        row: tableViewData.row
      }
    },
    template: `
    <lck-data-detail
      :definition="definition"
      :row="row"
      :cellState="cellState"
    />
    `
  }
)

withEditableColumnsAndRow.storyName = 'with editable columns and row'

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
          isValid: true
        }
      }
    },
    template: `
    <lck-data-detail
      :definition="definition"
      :row="row"
      :cellState="cellState"
    />
    `
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
          isValid: false
        }
      }
    },
    template: `
      <lck-data-detail
        :definition="definition"
        :row="row"
        :cellState="cellState"
      />
    `
  }
)

withEditableColumnsAndRowStateError.storyName = 'with edit state error'
