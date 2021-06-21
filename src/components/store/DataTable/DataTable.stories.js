import DataTable from './DataTable'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import Vue from 'vue'

export default {
  title: 'components/store/DataTable',
  component: DataTable,
  parameters: {
    docs: {
      description: `
        This component represent data with the Prime Datatable component.
        It is enhanced for ordering columns and resizing them.
      `
    }
  }
}

export const withEmptyDefinitionAndDataStory = () => (
  {
    components: { 'lck-datatable': DataTable },
    data () {
      return {
        definition: { column: [] },
        content: { data: [] }
      }
    },
    template: '<lck-datatable :definition="definition" :content="content"/>'
  }
)

withEmptyDefinitionAndDataStory.storyName = 'Empty definition and content properties'

const singleSelectOption1UUID = '1efa77d0-c07a-4d3e-8677-2c19c6a26ecd'
const singleSelectOption2UUID = 'c1d336fb-438f-4709-963f-5f159c147781'
const singleSelectOption3UUID = '4b50ce84-2450-47d7-9409-2f319b547efd'

/* eslint-disable @typescript-eslint/camelcase */
const tableViewData = {
  id: 1,
  title: 'My DataTable\'s block',
  type: 'TableSet',
  definition: {
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
            1: {
              color: '#fff',
              label: 'En maintenance',
              backgroundColor: 'var(--surface-a)'
            },
            2: {
              color: '#fff',
              label: 'En utilisation',
              backgroundColor: 'var(--surface-b)'
            },
            3: {
              color: '#fff',
              label: 'Stocké',
              backgroundColor: 'var(--surface-c)'
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
      }, {
        text: 'Files',
        id: '2b2a976d-565a-4b22-911a-b18146b33b3d',
        settings: null,
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
        column_type_id: COLUMN_TYPE.FILE,
        order: null,
        filter: null,
        displayed: true
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
      }, {
        text: 'Vélo n° YYYY',
        data: {
          '3a659ea1-446f-4755-8db9-583a204279cc': 2,
          'b9058b15-44b7-4cd9-a121-a942b69a0434': '2020-10-30',
          'bde4bbbd-2584-447f-acff-f434f53619da': {
            value: 'CYCLABLE ENTREPRISE',
            reference: 3

          },
          'e065323c-1151-447f-be0f-6d2728117b38': 'Btwin',
          '413bf240-b8fb-4a5b-87eb-074bef2ee21a': 'Welcome at home, \nthis is a multi line text\nand it works'

        },
        id: 'cd57a998-1775-4d13-b493-2cbdf7c54e4c',
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf'
      }
    ]
  }
}

const manualProcesses = [
  {
    id: '17',
    maximumNumberSuccess: 1,
    table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
    text: 'Action 1 to run',
    trigger: 'MANUAL',
    runs: [{
      process_id: '17',
      table_row_id: '38ed19db-588d-4ca1-8ab3-c8b17d60db2d',
      status: 'SUCCESS',
      id: '42'
    }]
  }, {
    id: '12',
    maximumNumberSuccess: 0,
    table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
    text: 'Action 2 to run',
    trigger: 'MANUAL'
  }]
/* eslint-enable @typescript-eslint/camelcase */

export const withoutContent = () => (
  {
    components: { 'lck-datatable': DataTable },
    data () {
      return {
        block: {
          ...tableViewData,
          content: {}
        }
      }
    },
    template: '<lck-datatable :content="block.content" :definition="block.definition" />'
  }
)

withoutContent.storyName = 'No content'

export const withoutContentWithDetailButtons = () => (
  {
    components: { 'lck-datatable': DataTable },
    data () {
      return {
        block: {
          ...tableViewData,
          content: {}
        }
      }
    },
    template: '<lck-datatable :content="block.content" :definition="block.definition" :displayDetailButton="true" />'
  }
)

withoutContentWithDetailButtons.storyName = 'No content with the detail buttons column'

export const withExpectedProps = () => (
  {
    components: { 'lck-datatable': DataTable },
    data () {
      return {
        block: tableViewData
      }
    },
    template: '<lck-datatable :content="block.content" :definition="block.definition" />'
  }
)

withExpectedProps.storyName = 'Expected props'

export const withExpectedPropsWithDetailButtons = () => (
  {
    components: { 'lck-datatable': DataTable },
    data () {
      return {
        block: tableViewData
      }
    },
    template: '<lck-datatable :content="block.content" :definition="block.definition" :displayDetailButton="true" />'
  }
)

withExpectedPropsWithDetailButtons.storyName = 'Expected props with the detail buttons column'

export const withExpectedPropsWithDetailProcessButtons = () => (
  {
    components: { 'lck-datatable': DataTable },
    data () {
      return {
        block: tableViewData,
        manualProcesses: manualProcesses
      }
    },
    template: '<lck-datatable :crud-mode="true" :manualProcesses="manualProcesses" :content="block.content" :definition="block.definition" :displayDetailButton="true"  />'
  }
)

withExpectedPropsWithDetailProcessButtons.storyName = 'Expected props with detail and process buttons column'

export const withExpectedPropsAndCrudMode = () => (
  {
    components: { 'lck-datatable': DataTable },
    data () {
      return {
        block: tableViewData
      }
    },
    template: '<lck-datatable :content="block.content" :definition="block.definition" :crud-mode="true" />'
  }
)

withExpectedPropsAndCrudMode.storyName = 'CRUD mode with expected props'

export const crudModeWithCalendar = () => (
  {
    components: { 'lck-datatable': DataTable },
    data () {
      return {
        block: tableViewData
      }
    },
    template: '<lck-datatable :content="block.content" :definition="block.definition" :crud-mode="true" ref="lck-datatable" />',
    async mounted () {
      const crudElement = this.$refs['lck-datatable'].$el
      await Vue.nextTick()
      const calendarCellFirstRow = crudElement.querySelector('table > tbody > tr > td:nth-child(4)')
      calendarCellFirstRow.click()
      await Vue.nextTick()

      const nextMonthButton = document.querySelector('.p-datepicker-next.p-link')
      nextMonthButton && nextMonthButton.click()
    }
  }
)

crudModeWithCalendar.storyName = 'CRUD mode with calendar opened and month changed'
crudModeWithCalendar.args = {
  waitForSelector: '.p-datepicker'
}

export const crudModeWithTextarea = () => (
  {
    components: { 'lck-datatable': DataTable },
    data () {
      return {
        block: tableViewData
      }
    },
    template: '<lck-datatable :content="block.content" :definition="block.definition" :crud-mode="true" ref="lck-datatable" />',
    async mounted () {
      const crudElement = this.$refs['lck-datatable'].$el
      await Vue.nextTick()
      const textareaCellFirstRow = crudElement.querySelector('table > tbody > tr > td:nth-child(5)')
      textareaCellFirstRow.click()
    }
  }
)

crudModeWithTextarea.storyName = 'CRUD mode with textarea opened'

export const crudModeWithSaving = () => (
  {
    components: { 'lck-datatable': DataTable },
    data () {
      return {
        block: tableViewData,
        cellState: {
          rowId: '38ed19db-588d-4ca1-8ab3-c8b17d60db2d',
          columnId: 'e065323c-1151-447f-be0f-6d2728117b38',
          waiting: true,
          isValid: null
        }
      }
    },
    template: `
    <lck-datatable
      :content="block.content"
      :definition="block.definition"
      :crud-mode="true"
      :cellState="cellState"
    />`

  }
)

crudModeWithSaving.storyName = 'CRUD mode, edition state saving'

export const crudModeSavedOk = () => (
  {
    components: { 'lck-datatable': DataTable },
    data () {
      return {
        block: tableViewData,
        cellState: {
          rowId: '38ed19db-588d-4ca1-8ab3-c8b17d60db2d',
          columnId: 'e065323c-1151-447f-be0f-6d2728117b38',
          waiting: false,
          isValid: true
        }
      }
    },
    template: `
    <lck-datatable
      :content="block.content"
      :definition="block.definition"
      :crud-mode="true"
      :cellState="cellState"
    />`
  }
)

crudModeSavedOk.storyName = 'CRUD mode, edition state saved ok'

export const crudModeSavedError = () => (
  {
    components: { 'lck-datatable': DataTable },
    data () {
      return {
        block: tableViewData,
        cellState: {
          rowId: '38ed19db-588d-4ca1-8ab3-c8b17d60db2d',
          columnId: 'e065323c-1151-447f-be0f-6d2728117b38',
          waiting: false,
          isValid: false
        }
      }
    },
    template: `
    <lck-datatable
      :content="block.content"
      :definition="block.definition"
      :crud-mode="true"
      :cellState="cellState"
    />`
  }
)

crudModeSavedError.storyName = 'CRUD mode, edition state saved error'

export const withExpectedPropsAndCrudModeToEditColumn = () => (
  {
    components: { 'lck-datatable': DataTable },
    data () {
      return {
        block: tableViewData
      }
    },
    template: '<lck-datatable ref="lck-datatable" :content="block.content" :definition="block.definition" :crud-mode="true" />',
    async mounted () {
      const crudElement = this.$refs['lck-datatable'].$el
      await Vue.nextTick()
      const editColumnButton = crudElement.querySelector('table > thead > tr > th .edit-column-icon')
      editColumnButton.click()
      await Vue.nextTick()
    }
  }
)

withExpectedPropsAndCrudModeToEditColumn.storyName = 'CRUD mode with expected props to edit a column'
withExpectedPropsAndCrudModeToEditColumn.args = {
  waitForSelector: '.p-menu'
}

export const withExpectedPropsAndCrudModeToEditUnsortableColumn = () => (
  {
    components: { 'lck-datatable': DataTable },
    data () {
      return {
        block: tableViewData
      }
    },
    template: '<lck-datatable ref="lck-datatable" :content="block.content" :definition="block.definition" :crud-mode="true" />',
    async mounted () {
      const crudElement = this.$refs['lck-datatable'].$el
      await Vue.nextTick()
      const editColumnButton = crudElement.querySelectorAll('table > thead > tr > th .edit-column-icon')[1]
      editColumnButton.click()
      await Vue.nextTick()
    }
  }
)

withExpectedPropsAndCrudModeToEditUnsortableColumn.storyName = 'CRUD mode with expected props to edit an unsortable column'
withExpectedPropsAndCrudModeToEditUnsortableColumn.args = {
  waitForSelector: '.p-menu'
}

/* eslint-disable @typescript-eslint/camelcase */
const tableViewDataLookedUpColumn = {
  id: 1,
  title: 'My DataTable\'s block',
  type: 'TableSet',
  definition: {
    text: 'Test des lookup-columns',
    table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
    columns: [
      {
        text: 'Looked_up boolean',
        id: 'e065323c-1151-447f-be0f-6d2728117b38',
        settings: {
          localField: 'a065323c-1151-447f-be0f-6d2728117b30',
          foreignField: 'd065323c-1151-447f-be0f-6d2728117b31'
        },
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
        style: {
          width: 100
        },
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
            parents: []
          }
        ]
      },
      {
        text: 'Looked_up string',
        id: 'e165323c-1151-447f-be0f-6d2728117b38',
        settings: {
          localField: 'a065323c-1151-447f-be0f-6d2728117b30',
          foreignField: 'd165323c-1151-447f-be0f-6d2728117b31'
        },
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
        style: {
          width: 100
        },
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
            parents: []
          }
        ]
      },
      {
        text: 'Looked_up number',
        id: 'e265323c-1151-447f-be0f-6d2728117b38',
        settings: {
          localField: 'a065323c-1151-447f-be0f-6d2728117b30',
          foreignField: 'd265323c-1151-447f-be0f-6d2728117b31'
        },
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
        style: {
          width: 100
        },
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
            parents: []
          }
        ]
      },
      {
        text: 'Looked_up float',
        id: 'e365323c-1151-447f-be0f-6d2728117b38',
        settings: {
          localField: 'a065323c-1151-447f-be0f-6d2728117b30',
          foreignField: 'd365323c-1151-447f-be0f-6d2728117b31'
        },
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
        style: {
          width: 100
        },
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
            parents: []
          }
        ]
      },
      {
        text: 'Looked_up date',
        id: 'e465323c-1151-447f-be0f-6d2728117b38',
        settings: {
          localField: 'a065323c-1151-447f-be0f-6d2728117b30',
          foreignField: 'd465323c-1151-447f-be0f-6d2728117b31'
        },
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
        style: {
          width: 100
        },
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
            parents: []
          }
        ]
      },
      {
        text: 'Looked_up user',
        id: 'e565323c-1151-447f-be0f-6d2728117b38',
        settings: {
          localField: 'a065323c-1151-447f-be0f-6d2728117b30',
          foreignField: 'd565323c-1151-447f-be0f-6d2728117b31'
        },
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
        style: {
          width: 100
        },
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
            parents: []
          }
        ]
      },
      {
        text: 'Looked_up group',
        id: 'e665323c-1151-447f-be0f-6d2728117b38',
        settings: {
          localField: 'a065323c-1151-447f-be0f-6d2728117b30',
          foreignField: 'd665323c-1151-447f-be0f-6d2728117b31'
        },
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
        style: {
          width: 100
        },
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
            parents: []
          }
        ]
      },
      {
        text: 'Looked_up relation between tables',
        id: 'e765323c-1151-447f-be0f-6d2728117b38',
        settings: {
          localField: 'a065323c-1151-447f-be0f-6d2728117b30',
          foreignField: 'd765323c-1151-447f-be0f-6d2728117b31'
        },
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
        style: {
          width: 100
        },
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
            parents: []
          }
        ]
      },
      {
        text: 'Looked_up single select',
        id: 'e865323c-1151-447f-be0f-6d2728117b38',
        settings: {
          localField: 'a065323c-1151-447f-be0f-6d2728117b30',
          foreignField: 'd865323c-1151-447f-be0f-6d2728117b31'
        },
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
        style: {
          width: 100
        },
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
                  label: 'option 1',
                  color: '#ffffff',
                  backgroundColor: '#007734'
                },
                [singleSelectOption2UUID]: {
                  label: 'option 2',
                  color: '#ffffff',
                  backgroundColor: '#883477'
                },
                [singleSelectOption3UUID]: {
                  label: 'option 3',
                  color: '#ffffff',
                  backgroundColor: '#003477'
                }
              }
            },
            table_id: '000c21e6-5339-4748-903f-8c77e21314cf',
            column_type_id: COLUMN_TYPE.SINGLE_SELECT,
            order: null,
            filter: null,
            displayed: true,
            parents: []
          }
        ]
      },
      {
        text: 'Looked_up multi select',
        id: 'e965323c-1151-447f-be0f-6d2728117b38',
        settings: {
          localField: 'a065323c-1151-447f-be0f-6d2728117b30',
          foreignField: 'd965323c-1151-447f-be0f-6d2728117b31'
        },
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
        style: {
          width: 100
        },
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
                  label: 'option 1'
                },
                [singleSelectOption2UUID]: {
                  label: 'option 2'
                },
                [singleSelectOption3UUID]: {
                  label: 'option 3'
                }
              }
            },
            table_id: '000c21e6-5339-4748-903f-8c77e21314cf',
            column_type_id: COLUMN_TYPE.MULTI_SELECT,
            order: null,
            filter: null,
            displayed: true,
            parents: []
          }
        ]
      },
      {
        text: 'Looked_up formula',
        id: 'e105323c-1151-447f-be0f-6d2728117b38',
        settings: {
          localField: 'a065323c-1151-447f-be0f-6d2728117b30',
          foreignField: 'd105323c-1151-447f-be0f-6d2728117b31'
        },
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
        style: {
          width: 100
        },
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
            parents: []
          }
        ]
      },
      {
        text: 'Looked_up file',
        id: 'e115323c-1151-447f-be0f-6d2728117b38',
        settings: {
          localField: 'a065323c-1151-447f-be0f-6d2728117b30',
          foreignField: 'd115323c-1151-447f-be0f-6d2728117b31'
        },
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
        style: {
          width: 100
        },
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
            parents: []
          }
        ]
      },
      {
        text: 'Looked_up multi user',
        id: 'e125323c-1151-447f-be0f-6d2728117b38',
        settings: {
          localField: 'a065323c-1151-447f-be0f-6d2728117b30',
          foreignField: 'd125323c-1151-447f-be0f-6d2728117b31'
        },
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
        style: {
          width: 100
        },
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
            parents: []
          }
        ]
      },
      {
        text: 'Looked_up text',
        id: 'e135323c-1151-447f-be0f-6d2728117b38',
        settings: {
          localField: 'a065323c-1151-447f-be0f-6d2728117b30',
          foreignField: 'd135323c-1151-447f-be0f-6d2728117b31'
        },
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
        style: {
          width: 100
        },
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
            parents: []
          }
        ]
      },
      {
        text: 'Looked_up url',
        id: 'e145323c-1151-447f-be0f-6d2728117b38',
        settings: {
          localField: 'a065323c-1151-447f-be0f-6d2728117b30',
          foreignField: 'd145323c-1151-447f-be0f-6d2728117b31'
        },
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
        style: {
          width: 100
        },
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
            parents: []
          }
        ]
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
          'e065323c-1151-447f-be0f-6d2728117b38': {
            reference: 'a015323c-1151-447f-be0f-6d2728117b38',
            value: true
          },
          'e165323c-1151-447f-be0f-6d2728117b38': {
            reference: 'a015323c-1151-447f-be0f-6d2728117b38',
            value: 'My first string'
          },
          'e265323c-1151-447f-be0f-6d2728117b38': {
            reference: 'a015323c-1151-447f-be0f-6d2728117b38',
            value: 10
          },
          'e365323c-1151-447f-be0f-6d2728117b38': {
            reference: 'a015323c-1151-447f-be0f-6d2728117b38',
            value: 10.5
          },
          'e465323c-1151-447f-be0f-6d2728117b38': {
            reference: 'a015323c-1151-447f-be0f-6d2728117b38',
            value: '2021-01-15'
          },
          'e565323c-1151-447f-be0f-6d2728117b38': {
            reference: 'u015323c-1151-447f-be0f-6d2728117b38',
            value: 'User 1'
          },
          'e665323c-1151-447f-be0f-6d2728117b38': {
            reference: 'g015323c-1151-447f-be0f-6d2728117b38',
            value: 'Group 1'
          },
          'e765323c-1151-447f-be0f-6d2728117b38': {
            reference: 'a015323c-1151-447f-be0f-6d2728117b38',
            value: 'RBT 1'
          },
          'e865323c-1151-447f-be0f-6d2728117b38': {
            reference: 'a015323c-1151-447f-be0f-6d2728117b38',
            value: singleSelectOption1UUID
          },
          'e965323c-1151-447f-be0f-6d2728117b38': {
            reference: 'a015323c-1151-447f-be0f-6d2728117b38',
            value: [singleSelectOption1UUID, singleSelectOption2UUID]
          },
          'e105323c-1151-447f-be0f-6d2728117b38': {
            reference: 'a015323c-1151-447f-be0f-6d2728117b38',
            value: 'My formula'
          },
          'e115323c-1151-447f-be0f-6d2728117b38': {
            reference: 'a015323c-1151-447f-be0f-6d2728117b38',
            value: 'File'
          },
          'e125323c-1151-447f-be0f-6d2728117b38': {
            reference: ['u015323c-1151-447f-be0f-6d2728117b38', 'u115323c-1151-447f-be0f-6d2728117b38'],
            value: ['User 1', 'User 2']
          },
          'e135323c-1151-447f-be0f-6d2728117b38': {
            reference: 'a015323c-1151-447f-be0f-6d2728117b38',
            value: 'My text to display...'
          },
          'e145323c-1151-447f-be0f-6d2728117b38': {
            reference: 'a015323c-1151-447f-be0f-6d2728117b38',
            value: 'http://myurl.com'
          }
        },
        id: '38ed19db-588d-4ca1-8ab3-c8b17d60db2d',
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf'
      }, {
        text: 'Vélo n° YYYY',
        data: {
          'e065323c-1151-447f-be0f-6d2728117b38': {
            reference: 'a025323c-1151-447f-be0f-6d2728117b38',
            value: false
          },
          'e165323c-1151-447f-be0f-6d2728117b38': {
            reference: 'a025323c-1151-447f-be0f-6d2728117b38',
            value: 'My second string'
          },
          'e265323c-1151-447f-be0f-6d2728117b38': {
            reference: 'a025323c-1151-447f-be0f-6d2728117b38',
            value: 15
          },
          'e365323c-1151-447f-be0f-6d2728117b38': {
            reference: 'a025323c-1151-447f-be0f-6d2728117b38',
            value: 15.5
          },
          'e465323c-1151-447f-be0f-6d2728117b38': {
            reference: 'a025323c-1151-447f-be0f-6d2728117b38',
            value: '2021-01-30'
          },
          'e565323c-1151-447f-be0f-6d2728117b38': {
            reference: 'u025323c-1151-447f-be0f-6d2728117b38',
            value: 'User 2'
          },
          'e665323c-1151-447f-be0f-6d2728117b38': {
            reference: 'g025323c-1151-447f-be0f-6d2728117b38',
            value: 'Group 2'
          },
          'e765323c-1151-447f-be0f-6d2728117b38': {
            reference: 'a025323c-1151-447f-be0f-6d2728117b38',
            value: 'RBT 2'
          },
          'e865323c-1151-447f-be0f-6d2728117b38': {
            reference: 'a025323c-1151-447f-be0f-6d2728117b38',
            value: singleSelectOption3UUID
          },
          'e965323c-1151-447f-be0f-6d2728117b38': {
            reference: 'a025323c-1151-447f-be0f-6d2728117b38',
            value: [singleSelectOption3UUID]
          },
          'e105323c-1151-447f-be0f-6d2728117b38': {
            reference: 'a025323c-1151-447f-be0f-6d2728117b38',
            value: 'My formula 2'
          },
          'e115323c-1151-447f-be0f-6d2728117b38': {
            reference: 'a025323c-1151-447f-be0f-6d2728117b38',
            value: 'File 2'
          },
          'e125323c-1151-447f-be0f-6d2728117b38': {
            reference: ['u025323c-1151-447f-be0f-6d2728117b38', 'u125323c-1151-447f-be0f-6d2728117b38'],
            value: ['User bis 1', 'User bis 2']
          },
          'e135323c-1151-447f-be0f-6d2728117b38': {
            reference: 'a025323c-1151-447f-be0f-6d2728117b38',
            value: 'My second text to display...'
          },
          'e145323c-1151-447f-be0f-6d2728117b38': {
            reference: 'a025323c-1151-447f-be0f-6d2728117b38',
            value: 'http://mysecondurl.com'
          }
        },
        id: 'cd57a998-1775-4d13-b493-2cbdf7c54e4c',
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf'
      }
    ]
  }
}

export const lookedUpColumnsWithExpectedProps = () => (
  {
    components: { 'lck-datatable': DataTable },
    data () {
      return {
        block: tableViewDataLookedUpColumn
      }
    },
    template: '<lck-datatable :content="block.content" :definition="block.definition" />'
  }
)

withExpectedProps.storyName = 'Expected props'
