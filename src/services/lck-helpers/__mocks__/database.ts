/* eslint-disable @typescript-eslint/camelcase */
import { lckServices } from '@/services/lck-api'
import { LckTableColumn, LckTableView } from '@/services/lck-api/definitions'
import { Paginated } from '@feathersjs/feathers'

export const mockDatabase = {
  id: 'D1',
  text: 'Base principale',
  createdAt: '2020-11-02T16:11:03.109Z',
  updatedAt: '2020-11-02T16:11:03.109Z',
  workspace_id: 'W1',
  tables: [
    {
      id: 'T1',
      text: 'Personne',
      createdAt: '2020-11-02T16:11:03.109Z',
      updatedAt: '2020-11-02T16:11:03.109Z',
      database_id: 'D1',
      views: [
        {
          id: 'V11',
          text: 'Vue - bénéficiaires',
          createdAt: '2021-01-29T10:38:30.213Z',
          updatedAt: '2021-02-08T10:42:32.622Z',
          table_id: 'T1',
          locked: false,
          columns: [
            {
              id: 'C11',
              text: 'Prénom',
              createdAt: '2020-11-02T16:11:03.109Z',
              updatedAt: '2020-11-02T16:11:03.109Z',
              settings: null,
              position: 1,
              reference: true,
              reference_position: 0,
              table_id: 'T1',
              column_type_id: 2,
              locked: false,
              displayed: false,
              filter: null,
              transmitted: true,
              editable: true,
              style: {
                width: 128
              },
              default: null
            },
            {
              id: 'C13',
              text: 'E-mail',
              createdAt: '2020-11-02T16:11:03.109Z',
              updatedAt: '2021-02-09T08:29:25.368Z',
              settings: {},
              position: 2,
              reference: false,
              reference_position: null,
              table_id: 'T1',
              column_type_id: 2,
              locked: false,
              displayed: true,
              filter: null,
              transmitted: true,
              editable: null,
              style: {
                width: 352
              },
              default: null
            },
            {
              id: 'C12',
              text: 'Nom',
              createdAt: '2020-11-02T16:11:03.109Z',
              updatedAt: '2020-11-02T16:11:03.109Z',
              settings: null,
              position: 3,
              reference: true,
              reference_position: 1,
              table_id: 'T1',
              column_type_id: 2,
              locked: false,
              displayed: true,
              filter: null,
              transmitted: true,
              editable: null,
              style: {
                width: 153
              },
              default: null
            }
          ]
        },
        {
          id: 'V12',
          text: 'Vue - Prénom',
          createdAt: '2021-01-29T10:38:30.213Z',
          updatedAt: '2021-02-08T10:42:32.622Z',
          table_id: 'T1',
          locked: false,
          columns: [
            {
              id: 'C11',
              text: 'Prénom',
              createdAt: '2020-11-02T16:11:03.109Z',
              updatedAt: '2020-11-02T16:11:03.109Z',
              settings: null,
              position: 1,
              reference: true,
              reference_position: 0,
              table_id: 'T1',
              column_type_id: 2,
              locked: false,
              displayed: false,
              filter: null,
              transmitted: true,
              editable: true,
              style: {
                width: 128
              },
              default: null
            }
          ]
        }
      ],
      columns: [
        {
          id: 'C11',
          text: 'Prénom',
          createdAt: '2020-11-02T16:11:03.109Z',
          updatedAt: '2020-11-02T16:11:03.109Z',
          settings: null,
          position: 0,
          reference: true,
          reference_position: 0,
          table_id: 'T1',
          column_type_id: 2,
          locked: false
        },
        {
          id: 'C12',
          text: 'Nom',
          createdAt: '2020-11-02T16:11:03.109Z',
          updatedAt: '2020-11-02T16:11:03.109Z',
          settings: null,
          position: 1,
          reference: true,
          reference_position: 1,
          table_id: 'T1',
          column_type_id: 2,
          locked: false
        },
        {
          id: 'C13',
          text: 'E-mail',
          createdAt: '2020-11-02T16:11:03.109Z',
          updatedAt: '2021-02-09T08:29:25.368Z',
          settings: {},
          position: 2,
          reference: false,
          reference_position: null,
          table_id: 'T1',
          column_type_id: 2,
          locked: false
        },
        {
          id: 'C14',
          text: 'Tél',
          createdAt: '2020-11-02T16:11:03.109Z',
          updatedAt: '2020-11-02T16:11:03.109Z',
          settings: null,
          position: 3,
          reference: false,
          reference_position: null,
          table_id: 'T1',
          column_type_id: 2,
          locked: false
        },
        {
          id: 'C15',
          text: 'Utilisateur',
          createdAt: '2020-11-02T16:11:03.109Z',
          updatedAt: '2020-11-02T16:11:03.109Z',
          settings: null,
          position: 4,
          reference: false,
          reference_position: null,
          table_id: 'T1',
          column_type_id: 6,
          locked: false
        }
      ]
    },
    {
      id: 'T2',
      text: 'Fournisseur',
      createdAt: '2020-11-02T16:11:03.109Z',
      updatedAt: '2020-11-02T16:11:03.109Z',
      database_id: 'D1',
      views: [
        {
          id: 'V11',
          text: 'Ensemble des fournisseurs',
          createdAt: '2020-11-02T16:11:03.109Z',
          updatedAt: '2020-11-02T16:11:03.109Z',
          table_id: 'T2',
          locked: false,
          columns: [
            {
              id: 'C21',
              text: 'Utilisateur',
              createdAt: '2020-11-02T16:11:03.109Z',
              updatedAt: '2020-11-02T16:11:03.109Z',
              settings: null,
              position: 1,
              reference: false,
              reference_position: null,
              table_id: 'T2',
              column_type_id: 6,
              locked: false,
              displayed: true,
              filter: null,
              transmitted: true,
              editable: true,
              style: {
                width: 337
              },
              default: null
            },
            {
              id: 'C22',
              text: 'Nom fournisseur',
              createdAt: '2020-11-02T16:11:03.109Z',
              updatedAt: '2020-11-02T16:11:03.109Z',
              settings: null,
              position: 0,
              reference: true,
              reference_position: null,
              table_id: 'T2',
              column_type_id: 2,
              locked: false,
              displayed: true,
              filter: null,
              transmitted: true,
              editable: true,
              style: {
                width: 164
              },
              default: null
            }
          ]
        }
      ],
      columns: [
        {
          id: 'C21',
          text: 'Nom fournisseur',
          createdAt: '2020-11-02T16:11:03.109Z',
          updatedAt: '2020-11-02T16:11:03.109Z',
          settings: null,
          position: 0,
          reference: true,
          reference_position: null,
          table_id: 'T2',
          column_type_id: 2,
          locked: false
        },
        {
          id: 'C22',
          text: 'Utilisateur',
          createdAt: '2020-11-02T16:11:03.109Z',
          updatedAt: '2020-11-02T16:11:03.109Z',
          settings: null,
          position: 2,
          reference: false,
          reference_position: null,
          table_id: 'T2',
          column_type_id: 6,
          locked: false
        }
      ]
    }
  ]
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function retrieveDatabaseTableAndViewsDefinitions (databaseId: string) {
  return mockDatabase
}

export async function retrieveTableColumns (tableId: string) {
  // return [{
  //   id: 'column-1'
  // }]
  return await lckServices.tableColumn.find({
    // eslint-disable-next-line @typescript-eslint/camelcase
    query: {
      table_id: tableId,
      $limit: -1,
      $sort: {
        position: 1
      },
      $eager: 'parents.^'
    }
  }) as LckTableColumn[]
}

export async function retrieveTableRowsWithSkipAndLimit (
  tableId: string,
  groupId: string,
  {
    skip = 0,
    limit = 20,
    sort = {
      createdAt: 1
    },
    filters = {}
  }
) {
  return await lckServices.tableRow.find({
    query: {
      table_id: tableId,
      $lckGroupId: groupId,
      $limit: limit,
      $skip: skip,
      $sort: sort,
      ...filters
    }
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
        position: 1
      }
    }
  }) as Paginated<LckTableView>
  return result.data.map(view => ({
    ...view,
    columns: view.columns?.slice(0).sort((a, b) => a.position - b.position)
  }))
}
