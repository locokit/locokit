import * as Knex from "knex";
import { TABLES } from "./160-v-logistique-schema";

export const VIEWS = {
  RECIPIENT_BICYCLE: 'b1345b1b-d5f9-4a6e-bded-265313e81ef9',
  PROVIDER_BICYCLE: '2ef7f439-3946-4efb-87c7-0fd413bfc9d7',
  ALL_BICYCLE: '91d819b4-ff5d-498f-ae61-5796268607d0',
  ALL_RECIPIENT: 'c804fae3-5d33-4759-9c1f-7d8f01c32d81',
  ALL_PROVIDER: '9753bd58-ad09-4ed0-9301-fa9ea66b7d7f',
  ROZO: 'b86f21ea-e086-11ea-87d0-0242ac130003',
}

export async function seed(knex: Knex): Promise<any> {
  /**
   * View vélo bénéficiaire
   */
  await knex("table_view").insert([{
    id: VIEWS.RECIPIENT_BICYCLE,
    text: 'Vélo bénéficiaire',
    table_id: TABLES.BICYCLE.ID
  }])
  await knex("table_view_has_table_column").insert([{
    table_column_id: TABLES.BICYCLE.COLUMNS.NAME,
    table_view_id: VIEWS.RECIPIENT_BICYCLE,
    visible: true
  }, {
    table_column_id: TABLES.BICYCLE.COLUMNS.REF,
    table_view_id: VIEWS.RECIPIENT_BICYCLE,
    visible: true
  }, {
    table_column_id: TABLES.BICYCLE.COLUMNS.STATUS,
    table_view_id: VIEWS.RECIPIENT_BICYCLE,
    visible: true
  }, {
    table_column_id: TABLES.BICYCLE.COLUMNS.BRAND,
    table_view_id: VIEWS.RECIPIENT_BICYCLE,
    visible: true
  }, {
    table_column_id: TABLES.BICYCLE.COLUMNS.MAINTENANCE_DATE,
    table_view_id: VIEWS.RECIPIENT_BICYCLE,
    visible: true
  }, {
    table_column_id: TABLES.BICYCLE.COLUMNS.PERSON,
    table_view_id: VIEWS.RECIPIENT_BICYCLE,
    filter: JSON.stringify({
      $eq: "{userId}"
    }),
    visible: false
  }, {
    table_column_id: TABLES.BICYCLE.COLUMNS.PROVIDER,
    table_view_id: VIEWS.RECIPIENT_BICYCLE,
    visible: true
  }, {
    table_column_id: TABLES.BICYCLE.COLUMNS.LAST_TRACER_DATA,
    table_view_id: VIEWS.RECIPIENT_BICYCLE,
    visible: true
  }])

  /**
   * Vue Vélo fournisseur
   */
  await knex("table_view").insert([{
    id: VIEWS.PROVIDER_BICYCLE,
    text: 'Vélo fournisseur',
    table_id: TABLES.BICYCLE.ID
  }])

  await knex("table_view_has_table_column").insert([{
    table_column_id: TABLES.BICYCLE.COLUMNS.NAME,
    table_view_id: VIEWS.PROVIDER_BICYCLE,
    visible: true
  }, {
    table_column_id: TABLES.BICYCLE.COLUMNS.REF,
    table_view_id: VIEWS.PROVIDER_BICYCLE,
    visible: true
  }, {
    table_column_id: TABLES.BICYCLE.COLUMNS.STATUS,
    table_view_id: VIEWS.PROVIDER_BICYCLE,
    visible: true
  }, {
    table_column_id: TABLES.BICYCLE.COLUMNS.PERSON,
    table_view_id: VIEWS.PROVIDER_BICYCLE,
    visible: true
  }, {
    table_column_id: TABLES.BICYCLE.COLUMNS.COMMISSIONING_DATE,
    table_view_id: VIEWS.PROVIDER_BICYCLE,
    visible: true
  }, {
    table_column_id: TABLES.BICYCLE.COLUMNS.PROVIDER,
    table_view_id: VIEWS.PROVIDER_BICYCLE,
    filter: JSON.stringify({
      $eq: "{userId}"
    }),
    visible: false
  }, {
    table_column_id: TABLES.BICYCLE.COLUMNS.LAST_TRACER_DATA,
    table_view_id: VIEWS.PROVIDER_BICYCLE,
    visible: true
  }])


  /**
   * Vue ensemble des vélos
   */
  await knex("table_view").insert([{
    id: VIEWS.ALL_BICYCLE,
    text: 'Ensemble des vélos',
    table_id: TABLES.BICYCLE.ID
  }])

  await knex("table_view_has_table_column").insert([{
    table_column_id: TABLES.BICYCLE.COLUMNS.NAME,
    table_view_id: VIEWS.ALL_BICYCLE,
    visible: true
  }, {
    table_column_id: TABLES.BICYCLE.COLUMNS.REF,
    table_view_id: VIEWS.ALL_BICYCLE,
    visible: true
  }, {
    table_column_id: TABLES.BICYCLE.COLUMNS.PERSON,
    table_view_id: VIEWS.ALL_BICYCLE,
    visible: true
  }, {
    table_column_id: TABLES.BICYCLE.COLUMNS.PROVIDER,
    table_view_id: VIEWS.ALL_BICYCLE,
    visible: true
  }, {
    table_column_id: TABLES.BICYCLE.COLUMNS.STATUS,
    table_view_id: VIEWS.ALL_BICYCLE,
    visible: true
  }, {
    table_column_id: TABLES.BICYCLE.COLUMNS.BRAND,
    table_view_id: VIEWS.ALL_BICYCLE,
    visible: true
  }, {
    table_column_id: TABLES.BICYCLE.COLUMNS.COMMISSIONING_DATE,
    table_view_id: VIEWS.ALL_BICYCLE,
    visible: true
  }, {
    table_column_id: TABLES.BICYCLE.COLUMNS.MAINTENANCE_DATE,
    table_view_id: VIEWS.ALL_BICYCLE,
    visible: true
  }, {
    table_column_id: TABLES.BICYCLE.COLUMNS.LAST_TRACER_DATA,
    table_view_id: VIEWS.ALL_BICYCLE,
    visible: true
  }])

  /**
   * Vue ensemble des bénéficiaires
   */
  await knex("table_view").insert([{
    id: VIEWS.ALL_RECIPIENT,
    text: 'Ensemble des bénéficiaires',
    table_id: TABLES.PERSON.ID
  }])

  await knex("table_view_has_table_column").insert([{
    table_column_id: TABLES.PERSON.COLUMNS.LASTNAME,
    table_view_id: VIEWS.ALL_RECIPIENT,
    visible: true
  }, {
    table_column_id: TABLES.PERSON.COLUMNS.FIRSTNAME,
    table_view_id: VIEWS.ALL_RECIPIENT,
    visible: true
  }, {
    table_column_id: TABLES.PERSON.COLUMNS.USER,
    table_view_id: VIEWS.ALL_RECIPIENT,
    visible: true
  }])

  /**
   * Vue ensemble des fournisseurs
   */
  await knex("table_view").insert([{
    id: VIEWS.ALL_PROVIDER,
    text: 'Ensemble des fournisseurs',
    table_id: TABLES.PROVIDER.ID
  }])

  await knex("table_view_has_table_column").insert([{
    table_column_id: TABLES.PROVIDER.COLUMNS.NAME,
    table_view_id: VIEWS.ALL_PROVIDER,
    visible: true
  }, {
    table_column_id: TABLES.PROVIDER.COLUMNS.USER,
    table_view_id: VIEWS.ALL_PROVIDER,
    visible: true
  }])

  /**
   * Vue ensemble rozo
   */
  await knex("table_view").insert([{
    id: VIEWS.ROZO,
    text: 'Ensemble Rozo',
    table_id: TABLES.ROZO.ID
  }])

  await knex("table_view_has_table_column").insert([{
    table_column_id: '7a9c6160-e069-11ea-87d0-0242ac130003',
    table_view_id: VIEWS.ROZO,
    visible: true
  }, {
    table_column_id: 'b95a6a20-e06c-11ea-87d0-0242ac130003',
    table_view_id: VIEWS.ROZO,
    visible: true
  }, {
    table_column_id: 'c3c22e08-e06c-11ea-87d0-0242ac130003',
    table_view_id: VIEWS.ROZO,
    visible: true
  }, {
    table_column_id: '6c20ca98-e08e-11ea-87d0-0242ac130003',
    table_view_id: VIEWS.ROZO,
    visible: true
  }, {
    table_column_id: 'c9d0980c-e06c-11ea-87d0-0242ac130003',
    table_view_id: VIEWS.ROZO,
    visible: true
  }, {
    table_column_id: 'ce540512-e06c-11ea-87d0-0242ac130003',
    table_view_id: VIEWS.ROZO,
    visible: true
  }])
};
