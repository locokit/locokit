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

/* eslint-disable @typescript-eslint/camelcase */
const tableViewData = {
  id: 1,
  title: 'My DataTable\'s block',
  type: 'TableView',
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

/* eslint-disable @typescript-eslint/camelcase */
const tableViewDataColumn = {
  id: 1,
  title: 'My DataTable\'s block',
  type: 'TableView',
  definition: {
    text: 'Ensemble des vélos',
    table_id: '163c21e6-5339-4748-903f-8c77e21314cd',
    columns: [
      {
        text: 'Boolean',
        id: 'e065323c-1151-447f-be0f-6d2728117c38',
        settings: null,
        table_id: '163c21e6-5339-4748-903f-8c77e21314cd',
        column_type_id: COLUMN_TYPE.BOOLEAN,
        order: null,
        filter: null,
        displayed: true,
        type: {
          text: 'String',
          id: 3
        }
      },
      {
        text: 'String',
        id: 'e065323c-1151-447f-be0f-6d2728117c39',
        settings: null,
        table_id: '163c21e6-5339-4748-903f-8c77e21314cd',
        column_type_id: COLUMN_TYPE.STRING,
        order: null,
        filter: null,
        displayed: true,
        type: {
          text: 'String',
          id: 3
        }
      },
      {
        text: 'Number',
        id: 'e065323c-1151-447f-be0f-6d2728117c40',
        settings: null,
        table_id: '163c21e6-5339-4748-903f-8c77e21314cd',
        column_type_id: COLUMN_TYPE.NUMBER,
        order: null,
        filter: null,
        displayed: true,
        type: {
          text: 'String',
          id: 3
        }
      },
      {
        text: 'Float',
        id: 'e065323c-1151-447f-be0f-6d2728117c41',
        settings: null,
        table_id: '163c21e6-5339-4748-903f-8c77e21314cd',
        column_type_id: COLUMN_TYPE.FLOAT,
        order: null,
        filter: null,
        displayed: true,
        type: {
          text: 'String',
          id: 3
        }
      },
      {
        text: 'Date',
        id: 'b9058b15-44b7-4cd9-a121-a942b69a0434',
        settings: null,
        table_id: '163c21e6-5339-4748-903f-8c77e21314cd',
        column_type_id: COLUMN_TYPE.DATE,
        order: null,
        filter: null,
        displayed: true
      },
      {
        text: 'User',
        id: 'bde4bbbd-2584-447f-acff-f434f53619da',
        settings: null,
        table_id: '163c21e6-5339-4748-903f-8c77e21314cd',
        column_type_id: COLUMN_TYPE.USER,
        order: null,
        filter: null,
        displayed: true,
        type: {
          text: 'User',
          id: 5
        }
      },
      {
        text: 'Group',
        id: 'bde4bbbd-2584-447f-acff-f434f53619da',
        settings: null,
        table_id: '163c21e6-5339-4748-903f-8c77e21314cd',
        column_type_id: COLUMN_TYPE.GROUP,
        order: null,
        filter: null,
        displayed: true,
        type: {
          text: 'Group',
          id: 5
        }
      },
      {
        text: 'Relation between table',
        id: 'bde4bbbd-2584-447f-acff-f434f53619da',
        settings: null,
        table_id: '163c21e6-5339-4748-903f-8c77e21314cd',
        column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
        order: null,
        filter: null,
        displayed: true,
        type: {
          text: 'Relation between table',
          id: 5
        }
      },
      {
        text: 'Single Select',
        id: '3a659ea1-446f-4755-8db9-583a204279c42',
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
        table_id: '163c21e6-5339-4748-903f-8c77e21314cd',
        column_type_id: COLUMN_TYPE.SINGLE_SELECT,
        order: null,
        filter: null,
        displayed: true,
        type: {
          text: 'Single select',
          id: 9
        }
      },
      {
        text: 'Multi Select',
        id: '3a659ea1-446f-4755-8db9-583a204279c42',
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
        table_id: '163c21e6-5339-4748-903f-8c77e21314cd',
        column_type_id: COLUMN_TYPE.MULTI_SELECT,
        order: null,
        filter: null,
        displayed: true,
        type: {
          text: 'Multi select',
          id: 9
        }
      },
      {
        text: 'Formula',
        id: 'bde4bbbd-2584-447f-acff-f434f53619da',
        settings: null,
        table_id: '163c21e6-5339-4748-903f-8c77e21314cd',
        column_type_id: COLUMN_TYPE.FORMULA,
        order: null,
        filter: null,
        displayed: true,
        type: {
          text: 'Group',
          id: 5
        }
      },
      {
        text: 'File',
        id: 'bde4bbbd-2584-447f-acff-f434f53619da',
        settings: null,
        table_id: '163c21e6-5339-4748-903f-8c77e21314cd',
        column_type_id: COLUMN_TYPE.FILE,
        order: null,
        filter: null,
        displayed: true,
        type: {
          text: 'File',
          id: 5
        }
      },
      {
        text: 'Multi User',
        id: 'bde4bbbd-2584-447f-acff-f434f53619da',
        settings: null,
        table_id: '163c21e6-5339-4748-903f-8c77e21314cd',
        column_type_id: COLUMN_TYPE.MULTI_USER,
        order: null,
        filter: null,
        displayed: true,
        type: {
          text: 'Multi User',
          id: 5
        }
      },
      {
        text: 'Multi Group',
        id: 'bde4bbbd-2584-447f-acff-f434f53619da',
        settings: null,
        table_id: '163c21e6-5339-4748-903f-8c77e21314cd',
        column_type_id: COLUMN_TYPE.MULTI_GROUP,
        order: null,
        filter: null,
        displayed: true,
        type: {
          text: 'Multi User',
          id: 5
        }
      },
      {
        text: 'Textarea',
        id: '413bf240-b8fb-4a5b-87eb-074bef2ee21a',
        settings: null,
        table_id: '163c21e6-5339-4748-903f-8c77e21314cd',
        column_type_id: COLUMN_TYPE.TEXT,
        order: null,
        filter: null,
        displayed: true
      },
      {
        text: 'URL',
        id: '413bf240-b8fb-4a5b-87eb-074bef2ee21a',
        settings: null,
        table_id: '163c21e6-5339-4748-903f-8c77e21314cd',
        column_type_id: COLUMN_TYPE.URL,
        order: null,
        filter: null,
        displayed: true
      },
      {
        text: 'Geometry point',
        id: '413bf240-b8fb-4a5b-87eb-074bef2ee21a',
        settings: null,
        table_id: '163c21e6-5339-4748-903f-8c77e21314cd',
        column_type_id: COLUMN_TYPE.GEOMETRY_POINT,
        order: null,
        filter: null,
        displayed: true
      },
      {
        text: 'Geometry polygon',
        id: '413bf240-b8fb-4a5b-87eb-074bef2ee21a',
        settings: null,
        table_id: '163c21e6-5339-4748-903f-8c77e21314cd',
        column_type_id: COLUMN_TYPE.GEOMETRY_POLYGON,
        order: null,
        filter: null,
        displayed: true
      },
      {
        text: 'Geometry linestring',
        id: '413bf240-b8fb-4a5b-87eb-074bef2ee21a',
        settings: null,
        table_id: '163c21e6-5339-4748-903f-8c77e21314cd',
        column_type_id: COLUMN_TYPE.GEOMETRY_LINESTRING,
        order: null,
        filter: null,
        displayed: true
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

export const withAllColumnType = () => (
  {
    components: { 'lck-datatable': DataTable },
    data () {
      return {
        block: {
          ...tableViewDataColumn,
          content: {}
        }
      }
    },
    template: '<lck-datatable :content="block.content" :definition="block.definition" />'
  }
)

withAllColumnType.storyName = 'With all column type'

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
