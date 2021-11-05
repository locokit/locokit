/* eslint-disable @typescript-eslint/camelcase */
import { lckServices } from '@/services/lck-api'
import { LckTableColumn, LckTableView } from '@/services/lck-api/definitions'
import { Paginated } from '@feathersjs/feathers'

export async function retrieveDatabaseTableAndViewsDefinitions (databaseId: string) {
  const result = await lckServices.database.get(databaseId, {
    query: {
      $eager: '[tables.[columns,views.[columns]]]',
    },
  })
  return result
}

export async function retrieveTableColumns (tableId: string) {
  return await lckServices.tableColumn.find({
    // eslint-disable-next-line @typescript-eslint/camelcase
    query: {
      table_id: tableId,
      $limit: -1,
      $sort: {
        position: 1,
      },
      $eager: 'parents.^',
    },
  }) as LckTableColumn[]
}

export async function retrieveTableRowsWithSkipAndLimit (
  tableId: string,
  groupId: string,
  {
    skip = 0,
    limit = 20,
    sort = {
      createdAt: 1,
    },
    filters = {},
  },
) {
  return await lckServices.tableRow.find({
    query: {
      table_id: tableId,
      $lckGroupId: groupId,
      $limit: limit,
      $skip: skip,
      $sort: sort,
      ...filters,
    },
  })
}

export async function retrieveTableViews (tableId: string) {
  const result = await lckServices.tableView.find({
    // eslint-disable-next-line @typescript-eslint/camelcase
    query: {
      table_id: tableId,
      $eager: '[columns.[parents.^], actions]',
      $limit: 50,
      $sort: {
        position: 1,
      },
    },
  }) as Paginated<LckTableView>
  return result.data.map(view => ({
    ...view,
    columns: view.columns?.slice(0).sort((a, b) => a.position - b.position),
  }))
}
