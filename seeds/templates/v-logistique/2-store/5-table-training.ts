import * as Knex from 'knex'
import { glossary } from '../../../core/glossary'
import { DATABASE_ID, TABLES } from '../glossary/schema'

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
    id: TABLES.TRAINING.COLUMNS.REQUEST,
    text: 'Demande',
    table_id: TABLES.TRAINING.ID,
    column_type_id: glossary.COLUMN_TYPE.RELATION_BETWEEN_TABLES,
    settings: {
      tableId: TABLES.REQUEST.ID
    }
  }, {
    id: TABLES.TRAINING.COLUMNS.SOCIETY,
    text: 'Société',
    table_id: TABLES.TRAINING.ID,
    column_type_id: glossary.COLUMN_TYPE.LOOKED_UP_COLUMN,
    settings: {
      tableId: TABLES.REQUEST.ID, // useful ?
      localField: TABLES.TRAINING.COLUMNS.REQUEST,
      foreignField: TABLES.REQUEST.COLUMNS.SOCIETY
    }
  }, {
    id: TABLES.TRAINING.COLUMNS.TYPE,
    text: 'Type',
    table_id: TABLES.TRAINING.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.TRAINING.COLUMNS.FORMATION,
    text: 'Formation ??',
    table_id: TABLES.TRAINING.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.TRAINING.COLUMNS.DATE,
    text: 'Date',
    table_id: TABLES.TRAINING.ID,
    column_type_id: glossary.COLUMN_TYPE.DATE
  }, {
    id: TABLES.TRAINING.COLUMNS.INSTITUTION,
    text: 'Institution',
    table_id: TABLES.TRAINING.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.TRAINING.COLUMNS.TRAINER,
    text: 'Formateur',
    table_id: TABLES.TRAINING.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.TRAINING.COLUMNS.FILE,
    text: 'Fichier',
    table_id: TABLES.TRAINING.ID,
    column_type_id: glossary.COLUMN_TYPE.FILE
  }, {
    id: TABLES.TRAINING.COLUMNS.USER,
    text: 'Utilisateur',
    table_id: TABLES.TRAINING.ID,
    column_type_id: glossary.COLUMN_TYPE.USER
  }, {
    id: TABLES.TRAINING.COLUMNS.RATING,
    text: 'Note',
    table_id: TABLES.TRAINING.ID,
    column_type_id: glossary.COLUMN_TYPE.NUMBER
  }])
}
