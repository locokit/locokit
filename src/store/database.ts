/* eslint-disable @typescript-eslint/camelcase */
import { lckServices } from '@/services/lck-api'
import { BaseState } from './state'
import { LckColumnView } from '@/services/lck-api/helpers'

class Database {
  text = ''
  tables = []
}

class DatabaseState extends BaseState<Database> {
}

export const databaseState: DatabaseState = {
  loading: false,
  error: null,
  data: new Database()
}

export async function retrieveDatabaseTableAndViewsDefinitions (databaseId: string) {
  databaseState.loading = true
  try {
    const result = await lckServices.database.get(databaseId, {
      query: {
        $eager: '[tables.[columns,views.[columns]]]'
      }
    })
    databaseState.data = result
    return result
  } catch (error) {
    databaseState.error = error
  }
  databaseState.loading = false
}

export async function retrieveTableColumsAndTableRows (tableId: string) {
  databaseState.loading = true
  try {
    return await lckServices.table.get(tableId, {
      // eslint-disable-next-line @typescript-eslint/camelcase
      query: { $eager: '[columns, rows]' }
    })
  } catch (error) {
    databaseState.error = error
  }
  databaseState.loading = false
}

export async function retrieveTableColumns (tableId: string) {
  databaseState.loading = true
  try {
    const result = await lckServices.tableColumn.find({
      // eslint-disable-next-line @typescript-eslint/camelcase
      query: { table_id: tableId, $limit: 50, $sort: { position: 1 } }

    })
    return result.data
  } catch (error) {
    databaseState.error = error
  }
  databaseState.loading = false
}

export async function retrieveTableRows (tableId: string, pageIndex = 0) {
  databaseState.loading = true
  const ITEMS_PER_PAGE = 20

  try {
    return await lckServices.tableRow.find({
      // eslint-disable-next-line @typescript-eslint/camelcase
      query: {
        table_id: tableId,
        $limit: ITEMS_PER_PAGE,
        $skip: pageIndex * ITEMS_PER_PAGE
      }
    })
  } catch (error) {
    databaseState.error = error
  }
  databaseState.loading = false
}

export async function retrieveTableRowsWithSkipAndLimit (
  tableId: string,
  {
    skip = 0,
    limit = 20,
    sort = {
      createdAt: 1
    },
    filters = []
  }
) {
  databaseState.loading = true
  try {
    const query: Record<string, string | number | object> = {
      table_id: tableId,
      $limit: limit,
      $skip: skip,
      $sort: sort
    }
    filters.forEach((f: { req: string; value: string }) => {
      query[f.req] = f.value
    })

    return await lckServices.tableRow.find({
      query
    })
  } catch (error) {
    databaseState.error = error
  }
  databaseState.loading = false
}

export async function retrieveTableViews (tableId: string) {
  databaseState.loading = true

  try {
    const result = await lckServices.tableView.find({
      // eslint-disable-next-line @typescript-eslint/camelcase
      query: {
        table_id: tableId,
        $eager: 'columns',
        $limit: 50
      }
    })
    return result.data.map((view: { columns: LckColumnView[] }) => ({
      ...view,
      columns: view.columns.slice(0).sort((a, b) => a.position - b.position)
    }))
  } catch (error) {
    databaseState.error = error
  }
  databaseState.loading = false
}

export async function saveTableData (formData: object) {
  databaseState.loading = true

  try {
    const result = await lckServices.tableRow.create(formData)
    databaseState.loading = false
    return result
  } catch ({ code, name }) {
    databaseState.loading = false
    return { code, name }
  }
}

export async function deleteTableData (rowId: string) {
  databaseState.loading = true

  try {
    const result = await lckServices.tableRow.remove(rowId)
    databaseState.loading = false
    return result
  } catch ({ code, name }) {
    databaseState.loading = false
    return { code, name }
  }
}

export async function patchTableData (rowId: string, formData: object) {
  databaseState.loading = true
  try {
    return await lckServices.tableRow.patch(rowId, formData)
  } catch ({ code, name }) {
    databaseState.error = new Error(`${code}: ${name}`)
  }
  databaseState.loading = false
}

export async function retrieveManualProcessTrigger (tableId: string) {
  databaseState.error = null

  try {
    const res = await lckServices.processTrigger.find({
      // eslint-disable-next-line @typescript-eslint/camelcase
      query: {
        table_id: tableId,
        event: 'MANUAL',
        $eager: 'executions'
      }
    })
    return res.data
  } catch (error) {
    databaseState.error = error
  }
  databaseState.loading = false
}

export async function retrieveProcessesByRow (tableId: string, rowId: string) {
  databaseState.error = null
  /*
    * Warning
    * Pagination is computed from the executions and no longer from the number of triggers.
    * So the skip information is wrong (it is always correlated to the trigger).
   */
  try {
    const res = await lckServices.processTrigger.find({
      // eslint-disable-next-line @typescript-eslint/camelcase
      query: {
        table_id: tableId,
        $eager: 'executions',
        $joinEager: 'executions',
        $sort: { createdAt: 1, 'executions.createdAt': -1 },
        $limit: -1
      }
    })
    return res.map((process: { executions: { table_row_id: string }[] }) => {
      if (process.executions.length > 0) {
        process.executions = [...process.executions.filter(exec => exec.table_row_id === rowId)]
      }
      return process
    })
  } catch (error) {
    databaseState.error = error
  }
  databaseState.loading = false
}

export async function createManualProcessExecution (formData: { process_trigger_id: string; table_row_id: string }) {
  databaseState.error = null

  try {
    return await lckServices.processExecution.create(formData)
  } catch (error) {
    databaseState.error = error
  }
  databaseState.loading = false
}

export async function patchProcessTrigger (processTriggerId: string, formData: object) {
  databaseState.loading = true
  try {
    return await lckServices.processTrigger.patch(processTriggerId, formData)
  } catch ({ code, name }) {
    databaseState.error = new Error(`${code}: ${name}`)
  }
  databaseState.loading = false
}
