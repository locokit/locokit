import * as Knex from 'knex'
import { COLUMN_TYPE } from "@locokit/lck-glossary";
import { DATABASE_ID, TABLES } from '../glossary/schema'

export async function seed (knex: Knex): Promise<any> {
  // Request
  await knex('table').insert([
    {
      id: TABLES.MESSAGE.ID,
      text: 'Message',
      database_id: DATABASE_ID
    }
  ])
  await knex('table_column').insert([{
    id: TABLES.MESSAGE.COLUMNS.FROM_EMAIL,
    text: 'De',
    table_id: TABLES.MESSAGE.ID,
    column_type_id: COLUMN_TYPE.STRING
  }, {
    id: TABLES.MESSAGE.COLUMNS.FROM_USER,
    text: 'De (utilisateur)',
    table_id: TABLES.MESSAGE.ID,
    column_type_id: COLUMN_TYPE.USER
  }, {
    id: TABLES.MESSAGE.COLUMNS.TO_EMAIL,
    text: 'À',
    table_id: TABLES.MESSAGE.ID,
    column_type_id: COLUMN_TYPE.STRING
  }, {
    id: TABLES.MESSAGE.COLUMNS.TO_USER,
    text: 'À (utilisateur)',
    table_id: TABLES.MESSAGE.ID,
    column_type_id: COLUMN_TYPE.USER
  }, {
    id: TABLES.MESSAGE.COLUMNS.SUBJECT,
    text: 'Sujet',
    table_id: TABLES.MESSAGE.ID,
    column_type_id: COLUMN_TYPE.STRING
  }, {
    id: TABLES.MESSAGE.COLUMNS.CONTENT,
    text: 'Message',
    table_id: TABLES.MESSAGE.ID,
    column_type_id: COLUMN_TYPE.STRING
  }, {
    id: TABLES.MESSAGE.COLUMNS.DATE,
    text: 'Date',
    table_id: TABLES.MESSAGE.ID,
    column_type_id: COLUMN_TYPE.DATE
  }])
}
