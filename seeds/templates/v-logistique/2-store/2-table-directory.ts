import * as Knex from 'knex'
import { glossary } from "../../../../src/glossary";
import { DATABASE_ID, TABLES } from '../glossary/schema'

export async function seed (knex: Knex): Promise<any> {

  // Person
  await knex('table').insert([
    {
      id: TABLES.PERSON.ID,
      text: 'Personne',
      database_id: DATABASE_ID
    }
  ])
  await knex('table_column').insert([
    {
      id: TABLES.PERSON.COLUMNS.FIRST_NAME,
      text: 'Prénom',
      table_id: TABLES.PERSON.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.PERSON.COLUMNS.LAST_NAME,
      text: 'Nom',
      table_id: TABLES.PERSON.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.PERSON.COLUMNS.USER,
      text: 'Utilisateur',
      table_id: TABLES.PERSON.ID,
      column_type_id: glossary.COLUMN_TYPE.USER
    }
  ])

  // Providers
  await knex('table').insert([
    {
      id: TABLES.SUPPLIER.ID,
      text: 'Fournisseur',
      database_id: DATABASE_ID
    }
  ])
  await knex('table_column').insert([
    {
      id: TABLES.SUPPLIER.COLUMNS.NAME,
      text: 'Nom fournisseur',
      table_id: TABLES.SUPPLIER.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.SUPPLIER.COLUMNS.GEOZONE,
      text: 'Zone géographique',
      table_id: TABLES.SUPPLIER.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.SUPPLIER.COLUMNS.USER,
      text: 'Utilisateur',
      table_id: TABLES.SUPPLIER.ID,
      column_type_id: glossary.COLUMN_TYPE.USER
    }
  ])

}
