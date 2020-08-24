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
    table_id: TABLES.PROVIDER.FLEET_BIKE.ID
  }])

  await knex("table_view_has_table_column").insert([{
    table_column_id: TABLES.PROVIDER.FLEET_BIKE.COLUMNS.TYPE,
    table_view_id: VIEWS.PROVIDER.FLEET,
    visible: true
  }, {
    table_column_id: TABLES.PROVIDER.FLEET_BIKE.COLUMNS.IDENTITY,
    table_view_id: VIEWS.PROVIDER.FLEET,
    visible: true
  }, {
    table_column_id: TABLES.PROVIDER.FLEET_BIKE.COLUMNS.BRAND,
    table_view_id: VIEWS.PROVIDER.FLEET,
    visible: true
  }, {
    table_column_id: TABLES.PROVIDER.FLEET_BIKE.COLUMNS.STATUS,
    table_view_id: VIEWS.PROVIDER.FLEET,
    visible: true
  }, {
    table_column_id: TABLES.PROVIDER.FLEET_BIKE.COLUMNS.MAINTENANCE_DATE,
    table_view_id: VIEWS.PROVIDER.FLEET,
    visible: true
  }, {
    table_column_id: TABLES.PROVIDER.FLEET_BIKE.COLUMNS.DELIVERY_ESTIMATED_DATE,
    table_view_id: VIEWS.PROVIDER.FLEET,
    visible: true
  }, {
    table_column_id: TABLES.PROVIDER.FLEET_BIKE.COLUMNS.PROVIDER,
    table_view_id: VIEWS.PROVIDER.FLEET,
    visible: true
  }, {
    table_column_id: TABLES.PROVIDER.FLEET_BIKE.COLUMNS.RECIPIENT,
    table_view_id: VIEWS.PROVIDER.FLEET,
    visible: true
  }])

  /**
   * Vue maintenance préventive vélo
   */
  await knex("table_view").insert([{
    id: VIEWS.PROVIDER.MAINTENANCE_PREVENTIVE,
    text: 'Vélo fournisseur',
    table_id: TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.ID
  }])

  await knex("table_view_has_table_column").insert([{
    table_column_id: TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.TYPE,
    table_view_id: VIEWS.PROVIDER.MAINTENANCE_PREVENTIVE,
    visible: true
  }, {
    table_column_id: TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.IDENTITY,
    table_view_id: VIEWS.PROVIDER.MAINTENANCE_PREVENTIVE,
    visible: true
  }, {
    table_column_id: TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.STATUS,
    table_view_id: VIEWS.PROVIDER.MAINTENANCE_PREVENTIVE,
    visible: false
  }, {
    table_column_id: TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.RECIPIENT,
    table_view_id: VIEWS.PROVIDER.MAINTENANCE_PREVENTIVE,
    visible: true
  }, {
    table_column_id: TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.MAINTENANCE_DATE,
    table_view_id: VIEWS.PROVIDER.MAINTENANCE_PREVENTIVE,
    visible: true
  }, {
    table_column_id: TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.TECHNICIAN,
    table_view_id: VIEWS.PROVIDER.MAINTENANCE_PREVENTIVE,
    visible: true
  }, {
    table_column_id: TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.MAINTENANCE_STEP,
    table_view_id: VIEWS.PROVIDER.MAINTENANCE_PREVENTIVE,
    visible: true
  }])

  /**
   * Vue maintenance curative vélo
   */
  await knex("table_view").insert([{
    id: VIEWS.PROVIDER.MAINTENANCE_CURATIVE,
    text: 'Vélo fournisseur',
    table_id: TABLES.PROVIDER.MAINTENANCE_CURATIVE_BIKE.ID
  }])

  await knex("table_view_has_table_column").insert([{
    table_column_id: TABLES.PROVIDER.MAINTENANCE_CURATIVE_BIKE.COLUMNS.TYPE,
    table_view_id: VIEWS.PROVIDER.MAINTENANCE_CURATIVE,
    visible: true
  }, {
    table_column_id: TABLES.PROVIDER.MAINTENANCE_CURATIVE_BIKE.COLUMNS.IDENTITY,
    table_view_id: VIEWS.PROVIDER.MAINTENANCE_CURATIVE,
    visible: true
  }, {
    table_column_id: TABLES.PROVIDER.MAINTENANCE_CURATIVE_BIKE.COLUMNS.STATUS,
    table_view_id: VIEWS.PROVIDER.MAINTENANCE_CURATIVE,
    visible: true
  }, {
    table_column_id: TABLES.PROVIDER.MAINTENANCE_CURATIVE_BIKE.COLUMNS.MAINTENANCE_DATE,
    table_view_id: VIEWS.PROVIDER.MAINTENANCE_CURATIVE,
    visible: true
  }, {
    table_column_id: TABLES.PROVIDER.MAINTENANCE_CURATIVE_BIKE.COLUMNS.RECIPIENT,
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
    table_id: TABLES.RECIPIENT.USING_BIKE.ID
  }])

  await knex("table_view_has_table_column").insert([{
    table_column_id: TABLES.RECIPIENT.USING_BIKE.COLUMNS.TYPE,
    table_view_id: VIEWS.RECIPIENT.BICYCLE_USE,
    visible: true
  }, {
    table_column_id: TABLES.RECIPIENT.USING_BIKE.COLUMNS.IDENTITY,
    table_view_id: VIEWS.RECIPIENT.BICYCLE_USE,
    visible: true
  }, {
    table_column_id: TABLES.RECIPIENT.USING_BIKE.COLUMNS.STATUS,
    table_view_id: VIEWS.RECIPIENT.BICYCLE_USE,
    visible: true
  }, {
    table_column_id: TABLES.RECIPIENT.USING_BIKE.COLUMNS.BRAND,
    table_view_id: VIEWS.RECIPIENT.BICYCLE_USE,
    visible: true
  }, {
    table_column_id: TABLES.RECIPIENT.USING_BIKE.COLUMNS.COMMISSIONING_DATE,
    table_view_id: VIEWS.RECIPIENT.BICYCLE_USE,
    visible: true
  }, {
    table_column_id: TABLES.RECIPIENT.USING_BIKE.COLUMNS.MAINTENANCE_DATE,
    table_view_id: VIEWS.RECIPIENT.BICYCLE_USE,
    visible: true
  }, {
    table_column_id: TABLES.RECIPIENT.USING_BIKE.COLUMNS.LAST_TRACER_DATA,
    table_view_id: VIEWS.RECIPIENT.BICYCLE_USE,
    visible: true
  }, {
    table_column_id: TABLES.RECIPIENT.USING_BIKE.COLUMNS.ALERT,
    table_view_id: VIEWS.RECIPIENT.BICYCLE_USE,
    visible: true
  }])

  /**
   * Vue ensemble de mes formations
   */
  await knex("table_view").insert([{
    id: VIEWS.RECIPIENT.AWARENESS,
    text: 'Ensemble de mes formations',
    table_id: TABLES.RECIPIENT.AWARENESS_FORMATION.ID
  }])

  await knex("table_view_has_table_column").insert([{
    table_column_id: TABLES.RECIPIENT.AWARENESS_FORMATION.COLUMNS.TYPE,
    table_view_id: VIEWS.RECIPIENT.AWARENESS,
    visible: true
  }, {
    table_column_id: TABLES.RECIPIENT.AWARENESS_FORMATION.COLUMNS.INSTITUTION,
    table_view_id: VIEWS.RECIPIENT.AWARENESS,
    visible: true
  }, {
    table_column_id: TABLES.RECIPIENT.AWARENESS_FORMATION.COLUMNS.TRAINER,
    table_view_id: VIEWS.RECIPIENT.AWARENESS,
    visible: true
  }, {
    table_column_id: TABLES.RECIPIENT.AWARENESS_FORMATION.COLUMNS.FILE,
    table_view_id: VIEWS.RECIPIENT.AWARENESS,
    visible: true
  }, {
    table_column_id: TABLES.RECIPIENT.AWARENESS_FORMATION.COLUMNS.DATE,
    table_view_id: VIEWS.RECIPIENT.AWARENESS,
    visible: true
  }])


  // View V-Logistique


  /**
   * View Stock vélo
   */
  await knex("table_view").insert([{
    id: VIEWS.VLO.BICYCLE_STOCK_1,
    text: 'Vélo bénéficiaire',
    table_id: TABLES.VLO.STOCK_BIKE.ID
  }])
  await knex("table_view_has_table_column").insert([{
    table_column_id: TABLES.VLO.STOCK_BIKE.COLUMNS.TYPE,
    table_view_id: VIEWS.VLO.BICYCLE_STOCK_1,
    visible: true
  }, {
    table_column_id: TABLES.VLO.STOCK_BIKE.COLUMNS.REF,
    table_view_id: VIEWS.VLO.BICYCLE_STOCK_1,
    visible: true
  }, {
    table_column_id: TABLES.VLO.STOCK_BIKE.COLUMNS.STATUS,
    table_view_id: VIEWS.VLO.BICYCLE_STOCK_1,
    visible: true
  }, {
    table_column_id: TABLES.VLO.STOCK_BIKE.COLUMNS.BRAND,
    table_view_id: VIEWS.VLO.BICYCLE_STOCK_1,
    visible: true
  }, {
    table_column_id: TABLES.VLO.STOCK_BIKE.COLUMNS.REQUEST,
    table_view_id: VIEWS.VLO.BICYCLE_STOCK_1,
    visible: true
  }, {
    table_column_id: TABLES.VLO.STOCK_BIKE.COLUMNS.MAINTENANCE_DATE,
    table_view_id: VIEWS.VLO.BICYCLE_STOCK_1,
    visible: true
  }, {
    table_column_id: TABLES.VLO.STOCK_BIKE.COLUMNS.COMMISSIONING_DATE,
    table_view_id: VIEWS.VLO.BICYCLE_STOCK_1,
    visible: true
  }, {
    table_column_id: TABLES.VLO.STOCK_BIKE.COLUMNS.DELIVERY_ESTIMATED_DATE,
    table_view_id: VIEWS.VLO.BICYCLE_STOCK_1,
    visible: true
  }, {
    table_column_id: TABLES.VLO.STOCK_BIKE.COLUMNS.PERSON,
    table_view_id: VIEWS.VLO.BICYCLE_STOCK_1,
    visible: true
  }, {
    table_column_id: TABLES.VLO.STOCK_BIKE.COLUMNS.PROVIDER,
    table_view_id: VIEWS.VLO.BICYCLE_STOCK_1,
    visible: true
  }, {
    table_column_id: TABLES.VLO.STOCK_BIKE.COLUMNS.TRACER,
    table_view_id: VIEWS.VLO.BICYCLE_STOCK_1,
    visible: true
  }, {
    table_column_id: TABLES.VLO.STOCK_BIKE.COLUMNS.LAST_TRACER_DATA,
    table_view_id: VIEWS.VLO.BICYCLE_STOCK_1,
    visible: true
  }])

  /**
   * Vue ensemble des pré bénéficiaires
   */
  await knex("table_view").insert([{
    id: VIEWS.VLO.PRE_RECIPIENT,
    text: 'Ensemble des pré-bénéficiaires',
    table_id: TABLES.VLO.LIST_PRE_RECIPIENT.ID
  }])

  await knex("table_view_has_table_column").insert([{
    table_column_id: TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.SOCIETY,
    table_view_id: VIEWS.VLO.PRE_RECIPIENT,
    visible: true
  }, {
    table_column_id: TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.USER,
    table_view_id: VIEWS.VLO.PRE_RECIPIENT,
    visible: true
  }, {
    table_column_id: TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.STATUS,
    table_view_id: VIEWS.VLO.PRE_RECIPIENT,
    visible: true
  }, {
    table_column_id: TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.NUM_REQUEST,
    table_view_id: VIEWS.VLO.PRE_RECIPIENT,
    visible: true
  }, {
    table_column_id: TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.EMAIL,
    table_view_id: VIEWS.VLO.PRE_RECIPIENT,
    visible: true
  }, {
    table_column_id: TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.PHONE,
    table_view_id: VIEWS.VLO.PRE_RECIPIENT,
    visible: true
  }, {
    table_column_id: TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.ADDRESS,
    table_view_id: VIEWS.VLO.PRE_RECIPIENT,
    visible: true
  }, {
    table_column_id: TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.LOT,
    table_view_id: VIEWS.VLO.PRE_RECIPIENT,
    visible: true
  }, {
    table_column_id: TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.APE,
    table_view_id: VIEWS.VLO.PRE_RECIPIENT,
    visible: true
  }, {
    table_column_id: TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.NB_VAE,
    table_view_id: VIEWS.VLO.PRE_RECIPIENT,
    visible: true
  }, {
    table_column_id: TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.NB_VCAE_BI,
    table_view_id: VIEWS.VLO.PRE_RECIPIENT,
    visible: true
  }, {
    table_column_id: TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.NB_VCAE_TRI,
    table_view_id: VIEWS.VLO.PRE_RECIPIENT,
    visible: true
  }])

  /**
   * Vue ensemble des bénéficiaires
   */
  await knex("table_view").insert([{
    id: VIEWS.VLO.RECIPIENT,
    text: 'Ensemble des bénéficiaires',
    table_id: TABLES.VLO.LIST_RECIPIENT.ID
  }])

  await knex("table_view_has_table_column").insert([{
    table_column_id: TABLES.VLO.LIST_RECIPIENT.COLUMNS.SOCIETY,
    table_view_id: VIEWS.VLO.RECIPIENT,
    visible: true
  }, {
    table_column_id: TABLES.VLO.LIST_RECIPIENT.COLUMNS.USER,
    table_view_id: VIEWS.VLO.RECIPIENT,
    visible: true
  }, {
    table_column_id: TABLES.VLO.LIST_RECIPIENT.COLUMNS.STATUS,
    table_view_id: VIEWS.VLO.RECIPIENT,
    visible: true
  }, {
    table_column_id: TABLES.VLO.LIST_RECIPIENT.COLUMNS.NUM_REQUEST,
    table_view_id: VIEWS.VLO.RECIPIENT,
    visible: true
  }, {
    table_column_id: TABLES.VLO.LIST_RECIPIENT.COLUMNS.EMAIL,
    table_view_id: VIEWS.VLO.RECIPIENT,
    visible: true
  }, {
    table_column_id: TABLES.VLO.LIST_RECIPIENT.COLUMNS.PHONE,
    table_view_id: VIEWS.VLO.RECIPIENT,
    visible: true
  }, {
    table_column_id: TABLES.VLO.LIST_RECIPIENT.COLUMNS.ADDRESS,
    table_view_id: VIEWS.VLO.RECIPIENT,
    visible: true
  }, {
    table_column_id: TABLES.VLO.LIST_RECIPIENT.COLUMNS.LOT,
    table_view_id: VIEWS.VLO.RECIPIENT,
    visible: true
  }, {
    table_column_id: TABLES.VLO.LIST_RECIPIENT.COLUMNS.APE,
    table_view_id: VIEWS.VLO.RECIPIENT,
    visible: true
  }, {
    table_column_id: TABLES.VLO.LIST_RECIPIENT.COLUMNS.NB_VAE,
    table_view_id: VIEWS.VLO.RECIPIENT,
    visible: true
  }, {
    table_column_id: TABLES.VLO.LIST_RECIPIENT.COLUMNS.NB_VCAE_BI,
    table_view_id: VIEWS.VLO.RECIPIENT,
    visible: true
  }, {
    table_column_id: TABLES.VLO.LIST_RECIPIENT.COLUMNS.NB_VCAE_TRI,
    table_view_id: VIEWS.VLO.PRE_RECIPIENT,
    visible: true
  }])

  /**
   * Vue Stock vélo ensemble des fournisseurs
   */
  await knex("table_view").insert([{
    id: VIEWS.VLO.BICYCLE_STOCK_2,
    text: 'Ensemble des fournisseurs',
    table_id: TABLES.VLO.LIST_PROVIDER.ID
  }])

  await knex("table_view_has_table_column").insert([{
    table_column_id: TABLES.VLO.LIST_PROVIDER.COLUMNS.NAME,
    table_view_id: VIEWS.VLO.BICYCLE_STOCK_2,
    visible: true
  }, {
    table_column_id: TABLES.VLO.LIST_PROVIDER.COLUMNS.USER,
    table_view_id: VIEWS.VLO.BICYCLE_STOCK_2,
    visible: true
  }])


  /**
   * Vue ensemble rozo
   */
  await knex("table_view").insert([{
    id: VIEWS.VLO.ROZO,
    text: 'Ensemble Rozo',
    table_id: TABLES.VLO.ROZO_REQUEST.ID
  }])

  await knex("table_view_has_table_column").insert([{
    table_column_id: '7a9c6160-e069-11ea-87d0-0242ac130003',
    table_view_id: VIEWS.VLO.ROZO,
    visible: true
  }, {
    table_column_id: 'b95a6a20-e06c-11ea-87d0-0242ac130003',
    table_view_id: VIEWS.VLO.ROZO,
    visible: true
  }, {
    table_column_id: 'c3c22e08-e06c-11ea-87d0-0242ac130003',
    table_view_id: VIEWS.VLO.ROZO,
    visible: true
  }, {
    table_column_id: '6c20ca98-e08e-11ea-87d0-0242ac130003',
    table_view_id: VIEWS.VLO.ROZO,
    visible: true
  }, {
    table_column_id: 'c9d0980c-e06c-11ea-87d0-0242ac130003',
    table_view_id: VIEWS.VLO.ROZO,
    visible: true
  }, {
    table_column_id: 'ce540512-e06c-11ea-87d0-0242ac130003',
    table_view_id: VIEWS.VLO.ROZO,
    visible: true
  }])
};
