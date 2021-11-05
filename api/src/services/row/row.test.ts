import { COLUMN_TYPE } from '@locokit/lck-glossary'
import app from '../../app'
import { Database } from '../../models/database.model'
import { TableRow } from '../../models/tablerow.model'
import { Table } from '../../models/table.model'
import { Workspace } from '../../models/workspace.model'
import { BadRequest } from '@feathersjs/errors'
import { Paginated } from '@feathersjs/feathers'

describe('\'row\' service', () => {
  const service = app.service('row')

  it('registered the service', () => {
    expect(service).toBeTruthy()
  })

  let workspace: Workspace
  let database: Database
  let table: Table
  beforeAll(async () => {
    workspace = await app.service('workspace').create({ text: 'pouet' })
    const workspaceDatabases = await app.service('database').find({
      query: {
        workspace_id: workspace.id,
        $limit: 1,
      },
    }) as Paginated<Database>
    database = workspaceDatabases.data[0]
    table = await app.service('table').create({ text: 'pouet', database_id: database.id })
  })

  it('throw if table_id is not present', async () => {
    expect.assertions(1)
    await expect(service.create({
      text: 'test',
    })).rejects.toThrow()
  })

  it('throw if table_id is present but did not exist', async () => {
    expect.assertions(1)
    await expect(service.create({
      text: 'test',
      table_id: 'you lose',
    })).rejects.toThrow()
  })

  it('succeed if table_id + data is present and exist', async () => {
    expect.assertions(1)
    const row: TableRow = await service.create({
      text: 'test',
      table_id: table.id,
      data: {},
    })
    expect(row).toBeTruthy()
    await app.service('row').remove(row.id)
  })

  it('throw if table_id is not in params', async () => {
    expect.assertions(1)
    await expect(service
      .create({}))
      .rejects.toThrow(BadRequest)
  })

  it('accept to insert an empty row', async () => {
    expect.assertions(2)
    const rowTable1: TableRow = await service.create({
      data: {},
      table_id: table.id,
    })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await service.remove(rowTable1.id)
  })

  it('patch only the "text" property when patching "text" (bug of crush "data" property)', async () => {
    const tableColumn = await app.service('column').create({
      text: 'myColumn',
      table_id: table.id,
      column_type_id: COLUMN_TYPE.STRING,
    })
    const currentRow: TableRow = await service.create({
      text: 'test',
      data: {
        [tableColumn.id]: 'myValue',
      },
      table_id: table.id,
    })
    const patchedRow: TableRow = await service.patch(currentRow.id, {
      text: 'new test',
    })
    expect(patchedRow.text).toEqual('new test')
    expect(patchedRow.data[tableColumn.id]).toEqual('myValue')
    await service.remove(patchedRow.id)
  })

  describe('Filter in sub-prop in JSON', () => {
    it('Type string Equal', async () => {
      const tableColumn = await app.service('column').create({
        text: 'myColumnOfString',
        table_id: table.id,
        column_type_id: COLUMN_TYPE.STRING,
      })

      const row1 = await service.create({
        text: 'Test Row 1',
        data: {
          [tableColumn.id]: 'Hello there!',
        },
        table_id: table.id,
      })

      const row2 = await service.create({
        text: 'Test Row 2',
        data: {
          [tableColumn.id]: 'It\'s a trap !',
        },
        table_id: table.id,
      })

      const rows = await service.find({
        query: {
          table_id: table.id,
          data: {
            [tableColumn.id]: {
              $eq: 'Hello there!',
            },
          },
        },
      }) as Paginated<TableRow>
      expect(rows.data.length).toEqual(1)
      expect(rows.data[0].data[tableColumn.id]).toEqual('Hello there!')

      await service.remove(row1.id)
      await service.remove(row2.id)
    })

    it('Type int Equal', async () => {
      const tableColumn = await app.service('column').create({
        text: 'myColumnOfInt1',
        table_id: table.id,
        column_type_id: COLUMN_TYPE.NUMBER,
      })

      const row1 = await service.create({
        text: 'Test Row 1',
        data: {
          [tableColumn.id]: 17,
        },
        table_id: table.id,
      })

      const row2 = await service.create({
        text: 'Test Row 2',
        data: {
          [tableColumn.id]: 42,
        },
        table_id: table.id,
      })

      const rows = await service.find({
        query: {
          table_id: table.id,
          data: {
            [tableColumn.id]: {
              $eq: 17,
            },
          },
        },
      }) as Paginated<TableRow>
      expect(rows.data.length).toEqual(1)
      expect(rows.data[0].data[tableColumn.id]).toEqual(17)

      await service.remove(row1.id)
      await service.remove(row2.id)
    })

    it('Type float Equal', async () => {
      const tableColumn = await app.service('column').create({
        text: 'myColumnOfFloat1',
        table_id: table.id,
        column_type_id: COLUMN_TYPE.FLOAT,
      })

      const row1 = await service.create({
        text: 'Test Row 1',
        data: {
          [tableColumn.id]: 17.42,
        },
        table_id: table.id,
      })

      const row2 = await service.create({
        text: 'Test Row 2',
        data: {
          [tableColumn.id]: 42.17,
        },
        table_id: table.id,
      })

      const rows = await service.find({
        query: {
          table_id: table.id,
          data: {
            [tableColumn.id]: {
              $eq: 17.42,
            },
          },
        },
      }) as Paginated<TableRow>
      expect(rows.data.length).toEqual(1)
      expect(rows.data[0].data[tableColumn.id]).toEqual(17.42)

      await service.remove(row1.id)
      await service.remove(row2.id)
    })

    it('Type bool Equal', async () => {
      const tableColumn = await app.service('column').create({
        text: 'myColumnOfBool',
        table_id: table.id,
        column_type_id: COLUMN_TYPE.BOOLEAN,
      })
      const row1 = await service.create({
        text: 'Test Row 1',
        data: {
          [tableColumn.id]: true,
        },
        table_id: table.id,
      })

      const row2 = await service.create({
        text: 'Test Row 2',
        data: {
          [tableColumn.id]: null,
        },
        table_id: table.id,
      })

      const rows = await service.find({
        query: {
          table_id: table.id,
          data: {
            [tableColumn.id]: {
              $eq: true,
            },
          },
        },
      }) as Paginated<TableRow>
      expect(rows.data.length).toEqual(1)
      expect(rows.data[0].data[tableColumn.id]).toEqual(true)

      await service.remove(row1.id)
      await service.remove(row2.id)
    })

    it('Type Date Equal', async () => {
      const tableColumn = await app.service('column').create({
        text: 'myColumnOfDate1',
        table_id: table.id,
        column_type_id: COLUMN_TYPE.DATE,
      })
      const row1 = await service.create({
        text: 'Test Row 1',
        data: {
          [tableColumn.id]: '1944-04-21',
        },
        table_id: table.id,
      })

      const row2 = await service.create({
        text: 'Test Row 2',
        data: {
          [tableColumn.id]: '2020-04-21',
        },
        table_id: table.id,
      })

      const rows = await service.find({
        query: {
          table_id: table.id,
          data: {
            [tableColumn.id]: {
              $eq: '1944-04-21',
            },
          },
        },
      }) as Paginated<TableRow>
      expect(rows.data.length).toEqual(1)
      expect(rows.data[0].data[tableColumn.id]).toEqual('1944-04-21')

      await service.remove(row1.id)
      await service.remove(row2.id)
    })

    it('Type Date Less Than and Equal', async () => {
      const tableColumn = await app.service('column').create({
        text: 'myColumnOfDate2',
        table_id: table.id,
        column_type_id: COLUMN_TYPE.DATE,
      })
      const row1 = await service.create({
        text: 'Test Row 1',
        data: {
          [tableColumn.id]: '1944-04-21',
        },
        table_id: table.id,
      })

      const row2 = await service.create({
        text: 'Test Row 2',
        data: {
          [tableColumn.id]: '2020-04-21',
        },
        table_id: table.id,
      })

      const row3 = await service.create({
        text: 'Test Row 3',
        data: {
          [tableColumn.id]: '1992-02-17',
        },
        table_id: table.id,
      })

      const rows = await service.find({
        query: {
          table_id: table.id,
          data: {
            [tableColumn.id]: {
              $lte: '1992-02-17',
            },
          },
        },
      }) as Paginated<TableRow>
      expect.assertions(3)
      expect(rows.data.length).toEqual(2)
      // we don't sort the result, order of values can change
      if (rows.data[0].data[tableColumn.id] === '1944-04-21') {
        expect(rows.data[0].data[tableColumn.id]).toEqual('1944-04-21')
        expect(rows.data[1].data[tableColumn.id]).toEqual('1992-02-17')
      } else {
        expect(rows.data[1].data[tableColumn.id]).toEqual('1944-04-21')
        expect(rows.data[0].data[tableColumn.id]).toEqual('1992-02-17')
      }

      await service.remove(row1.id)
      await service.remove(row2.id)
      await service.remove(row3.id)
    })

    it('Type float More Than and Equal', async () => {
      const tableColumn = await app.service('column').create({
        text: 'myColumnOfFloat2',
        table_id: table.id,
        column_type_id: COLUMN_TYPE.FLOAT,
      })

      const row1 = await service.create({
        text: 'Test Row 1',
        data: {
          [tableColumn.id]: 17.42,
        },
        table_id: table.id,
      })

      const row2 = await service.create({
        text: 'Test Row 2',
        data: {
          [tableColumn.id]: 42.17,
        },
        table_id: table.id,
      })

      const row3 = await service.create({
        text: 'Test Row 3',
        data: {
          [tableColumn.id]: 142.17,
        },
        table_id: table.id,
      })

      const rows = await service.find({
        query: {
          table_id: table.id,
          data: {
            [tableColumn.id]: {
              $gte: 142.17,
            },
          },
        },
      }) as Paginated<TableRow>
      expect(rows.data.length).toEqual(1)
      expect(rows.data[0].data[tableColumn.id]).toEqual(142.17)

      await service.remove(row1.id)
      await service.remove(row2.id)
      await service.remove(row3.id)
    })

    it('Type int Less Than', async () => {
      const tableColumn = await app.service('column').create({
        text: 'myColumnOfInt2',
        table_id: table.id,
        column_type_id: COLUMN_TYPE.NUMBER,
      })

      const row1 = await service.create({
        text: 'Test Row 1',
        data: {
          [tableColumn.id]: 17,
        },
        table_id: table.id,
      })

      const row2 = await service.create({
        text: 'Test Row 2',
        data: {
          [tableColumn.id]: 42,
        },
        table_id: table.id,
      })

      const row3 = await service.create({
        text: 'Test Row 3',
        data: {
          [tableColumn.id]: 142,
        },
        table_id: table.id,
      })

      const rows = await service.find({
        query: {
          table_id: table.id,
          data: {
            [tableColumn.id]: {
              $lt: 100,
            },
          },
        },
      }) as Paginated<TableRow>
      expect(rows.data.length).toEqual(2)
      expect(rows.data[0].data[tableColumn.id]).not.toEqual(142)
      expect(rows.data[1].data[tableColumn.id]).not.toEqual(142)

      await service.remove(row1.id)
      await service.remove(row2.id)
      await service.remove(row3.id)
    })
  })

  afterAll(async () => {
    await app.service('table').remove(table.id)
    await app.service('database').remove(database.id)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    await app.service('aclset').remove(workspace.aclsets?.[0].id as string)
    await app.service('workspace').remove(workspace.id)
  })
})
