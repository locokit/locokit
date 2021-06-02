import { Paginated } from '@feathersjs/feathers'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import app from '../../app'
import { TableColumn } from '../../models/tablecolumn.model'
import { database } from '../../models/database.model'
import { Table } from '../../models/table.model'
import { workspace } from '../../models/workspace.model'
import { Columnrelation } from '../columnrelation/columnrelation.class'
import { TableColumnRelation } from '../../models/tablecolumnrelation.model'

describe('\'column\' service', () => {
  it('registered the service', () => {
    const service = app.service('column')
    expect(service).toBeTruthy()
  })

  it('create a column without error', async () => {
    expect.assertions(1)
    const service = app.service('column')
    const workspace = await app.service('workspace').create({ text: 'pouet' })
    const workspaceDatabases = await app.service('database').find({
      query: {
        workspace_id: workspace.id,
        $limit: 1,
      },
    }) as Paginated<database>
    const database = workspaceDatabases.data[0]
    const table = await app.service('table').create({ text: 'pouet', database_id: database.id })
    const tableColumn = await service.create({
      text: 'myColumn',
      table_id: table.id,
      column_type_id: COLUMN_TYPE.STRING,
    })

    expect(tableColumn).toBeTruthy()
  })

  describe('get the original type of a column', () => {
    let workspace: workspace
    let database: database
    let table1: Table
    let table2: Table
    let stringColumn: TableColumn
    let relationBetweenTableColumn1: TableColumn
    let relationBetweenTableColumn2: TableColumn
    let lookedUpColumn1FromStringColumn: TableColumn
    let lookedUpColumn2FromStringColumn: TableColumn
    let lookedUpColumn3FromLookedUpColumn1: TableColumn
    let formulaColumn: TableColumn

    beforeAll(async () => {
      // Create workspace and database
      workspace = await app.service('workspace').create({ text: 'workspace1' })
      const workspaceDatabases = await app.service('database').find({
        query: {
          workspace_id: workspace.id,
          $limit: 1,
        },
      }) as Paginated<database>
      database = workspaceDatabases.data[0]
      // Create tables
      table1 = await app.service('table').create({
        text: 'table1',
        database_id: database.id,
      })
      table2 = await app.service('table').create({
        text: 'table2',
        database_id: database.id,
      })
      // Create columns
      stringColumn = await app.service('column').create({
        text: 'string_column',
        column_type_id: COLUMN_TYPE.STRING,
        table_id: table1.id,
      })
      formulaColumn = await app.service('column').create({
        text: 'formula_column',
        column_type_id: COLUMN_TYPE.FORMULA,
        table_id: table1.id,
        settings: {
          formula: '""',
        },
      })
      relationBetweenTableColumn1 = await app.service('column').create({
        text: 'relation_between_table_column_1',
        column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
        table_id: table1.id,
        settings: {
          tableId: table2.id,
        },
      })
      relationBetweenTableColumn2 = await app.service('column').create({
        text: 'relation_between_table_column_2',
        column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
        table_id: table2.id,
        settings: {
          tableId: table1.id,
        },
      })
      lookedUpColumn1FromStringColumn = await app.service('column').create({
        text: 'looked_up_column_1',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        table_id: table2.id,
        settings: {
          tableId: table1.id,
          localField: relationBetweenTableColumn2.id,
          foreignField: stringColumn.id,
        },
      })
      lookedUpColumn2FromStringColumn = await app.service('column').create({
        text: 'looked_up_column_2',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        table_id: table2.id,
        settings: {
          tableId: table1.id,
          localField: relationBetweenTableColumn2.id,
          foreignField: stringColumn.id,
        },
      })
      lookedUpColumn3FromLookedUpColumn1 = await app.service('column').create({
        text: 'looked_up_column_3',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        table_id: table1.id,
        settings: {
          tableId: table2.id,
          localField: relationBetweenTableColumn1.id,
          foreignField: lookedUpColumn1FromStringColumn.id,
        },
      })
      // Get parents columns
      lookedUpColumn2FromStringColumn = await app.service('column').get(lookedUpColumn2FromStringColumn.id,
        {
          query: {
            $eager: 'parents.^',
          },
        })
      lookedUpColumn3FromLookedUpColumn1 = await app.service('column').get(lookedUpColumn3FromLookedUpColumn1.id,
        {
          query: {
            $eager: 'parents.^',
          },
        })
    })

    it('returns the column type id for a string column', async () => {
      expect(stringColumn.originalTypeId()).toBe(COLUMN_TYPE.STRING)
    })

    it('returns the formula type id for a formula column', async () => {
      expect(formulaColumn.originalTypeId()).toBe(COLUMN_TYPE.STRING)
    })

    it('returns the column type id for a looked-up-column without computed parents', async () => {
      expect(lookedUpColumn1FromStringColumn.originalTypeId()).toBe(COLUMN_TYPE.LOOKED_UP_COLUMN)
    })

    it('returns the ancestor column type (1-level) for a looked-up-column with one computed parent', async () => {
      expect(lookedUpColumn2FromStringColumn.originalTypeId()).toBe(COLUMN_TYPE.STRING)
    })

    it('returns the ancestor column type (2-level) for a looked-up-column with one computed parent', async () => {
      expect(lookedUpColumn3FromLookedUpColumn1.originalTypeId()).toBe(COLUMN_TYPE.STRING)
    })

    afterAll(async () => {
      await app.service('table').remove(table1.id)
      await app.service('table').remove(table2.id)
      await app.service('database').remove(database.id)
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      await app.service('aclset').remove(workspace.aclsets?.[0].id as string)
      await app.service('workspace').remove(workspace.id)
      await app.service('column').remove(stringColumn.id)
      await app.service('column').remove(relationBetweenTableColumn1.id)
      await app.service('column').remove(relationBetweenTableColumn2.id)
      await app.service('column').remove(lookedUpColumn1FromStringColumn.id)
      await app.service('column').remove(lookedUpColumn2FromStringColumn.id)
      await app.service('column').remove(lookedUpColumn3FromLookedUpColumn1.id)
      await app.service('column').remove(formulaColumn.id)
    })
  })

  it('paginate results by default to 10', async () => {
    expect.assertions(2)
    const service = app.service('column')
    const columns: any = await service.find()
    expect(columns.total).toBeDefined()
    expect(columns.limit).toBe(10)
  })

  it('discard pagination when table_id is set in query param and $limit is -1', async () => {
    expect.assertions(5)
    const service = app.service('column')
    const workspace = await app.service('workspace').create({ text: 'pouet' })
    const workspaceDatabases = await app.service('database').find({
      query: {
        workspace_id: workspace.id,
        $limit: 1,
      },
    }) as Paginated<database>
    const database = workspaceDatabases.data[0]
    const table = await app.service('table').create({ text: 'pouet', database_id: database.id })
    const column1 = await service.create({
      text: 'myColumn1',
      table_id: table.id,
      column_type_id: COLUMN_TYPE.STRING,
    })
    const column2 = await service.create({
      text: 'myColumn2',
      table_id: table.id,
      column_type_id: COLUMN_TYPE.STRING,
    })

    const columns: any = await service.find({
      query: {
        table_id: table.id,
        $limit: -1,
      },
    })
    expect(columns.total).not.toBeDefined()
    expect(columns.limit).not.toBeDefined()
    expect(columns.length).toBe(2)
    if (columns[0].id === column1.id) {
      expect(columns[0].id).toBe(column1.id)
      expect(columns[1].id).toBe(column2.id)
    } else {
      expect(columns[0].id).toBe(column2.id)
      expect(columns[1].id).toBe(column1.id)
    }
  })
})

describe('hooks for column service', () => {
  let workspace: workspace
  let database: database
  let table1: Table
  let table2: Table

  beforeAll(async () => {
    workspace = await app.service('workspace').create({ text: 'pouet' })
    const workspaceDatabases = await app.service('database').find({
      query: {
        workspace_id: workspace.id,
        $limit: 1,
      },
    }) as Paginated<database>
    database = workspaceDatabases.data[0]
    table1 = await app.service('table').create({
      text: 'table1',
      database_id: database.id,
    })
    table2 = await app.service('table').create({
      text: 'table2',
      database_id: database.id,
    })
  })

  describe('upsertColumnRelation', () => {
    it('create a column relation when a lookedup column reference another column', async () => {
      expect.assertions(1)

      const columnTable1Ref: TableColumn = await app.service('column').create({
        text: 'column table 1',
        column_type_id: COLUMN_TYPE.STRING,
        table_id: table1.id,
      })
      const columnTable2RelationBetweenTable1: TableColumn = await app.service('column').create({
        text: 'LKDP column table 1',
        column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
        table_id: table2.id,
        settings: {
          tableId: table1.id,
        },
      })
      const columnTable2LookedUpColumnTable1User: TableColumn = await app.service('column').create({
        text: 'Ref',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        table_id: table2.id,
        settings: {
          tableId: table1.id,
          localField: columnTable2RelationBetweenTable1.id,
          foreignField: columnTable1Ref.id,
        },
      })
      const columnrelation = await app.service('columnrelation').find({
        query: {
          table_column_from_id: columnTable1Ref.id,
          table_column_to_id: columnTable2LookedUpColumnTable1User.id,
        },
      }) as Paginated<Columnrelation>
      expect(columnrelation.total).toBe(1)

      await app.service('columnrelation')._remove(null, {
        query: {
          table_column_from_id: columnTable1Ref.id,
          table_column_to_id: columnTable2LookedUpColumnTable1User.id,
        },
      })
      await app.service('column')._remove(columnTable2LookedUpColumnTable1User.id, {})
      await app.service('column')._remove(columnTable1Ref.id, {})
      await app.service('column')._remove(columnTable2RelationBetweenTable1.id, {})
    })
    describe('Formula column', () => {
      // Referenced columns
      let stringColumn1: TableColumn
      let stringColumn2: TableColumn

      beforeAll(async () => {
        // Create referenced columns
        stringColumn1 = await app.service('column').create({
          text: 'string_column_1',
          column_type_id: COLUMN_TYPE.STRING,
          table_id: table1.id,
        })
        stringColumn2 = await app.service('column').create({
          text: 'string_column_2',
          column_type_id: COLUMN_TYPE.STRING,
          table_id: table1.id,
        })
      })

      afterAll(async () => {
        // Clean database
        await app.service('column')._remove(stringColumn1.id, {})
        await app.service('column')._remove(stringColumn2.id, {})
      })

      describe('On creation', () => {
        it('create one column relation for each referenced column used in a formula column', async () => {
          expect.assertions(3)
          // Formula column
          const formulaColumn: TableColumn = await app.service('column').create({
            text: 'formula_column',
            column_type_id: COLUMN_TYPE.FORMULA,
            table_id: table1.id,
            settings: {
              formula: `TEXT.CONCAT(COLUMN.{${stringColumn1.id}},COLUMN.{${stringColumn2.id}})`,
            },
          })
          // Get the created column relations
          const firstColumnRelation = await app.service('columnrelation').get(`${stringColumn1.id},${formulaColumn.id}`)
          const secondColumnRelation = await app.service('columnrelation').get(`${stringColumn2.id},${formulaColumn.id}`)
          expect(firstColumnRelation).toBeDefined()
          expect(secondColumnRelation).toBeDefined()
          // Delete the column relations
          const columnRelations = await app.service('columnrelation')._remove(null, {
            query: {
              table_column_to_id: formulaColumn.id,
            },
          }) as TableColumnRelation[]
          expect(columnRelations.length).toBe(2)
          // Clean database
          await app.service('column')._remove(formulaColumn.id, {})
        })
        it('don\'t create column relation if no column is used in a formula column', async () => {
          expect.assertions(1)
          // Formula column
          const formulaColumn: TableColumn = await app.service('column').create({
            text: 'formula_column',
            column_type_id: COLUMN_TYPE.FORMULA,
            table_id: table1.id,
            settings: {
              formula: '10',
            },
          })
          // Get created column relations and delete them
          const columnRelations = await app.service('columnrelation').find({
            query: {
              table_column_to_id: formulaColumn.id,
            },
          }) as Paginated<TableColumnRelation>
          expect(columnRelations.total).toBe(0)
          // Clean database
          await app.service('column')._remove(formulaColumn.id, {})
        })
      })
      describe('On update', () => {
        describe('If no column is specified in the formula', () => {
          it('If at least one column was used before', async () => {
            expect.assertions(1)
            // Formula column
            const formulaColumn: TableColumn = await app.service('column').create({
              text: 'formula_column',
              column_type_id: COLUMN_TYPE.FORMULA,
              table_id: table1.id,
              settings: {
                formula: `COLUMN.{${stringColumn1.id}}`,
              },
            })
            await app.service('column').patch(formulaColumn.id, {
              settings: {
                formula: '20',
              },
            })
            // Search if the column relations have been deleted
            const columnRelations = await app.service('columnrelation').find({
              query: {
                table_column_to_id: formulaColumn.id,
              },
            }) as Paginated<TableColumnRelation>
            expect(columnRelations.total).toBe(0)
            // Clean database
            await app.service('column')._remove(formulaColumn.id, {})
          })
          it('If no column was used before', async () => {
            expect.assertions(1)
            // Formula column
            const formulaColumn: TableColumn = await app.service('column').create({
              text: 'formula_column',
              column_type_id: COLUMN_TYPE.FORMULA,
              table_id: table1.id,
              settings: {
                formula: '10',
              },
            })
            await app.service('column').patch(formulaColumn.id, {
              settings: {
                formula: '20',
              },
            })
            // Search if some column relations have been created
            const columnRelations = await app.service('columnrelation').find({
              query: {
                table_column_to_id: formulaColumn.id,
              },
            }) as Paginated<TableColumnRelation>
            expect(columnRelations.total).toBe(0)
            // Clean database
            await app.service('column')._remove(formulaColumn.id, {})
          })
        })
        describe('If at least one column is specified in the formula', () => {
          it('If no column was used before', async () => {
            expect.assertions(3)
            // Formula column
            const formulaColumn: TableColumn = await app.service('column').create({
              text: 'formula_column',
              column_type_id: COLUMN_TYPE.FORMULA,
              table_id: table1.id,
              settings: {
                formula: '20',
              },
            })
            await app.service('column').patch(formulaColumn.id, {
              settings: {
                formula: `TEXT.CONCAT(COLUMN.{${stringColumn1.id}},COLUMN.{${stringColumn2.id}})`,
              },
            })
            // Get the created column relations
            const firstColumnRelation = await app.service('columnrelation').get(`${stringColumn1.id},${formulaColumn.id}`)
            const secondColumnRelation = await app.service('columnrelation').get(`${stringColumn2.id},${formulaColumn.id}`)
            expect(firstColumnRelation).toBeDefined()
            expect(secondColumnRelation).toBeDefined()
            // Delete the column relations
            const columnRelations = await app.service('columnrelation')._remove(null, {
              query: {
                table_column_to_id: formulaColumn.id,
              },
            }) as TableColumnRelation[]
            expect(columnRelations.length).toBe(2)
            // Clean database
            await app.service('column')._remove(formulaColumn.id, {})
          })
          it('If one other column was used before', async () => {
            expect.assertions(2)
            // Formula column
            const formulaColumn: TableColumn = await app.service('column').create({
              text: 'formula_column',
              column_type_id: COLUMN_TYPE.FORMULA,
              table_id: table1.id,
              settings: {
                formula: `COLUMN.{${stringColumn1.id}}`,
              },
            })
            await app.service('column').patch(formulaColumn.id, {
              settings: {
                formula: `TEXT.CONCAT(COLUMN.{${stringColumn2.id}})`,
              },
            })
            const columnRelation = await app.service('columnrelation').get(`${stringColumn2.id},${formulaColumn.id}`)

            // Get created column relations and delete them
            const columnRelations = await app.service('columnrelation')._remove(null, {
              query: {
                table_column_to_id: formulaColumn.id,
              },
            }) as TableColumnRelation[]
            expect(columnRelation).toBeDefined()
            expect(columnRelations.length).toBe(1)

            // Clean database
            await app.service('column')._remove(formulaColumn.id, {})
          })
          it('If the specified column was already used', async () => {
            expect.assertions(2)
            // Formula column
            const formulaColumn: TableColumn = await app.service('column').create({
              text: 'formula_column',
              column_type_id: COLUMN_TYPE.FORMULA,
              table_id: table1.id,
              settings: {
                formula: `COLUMN.{${stringColumn1.id}}`,
              },
            })
            await app.service('column').patch(formulaColumn.id, {
              settings: {
                formula: `TEXT.CONCAT(COLUMN.{${stringColumn1.id}})`,
              },
            })
            const columnRelation = await app.service('columnrelation').get(`${stringColumn1.id},${formulaColumn.id}`)

            // Get created column relations and delete them
            const columnRelations = await app.service('columnrelation')._remove(null, {
              query: {
                table_column_to_id: formulaColumn.id,
              },
            }) as TableColumnRelation[]
            expect(columnRelation).toBeDefined()
            expect(columnRelations.length).toBe(1)
            // Clean database
            await app.service('column')._remove(formulaColumn.id, {})
          })
          it('If the specified column was already used and if one other is now used', async () => {
            expect.assertions(3)
            // Formula column
            const formulaColumn: TableColumn = await app.service('column').create({
              text: 'formula_column',
              column_type_id: COLUMN_TYPE.FORMULA,
              table_id: table1.id,
              settings: {
                formula: `COLUMN.{${stringColumn1.id}}`,
              },
            })
            await app.service('column').patch(formulaColumn.id, {
              settings: {
                formula: `TEXT.CONCAT(COLUMN.{${stringColumn1.id}}, COLUMN.{${stringColumn2.id}})`,
              },
            })
            // Get the created column relations
            const firstColumnRelation = await app.service('columnrelation').get(`${stringColumn1.id},${formulaColumn.id}`)
            const secondColumnRelation = await app.service('columnrelation').get(`${stringColumn2.id},${formulaColumn.id}`)
            // Delete the column relations
            const columnRelations = await app.service('columnrelation')._remove(null, {
              query: {
                table_column_to_id: formulaColumn.id,
              },
            }) as TableColumnRelation[]
            expect(columnRelations.length).toBe(2)
            expect(firstColumnRelation).toBeDefined()
            expect(secondColumnRelation).toBeDefined()
            // Clean database
            await app.service('column')._remove(formulaColumn.id, {})
          })
        })
      })
    })

    afterAll(async () => {
      await app.service('table').remove(table1.id)
      await app.service('table').remove(table2.id)
      await app.service('database').remove(database.id)
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      await app.service('aclset').remove(workspace.aclsets?.[0].id as string)
    })
  })
})
