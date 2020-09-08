import * as Knex from 'knex'
import { glossary } from "../../../../src/glossary";
import { DATABASE_ID, TABLES } from '../glossary/schema'
import { VALUES } from '../glossary/value_single_select'

export async function seed (knex: Knex): Promise<any> {
  // Request
  await knex('table').insert([
    {
      id: TABLES.TRAINING.ID,
      text: 'Formation',
      database_id: DATABASE_ID
    }
  ])
  await knex('table_column').insert([{
    id: TABLES.TRAINING.COLUMNS.BIKE,
    text: 'Vélo',
    table_id: TABLES.TRAINING.ID,
    column_type_id: glossary.COLUMN_TYPE.RELATION_BETWEEN_TABLES,
    settings: {
      tableId: TABLES.BIKE.ID
    }
  }, {
    id: TABLES.TRAINING.COLUMNS.SOCIETY,
    text: 'Société',
    table_id: TABLES.TRAINING.ID,
    column_type_id: glossary.COLUMN_TYPE.LOOKED_UP_COLUMN,
    settings: {
      tableId: TABLES.BIKE.ID, // useful ?
      localField: TABLES.TRAINING.COLUMNS.BIKE,
      foreignField: TABLES.BIKE.COLUMNS.SOCIETY
    }
  }, {
    id: TABLES.TRAINING.COLUMNS.BENEFICIARY_USER,
    text: 'Bénéficiaire',
    table_id: TABLES.TRAINING.ID,
    column_type_id: glossary.COLUMN_TYPE.LOOKED_UP_COLUMN,
    settings: {
      tableId: TABLES.BIKE.ID, // useful ?
      localField: TABLES.TRAINING.COLUMNS.BIKE,
      foreignField: TABLES.BIKE.COLUMNS.BENEFICIARY_USER
    }
  }, {
    id: TABLES.TRAINING.COLUMNS.TYPE,
    text: 'Type',
    table_id: TABLES.TRAINING.ID,
    column_type_id: glossary.COLUMN_TYPE.LOOKED_UP_COLUMN,
    settings: {
      tableId: TABLES.BIKE.ID, // useful ?
      localField: TABLES.TRAINING.COLUMNS.BIKE,
      foreignField: TABLES.BIKE.COLUMNS.TYPE
    }
  }, {
    id: TABLES.TRAINING.COLUMNS.STATUS,
    text: 'État',
    table_id: TABLES.TRAINING.ID,
    column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
    settings: {
      values: VALUES.KANBAN
    }
  }, {
    id: TABLES.TRAINING.COLUMNS.DATE,
    text: 'Date',
    table_id: TABLES.TRAINING.ID,
    column_type_id: glossary.COLUMN_TYPE.DATE
  }, {
    id: TABLES.TRAINING.COLUMNS.INSTITUTION,
    text: 'Organisme',
    table_id: TABLES.TRAINING.ID,
    column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
    settings: {
      values: {
        1: {
          label: 'FUB',
          color: '#25496a'
        },
        2: {
          label: 'BicyclAide',
          color: '#082b4b'
        }
      }
    }
  }, {
    id: TABLES.TRAINING.COLUMNS.TRAINER,
    text: 'Formateur',
    table_id: TABLES.TRAINING.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.TRAINING.COLUMNS.FILE,
    text: 'Document',
    table_id: TABLES.TRAINING.ID,
    column_type_id: glossary.COLUMN_TYPE.FILE
  }, {
    id: TABLES.TRAINING.COLUMNS.RATING,
    text: 'Note',
    table_id: TABLES.TRAINING.ID,
    column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
    settings: {
      values: VALUES.RATING
    }
  }])
}
