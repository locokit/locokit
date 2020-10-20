import CrudTable from './CrudTable'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import Vue from 'vue'

export default {
  title: 'components/store/CrudTable',
  component: CrudTable,
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
    components: { CrudTable },
    data () {
      return {
        definition: { column: [] },
        content: { data: [] }
      }
    },
    template: '<div><CrudTable :definition="definition" :content="content"/></div>'
  }
)

withEmptyDefinitionAndDataStory.storyName = 'Empty definition and content properties'

/* eslint-disable @typescript-eslint/camelcase */
const tableViewData = {
  id: 1,
  title: 'My CrudTable\'s block',
  type: 'CrudTable',
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
        visible: true,
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
      }, {
        text: 'Date',
        id: 'b9058b15-44b7-4cd9-a121-a942b69a0434',
        settings: null,
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
        column_type_id: COLUMN_TYPE.DATE,
        order: null,
        filter: null,
        visible: true
      }, {
        text: 'Textarea',
        id: '413bf240-b8fb-4a5b-87eb-074bef2ee21a',
        settings: null,
        table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
        column_type_id: COLUMN_TYPE.TEXT,
        order: null,
        filter: null,
        visible: true
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
/* eslint-enable @typescript-eslint/camelcase */

export const withoutContent = () => (
  {
    components: { CrudTable },
    data () {
      return {
        block: {
          ...tableViewData,
          content: {}
        }
      }
    },
    template: '<div><CrudTable :content="block.content" :definition="block.definition" /></div>'
  }
)

withoutContent.storyName = 'No content'

export const withExpectedProps = () => (
  {
    components: { CrudTable },
    data () {
      return {
        block: tableViewData
      }
    },
    template: '<div><CrudTable :content="block.content" :definition="block.definition" /></div>'
  }
)

withExpectedProps.storyName = 'Expected props'

export const withExpectedPropsAndCrudMode = () => (
  {
    components: { CrudTable },
    data () {
      return {
        block: tableViewData
      }
    },
    template: '<div><CrudTable :content="block.content" :definition="block.definition" :crud-mode="true" /></div>'
  }
)

withExpectedPropsAndCrudMode.storyName = 'CRUD mode with expected props'

export const crudModeWithCalendar = () => (
  {
    components: { CrudTable },
    data () {
      return {
        block: tableViewData
      }
    },
    template: '<CrudTable :content="block.content" :definition="block.definition" :crud-mode="true" ref="lck-datatable" />',
    async mounted () {
      const crudElement = this.$refs['lck-datatable'].$el
      await Vue.nextTick()
      const calendarCellFirstRow = crudElement.querySelector('table > tbody > tr > td:nth-child(4)')
      calendarCellFirstRow.click()
      await Vue.nextTick()

      const nextMonthButton = document.querySelector('.p-datepicker-next.p-link')
      console.log(nextMonthButton)
      nextMonthButton && nextMonthButton.click()
    }
  }
)

crudModeWithCalendar.storyName = 'CRUD mode with calendar opened and month changed'
crudModeWithCalendar.args = { timeoutBeforeScreenshot: 1500 }

export const crudModeWithTextarea = () => (
  {
    components: { CrudTable },
    data () {
      return {
        block: tableViewData
      }
    },
    template: '<div><CrudTable :content="block.content" :definition="block.definition" :crud-mode="true" ref="lck-datatable" /></div>',
    async mounted () {
      const crudElement = this.$refs['lck-datatable'].$el
      await Vue.nextTick()
      const textareaCellFirstRow = crudElement.querySelector('table > tbody > tr > td:nth-child(5)')
      textareaCellFirstRow.click()
      await Vue.nextTick()
    }
  }
)

crudModeWithTextarea.storyName = 'CRUD mode with textarea opened'
crudModeWithTextarea.args = { timeoutBeforeScreenshot: 1500 }
