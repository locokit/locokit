import { COLUMN_TYPE } from '@locokit/lck-glossary'
import app from '../../app'
import { TableColumn } from '../../models/tablecolumn.model'
import { database } from '../../models/database.model'
import { TableRow } from '../../models/tablerow.model'
import { Table } from '../../models/table.model'
import { User } from '../../models/user.model'
import { workspace } from '../../models/workspace.model'
import { Paginated } from '@feathersjs/feathers'

describe('computeLookedUpColumns hook', () => {
  let workspace: workspace
  let database: database
  let table1: Table
  let table2: Table
  let table3: Table
  let table4: Table
  let columnTable1Ref: TableColumn
  let columnTable1User: TableColumn
  let columnTable1MultiUser: TableColumn
  let columnTable1FormulaRef: TableColumn
  let columnTable2Ref: TableColumn
  let columnTable2FormulaUser: TableColumn
  let columnTable2FormulaUserString: TableColumn
  let columnTable2RelationBetweenTable1: TableColumn
  let columnTable2LookedUpColumnTable1Ref: TableColumn
  let columnTable2LookedUpColumnTable1User: TableColumn
  let columnTable2LookedUpColumnTable1MultiUser: TableColumn
  let columnTable2LookedUpcolumnTable1FormulaRef: TableColumn
  let columnTable3RelationBetweenTable2: TableColumn
  let columnTable3LookedUpColumnTable2Ref: TableColumn
  let columnTable3LookedUpColumnTable2User: TableColumn
  let columnTable3LookedUpColumnTable2MultiUser: TableColumn
  let columnTable3FormulaUser: TableColumn
  let columnTable3FormulaUserString: TableColumn
  let columnTable4RelationBetweenTable1: TableColumn
  let columnTable4RelationBetweenTable3: TableColumn
  let columnTable4LookedUpColumnTable1User: TableColumn
  let columnTable4LookedUpColumnTable3User: TableColumn
  let columnTable4LookedUpColumnTable3FormulaUser: TableColumn
  let columnTable4FormulaUserT1T3: TableColumn

  let user1: User
  let rowTable1: TableRow
  let row1Table2: TableRow
  let row2Table2: TableRow
  let row1Table3: TableRow
  let row2Table3: TableRow
  let row1Table4: TableRow
  let user2: User
  const refString = 'myFirstString'

  beforeAll(async () => {
    // Create workspace
    workspace = await app.service('workspace').create({ text: 'pouet' })
    // Create database
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
    table3 = await app.service('table').create({
      text: 'table3',
      database_id: database.id,
    })
    table4 = await app.service('table').create({
      text: 'table4',
      database_id: database.id,
    })
    // Create table 1 columns
    columnTable1Ref = await app.service('column').create({
      text: 'T1-STRING',
      column_type_id: COLUMN_TYPE.STRING,
      table_id: table1.id,
    })
    columnTable1User = await app.service('column').create({
      text: 'T1-USER',
      column_type_id: COLUMN_TYPE.USER,
      table_id: table1.id,
    })
    columnTable1MultiUser = await app.service('column').create({
      text: 'T1-MULTIUSER',
      column_type_id: COLUMN_TYPE.MULTI_USER,
      table_id: table1.id,
    })
    columnTable1FormulaRef = await app.service('column').create({
      text: 'T1-USER_FORMULA',
      column_type_id: COLUMN_TYPE.FORMULA,
      table_id: table1.id,
      settings: {
        formula: `TEXT.CONCAT("TEXT:", COLUMN.{${columnTable1Ref.id}})`,
      },
    })
    // Create table 2 columns
    columnTable2Ref = await app.service('column').create({
      text: 'T2-STRING',
      column_type_id: COLUMN_TYPE.STRING,
      table_id: table2.id,
    })
    columnTable2RelationBetweenTable1 = await app.service('column').create({
      text: 'T2-RBT-T1',
      column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
      },
    })
    columnTable2LookedUpColumnTable1Ref = await app.service('column').create({
      text: 'T2-LUC-T1-STRING',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
        localField: columnTable2RelationBetweenTable1.id,
        foreignField: columnTable1Ref.id,
      },
    })
    columnTable2LookedUpColumnTable1User = await app.service('column').create({
      text: 'T2-LUC-T1-USER',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
        localField: columnTable2RelationBetweenTable1.id,
        foreignField: columnTable1User.id,
      },
    })
    columnTable2LookedUpColumnTable1MultiUser = await app.service('column').create({
      text: 'T2-LUC-T1-MULTIUSER',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
        localField: columnTable2RelationBetweenTable1.id,
        foreignField: columnTable1MultiUser.id,
      },
    })
    columnTable2LookedUpcolumnTable1FormulaRef = await app.service('column').create({
      text: 'T2-LUC-T1-USER_FORMULA',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
        localField: columnTable2RelationBetweenTable1.id,
        foreignField: columnTable1FormulaRef.id,
      },
    })
    columnTable2FormulaUser = await app.service('column').create({
      text: 'T2-USER_FORMULA',
      column_type_id: COLUMN_TYPE.FORMULA,
      table_id: table2.id,
      settings: {
        formula: `TEXT.UPPER(COLUMN.{${columnTable2LookedUpColumnTable1User.id}})`,
      },
    })
    columnTable2FormulaUserString = await app.service('column').create({
      text: 'T2-USER_MULTIUSER_FORMULA',
      column_type_id: COLUMN_TYPE.FORMULA,
      table_id: table2.id,
      settings: {
        formula: `TEXT.CONCAT(COLUMN.{${columnTable2LookedUpColumnTable1User.id}},"-",COLUMN.{${columnTable2LookedUpColumnTable1Ref.id}})`,
      },
    })
    // Create table 3 columns
    columnTable3RelationBetweenTable2 = await app.service('column').create({
      text: 'T3-RBT-T2',
      column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
      table_id: table3.id,
      settings: {
        tableId: table2.id,
      },
    })
    columnTable3LookedUpColumnTable2Ref = await app.service('column').create({
      text: 'T3-LUC-T2-STRING',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table3.id,
      settings: {
        tableId: table2.id,
        localField: columnTable3RelationBetweenTable2.id,
        foreignField: columnTable2LookedUpColumnTable1Ref.id,
      },
    })
    columnTable3LookedUpColumnTable2User = await app.service('column').create({
      text: 'T3-LUC-T2-USER',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table3.id,
      settings: {
        tableId: table2.id,
        localField: columnTable3RelationBetweenTable2.id,
        foreignField: columnTable2LookedUpColumnTable1User.id,
      },
    })
    columnTable3LookedUpColumnTable2MultiUser = await app.service('column').create({
      text: 'T3-LUC-T2-MULTIUSER',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table3.id,
      settings: {
        tableId: table2.id,
        localField: columnTable3RelationBetweenTable2.id,
        foreignField: columnTable2LookedUpColumnTable1MultiUser.id,
      },
    })
    columnTable3FormulaUser = await app.service('column').create({
      text: 'T3-FORMULA_USER',
      column_type_id: COLUMN_TYPE.FORMULA,
      table_id: table3.id,
      settings: {
        formula: `TEXT.LOWER(COLUMN.{${columnTable3LookedUpColumnTable2User.id}})`,
      },
    })
    columnTable3FormulaUserString = await app.service('column').create({
      text: 'FORMULA_USER_MULTIUSER',
      column_type_id: COLUMN_TYPE.FORMULA,
      table_id: table3.id,
      settings: {
        formula: `TEXT.CONCAT(COLUMN.{${columnTable3LookedUpColumnTable2User.id}},"-",COLUMN.{${columnTable3LookedUpColumnTable2Ref.id}})`,
      },
    })
    // Create table 4 columns
    columnTable4RelationBetweenTable1 = await app.service('column').create({
      text: 'T4-RBT-T1',
      column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
      table_id: table4.id,
      settings: {
        tableId: table1.id,
      },
    })
    columnTable4LookedUpColumnTable1User = await app.service('column').create({
      text: 'T4-LUC-T1-USER',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table4.id,
      settings: {
        tableId: table1.id,
        localField: columnTable4RelationBetweenTable1.id,
        foreignField: columnTable1User.id,
      },
    })
    columnTable4RelationBetweenTable3 = await app.service('column').create({
      text: 'T4-RBT-T3',
      column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
      table_id: table4.id,
      settings: {
        tableId: table3.id,
      },
    })
    columnTable4LookedUpColumnTable3User = await app.service('column').create({
      text: 'T4-LUC-T3-USER',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table4.id,
      settings: {
        tableId: table3.id,
        localField: columnTable4RelationBetweenTable3.id,
        foreignField: columnTable3LookedUpColumnTable2User.id,
      },
    })
    columnTable4LookedUpColumnTable3FormulaUser = await app.service('column').create({
      text: 'T4-LUC-T3-FORMULA_USER',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table4.id,
      settings: {
        tableId: table3.id,
        localField: columnTable4RelationBetweenTable3.id,
        foreignField: columnTable3FormulaUser.id,
      },
    })
    columnTable4FormulaUserT1T3 = await app.service('column').create({
      text: 'T4-FORMULA_USER',
      column_type_id: COLUMN_TYPE.FORMULA,
      table_id: table4.id,
      settings: {
        formula: `TEXT.CONCAT(COLUMN.{${columnTable4LookedUpColumnTable1User.id}}, "-", COLUMN.{${columnTable4LookedUpColumnTable3User.id}})`,
      },
    })
    // Create user
    user1 = await app.service('user').create({
      name: 'User 1',
      email: 'user1-lkdpup@locokit.io',
      password: 'locokit',
    })
  })

  describe('correctly initialize the values', () => {
    beforeAll(async () => {
      rowTable1 = await app.service('row').create({
        table_id: table1.id,
        text: 'table 1 ref',
        data: {
          [columnTable1Ref.id]: refString,
          [columnTable1User.id]: user1.id,
          [columnTable1MultiUser.id]: [user1.id],
        },
      })
      row1Table2 = await app.service('row').create({
        table_id: table2.id,
        text: 'table 2 ref',
        data: {
          [columnTable2Ref.id]: 'mySecondString1',
          [columnTable2RelationBetweenTable1.id]: rowTable1.id,
        },
      })
      row2Table2 = await app.service('row').create({
        table_id: table2.id,
        text: 'table 2 ref',
        data: {
          [columnTable2Ref.id]: 'mySecondString2',
          [columnTable2RelationBetweenTable1.id]: rowTable1.id,
        },
      })
      row1Table3 = await app.service('row').create({
        table_id: table3.id,
        text: 'table 3 ref',
        data: {
          [columnTable3RelationBetweenTable2.id]: row1Table2.id,
        },
      })
      row2Table3 = await app.service('row').create({
        table_id: table3.id,
        text: 'table 3 ref',
        data: {
          [columnTable3RelationBetweenTable2.id]: row2Table2.id,
        },
      })
      row1Table4 = await app.service('row').create({
        table_id: table4.id,
        text: 'table 4 ref',
        data: {
          [columnTable4RelationBetweenTable1.id]: rowTable1.id,
          [columnTable4RelationBetweenTable3.id]: row1Table3.id,
        },
      })
    })
    afterAll(async () => {
      await app.service('row').remove(row1Table4.id)
      await app.service('row').remove(row1Table3.id)
      await app.service('row').remove(row2Table3.id)
      await app.service('row').remove(row1Table2.id)
      await app.service('row').remove(row2Table2.id)
      await app.service('row').remove(rowTable1.id)
    })
    it('in the original table', async () => {
      expect.assertions(6)

      const currentColumnTable1Ref = rowTable1.data[columnTable1Ref.id] as string
      const currentColumnTable1User = rowTable1.data[columnTable1User.id] as { reference: string, value: string }
      const currentColumnTable1MultiUser = rowTable1.data[columnTable1MultiUser.id] as { reference: string, value: string }
      const currentcolumnTable1FormulaRef = rowTable1.data[columnTable1FormulaRef.id] as string

      expect(currentColumnTable1Ref).toBe(refString)
      expect(currentColumnTable1User.reference).toBe(user1.id)
      expect(currentColumnTable1User.value).toBe(user1.name)
      expect(currentColumnTable1MultiUser.reference).toStrictEqual([user1.id])
      expect(currentColumnTable1MultiUser.value).toStrictEqual([user1.name])
      expect(currentcolumnTable1FormulaRef).toBe(`TEXT:${refString}`)
    })
    describe('in direct children rows', () => {
      it('of the looked-up columns', async () => {
        expect.assertions(16)

        // Table 2 - row 1
        const currentColumnTable2Row1Ref = row1Table2.data[columnTable2LookedUpColumnTable1Ref.id] as { reference: string, value: string }
        const currentColumnTable2Row1User = row1Table2.data[columnTable2LookedUpColumnTable1User.id] as { reference: string, value: string }
        const currentColumnTable2Row1MultiUser = row1Table2.data[columnTable2LookedUpColumnTable1MultiUser.id] as { reference: string, value: string }
        const currentColumnTable2Row1FormulaUser = row1Table2.data[columnTable2LookedUpcolumnTable1FormulaRef.id] as { reference: string, value: string }

        expect(currentColumnTable2Row1Ref.reference).toBe(rowTable1.id)
        expect(currentColumnTable2Row1Ref.value).toBe(refString)
        expect(currentColumnTable2Row1User.reference).toBe(user1.id)
        expect(currentColumnTable2Row1User.value).toBe(user1.name)
        expect(currentColumnTable2Row1MultiUser.reference).toStrictEqual([user1.id])
        expect(currentColumnTable2Row1MultiUser.value).toBe(user1.name)
        expect(currentColumnTable2Row1FormulaUser.reference).toBe(rowTable1.id)
        expect(currentColumnTable2Row1FormulaUser.value).toBe(`TEXT:${refString}`)

        // Table 2 - row 2
        const currentColumnTable2Row2Ref = row2Table2.data[columnTable2LookedUpColumnTable1Ref.id] as { reference: string, value: string }
        const currentColumnTable2Row2User = row2Table2.data[columnTable2LookedUpColumnTable1User.id] as { reference: string, value: string }
        const currentColumnTable2Row2MultiUser = row2Table2.data[columnTable2LookedUpColumnTable1MultiUser.id] as { reference: string, value: string }
        const currentColumnTable2Row2FormulaUser = row2Table2.data[columnTable2LookedUpcolumnTable1FormulaRef.id] as { reference: string, value: string }

        expect(currentColumnTable2Row2Ref.reference).toBe(rowTable1.id)
        expect(currentColumnTable2Row2Ref.value).toBe(refString)
        expect(currentColumnTable2Row2User.reference).toBe(user1.id)
        expect(currentColumnTable2Row2User.value).toBe(user1.name)
        expect(currentColumnTable2Row2MultiUser.reference).toStrictEqual([user1.id])
        expect(currentColumnTable2Row2MultiUser.value).toBe(user1.name)
        expect(currentColumnTable2Row2FormulaUser.reference).toBe(rowTable1.id)
        expect(currentColumnTable2Row2FormulaUser.value).toBe(`TEXT:${refString}`)
      })

      it('of the formula columns', async () => {
        expect.assertions(4)

        // Table 2 - row 1
        const currentColumnTable2Row1User = row1Table2.data[columnTable2LookedUpColumnTable1User.id] as { reference: string, value: string }
        const currentColumnTable2Row1String = row1Table2.data[columnTable2LookedUpColumnTable1Ref.id] as { reference: string, value: string }
        const currentColumnTable2Row1FormulaUser = row1Table2.data[columnTable2FormulaUser.id]
        const currentColumnTable2Row1FormulaUserString = row1Table2.data[columnTable2FormulaUserString.id]

        expect(currentColumnTable2Row1FormulaUser).toBe(currentColumnTable2Row1User.value.toUpperCase())
        expect(currentColumnTable2Row1FormulaUserString).toBe(`${currentColumnTable2Row1User.value}-${currentColumnTable2Row1String.value}`)

        // Table 2 - row 2
        const currentColumnTable2Row2User = row2Table2.data[columnTable2LookedUpColumnTable1User.id] as { reference: string, value: string }
        const currentColumnTable2Row2String = row2Table2.data[columnTable2LookedUpColumnTable1Ref.id] as { reference: string, value: string }
        const currentColumnTable2Row2FormulaUser = row2Table2.data[columnTable2FormulaUser.id]
        const currentColumnTable2Row2FormulaUserString = row2Table2.data[columnTable2FormulaUserString.id]

        expect(currentColumnTable2Row2FormulaUser).toBe(currentColumnTable2Row2User.value.toUpperCase())
        expect(currentColumnTable2Row2FormulaUserString).toBe(`${currentColumnTable2Row2User.value}-${currentColumnTable2Row2String.value}`)
      })
    })

    describe('in grandchildren rows', () => {
      it('of the looked-up columns', async () => {
        expect.assertions(18)

        // Table 3 - row 1
        const currentColumnTable3Row1Ref = row1Table3.data[columnTable3LookedUpColumnTable2Ref.id] as { reference: string, value: string }
        const currentColumnTable3Row1User = row1Table3.data[columnTable3LookedUpColumnTable2User.id] as { reference: string, value: string }
        const currentColumnTable3Row1MultiUser = row1Table3.data[columnTable3LookedUpColumnTable2MultiUser.id] as { reference: string, value: string }

        expect(currentColumnTable3Row1Ref.reference).toBe(rowTable1.id)
        expect(currentColumnTable3Row1Ref.value).toBe(refString)
        expect(currentColumnTable3Row1User.reference).toBe(user1.id)
        expect(currentColumnTable3Row1User.value).toBe(user1.name)
        expect(currentColumnTable3Row1MultiUser.reference).toStrictEqual([user1.id])
        expect(currentColumnTable3Row1MultiUser.value).toBe(user1.name)

        // Table 3 - row 2
        const currentColumnTable3Row2Ref = row2Table3.data[columnTable3LookedUpColumnTable2Ref.id] as { reference: string, value: string }
        const currentColumnTable3Row2User = row2Table3.data[columnTable3LookedUpColumnTable2User.id] as { reference: string, value: string }
        const currentColumnTable3Row2MultiUser = row2Table3.data[columnTable3LookedUpColumnTable2MultiUser.id] as { reference: string, value: string }

        expect(currentColumnTable3Row2Ref.reference).toBe(rowTable1.id)
        expect(currentColumnTable3Row2Ref.value).toBe(refString)
        expect(currentColumnTable3Row2User.reference).toBe(user1.id)
        expect(currentColumnTable3Row2User.value).toBe(user1.name)
        expect(currentColumnTable3Row2MultiUser.reference).toStrictEqual([user1.id])
        expect(currentColumnTable3Row2MultiUser.value).toBe(user1.name)

        // Table 4 - row 1
        const currentColumnTable4Row1UserT1 = row1Table4.data[columnTable4LookedUpColumnTable1User.id] as { reference: string, value: string }
        const currentColumnTable4Row1UserT3 = row1Table4.data[columnTable4LookedUpColumnTable3User.id] as { reference: string, value: string }
        const currentColumnTable4Row1FormulaUserT3 = row1Table4.data[columnTable4LookedUpColumnTable3FormulaUser.id] as { reference: string, value: string }

        expect(currentColumnTable4Row1UserT1.reference).toBe(user1.id)
        expect(currentColumnTable4Row1UserT1.value).toBe(user1.name)
        expect(currentColumnTable4Row1UserT3.reference).toBe(user1.id)
        expect(currentColumnTable4Row1UserT3.value).toBe(user1.name)
        expect(currentColumnTable4Row1FormulaUserT3.reference).toBe(row1Table3.id)
        expect(currentColumnTable4Row1FormulaUserT3.value).toBe(user1.name.toLowerCase())
      })

      it('of the formula columns', async () => {
        expect.assertions(5)

        // Table 3 - row 1
        const currentColumnTable3Row1User = row1Table3.data[columnTable3LookedUpColumnTable2User.id] as { reference: string, value: string }
        const currentColumnTable3Row1String = row1Table3.data[columnTable3LookedUpColumnTable2Ref.id] as { reference: string, value: string }
        const currentColumnTable3Row1FormulaUser = row1Table3.data[columnTable3FormulaUser.id]
        const currentColumnTable3Row1FormulaUserString = row1Table3.data[columnTable3FormulaUserString.id]

        expect(currentColumnTable3Row1FormulaUser).toBe(currentColumnTable3Row1User.value.toLowerCase())
        expect(currentColumnTable3Row1FormulaUserString).toBe(`${currentColumnTable3Row1User.value}-${currentColumnTable3Row1String.value}`)

        // Table 3 - row 2
        const currentColumnTable3Row2User = row2Table3.data[columnTable3LookedUpColumnTable2User.id] as { reference: string, value: string }
        const currentColumnTable3Row2MultiString = row2Table3.data[columnTable3LookedUpColumnTable2Ref.id] as { reference: string, value: string }
        const currentColumnTable3Row2FormulaUser = row2Table3.data[columnTable3FormulaUser.id]
        const currentColumnTable3Row2FormulaUserString = row2Table3.data[columnTable3FormulaUserString.id]

        expect(currentColumnTable3Row2FormulaUser).toBe(currentColumnTable3Row2User.value.toLowerCase())
        expect(currentColumnTable3Row2FormulaUserString).toBe(`${currentColumnTable3Row2User.value}-${currentColumnTable3Row2MultiString.value}`)

        // Table 4 - row 1
        const currentColumnTable4Row1Table1User = row1Table4.data[columnTable4LookedUpColumnTable1User.id] as { reference: string, value: string }
        const currentColumnTable4Row1Table3User = row1Table4.data[columnTable4LookedUpColumnTable3User.id] as { reference: string, value: string }
        const currentColumnTable4Row1FormulaUserT1T3 = row1Table4.data[columnTable4FormulaUserT1T3.id] as string

        expect(currentColumnTable4Row1FormulaUserT1T3).toBe(`${currentColumnTable4Row1Table1User.value}-${currentColumnTable4Row1Table3User.value}`)
      })
    })
  })

  describe('correctly update the values', () => {
    let newRowTable1: TableRow
    const updatedFirstString = 'myFirstUpdatedString'

    beforeAll(async () => {
      const service = app.service('row')
      rowTable1 = await service.create({
        table_id: table1.id,
        text: 'table 1 ref',
        data: {
          [columnTable1Ref.id]: refString,
          [columnTable1User.id]: user1.id,
          [columnTable1MultiUser.id]: [user1.id],
        },
      })
      row1Table2 = await service.create({
        table_id: table2.id,
        text: 'table 2 ref',
        data: {
          [columnTable2Ref.id]: 'mySecondString1',
          [columnTable2RelationBetweenTable1.id]: rowTable1.id,
        },
      })
      row2Table2 = await service.create({
        table_id: table2.id,
        text: 'table 2 ref',
        data: {
          [columnTable2Ref.id]: 'mySecondString2',
          [columnTable2RelationBetweenTable1.id]: rowTable1.id,
        },
      })
      row1Table3 = await service.create({
        table_id: table3.id,
        text: 'table 3 ref',
        data: {
          [columnTable3RelationBetweenTable2.id]: row1Table2.id,
        },
      })
      row2Table3 = await service.create({
        table_id: table3.id,
        text: 'table 3 ref',
        data: {
          [columnTable3RelationBetweenTable2.id]: row2Table2.id,
        },
      })
      row1Table4 = await app.service('row').create({
        table_id: table4.id,
        text: 'table 4 ref',
        data: {
          [columnTable4RelationBetweenTable1.id]: rowTable1.id,
          [columnTable4RelationBetweenTable3.id]: row1Table3.id,
        },
      })
      user2 = await app.service('user').create({
        name: 'User 2',
        email: 'user2-lkdupcolumn@locokit.io',
        password: 'locokit',
      })
      // Update the original table
      newRowTable1 = await app.service('row').patch(rowTable1.id, {
        data: {
          [columnTable1Ref.id]: updatedFirstString,
          [columnTable1User.id]: user2.id,
          [columnTable1MultiUser.id]: [user1.id, user2.id],
        },
      })
    })

    afterAll(async () => {
      await app.service('user').remove(user2.id)
      await app.service('row').remove(row1Table3.id)
      await app.service('row').remove(row2Table3.id)
      await app.service('row').remove(row1Table2.id)
      await app.service('row').remove(row2Table2.id)
      await app.service('row').remove(rowTable1.id)
    })

    it('in the original table', async () => {
      expect.assertions(6)
      const newColumnTable1Ref = newRowTable1.data[columnTable1Ref.id] as string
      const newColumnTable1User = newRowTable1.data[columnTable1User.id] as { reference: string, value: string }
      const newColumnTable1MultiUser = newRowTable1.data[columnTable1MultiUser.id] as { reference: string, value: string }
      const newcolumnTable1FormulaRef = newRowTable1.data[columnTable1FormulaRef.id] as string

      expect(newColumnTable1Ref).toBe(updatedFirstString)
      expect(newColumnTable1User.reference).toBe(user2.id)
      expect(newColumnTable1User.value).toBe(user2.name)
      expect(newColumnTable1MultiUser.reference).toStrictEqual([user1.id, user2.id])
      expect(newColumnTable1MultiUser.value).toStrictEqual([user1.name, user2.name])
      expect(newcolumnTable1FormulaRef).toBe(`TEXT:${updatedFirstString}`)
    })

    describe('in direct children rows', () => {
      let newRow1Table2: TableRow
      let newRow2Table2: TableRow

      beforeAll(async () => {
        newRow1Table2 = await app.service('row').get(row1Table2.id)
        newRow2Table2 = await app.service('row').get(row2Table2.id)
      })

      it('of the looked-up columns', async () => {
        expect.assertions(16)

        // Table 2 - row 1
        const newColumnTable2Row1Ref = newRow1Table2.data[columnTable2LookedUpColumnTable1Ref.id] as { reference: string, value: string }
        const newColumnTable2Row1User = newRow1Table2.data[columnTable2LookedUpColumnTable1User.id] as { reference: string, value: string }
        const newColumnTable2Row1MultiUser = newRow1Table2.data[columnTable2LookedUpColumnTable1MultiUser.id] as { reference: string, value: string }
        const newColumnTable2Row1FormulaUser = newRow1Table2.data[columnTable2LookedUpcolumnTable1FormulaRef.id] as { reference: string, value: string }

        expect(newColumnTable2Row1Ref.reference).toBe(newRowTable1.id)
        expect(newColumnTable2Row1Ref.value).toBe(updatedFirstString)
        expect(newColumnTable2Row1User.reference).toBe(user2.id)
        expect(newColumnTable2Row1User.value).toBe(user2.name)
        expect(newColumnTable2Row1MultiUser.reference).toStrictEqual([user1.id, user2.id])
        expect(newColumnTable2Row1MultiUser.value).toBe(`${user1.name}, ${user2.name}`)
        expect(newColumnTable2Row1FormulaUser.reference).toBe(newRowTable1.id)
        expect(newColumnTable2Row1FormulaUser.value).toBe(`TEXT:${updatedFirstString}`)

        // Table 2 - row 2
        const newColumnTable2Row2Ref = newRow2Table2.data[columnTable2LookedUpColumnTable1Ref.id] as { reference: string, value: string }
        const newColumnTable2Row2User = newRow2Table2.data[columnTable2LookedUpColumnTable1User.id] as { reference: string, value: string }
        const newColumnTable2Row2MultiUser = newRow2Table2.data[columnTable2LookedUpColumnTable1MultiUser.id] as { reference: string, value: string }
        const newColumnTable2Row2FormulaUser = newRow2Table2.data[columnTable2LookedUpcolumnTable1FormulaRef.id] as { reference: string, value: string }

        expect(newColumnTable2Row2Ref.reference).toBe(newRowTable1.id)
        expect(newColumnTable2Row2Ref.value).toBe(updatedFirstString)
        expect(newColumnTable2Row2User.reference).toBe(user2.id)
        expect(newColumnTable2Row2User.value).toBe(user2.name)
        expect(newColumnTable2Row2MultiUser.reference).toStrictEqual([user1.id, user2.id])
        expect(newColumnTable2Row2MultiUser.value).toBe(`${user1.name}, ${user2.name}`)
        expect(newColumnTable2Row2FormulaUser.reference).toBe(newRowTable1.id)
        expect(newColumnTable2Row2FormulaUser.value).toBe(`TEXT:${updatedFirstString}`)
      })
      it('of the formula columns', async () => {
        expect.assertions(4)

        // Table 2 - row 1
        const newColumnTable2Row1User = newRow1Table2.data[columnTable2LookedUpColumnTable1User.id] as { reference: string, value: string }
        const newColumnTable2Row1String = newRow1Table2.data[columnTable2LookedUpColumnTable1Ref.id] as { reference: string, value: string }
        const newColumnTable2Row1FormulaUser = newRow1Table2.data[columnTable2FormulaUser.id]
        const newColumnTable2Row1FormulaUserString = newRow1Table2.data[columnTable2FormulaUserString.id]

        expect(newColumnTable2Row1FormulaUser).toBe(newColumnTable2Row1User.value.toUpperCase())
        expect(newColumnTable2Row1FormulaUserString).toBe(`${newColumnTable2Row1User.value}-${newColumnTable2Row1String.value}`)

        // Table 2 - row 2
        const newColumnTable2Row2User = newRow2Table2.data[columnTable2LookedUpColumnTable1User.id] as { reference: string, value: string }
        const newColumnTable2Row2String = newRow2Table2.data[columnTable2LookedUpColumnTable1Ref.id] as { reference: string, value: string }
        const newColumnTable2Row2FormulaUser = newRow2Table2.data[columnTable2FormulaUser.id]
        const newColumnTable2Row2FormulaUserString = newRow2Table2.data[columnTable2FormulaUserString.id]

        expect(newColumnTable2Row2FormulaUser).toBe(newColumnTable2Row2User.value.toUpperCase())
        expect(newColumnTable2Row2FormulaUserString).toBe(`${newColumnTable2Row2User.value}-${newColumnTable2Row2String.value}`)
      })
    })
    describe('in grandchildren rows', () => {
      let newRow1Table3: TableRow
      let newRow2Table3: TableRow
      let newRow1Table4: TableRow

      beforeAll(async () => {
        newRow1Table3 = await app.service('row').get(row1Table3.id)
        newRow2Table3 = await app.service('row').get(row2Table3.id)
        newRow1Table4 = await app.service('row').get(row1Table4.id)
      })

      it('of the looked-up columns', async () => {
        expect.assertions(18)

        // Table 3 - row 1
        const newColumnTable3Row1Ref = newRow1Table3.data[columnTable3LookedUpColumnTable2Ref.id] as { reference: string, value: string }
        const newColumnTable3Row1User = newRow1Table3.data[columnTable3LookedUpColumnTable2User.id] as { reference: string, value: string }
        const newColumnTable3Row1MultiUser = newRow1Table3.data[columnTable3LookedUpColumnTable2MultiUser.id] as { reference: string, value: string }

        expect(newColumnTable3Row1Ref.reference).toBe(newRowTable1.id)
        expect(newColumnTable3Row1Ref.value).toBe(updatedFirstString)
        expect(newColumnTable3Row1User.reference).toBe(user2.id)
        expect(newColumnTable3Row1User.value).toBe(user2.name)
        expect(newColumnTable3Row1MultiUser.reference).toStrictEqual([user1.id, user2.id])
        expect(newColumnTable3Row1MultiUser.value).toBe(`${user1.name}, ${user2.name}`)

        // Table 3 - row 2
        const newColumnTable3Row2Ref = newRow2Table3.data[columnTable3LookedUpColumnTable2Ref.id] as { reference: string, value: string }
        const newColumnTable3Row2User = newRow2Table3.data[columnTable3LookedUpColumnTable2User.id] as { reference: string, value: string }
        const newColumnTable3Row2MultiUser = newRow2Table3.data[columnTable3LookedUpColumnTable2MultiUser.id] as { reference: string, value: string }

        expect(newColumnTable3Row2Ref.reference).toBe(newRowTable1.id)
        expect(newColumnTable3Row2Ref.value).toBe(updatedFirstString)
        expect(newColumnTable3Row2User.reference).toBe(user2.id)
        expect(newColumnTable3Row2User.value).toBe(user2.name)
        expect(newColumnTable3Row2MultiUser.reference).toStrictEqual([user1.id, user2.id])
        expect(newColumnTable3Row2MultiUser.value).toBe(`${user1.name}, ${user2.name}`)

        // Table 4 - row 1
        const newColumnTable4Row1UserT1 = newRow1Table4.data[columnTable4LookedUpColumnTable1User.id] as { reference: string, value: string }
        const newColumnTable4Row1UserT3 = newRow1Table4.data[columnTable4LookedUpColumnTable3User.id] as { reference: string, value: string }
        const newColumnTable4Row1FormulaUserT3 = newRow1Table4.data[columnTable4LookedUpColumnTable3FormulaUser.id] as { reference: string, value: string }

        expect(newColumnTable4Row1UserT1.reference).toBe(user2.id)
        expect(newColumnTable4Row1UserT1.value).toBe(user2.name)
        expect(newColumnTable4Row1UserT3.reference).toStrictEqual(user2.id)
        expect(newColumnTable4Row1UserT3.value).toBe(user2.name)
        expect(newColumnTable4Row1FormulaUserT3.reference).toBe(newRow1Table3.id)
        expect(newColumnTable4Row1FormulaUserT3.value).toBe(user2.name.toLowerCase())
      })
      it('of the formula columns', async () => {
        expect.assertions(5)

        // Table 3 - row 1
        const newColumnTable3Row1User = newRow1Table3.data[columnTable3LookedUpColumnTable2User.id] as { reference: string, value: string }
        const newColumnTable3Row1String = newRow1Table3.data[columnTable3LookedUpColumnTable2Ref.id] as { reference: string, value: string }
        const newColumnTable3Row1FormulaUser = newRow1Table3.data[columnTable3FormulaUser.id]
        const newColumnTable3Row1FormulaUserString = newRow1Table3.data[columnTable3FormulaUserString.id]

        expect(newColumnTable3Row1FormulaUser).toBe(newColumnTable3Row1User.value.toLowerCase())
        expect(newColumnTable3Row1FormulaUserString).toBe(`${newColumnTable3Row1User.value}-${newColumnTable3Row1String.value}`)

        // Table 3 - row 2
        const newColumnTable3Row2User = newRow2Table3.data[columnTable3LookedUpColumnTable2User.id] as { reference: string, value: string }
        const newColumnTable3Row2String = newRow2Table3.data[columnTable3LookedUpColumnTable2Ref.id] as { reference: string, value: string }
        const newColumnTable3Row2FormulaUser = newRow2Table3.data[columnTable3FormulaUser.id]
        const newColumnTable3Row2FormulaUserString = newRow2Table3.data[columnTable3FormulaUserString.id]

        expect(newColumnTable3Row2FormulaUser).toBe(newColumnTable3Row2User.value.toLowerCase())
        expect(newColumnTable3Row2FormulaUserString).toBe(`${newColumnTable3Row2User.value}-${newColumnTable3Row2String.value}`)

        // Table 4 - row 1
        const newColumnTable4Row1Table1User = newRow1Table4.data[columnTable4LookedUpColumnTable1User.id] as { reference: string, value: string }
        const newColumnTable4Row1Table3User = newRow1Table4.data[columnTable4LookedUpColumnTable3User.id] as { reference: string, value: string }
        const newColumnTable4Row1FormulaUserT1T3 = newRow1Table4.data[columnTable4FormulaUserT1T3.id] as string

        expect(newColumnTable4Row1FormulaUserT1T3).toBe(`${newColumnTable4Row1Table1User.value}-${newColumnTable4Row1Table3User.value}`)
      })
    })
  })

  // describe('error cases', () => {
  //   let columnTable1RelationBetweenTable2: TableColumn
  //   let columnTable1LookedUpColumnTable2Ref: TableColumn

  //   beforeAll(async () => {
  //     // Create columns
  //     columnTable1RelationBetweenTable2 = await app.service('column').create({
  //       text: 'Ref',
  //       column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
  //       table_id: table1.id,
  //       settings: {
  //         tableId: table2.id,
  //       },
  //     })
  //     columnTable1LookedUpColumnTable2Ref = await app.service('column').create({
  //       text: 'RefString',
  //       column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
  //       table_id: table1.id,
  //       settings: {
  //         tableId: table2.id,
  //         localField: columnTable1RelationBetweenTable2.id,
  //         foreignField: columnTable2LookedUpColumnTable1Ref.id,
  //       },
  //     })
  //     rowTable1 = await app.service('row').create({
  //       table_id: table1.id,
  //       text: 'table 1 ref',
  //       data: {
  //         [columnTable1Ref.id]: refString,
  //         [columnTable1User.id]: user1.id,
  //         [columnTable1MultiUser.id]: [user1.id],
  //       },
  //     })
  //     row1Table2 = await app.service('row').create({
  //       table_id: table2.id,
  //       text: 'table 2 ref',
  //       data: {
  //         [columnTable2Ref.id]: 'mySecondString1',
  //         [columnTable2RelationBetweenTable1.id]: rowTable1.id,
  //       },
  //     })
  //     row2Table2 = await app.service('row').create({
  //       table_id: table2.id,
  //       text: 'table 2 ref',
  //       data: {
  //         [columnTable2Ref.id]: 'mySecondString2',
  //         [columnTable2RelationBetweenTable1.id]: rowTable1.id,
  //       },
  //     })
  //     row1Table3 = await app.service('row').create({
  //       table_id: table3.id,
  //       text: 'table 3 ref',
  //       data: {
  //         [columnTable3RelationBetweenTable2.id]: row1Table2.id,
  //       },
  //     })
  //     row2Table3 = await app.service('row').create({
  //       table_id: table3.id,
  //       text: 'table 3 ref',
  //       data: {
  //         [columnTable3RelationBetweenTable2.id]: row2Table2.id,
  //       },
  //     })
  //   })
  //   afterAll(async () => {
  //     await app.service('row').remove(row1Table3.id)
  //     await app.service('row').remove(row2Table3.id)
  //     await app.service('row').remove(row1Table2.id)
  //     await app.service('row').remove(row2Table2.id)
  //     await app.service('row').remove(rowTable1.id)
  //     await app.service('column').remove(columnTable1RelationBetweenTable2.id)
  //     await app.service('column').remove(columnTable1LookedUpColumnTable2Ref.id)
  //   })
  //   it('throw an error if a loop is encountered', async () => {
  //     expect.assertions(1)
  //     rowTable1 = await app.service('row').patch(rowTable1.id, {
  //       data: {
  //         [columnTable1RelationBetweenTable2.id]: row1Table2.id,
  //       },
  //     })
  //   })
  // })

  afterAll(async () => {
    await app.service('user').remove(user1.id)
    await app.service('column').remove(columnTable1User.id)
    await app.service('column').remove(columnTable1MultiUser.id)
    await app.service('column').remove(columnTable1FormulaRef.id)
    await app.service('column').remove(columnTable1Ref.id)
    await app.service('column').remove(columnTable2Ref.id)
    await app.service('column').remove(columnTable2FormulaUser.id)
    await app.service('column').remove(columnTable2FormulaUserString.id)
    await app.service('column').remove(columnTable2LookedUpColumnTable1Ref.id)
    await app.service('column').remove(columnTable2LookedUpColumnTable1User.id)
    await app.service('column').remove(columnTable2LookedUpColumnTable1MultiUser.id)
    await app.service('column').remove(columnTable2LookedUpcolumnTable1FormulaRef.id)
    await app.service('column').remove(columnTable2RelationBetweenTable1.id)
    await app.service('column').remove(columnTable3FormulaUser.id)
    await app.service('column').remove(columnTable3FormulaUserString.id)
    await app.service('column').remove(columnTable3LookedUpColumnTable2Ref.id)
    await app.service('column').remove(columnTable3LookedUpColumnTable2User.id)
    await app.service('column').remove(columnTable3LookedUpColumnTable2MultiUser.id)
    await app.service('column').remove(columnTable3RelationBetweenTable2.id)
    await app.service('column').remove(columnTable4FormulaUserT1T3.id)
    await app.service('column').remove(columnTable4LookedUpColumnTable1User.id)
    await app.service('column').remove(columnTable4LookedUpColumnTable3User.id)
    await app.service('column').remove(columnTable4RelationBetweenTable1.id)
    await app.service('column').remove(columnTable4RelationBetweenTable3.id)
    await app.service('column').remove(columnTable4LookedUpColumnTable3User.id)
    await app.service('column').remove(columnTable4LookedUpColumnTable3FormulaUser.id)
    await app.service('table').remove(table1.id)
    await app.service('table').remove(table2.id)
    await app.service('table').remove(table3.id)
    await app.service('table').remove(table4.id)
    await app.service('database').remove(database.id)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    await app.service('aclset').remove(workspace.aclsets?.[0].id as string)
    await app.service('workspace').remove(workspace.id)
  })
})
