import * as Knex from 'knex'
import { glossary } from '../../../core/glossary'
import { DATABASE_ID, TABLES } from '../glossary/schema'
import { VALUES } from '../glossary/value_single_select'

export async function seed (knex: Knex): Promise<any> {

  /**
   * Table Traceurs Morio
   */
  await knex('table').insert([
    {
      id: TABLES.MORIO_TRACER.ID,
      text: 'Traceurs Morio',
      database_id: DATABASE_ID
    }, {
      id: TABLES.MORIO_TRACER_DATA.ID,
      text: 'Métriques traceurs Morio',
      database_id: DATABASE_ID
    }
  ])

  // Tracer
  await knex('table_column').insert([{
    id: TABLES.MORIO_TRACER.COLUMNS.REF,
    text: 'Référence',
    table_id: TABLES.MORIO_TRACER.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.MORIO_TRACER.COLUMNS.SIGFOX_ID,
    text: 'Réf SigFox',
    table_id: TABLES.MORIO_TRACER.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.MORIO_TRACER.COLUMNS.STATUS,
    text: 'État',
    table_id: TABLES.MORIO_TRACER.ID,
    column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
    settings: {
      values: VALUES.SHIPMENT
    }
  }, {
    id: TABLES.MORIO_TRACER.COLUMNS.BIKE,
    text: 'Vélo',
    table_id: TABLES.MORIO_TRACER.ID,
    column_type_id: glossary.COLUMN_TYPE.RELATION_BETWEEN_TABLES,
    settings: {
      tableId: TABLES.BIKE.ID
    }
  }, {
    id: TABLES.MORIO_TRACER.COLUMNS.BIKE_STATUS,
    text: 'État vélo',
    table_id: TABLES.MORIO_TRACER.ID,
    column_type_id: glossary.COLUMN_TYPE.LOOKED_UP_COLUMN,
    settings: {
      tableId: TABLES.BIKE.ID,
      localField: TABLES.MORIO_TRACER.COLUMNS.BIKE,
      foreignField: TABLES.BIKE.COLUMNS.STATUS
    }
  }, {
    id: TABLES.MORIO_TRACER.COLUMNS.TYPE,
    text: 'Type',
    table_id: TABLES.MORIO_TRACER.ID,
    column_type_id: glossary.COLUMN_TYPE.LOOKED_UP_COLUMN,
    settings: {
      tableId: TABLES.BIKE.ID, // useful ?
      localField: TABLES.MORIO_TRACER.COLUMNS.BIKE,
      foreignField: TABLES.BIKE.COLUMNS.TYPE
    }
  }, {
    id: TABLES.MORIO_TRACER.COLUMNS.SOCIETY,
    text: 'Société',
    table_id: TABLES.MORIO_TRACER.ID,
    column_type_id: glossary.COLUMN_TYPE.LOOKED_UP_COLUMN,
    settings: {
      tableId: TABLES.BIKE.ID, // useful ?
      localField: TABLES.MORIO_TRACER.COLUMNS.BIKE,
      foreignField: TABLES.BIKE.COLUMNS.SOCIETY
    }
  }, {
    id: TABLES.MORIO_TRACER.COLUMNS.DATE_BEGIN,
    text: 'Date de début',
    table_id: TABLES.MORIO_TRACER.ID,
    column_type_id: glossary.COLUMN_TYPE.DATE
  }, {
    id: TABLES.MORIO_TRACER.COLUMNS.PERSON,
    text: 'Bénéficiaire',
    table_id: TABLES.MORIO_TRACER.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.MORIO_TRACER.COLUMNS.NUM_REQUEST,
    text: 'Demande n°',
    table_id: TABLES.MORIO_TRACER.ID,
    column_type_id: glossary.COLUMN_TYPE.LOOKED_UP_COLUMN,
    settings: {
      tableId: TABLES.BIKE.ID, // useful ?
      localField: TABLES.MORIO_TRACER.COLUMNS.BIKE,
      foreignField: TABLES.BIKE.COLUMNS.NUM_REQUEST
    }
  }])

  // Table tracer data
  await knex('table_column').insert([{
    id: TABLES.MORIO_TRACER_DATA.COLUMNS.REF,
    text: 'Référence',
    table_id: TABLES.MORIO_TRACER_DATA.ID,
    column_type_id: glossary.COLUMN_TYPE.RELATION_BETWEEN_TABLES,
    settings: {
      tableId: TABLES.MORIO_TRACER.ID
    }
  }, {
    id: TABLES.MORIO_TRACER_DATA.COLUMNS.BEGIN,
    text: 'Début de période',
    table_id: TABLES.MORIO_TRACER_DATA.ID,
    column_type_id: glossary.COLUMN_TYPE.DATE
  }, {
    id: TABLES.MORIO_TRACER_DATA.COLUMNS.END,
    text: 'Fin de période',
    table_id: TABLES.MORIO_TRACER_DATA.ID,
    column_type_id: glossary.COLUMN_TYPE.DATE
  }, {
    id: TABLES.MORIO_TRACER_DATA.COLUMNS.VALUE,
    text: 'Valeur',
    table_id: TABLES.MORIO_TRACER_DATA.ID,
    column_type_id: glossary.COLUMN_TYPE.NUMBER
  }])
}
