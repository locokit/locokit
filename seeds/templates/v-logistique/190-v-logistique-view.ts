import * as Knex from "knex";
import { TABLES } from "../../../src/glossary-seed/schema-glossary";
import { VIEWS } from '../../../src/glossary-seed/view-glossary'

export async function seed(knex: Knex): Promise<any> {
  // View Fournisseur

  /**
   * Vue flotte vélo
   */
  await knex("table_view").insert([{
    id: VIEWS.PROVIDER.FLEET,
    text: 'Vélo fournisseur',
    table_id: TABLES.PROVIDER_FLEET_BIKE.ID
  }])

  await knex("table_view_has_table_column").insert([{
    table_column_id: TABLES.PROVIDER_FLEET_BIKE.COLUMNS.TYPE,
    table_view_id: VIEWS.PROVIDER.FLEET,
    visible: true
  }, {
    table_column_id: TABLES.PROVIDER_FLEET_BIKE.COLUMNS.IDENTITY,
    table_view_id: VIEWS.PROVIDER.FLEET,
    visible: true
  }, {
    table_column_id: TABLES.PROVIDER_FLEET_BIKE.COLUMNS.BRAND,
    table_view_id: VIEWS.PROVIDER.FLEET,
    visible: true
  }, {
    table_column_id: TABLES.PROVIDER_FLEET_BIKE.COLUMNS.STATUS,
    table_view_id: VIEWS.PROVIDER.FLEET,
    visible: true
  }, {
    table_column_id: TABLES.PROVIDER_FLEET_BIKE.COLUMNS.MAINTENANCE_DATE,
    table_view_id: VIEWS.PROVIDER.FLEET,
    visible: true
  }, {
    table_column_id: TABLES.PROVIDER_FLEET_BIKE.COLUMNS.DELIVERY_ESTIMATED_DATE,
    table_view_id: VIEWS.PROVIDER.FLEET,
    visible: true
  }, {
    table_column_id: TABLES.PROVIDER_FLEET_BIKE.COLUMNS.PROVIDER,
    table_view_id: VIEWS.PROVIDER.FLEET,
    visible: true
  }, {
    table_column_id: TABLES.PROVIDER_FLEET_BIKE.COLUMNS.RECIPIENT,
    table_view_id: VIEWS.PROVIDER.FLEET,
    visible: true
  }])

  /**
   * Vue maintenance préventive vélo
   */
  await knex("table_view").insert([{
    id: VIEWS.PROVIDER.MAINTENANCE_PREVENTIVE,
    text: 'Vélo fournisseur',
    table_id: TABLES.PROVIDER_MAINTENANCE_PREVENTIVE_BIKE.ID
  }])

  await knex("table_view_has_table_column").insert([{
    table_column_id: TABLES.PROVIDER_MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.TYPE,
    table_view_id: VIEWS.PROVIDER.MAINTENANCE_PREVENTIVE,
    visible: true
  }, {
    table_column_id: TABLES.PROVIDER_MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.IDENTITY,
    table_view_id: VIEWS.PROVIDER.MAINTENANCE_PREVENTIVE,
    visible: true
  }, {
    table_column_id: TABLES.PROVIDER_MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.STATUS,
    table_view_id: VIEWS.PROVIDER.MAINTENANCE_PREVENTIVE,
    visible: false
  }, {
    table_column_id: TABLES.PROVIDER_MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.RECIPIENT,
    table_view_id: VIEWS.PROVIDER.MAINTENANCE_PREVENTIVE,
    visible: true
  }, {
    table_column_id: TABLES.PROVIDER_MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.MAINTENANCE_DATE,
    table_view_id: VIEWS.PROVIDER.MAINTENANCE_PREVENTIVE,
    visible: true
  }, {
    table_column_id: TABLES.PROVIDER_MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.TECHNICIAN,
    table_view_id: VIEWS.PROVIDER.MAINTENANCE_PREVENTIVE,
    visible: true
  }, {
    table_column_id: TABLES.PROVIDER_MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.MAINTENANCE_STEP,
    table_view_id: VIEWS.PROVIDER.MAINTENANCE_PREVENTIVE,
    visible: true
  }])

  /**
   * Vue maintenance curative vélo
   */
  await knex("table_view").insert([{
    id: VIEWS.PROVIDER.MAINTENANCE_CURATIVE,
    text: 'Vélo fournisseur',
    table_id: TABLES.PROVIDER_MAINTENANCE_CURATIVE_BIKE.ID
  }])

  await knex("table_view_has_table_column").insert([{
    table_column_id: TABLES.PROVIDER_MAINTENANCE_CURATIVE_BIKE.COLUMNS.TYPE,
    table_view_id: VIEWS.PROVIDER.MAINTENANCE_CURATIVE,
    visible: true
  }, {
    table_column_id: TABLES.PROVIDER_MAINTENANCE_CURATIVE_BIKE.COLUMNS.IDENTITY,
    table_view_id: VIEWS.PROVIDER.MAINTENANCE_CURATIVE,
    visible: true
  }, {
    table_column_id: TABLES.PROVIDER_MAINTENANCE_CURATIVE_BIKE.COLUMNS.STATUS,
    table_view_id: VIEWS.PROVIDER.MAINTENANCE_CURATIVE,
    visible: true
  }, {
    table_column_id: TABLES.PROVIDER_MAINTENANCE_CURATIVE_BIKE.COLUMNS.MAINTENANCE_DATE,
    table_view_id: VIEWS.PROVIDER.MAINTENANCE_CURATIVE,
    visible: true
  }, {
    table_column_id: TABLES.PROVIDER_MAINTENANCE_CURATIVE_BIKE.COLUMNS.RECIPIENT,
    table_view_id: VIEWS.PROVIDER.MAINTENANCE_CURATIVE,
    visible: true
  }])


  // View Bénéficiare


  /**
   * Vue ensemble de mes vélos
   */
  await knex("table_view").insert([{
    id: VIEWS.RECIPIENT.BICYCLE_USE,
    text: 'Ensemble de mes vélos',
    table_id: TABLES.BENEFICIAIRE_BICYCLE.ID
  }])

  await knex("table_view_has_table_column").insert([{
    table_column_id: TABLES.BENEFICIAIRE_BICYCLE.COLUMNS.TYPE,
    table_view_id: VIEWS.RECIPIENT.BICYCLE_USE,
    visible: true
  }, {
    table_column_id: TABLES.BENEFICIAIRE_BICYCLE.COLUMNS.IDENTITY,
    table_view_id: VIEWS.RECIPIENT.BICYCLE_USE,
    visible: true
  }, {
    table_column_id: TABLES.BENEFICIAIRE_BICYCLE.COLUMNS.STATUS,
    table_view_id: VIEWS.RECIPIENT.BICYCLE_USE,
    visible: true
  }, {
    table_column_id: TABLES.BENEFICIAIRE_BICYCLE.COLUMNS.BRAND,
    table_view_id: VIEWS.RECIPIENT.BICYCLE_USE,
    visible: true
  }, {
    table_column_id: TABLES.BENEFICIAIRE_BICYCLE.COLUMNS.COMMISSIONING_DATE,
    table_view_id: VIEWS.RECIPIENT.BICYCLE_USE,
    visible: true
  }, {
    table_column_id: TABLES.BENEFICIAIRE_BICYCLE.COLUMNS.MAINTENANCE_DATE,
    table_view_id: VIEWS.RECIPIENT.BICYCLE_USE,
    visible: true
  }, {
    table_column_id: TABLES.BENEFICIAIRE_BICYCLE.COLUMNS.LAST_TRACER_DATA,
    table_view_id: VIEWS.RECIPIENT.BICYCLE_USE,
    visible: true
  }])


  // View V-Logistique


  /**
   * View Stock vélo vélo bénéficiaire
   */
  await knex("table_view").insert([{
    id: VIEWS.VLO.BICYCLE_STOCK_1,
    text: 'Vélo bénéficiaire',
    table_id: TABLES.VLO_STOCK_1.ID
  }])
  await knex("table_view_has_table_column").insert([{
    table_column_id: TABLES.VLO_STOCK_1.COLUMNS.NAME,
    table_view_id: VIEWS.RECIPIENT_BICYCLE,
    visible: true
  }, {
    table_column_id: TABLES.VLO_STOCK_1.COLUMNS.REF,
    table_view_id: VIEWS.RECIPIENT_BICYCLE,
    visible: true
  }, {
    table_column_id: TABLES.VLO_STOCK_1.COLUMNS.STATUS,
    table_view_id: VIEWS.RECIPIENT_BICYCLE,
    visible: true
  }, {
    table_column_id: TABLES.VLO_STOCK_1.COLUMNS.BRAND,
    table_view_id: VIEWS.RECIPIENT_BICYCLE,
    visible: true
  }, {
    table_column_id: TABLES.VLO_STOCK_1.COLUMNS.MAINTENANCE_DATE,
    table_view_id: VIEWS.RECIPIENT_BICYCLE,
    visible: true
  }, {
    table_column_id: TABLES.VLO_STOCK_1.COLUMNS.PERSON,
    table_view_id: VIEWS.RECIPIENT_BICYCLE,
    filter: JSON.stringify({
      $eq: "{userId}"
    }),
    visible: false
  }, {
    table_column_id: TABLES.VLO_STOCK_1.COLUMNS.PROVIDER,
    table_view_id: VIEWS.RECIPIENT_BICYCLE,
    visible: true
  }, {
    table_column_id: TABLES.VLO_STOCK_1.COLUMNS.LAST_TRACER_DATA,
    table_view_id: VIEWS.RECIPIENT_BICYCLE,
    visible: true
  }])

  /**
   * Vue Stock vélo ensemble des fournisseurs
   */
  await knex("table_view").insert([{
    id: VIEWS.VLO.BICYCLE_STOCK_2,
    text: 'Ensemble des fournisseurs',
    table_id: TABLES.VLO_STOCK_2.ID
  }])

  await knex("table_view_has_table_column").insert([{
    table_column_id: TABLES.VLO_STOCK_2.COLUMNS.NAME,
    table_view_id: VIEWS.VLO.BICYCLE_STOCK_2,
    visible: true
  }, {
    table_column_id: TABLES.VLO_STOCK_2.COLUMNS.USER,
    table_view_id: VIEWS.VLO.BICYCLE_STOCK_2,
    visible: true
  }])

  /**
   * Vue ensemble des pré bénéficiaires - bénéficiaires
   */
  await knex("table_view").insert([{
    id: 'c804fae3-5d33-4759-9c1f-7d8f01c32d81',
    text: 'Ensemble des bénéficiaires',
    table_id: 'bb145d9f-0976-419d-9fef-bc15799d1624'
  }])

  await knex("table_view_has_table_column").insert([{
    table_column_id: 'c5fde1df-7f65-4422-a852-d8f8e963ce2b',
    table_view_id: 'c804fae3-5d33-4759-9c1f-7d8f01c32d81',
    visible: true
  }, {
    table_column_id: '193cd4d8-e9a9-4492-a2f4-5b0a9ebe7360',
    table_view_id: 'c804fae3-5d33-4759-9c1f-7d8f01c32d81',
    visible: true
  }, {
    table_column_id: 'b49eb157-b150-4d2e-84b3-ae74e4ba99b1',
    table_view_id: 'c804fae3-5d33-4759-9c1f-7d8f01c32d81',
    visible: true
  }])

  /**
   * Vue ensemble rozo
   */
  await knex("table_view").insert([{
    id: VIEWS.ROZO,
    text: 'Ensemble Rozo',
    table_id: TABLES.ROZO_REQUEST.ID
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
