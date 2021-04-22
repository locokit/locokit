import { COLUMN_TYPE } from '@locokit/lck-glossary'
import app from '../../app'
import { TableColumn } from '../../models/tablecolumn.model'
import { database } from '../../models/database.model'
import { Table } from '../../models/table.model'
import { workspace } from '../../models/workspace.model'
import { NotAcceptable } from '@feathersjs/errors'

// const geometryPolygon = {
//   type: 'Feature',
//   properties: {},
//   geometry: {
//     type: 'Polygon',
//     coordinates: [
//       [
//         [
//           16.6552734375,
//           53.93021986394
//         ],
//         [
//           11.689453125,
//           56.36525013685606
//         ],
//         [
//           2.0654296875,
//           57.20771009775018
//         ],
//         [
//           -6.328125,
//           54.13669645687002
//         ],
//         [
//           -4.7900390625,
//           47.78363463526376
//         ],
//         [
//           0.615234375,
//           45.02695045318546
//         ],
//         [
//           9.5361328125,
//           40.84706035607122
//         ],
//         [
//           24.6533203125,
//           51.09662294502995
//         ],
//         [
//           6.767578125,
//           50.48547354578499
//         ],
//         [
//           16.6552734375,
//           53.93021986394
//         ]
//       ]
//     ]
//   }
// }
// const geometryPoint = {
//   type: 'Feature',
//   properties: {},
//   geometry: {
//     type: 'Point',
//     coordinates: [
//       29.003906249999996,
//       54.54657953840501
//     ]
//   }
// }
// const geometryLinestring = {
//   type: 'Feature',
//   properties: {},
//   geometry: {
//     type: 'LineString',
//     coordinates: [
//       [
//         37.265625,
//         52.5897007687178
//       ],
//       [
//         41.484375,
//         46.89023157359399
//       ],
//       [
//         29.9267578125,
//         41.409775832009565
//       ],
//       [
//         21.4892578125,
//         38.788345355085625
//       ],
//       [
//         18.6767578125,
//         41.80407814427234
//       ],
//       [
//         17.05078125,
//         45.67548217560647
//       ],
//       [
//         16.083984375,
//         50.875311142200765
//       ],
//       [
//         21.3134765625,
//         53.51418452077113
//       ],
//       [
//         28.652343749999996,
//         54.7246201949245
//       ],
//       [
//         31.1572265625,
//         54.87660665410869
//       ],
//       [
//         32.7392578125,
//         54.18815548107151
//       ],
//       [
//         31.201171875,
//         50.708634400828224
//       ]
//     ]
//   }
// }

const ewktPolygon = 'SRID=4326;POLYGON ((16.6552734375 53.93021986394,11.689453125 56.3652501368561,2.0654296875 57.2077100977502,-6.328125 54.13669645687,-4.7900390625 47.7836346352638,0.615234375 45.0269504531855,9.5361328125 40.8470603560712,24.6533203125 51.0966229450299,6.767578125 50.485473545785,16.6552734375 53.93021986394))'
const ewktPolygonWithInjection = 'SRID=4326;POLYGON ((16.6552734375 53.93021986394,11.689453125 56.3652501368561,2.0654296875 57.2077100977502,-6.328125 54.13669645687,-4.7900390625 47.7836346352638,0.615234375 45.0269504531855,9.5361328125 40.8470603560712,24.6533203125 51.0966229450299,6.767578125 50.485473545785,16.6552734375 53.93021986394))\')); DROP TABLE table_row; SELECT ((\'1'
const ewktPoint = 'SRID=4326;POINT (29.00390625 54.546579538405)'
const ewktLinestring = 'SRID=4326;LINESTRING (37.265625 52.5897007687178,41.484375 46.890231573594,29.9267578125 41.4097758320096,21.4892578125 38.7883453550856,18.6767578125 41.8040781442723,17.05078125 45.6754821756065,16.083984375 50.8753111422008,21.3134765625 53.5141845207711,28.65234375 54.7246201949245,31.1572265625 54.8766066541087,32.7392578125 54.1881554810715,31.201171875 50.7086344008282)'

describe('checkColumnDefinitionMatching hook', () => {
  let workspace: workspace
  let database: database
  let table1: Table
  let table2: Table
  let columnTable1Boolean: TableColumn
  let columnTable1Number: TableColumn
  let columnTable1Date: TableColumn
  let columnTable1String: TableColumn
  let columnTable1Float: TableColumn
  let columnTable1User: TableColumn
  let columnTable1Group: TableColumn
  let columnTable1RelationBetweenTables: TableColumn
  let columnTable1LookedUpColumn: TableColumn
  let columnTable1SingleSelect: TableColumn
  let columnTable1MultiSelect: TableColumn
  let columnTable1Formula: TableColumn
  let columnTable1File: TableColumn
  let columnTable1MultiUser: TableColumn
  let columnTable1MultiGroup: TableColumn
  let columnTable1Text: TableColumn
  let columnTable1URL: TableColumn
  let columnTable1GeomPoint: TableColumn
  let columnTable1GeomPolygon: TableColumn
  let columnTable1GeomLinestring: TableColumn
  let columnTable2Ref: TableColumn
  let columnTable2Name: TableColumn
  // let user1: User
  // let group1: Group
  const singleSelectOption1UUID = '1efa77d0-c07a-4d3e-8677-2c19c6a26ecd'
  const singleSelectOption2UUID = 'c1d336fb-438f-4709-963f-5f159c147781'
  const singleSelectOption3UUID = '4b50ce84-2450-47d7-9409-2f319b547efd'

  beforeAll(async () => {
    workspace = await app.service('workspace').create({ text: 'pouet' })
    database = await app.service('database').create({ text: 'pouet', workspace_id: workspace.id })
    table1 = await app.service('table').create({
      text: 'table1',
      database_id: database.id,
    })
    table2 = await app.service('table').create({
      text: 'table2',
      database_id: database.id,
    })
    columnTable2Ref = await app.service('column').create({
      text: 'Ref',
      column_type_id: COLUMN_TYPE.STRING,
      table_id: table2.id,
    })
    columnTable2Name = await app.service('column').create({
      text: 'Name',
      column_type_id: COLUMN_TYPE.STRING,
      table_id: table2.id,
    })
    columnTable1Boolean = await app.service('column').create({
      text: 'Boolean',
      column_type_id: COLUMN_TYPE.BOOLEAN,
      table_id: table1.id,
    })
    columnTable1Number = await app.service('column').create({
      text: 'Number',
      column_type_id: COLUMN_TYPE.NUMBER,
      table_id: table1.id,
    })
    columnTable1Date = await app.service('column').create({
      text: 'Date',
      column_type_id: COLUMN_TYPE.DATE,
      table_id: table1.id,
    })
    columnTable1String = await app.service('column').create({
      text: 'String',
      column_type_id: COLUMN_TYPE.STRING,
      table_id: table1.id,
    })
    columnTable1Float = await app.service('column').create({
      text: 'Float',
      column_type_id: COLUMN_TYPE.FLOAT,
      table_id: table1.id,
    })
    columnTable1User = await app.service('column').create({
      text: 'User',
      column_type_id: COLUMN_TYPE.USER,
      table_id: table1.id,
    })
    columnTable1Group = await app.service('column').create({
      text: 'Group',
      column_type_id: COLUMN_TYPE.GROUP,
      table_id: table1.id,
    })
    columnTable1RelationBetweenTables = await app.service('column').create({
      text: 'RelationBetweenTables',
      column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
      table_id: table1.id,
      settings: {
        tableId: table2.id,
      },
    })
    columnTable1LookedUpColumn = await app.service('column').create({
      text: 'LookedUpColumn',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table1.id,
      settings: {
        tableId: table1.id,
        localField: columnTable1RelationBetweenTables.id,
        foreignField: columnTable2Name.id,
      },
    })
    columnTable1SingleSelect = await app.service('column').create({
      text: 'SingleSelect',
      column_type_id: COLUMN_TYPE.SINGLE_SELECT,
      table_id: table1.id,
      settings: {
        values: {
          [singleSelectOption1UUID]: {
            label: 'option 1',
          },
          [singleSelectOption2UUID]: {
            label: 'option 2',
          },
          [singleSelectOption3UUID]: {
            label: 'option 3',
          },
        },
      },
    })
    columnTable1MultiSelect = await app.service('column').create({
      text: 'MultiSelect',
      column_type_id: COLUMN_TYPE.MULTI_SELECT,
      table_id: table1.id,
      settings: {
        values: {
          [singleSelectOption1UUID]: {
            label: 'option 1',
          },
          [singleSelectOption2UUID]: {
            label: 'option 2',
          },
          [singleSelectOption3UUID]: {
            label: 'option 3',
          },
        },
      },
    })
    columnTable1Formula = await app.service('column').create({
      text: 'Formula',
      column_type_id: COLUMN_TYPE.FORMULA,
      table_id: table1.id,
    })
    columnTable1File = await app.service('column').create({
      text: 'File',
      column_type_id: COLUMN_TYPE.FILE,
      table_id: table1.id,
    })
    columnTable1MultiUser = await app.service('column').create({
      text: 'MultiUser',
      column_type_id: COLUMN_TYPE.MULTI_USER,
      table_id: table1.id,
    })
    columnTable1MultiGroup = await app.service('column').create({
      text: 'MultiGroup',
      column_type_id: COLUMN_TYPE.MULTI_GROUP,
      table_id: table1.id,
    })
    columnTable1Text = await app.service('column').create({
      text: 'Text',
      column_type_id: COLUMN_TYPE.TEXT,
      table_id: table1.id,
    })
    columnTable1URL = await app.service('column').create({
      text: 'URL',
      column_type_id: COLUMN_TYPE.URL,
      table_id: table1.id,
    })
    columnTable1GeomPoint = await app.service('column').create({
      text: 'POINT',
      column_type_id: COLUMN_TYPE.GEOMETRY_POINT,
      table_id: table1.id,
    })
    columnTable1GeomLinestring = await app.service('column').create({
      text: 'LINESTRING',
      column_type_id: COLUMN_TYPE.GEOMETRY_LINESTRING,
      table_id: table1.id,
    })
    columnTable1GeomPolygon = await app.service('column').create({
      text: 'POLYGON',
      column_type_id: COLUMN_TYPE.GEOMETRY_POLYGON,
      table_id: table1.id,
    })
  })

  it('throw an error if a boolean column receive a string value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1Boolean.id]: 'you lose',
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a null value for a boolean column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1Boolean.id]: null,
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('accept a boolean value for a boolean column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1Boolean.id]: true,
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a number column receive a string value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1Number.id]: 'you lose',
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a null value for a number column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1Number.id]: null,
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('accept a number value for a number column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1Number.id]: 123456,
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a float column receive a string value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1Float.id]: 'you lose',
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a null value for a float column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1Float.id]: null,
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('accept a float value for a float column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1Float.id]: 123.456,
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a date column receive a number value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1Date.id]: 123456,
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a null value for a date column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1Date.id]: null,
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a date column receive a non ISO8601 string', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1Date.id]: 'you lose...',
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept an ISO8601 string value for a date column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1Date.id]: '2020-10-29',
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a SINGLE_SELECT column receive a number value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1SingleSelect.id]: 123456,
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a null value for a SINGLE_SELECT column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1SingleSelect.id]: null,
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a SINGLE_SELECT column receive a string that is not an option from column settings', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1SingleSelect.id]: 'you lose...',
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a string value from values settings for a SINGLE_SELECT column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1SingleSelect.id]: singleSelectOption1UUID,
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a MULTI_SELECT column receive a number value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1MultiSelect.id]: 123456,
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('throw an error if a MULTI_SELECT column receive a string value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1MultiSelect.id]: 'you lose',
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a null value for a MULTI_SELECT column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1MultiSelect.id]: null,
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('accept an empty array value for a MULTI_SELECT column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1MultiSelect.id]: [],
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a MULTI_SELECT column receive an array with a string that is not an option from column settings', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1MultiSelect.id]: [
            'you lose...',
          ],
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('throw an error if a MULTI_SELECT column receive an array from which one string is not an option from column settings', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1MultiSelect.id]: [
            singleSelectOption1UUID,
            'you lose...',
          ],
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a string array from values settings for a MULTI_SELECT column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1MultiSelect.id]: [
            singleSelectOption1UUID,
            singleSelectOption2UUID,
          ],
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a STRING column receive a number value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1String.id]: 123,
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a null value for a STRING column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1String.id]: null,
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('accept a string value for a STRING column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1String.id]: 'that works',
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a TEXT column receive a number value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1Text.id]: 123456,
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a null value for a TEXT column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1Text.id]: null,
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('accept a string value for a TEXT column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1Text.id]: 'that works',
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a RELATION_BETWEEN_TABLES column receive a number value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1RelationBetweenTables.id]: 123456,
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a null value for a RELATION_BETWEEN_TABLES column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1RelationBetweenTables.id]: null,
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a RELATION_BETWEEN_TABLES column receive a string value not referencing a row from the good table', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1RelationBetweenTables.id]: 'you lose',
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a string value referencing another row from the good table for a RELATION_BETWEEN_TABLES column type', async () => {
    expect.assertions(2)
    const rowTable2 = await app.service('row')
      .create({
        data: {
          [columnTable2Name.id]: 'I\'m jack',
          [columnTable2Ref.id]: 'do not know',
        },
        table_id: table2.id,
      })
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1RelationBetweenTables.id]: rowTable2.id,
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
    await app.service('row').remove(rowTable2.id)
  })

  it('throw an error if a USER column receive a string value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1User.id]: 'you lose',
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a null value for a USER column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1User.id]: null,
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a USER column receive a number value not referencing a user', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1User.id]: 123456,
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a number value referencing a user for a USER column type', async () => {
    expect.assertions(2)
    const user = await app.service('user')
      .create({
        name: 'Jack',
        email: 'hello-check@locokit.io',
      })
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1User.id]: user.id,
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
    await app.service('user').remove(user.id)
  })

  it('throw an error if a GROUP column receive a number value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1Group.id]: 123456,
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a null value for a GROUP column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1Group.id]: null,
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a GROUP column receive a string value not referencing a group', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1Group.id]: 'you lose',
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a string value referencing a group for a GROUP column type', async () => {
    expect.assertions(2)
    const group = await app.service('group')
      .create({
        name: 'Jack',
      })
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1Group.id]: group.id,
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
    await app.service('group').remove(group.id)
  })

  it('throw an error if a LOOKED_UP_COLUMN column receive a value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1LookedUpColumn.id]: 123456,
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a null value for a LOOKED_UP_COLUMN column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1LookedUpColumn.id]: null,
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a FORMULA column receive a value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1Formula.id]: 123456,
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a null value for a FORMULA column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1Formula.id]: null,
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a FILE column receive a value not an array (number)', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1File.id]: 123456,
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('throw an error if a FILE column receive a value not an array (string)', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1File.id]: 'pouet',
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a null value for a FILE column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1File.id]: null,
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('accept an array of attachment ids already in db for a FILE column type', async () => {
    expect.assertions(2)
    // insert attachment
    const attachment1 = await app.service('attachment').create({
      workspace_id: workspace.id,
      filepath: 'toto1.txt',
      filename: 'toto1.txt',
    })
    const attachment2 = await app.service('attachment').create({
      workspace_id: workspace.id,
      filepath: 'toto2.txt',
      filename: 'toto2.txt',
    })
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1File.id]: [attachment1.id, attachment2.id],
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a MULTI_USER column receive a number value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1MultiUser.id]: 123456,
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('throw an error if a MULTI_USER column receive a string value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1MultiUser.id]: 'you lose',
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a null value for a MULTI_USER column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1MultiUser.id]: null,
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('accept an empty array value for a MULTI_USER column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1MultiUser.id]: [],
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a MULTI_USER column receive an array which does not only contain numbers', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1MultiUser.id]: [1, '2', 3],
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('throw an error if a MULTI_USER column receive an array from which one number is not a reference to an existing user', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1MultiUser.id]: [-1, -2, -3],
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a number array corresponding to existing users for a MULTI_USER column type', async () => {
    expect.assertions(2)
    const user1 = await app.service('user')
      .create({
        name: 'Jack',
        email: 'hello-check-1@locokit.io',
      })
    const user2 = await app.service('user')
      .create({
        name: 'Jack',
        email: 'hello-check-2@locokit.io',
      })

    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1MultiUser.id]: [user1.id, user2.id],
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
    await app.service('user').remove(user1.id)
    await app.service('user').remove(user2.id)
  })

  it('throw an error if a MULTI_GROUP column receive a value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1MultiGroup.id]: 123456,
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a null value for a MULTI_GROUP column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1MultiGroup.id]: null,
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a URL column receive a number value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1URL.id]: 123,
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('throw an error if a URL column receive a string value which is not a valid url', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1URL.id]: 'www.makina-corpus.com',
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a null value for a URL column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1URL.id]: null,
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('accept a string value which is a valid URL for a URL column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1URL.id]: 'http://www.makina-corpus.com',
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  /**
   * Geometry columns
   */
  it('throw an error if a GEOMETRY_POINT column receive a number value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1GeomPoint.id]: 123,
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('throw an error if a GEOMETRY_POINT column receive an object which is not a valid geometry', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1GeomPoint.id]: {},
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('throw an error if a GEOMETRY_POINT column receive a geometry that is not a point', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1GeomPoint.id]: ewktPolygon,
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a null value for a GEOMETRY_POINT column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1GeomPoint.id]: null,
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('accept a valid geometry that is a point for a GEOMETRY_POINT column', async () => {
    expect.assertions(3)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1GeomPoint.id]: ewktPoint,
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    expect(rowTable1.data[columnTable1GeomPoint.id]).toBe(ewktPoint)
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a GEOMETRY_LINESTRING column receive a number value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1GeomLinestring.id]: 123,
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('throw an error if a GEOMETRY_LINESTRING column receive an object which is not a valid geometry', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1GeomLinestring.id]: {},
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('throw an error if a GEOMETRY_LINESTRING column receive a geometry that is not a linestring', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1GeomLinestring.id]: ewktPoint,
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a null value for a GEOMETRY_LINESTRING column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1GeomLinestring.id]: null,
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('accept a valid geometry that is a linestring for a GEOMETRY_LINESTRING column', async () => {
    expect.assertions(3)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1GeomLinestring.id]: ewktLinestring,
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    expect(rowTable1.data[columnTable1GeomLinestring.id]).toBe(ewktLinestring)
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a GEOMETRY_POLYGON column receive a number value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1GeomPolygon.id]: 123,
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('throw an error if a GEOMETRY_POLYGON column receive an object which is not a valid geometry', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1GeomPolygon.id]: {},
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('throw an error if a GEOMETRY_POLYGON column receive a geometry that is not a polygon', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1GeomPolygon.id]: ewktLinestring,
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a null value for a GEOMETRY_POLYGON column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1GeomPolygon.id]: null,
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('accept a valid geometry that is a polygon for a GEOMETRY_POLYGON column', async () => {
    expect.assertions(3)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1GeomPolygon.id]: ewktPolygon,
        },
        table_id: table1.id,
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    expect(rowTable1.data[columnTable1GeomPolygon.id]).toBe(ewktPolygon)
    await app.service('row').remove(rowTable1.id)
  })

  it('sanitize string before using it in database (POLYGON example)', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1GeomPolygon.id]: ewktPolygonWithInjection,
        },
        table_id: table1.id,
      }))
      .rejects.toThrow(NotAcceptable)
  })

  afterAll(async () => {
    // await app.service('group').remove(group1.id)
    // await app.service('user').remove(user1.id)
    await app.service('column').remove(columnTable1Boolean.id)
    await app.service('column').remove(columnTable1Number.id)
    await app.service('column').remove(columnTable1Date.id)
    await app.service('column').remove(columnTable1String.id)
    await app.service('column').remove(columnTable1Float.id)
    await app.service('column').remove(columnTable1User.id)
    await app.service('column').remove(columnTable1Group.id)
    await app.service('column').remove(columnTable1RelationBetweenTables.id)
    await app.service('column').remove(columnTable1LookedUpColumn.id)
    await app.service('column').remove(columnTable1SingleSelect.id)
    await app.service('column').remove(columnTable1MultiSelect.id)
    await app.service('column').remove(columnTable1Formula.id)
    await app.service('column').remove(columnTable1File.id)
    await app.service('column').remove(columnTable1MultiUser.id)
    await app.service('column').remove(columnTable1MultiGroup.id)
    await app.service('column').remove(columnTable1Text.id)
    await app.service('column').remove(columnTable1URL.id)
    await app.service('column').remove(columnTable2Ref.id)
    await app.service('column').remove(columnTable2Name.id)
    await app.service('table').remove(table1.id)
    await app.service('table').remove(table2.id)
    await app.service('database').remove(database.id)
    await app.service('workspace').remove(workspace.id)
  })
})
