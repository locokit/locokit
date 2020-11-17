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
crudModeWithCalendar.args = { timeoutBeforeScreenshot: 1500 }

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
      await Vue.nextTick()
    }
  }
)

crudModeWithTextarea.storyName = 'CRUD mode with textarea opened'
crudModeWithTextarea.args = { timeoutBeforeScreenshot: 1500 }

export const crudModeWithSaving = () => (
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
      const inputCellFirstRow = crudElement.querySelector('table > tbody > tr > td:nth-child(1)')
      const inputCellSecondRow = crudElement.querySelector('table > tbody > tr > td:nth-child(2)')
      setTimeout(() => {
        inputCellSecondRow.click()
      }, 500)
      const inputCellFirstRowState = crudElement.querySelector('table > tbody > tr > td:nth-child(1) > div')
      inputCellFirstRowState.classList.add('saving')
    }
  }
)

crudModeWithSaving.storyName = 'CRUD mode, edition state saving'
crudModeWithSaving.args = { timeoutBeforeScreenshot: 800 }

export const crudModeSavedOk = () => (
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
      const inputCellFirstRow = crudElement.querySelector('table > tbody > tr > td:nth-child(1)')
      const inputCellSecondRow = crudElement.querySelector('table > tbody > tr > td:nth-child(2)')
      setTimeout(() => {
        inputCellSecondRow.click()
        inputCellSecondRow.click()
      }, 500)
      const inputCellFirstRowState = crudElement.querySelector('table > tbody > tr > td:nth-child(1) > div')
      inputCellFirstRowState.classList.add("saved")
      inputCellFirstRowState.classList.add("valid")
    }
  }
)

crudModeSavedOk.storyName = 'CRUD mode, edition state saved ok'
crudModeSavedOk.args = { timeoutBeforeScreenshot: 800 }

export const crudModeSavedError = () => (
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
      const inputCellFirstRow = crudElement.querySelector('table > tbody > tr > td:nth-child(1)')
      const inputCellSecondRow = crudElement.querySelector('table > tbody > tr > td:nth-child(2)')
      setTimeout(() => {
        inputCellSecondRow.click()
      }, 500)
      const inputCellFirstRowState = crudElement.querySelector('table > tbody > tr > td:nth-child(1) > div')
      inputCellFirstRowState.classList.add("saved")
      inputCellFirstRowState.classList.add("error")
    }
  }
)

crudModeSavedError.storyName = 'CRUD mode, edition state saved error'
crudModeSavedError.args = { timeoutBeforeScreenshot: 800 }
