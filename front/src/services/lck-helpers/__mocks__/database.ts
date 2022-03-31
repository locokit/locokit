/* eslint-disable @typescript-eslint/camelcase */
import { lckServices } from '@/services/lck-api'
import { LckAttachment, LckDatabase, LckTableRow, LckTableView, SORT_COLUMN } from '@/services/lck-api/definitions'
import { Paginated } from '@feathersjs/feathers'

// Table columns
const firstNameColumn = {
  id: 'C11',
  text: 'Prénom',
  slug: 'Prénom',
  createdAt: '2020-11-02T16:11:03.109Z',
  updatedAt: '2020-11-02T16:11:03.109Z',
  settings: {},
  position: 1,
  reference: true,
  reference_position: 0,
  table_id: 'T1',
  column_type_id: 2,
  locked: false,
}

const lastNameColumn = {
  id: 'C12',
  text: 'Nom',
  slug: 'Nom',
  createdAt: '2020-11-02T16:11:03.109Z',
  updatedAt: '2020-11-02T16:11:03.109Z',
  settings: {},
  position: 2,
  reference: true,
  reference_position: 1,
  table_id: 'T1',
  column_type_id: 2,
  locked: false,
}

const emailColumn = {
  id: 'C13',
  text: 'E-mail',
  slug: 'E-mail',
  createdAt: '2020-11-02T16:11:03.109Z',
  updatedAt: '2021-02-09T08:29:25.368Z',
  settings: {},
  position: 3,
  reference: false,
  reference_position: 0,
  table_id: 'T1',
  column_type_id: 2,
  locked: false,
}

const phoneColumn = {
  id: 'C14',
  text: 'Tél',
  slug: 'Tél',
  createdAt: '2020-11-02T16:11:03.109Z',
  updatedAt: '2020-11-02T16:11:03.109Z',
  settings: {},
  position: 4,
  reference: false,
  reference_position: 0,
  table_id: 'T1',
  column_type_id: 2,
  locked: false,
}

const userColumn = {
  id: 'C15',
  text: 'Utilisateur',
  slug: 'Utilisateur',
  createdAt: '2020-11-02T16:11:03.109Z',
  updatedAt: '2020-11-02T16:11:03.109Z',
  settings: {},
  position: 5,
  reference: false,
  reference_position: 0,
  table_id: 'T1',
  column_type_id: 6,
  locked: false,
}

const isActiveColumn = {
  id: 'C16',
  text: 'Est actif',
  slug: 'Est actif',
  createdAt: '2020-11-02T16:11:03.109Z',
  updatedAt: '2020-11-02T16:11:03.109Z',
  settings: {},
  position: 6,
  reference: false,
  reference_position: 0,
  table_id: 'T1',
  column_type_id: 1,
  locked: false,
}

const integerColumn = {
  id: 'C17',
  text: 'Nombre entier',
  slug: 'Nombre entier',
  createdAt: '2020-11-02T16:11:03.109Z',
  updatedAt: '2020-11-02T16:11:03.109Z',
  settings: {},
  position: 7,
  reference: false,
  reference_position: 0,
  table_id: 'T1',
  column_type_id: 3,
  locked: false,
}

const decimalColumn = {
  id: 'C18',
  text: 'Nombre décimal',
  slug: 'Nombre décimal',
  createdAt: '2020-11-02T16:11:03.109Z',
  updatedAt: '2020-11-02T16:11:03.109Z',
  settings: {},
  position: 8,
  reference: false,
  reference_position: 0,
  table_id: 'T1',
  column_type_id: 4,
  locked: false,
}

const dateColumn = {
  id: 'C19',
  text: 'Date',
  slug: 'Date',
  createdAt: '2020-11-02T16:11:03.109Z',
  updatedAt: '2020-11-02T16:11:03.109Z',
  settings: {},
  position: 9,
  reference: false,
  reference_position: 0,
  table_id: 'T1',
  column_type_id: 5,
  locked: false,
}

const groupColumn = {
  id: 'C110',
  text: 'Groupe',
  slug: 'Groupe',
  createdAt: '2020-11-02T16:11:03.109Z',
  updatedAt: '2020-11-02T16:11:03.109Z',
  settings: {},
  position: 10,
  reference: false,
  reference_position: 0,
  table_id: 'T1',
  column_type_id: 7,
  locked: false,
}

const linkColumn = {
  id: 'C111',
  text: 'Lien',
  slug: 'Lien',
  createdAt: '2020-11-02T16:11:03.109Z',
  updatedAt: '2020-11-02T16:11:03.109Z',
  settings: {
    tableId: 'T2',
  },
  position: 11,
  reference: false,
  reference_position: 0,
  table_id: 'T1',
  column_type_id: 8,
  locked: false,
}

const colorColumn = {
  id: 'C112',
  text: 'Couleur',
  slug: 'Couleur',
  createdAt: '2020-11-02T16:11:03.109Z',
  updatedAt: '2020-11-02T16:11:03.109Z',
  settings: {
    values: {
      option1: {
        value: 'option1',
        color: '#FFF',
        backgroundColor: '#00F',
        label: 'red',
      },
      option2: {
        value: 'option2',
        color: '#FFF',
        backgroundColor: '#0F0',
        label: 'green',
      },
      option3: {
        value: 'option3',
        color: '#FFF',
        backgroundColor: '#00F',
        label: 'blue',
      },
    },
  },
  position: 12,
  reference: false,
  reference_position: 0,
  table_id: 'T1',
  column_type_id: 10,
  locked: false,
}

const colorsColumn = {
  id: 'C113',
  text: 'Couleurs',
  slug: 'Couleurs',
  createdAt: '2020-11-02T16:11:03.109Z',
  updatedAt: '2020-11-02T16:11:03.109Z',
  settings: {
    values: {
      option1: {
        value: 'option1',
        color: '#FFF',
        backgroundColor: '#00F',
        label: 'red',
      },
      option2: {
        value: 'option2',
        color: '#FFF',
        backgroundColor: '#0F0',
        label: 'green',
      },
      option3: {
        value: 'option3',
        color: '#FFF',
        backgroundColor: '#00F',
        label: 'blue',
      },
    },
  },
  position: 13,
  reference: false,
  reference_position: 0,
  table_id: 'T1',
  column_type_id: 11,
  locked: false,
}

const fileColumn = {
  id: 'C114',
  text: 'Fichier',
  slug: 'Fichier',
  createdAt: '2020-11-02T16:11:03.109Z',
  updatedAt: '2020-11-02T16:11:03.109Z',
  settings: {},
  position: 14,
  reference: false,
  reference_position: 0,
  table_id: 'T1',
  column_type_id: 13,
  locked: false,
}

const usersColumn = {
  id: 'C115',
  text: 'Utilisateurs',
  slug: 'Utilisateurs',
  createdAt: '2020-11-02T16:11:03.109Z',
  updatedAt: '2020-11-02T16:11:03.109Z',
  settings: {},
  position: 15,
  reference: false,
  reference_position: 0,
  table_id: 'T1',
  column_type_id: 14,
  locked: false,
}

const textColumn = {
  id: 'C116',
  text: 'Texte long',
  slug: 'slug long',
  createdAt: '2020-11-02T16:11:03.109Z',
  updatedAt: '2020-11-02T16:11:03.109Z',
  settings: {},
  position: 16,
  reference: false,
  reference_position: 0,
  table_id: 'T1',
  column_type_id: 16,
  locked: false,
}

const urlColumn = {
  id: 'C117',
  text: 'URL',
  slug: 'URL',
  createdAt: '2020-11-02T16:11:03.109Z',
  updatedAt: '2020-11-02T16:11:03.109Z',
  settings: {},
  position: 17,
  reference: false,
  reference_position: 3,
  table_id: 'T1',
  column_type_id: 17,
  locked: false,
}

const geoColumn = {
  id: 'C118',
  text: 'Coordonnées géographiques',
  slug: 'Coordonnées géographiques',
  createdAt: '2020-11-02T16:11:03.109Z',
  updatedAt: '2020-11-02T16:11:03.109Z',
  settings: {},
  position: 18,
  reference: false,
  reference_position: 0,
  table_id: 'T1',
  column_type_id: 18,
  locked: false,
}

const datetimeColumn = {
  id: 'C119',
  text: 'Heure',
  slug: 'Heure',
  createdAt: '2020-11-02T16:11:03.109Z',
  updatedAt: '2020-11-02T16:11:03.109Z',
  settings: {},
  position: 19,
  reference: false,
  reference_position: 0,
  table_id: 'T1',
  column_type_id: 21,
  locked: false,
}

const multiGeoColumn = {
  id: 'C120',
  text: 'Zones géographiques',
  slug: 'Zones géographiques',
  createdAt: '2020-11-02T16:11:03.109Z',
  updatedAt: '2020-11-02T16:11:03.109Z',
  settings: {},
  position: 20,
  reference: false,
  reference_position: 0,
  table_id: 'T1',
  column_type_id: 18,
  locked: false,
}

export const mockDatabase: LckDatabase = {
  id: 'D1',
  text: 'Base principale',
  createdAt: '2020-11-02T16:11:03.109Z',
  updatedAt: '2020-11-02T16:11:03.109Z',
  workspace_id: 'W1',
  tables: [
    {
      id: 'T1',
      text: 'Personne',
      slug: 'Personne',
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
          filter: {
            operator: '$and',
            values: [
              {
                column: 'C11',
                action: 'isEqualTo',
                dbAction: '$eq',
                pattern: 'John',
              },
            ],
          },
          columns: [
            {
              ...firstNameColumn,
              displayed: true,
              filter: [],
              transmitted: true,
              editable: true,
              style: {
                width: 128,
              },
              default: {},
              table_column_id: 'C11',
              table_view_id: 'V11',
              required: false,
              sort: SORT_COLUMN.ASC,
            },
            {
              ...emailColumn,
              displayed: true,
              filter: [],
              transmitted: true,
              editable: true,
              style: {
                width: 352,
              },
              default: {},
              table_column_id: 'C13',
              table_view_id: 'V11',
              required: false,
              sort: SORT_COLUMN.ASC,
            },
            {
              ...lastNameColumn,
              displayed: true,
              filter: [],
              transmitted: true,
              editable: true,
              style: {
                width: 153,
              },
              default: {},
              table_column_id: 'C12',
              table_view_id: 'V11',
              required: false,
              sort: SORT_COLUMN.ASC,
            },
            ...[
              phoneColumn,
              userColumn,
              isActiveColumn,
              integerColumn,
              decimalColumn,
              dateColumn,
              groupColumn,
              linkColumn,
              colorColumn,
              colorsColumn,
              fileColumn,
              usersColumn,
              textColumn,
              urlColumn,
              geoColumn,
              datetimeColumn,
            ].map(column => ({
              ...column,
              displayed: true,
              filter: [],
              transmitted: true,
              editable: true,
              style: {
                width: 153,
              },
              default: {},
              table_column_id: column.id,
              table_view_id: 'V11',
              required: false,
              sort: SORT_COLUMN.ASC,
            })),
          ],
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
              ...firstNameColumn,
              displayed: false,
              filter: [],
              transmitted: true,
              editable: true,
              style: {
                width: 128,
              },
              default: {},
              table_column_id: 'C11',
              table_view_id: 'V12',
              required: false,
              sort: SORT_COLUMN.ASC,
            },
          ],
        },
      ],
      columns: [
        firstNameColumn,
        lastNameColumn,
        emailColumn,
        phoneColumn,
        userColumn,
        isActiveColumn,
        integerColumn,
        decimalColumn,
        dateColumn,
        groupColumn,
        linkColumn,
        colorColumn,
        colorsColumn,
        fileColumn,
        usersColumn,
        textColumn,
        urlColumn,
        geoColumn,
        datetimeColumn,
        multiGeoColumn,
      ],
    },
    {
      id: 'T2',
      text: 'Fournisseur',
      slug: 'Fournisseur',
      createdAt: '2020-11-02T16:11:03.109Z',
      updatedAt: '2020-11-02T16:11:03.109Z',
      database_id: 'D1',
      views: [
        {
          id: 'V21',
          text: 'Ensemble des fournisseurs',
          createdAt: '2020-11-02T16:11:03.109Z',
          updatedAt: '2020-11-02T16:11:03.109Z',
          table_id: 'T2',
          locked: false,
          columns: [
            {
              id: 'C21',
              text: 'Utilisateur',
              slug: 'Utilisateur',
              createdAt: '2020-11-02T16:11:03.109Z',
              updatedAt: '2020-11-02T16:11:03.109Z',
              settings: {},
              position: 0,
              reference: false,
              reference_position: 0,
              table_id: 'T2',
              column_type_id: 6,
              locked: false,
              displayed: true,
              filter: [],
              transmitted: true,
              editable: true,
              style: {
                width: 337,
              },
              default: {},
              table_column_id: 'C21',
              table_view_id: 'V21',
              required: false,
              sort: SORT_COLUMN.ASC,
            },
            {
              id: 'C22',
              text: 'Nom fournisseur',
              slug: 'Nom fournisseur',
              createdAt: '2020-11-02T16:11:03.109Z',
              updatedAt: '2020-11-02T16:11:03.109Z',
              settings: {},
              position: 1,
              reference: true,
              reference_position: 0,
              table_id: 'T2',
              column_type_id: 2,
              locked: false,
              displayed: true,
              filter: [],
              transmitted: true,
              editable: true,
              style: {
                width: 164,
              },
              default: {},
              table_column_id: 'C22',
              table_view_id: 'V21',
              required: false,
              sort: SORT_COLUMN.ASC,
            },
          ],
        },
      ],
      columns: [
        {
          id: 'C21',
          text: 'Nom fournisseur',
          slug: 'Nom fournisseur',
          createdAt: '2020-11-02T16:11:03.109Z',
          updatedAt: '2020-11-02T16:11:03.109Z',
          settings: {},
          position: 0,
          reference: true,
          reference_position: 0,
          table_id: 'T2',
          column_type_id: 2,
          locked: false,
        },
        {
          id: 'C22',
          text: 'Utilisateur',
          slug: 'Utilisateur',
          createdAt: '2020-11-02T16:11:03.109Z',
          updatedAt: '2020-11-02T16:11:03.109Z',
          settings: {},
          position: 2,
          reference: false,
          reference_position: 0,
          table_id: 'T2',
          column_type_id: 6,
          locked: false,
        },
      ],
    },
  ],
}

export const mockFile1: LckAttachment = {
  id: 1,
  ext: 'PDF',
  filename: 'file.pdf',
  filepath: 'http://www.locokit.io/docs/file.pdf',
  mime: 'application/pdf',
  thumbnail: false,
  size: 10030,
  workspace_id: 'W1',
}

export const mockFile2: LckAttachment = {
  id: 2,
  ext: 'PDF',
  filename: 'file2.pdf',
  filepath: 'http://www.locokit.io/docs/file2.pdf',
  mime: 'application/pdf',
  thumbnail: false,
  size: 10030,
  workspace_id: 'W1',
}

export const mockRowsByTable: Record<string, LckTableRow[]> = {
  T1: [
    {
      id: 'row-1',
      text: 'John Doe',
      data: {
        [firstNameColumn.id]: 'John',
        [lastNameColumn.id]: 'Doe',
        [emailColumn.id]: 'john.doe@locokit.io',
        [phoneColumn.id]: '0101010101',
        [userColumn.id]: {
          reference: 'user-1',
          value: 'John Doe',
        },
        [isActiveColumn.id]: true,
        [integerColumn.id]: 1,
        [decimalColumn.id]: 1.5,
        [dateColumn.id]: '2021-09-01',
        [groupColumn.id]: {
          reference: 'group-1',
          value: 'Group 1',
        },
        [linkColumn.id]: {
          reference: 'row-2b',
          value: 'Supplier 2',
        },
        [colorColumn.id]: 'option1',
        [colorsColumn.id]: ['option1', 'option2'],
        [fileColumn.id]: [mockFile1, mockFile2],
        [usersColumn.id]: {
          reference: ['user-1', 'user-3'],
          value: ['John Doe', 'Frank Foe'],
        },
        [textColumn.id]: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        [urlColumn.id]: 'https://www.locokit.io',
        [geoColumn.id]: 'SRID=4326;POINT(1.1 45)',
        [datetimeColumn.id]: '2021-09-01T12:00:00Z',
      },
    },
    {
      id: 'row-2',
      text: 'Jane Poe',
      data: {
        [firstNameColumn.id]: 'Jane',
        [lastNameColumn.id]: 'Poe',
        [emailColumn.id]: 'jane.poe@locokit.io',
        [phoneColumn.id]: '0202020202',
        [userColumn.id]: {
          reference: 'user-2',
          value: 'Jane Poe',
        },
        [isActiveColumn.id]: false,
        [integerColumn.id]: 2,
        [decimalColumn.id]: 2.5,
        [dateColumn.id]: '2021-09-02',
        [groupColumn.id]: {
          reference: 'group-1',
          value: 'Group 1',
        },
        [linkColumn.id]: {
          reference: 'row-1b',
          value: 'Supplier 1',
        },
        [colorColumn.id]: 'option2',
        [colorsColumn.id]: ['option1', 'option2'],
        [fileColumn.id]: [mockFile1],
        [usersColumn.id]: {
          reference: ['user-2', 'user-4'],
          value: ['Jane Poe', 'Karren Koe'],
        },
        [textColumn.id]: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        [urlColumn.id]: 'https://www.locokit.io',
        [geoColumn.id]: 'SRID=4326;POINT(1.2 45)',
        [datetimeColumn.id]: '2021-09-02T12:00:00Z',
      },
    },
    {
      id: 'row-3',
      text: 'Frank Foe',
      data: {
        [firstNameColumn.id]: 'Frank',
        [lastNameColumn.id]: 'Foe',
        [emailColumn.id]: 'frank.foe@locokit.io',
        [phoneColumn.id]: '0303030303',
        [userColumn.id]: {
          reference: 'user-3',
          value: 'Frank Foe',
        },
        [isActiveColumn.id]: false,
        [integerColumn.id]: 3,
        [decimalColumn.id]: 3.5,
        [dateColumn.id]: '2021-09-03',
        [groupColumn.id]: {
          reference: 'group-2',
          value: 'Group 2',
        },
        [linkColumn.id]: {
          reference: 'row-2b',
          value: 'Supplier 2',
        },
        [colorColumn.id]: 'option3',
        [colorsColumn.id]: ['option2', 'option3'],
        [fileColumn.id]: [mockFile2],
        [usersColumn.id]: {
          reference: ['user-1', 'user-3'],
          value: ['John Doe', 'Frank Foe'],
        },
        [textColumn.id]: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        [urlColumn.id]: 'https://www.locokit.io',
        [geoColumn.id]: 'SRID=4326;POINT(1.3 45)',
        [datetimeColumn.id]: '2021-09-03T12:00:00Z',
      },
    },
    {
      id: 'row-4',
      text: 'Karren Koe',
      data: {
        [firstNameColumn.id]: 'Karren',
        [lastNameColumn.id]: 'Koe',
        [emailColumn.id]: 'karren.koe@locokit.io',
        [phoneColumn.id]: '0304040404',
        [userColumn.id]: {
          reference: 'user-5',
          value: 'Karren Koe',
        },
        [isActiveColumn.id]: true,
        [integerColumn.id]: 4,
        [decimalColumn.id]: 4.5,
        [dateColumn.id]: '2021-09-04',
        [groupColumn.id]: {
          reference: 'group-1',
          value: 'Group 1',
        },
        [linkColumn.id]: {
          reference: 'row-1b',
          value: 'Supplier 1',
        },
        [colorColumn.id]: 'option1',
        [colorsColumn.id]: ['option3', 'option1'],
        [fileColumn.id]: [mockFile1],
        [usersColumn.id]: {
          reference: ['user-2', 'user-4'],
          value: ['Jane Poe', 'Karren Koe'],
        },
        [textColumn.id]: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        [urlColumn.id]: 'https://www.locokit.io',
        [geoColumn.id]: 'SRID=4326;POINT(1.4 45)',
        [datetimeColumn.id]: '2021-09-04T12:00:00Z',
      },
    },
  ],
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function retrieveDatabaseTableAndViewsDefinitions (databaseId: string) {
  return mockDatabase
}

export async function retrieveTableColumns (/* tableId: string */) {
  return [{
    id: 'column-1',
  }]
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
