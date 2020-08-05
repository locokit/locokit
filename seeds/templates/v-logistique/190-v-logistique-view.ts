import * as Knex from "knex";
import { TABLES } from "./160-v-logistique-schema";

export const VIEWS = {
  RECIPIENT_BICYCLE: 'b1345b1b-d5f9-4a6e-bded-265313e81ef9'
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
    table_column_id: 'e065323c-1151-447f-be0f-6d2728117b38',
    table_view_id: VIEWS.RECIPIENT_BICYCLE,
    visible: true
  }, {
    table_column_id: 'b712959e-3808-4bbc-b86e-17ab2ded8c6d',
    table_view_id: VIEWS.RECIPIENT_BICYCLE,
    visible: true
  }, {
    table_column_id: '3a659ea1-446f-4755-8db9-583a204279cc',
    table_view_id: VIEWS.RECIPIENT_BICYCLE,
    visible: true
  }, {
    table_column_id: '1c4c27e9-ed7f-4c1c-b472-b8906a9ce9d7',
    table_view_id: VIEWS.RECIPIENT_BICYCLE,
    visible: true
  }, {
    table_column_id: '80780a95-d709-43ec-b4f3-d6b5cb5dd31e',
    table_view_id: VIEWS.RECIPIENT_BICYCLE,
    visible: true
  }, {
    table_column_id: '360a9a83-d046-4b64-a39e-944d2bfbd9c5',
    table_view_id: VIEWS.RECIPIENT_BICYCLE,
    filter: JSON.stringify({
      $eq: "{userId}"
    }),
    visible: false
  }, {
    table_column_id: 'bde4bbbd-2584-447f-acff-f434f53619da',
    table_view_id: VIEWS.RECIPIENT_BICYCLE,
    visible: true
  }, {
    table_column_id: 'f114393e-eece-4e8f-8893-7c31dde09690',
    table_view_id: VIEWS.RECIPIENT_BICYCLE,
    visible: true
  }])

  /**
   * Vue Vélo fournisseur
   */
  await knex("table_view").insert([{
    id: '2ef7f439-3946-4efb-87c7-0fd413bfc9d7',
    text: 'Vélo fournisseur',
    table_id: '163c21e6-5339-4748-903f-8c77e21314cf'
  }])

  await knex("table_view_has_table_column").insert([{
    table_column_id: 'e065323c-1151-447f-be0f-6d2728117b38',
    table_view_id: '2ef7f439-3946-4efb-87c7-0fd413bfc9d7',
    visible: true
  }, {
    table_column_id: 'b712959e-3808-4bbc-b86e-17ab2ded8c6d',
    table_view_id: '2ef7f439-3946-4efb-87c7-0fd413bfc9d7',
    visible: true
  }, {
    table_column_id: '3a659ea1-446f-4755-8db9-583a204279cc',
    table_view_id: '2ef7f439-3946-4efb-87c7-0fd413bfc9d7',
    visible: true
  }, {
    table_column_id: '360a9a83-d046-4b64-a39e-944d2bfbd9c5',
    table_view_id: '2ef7f439-3946-4efb-87c7-0fd413bfc9d7',
    visible: true
  }, {
    table_column_id: '14a772f2-c161-4931-a8e5-bfb3acaaf42d',
    table_view_id: '2ef7f439-3946-4efb-87c7-0fd413bfc9d7',
    visible: true
  }, {
    table_column_id: 'bde4bbbd-2584-447f-acff-f434f53619da',
    table_view_id: '2ef7f439-3946-4efb-87c7-0fd413bfc9d7',
    filter: JSON.stringify({
      $eq: "{userId}"
    }),
    visible: false
  }, {
    table_column_id: 'f114393e-eece-4e8f-8893-7c31dde09690',
    table_view_id: '2ef7f439-3946-4efb-87c7-0fd413bfc9d7',
    visible: true
  }])


  /**
   * Vue ensemble des vélos
   */
  await knex("table_view").insert([{
    id: '91d819b4-ff5d-498f-ae61-5796268607d0',
    text: 'Ensemble des vélos',
    table_id: '163c21e6-5339-4748-903f-8c77e21314cf'
  }])

  await knex("table_view_has_table_column").insert([{
    table_column_id: 'e065323c-1151-447f-be0f-6d2728117b38',
    table_view_id: '91d819b4-ff5d-498f-ae61-5796268607d0',
    visible: true
  }, {
    table_column_id: 'b712959e-3808-4bbc-b86e-17ab2ded8c6d',
    table_view_id: '91d819b4-ff5d-498f-ae61-5796268607d0',
    visible: true
  }, {
    table_column_id: '360a9a83-d046-4b64-a39e-944d2bfbd9c5',
    table_view_id: '91d819b4-ff5d-498f-ae61-5796268607d0',
    visible: true
  }, {
    table_column_id: 'bde4bbbd-2584-447f-acff-f434f53619da',
    table_view_id: '91d819b4-ff5d-498f-ae61-5796268607d0',
    visible: true
  }, {
    table_column_id: '3a659ea1-446f-4755-8db9-583a204279cc',
    table_view_id: '91d819b4-ff5d-498f-ae61-5796268607d0',
    visible: true
  }, {
    table_column_id: '1c4c27e9-ed7f-4c1c-b472-b8906a9ce9d7',
    table_view_id: '91d819b4-ff5d-498f-ae61-5796268607d0',
    visible: true
  }, {
    table_column_id: '14a772f2-c161-4931-a8e5-bfb3acaaf42d',
    table_view_id: '91d819b4-ff5d-498f-ae61-5796268607d0',
    visible: true
  }, {
    table_column_id: '80780a95-d709-43ec-b4f3-d6b5cb5dd31e',
    table_view_id: '91d819b4-ff5d-498f-ae61-5796268607d0',
    visible: true
  }, {
    table_column_id: 'f114393e-eece-4e8f-8893-7c31dde09690',
    table_view_id: '91d819b4-ff5d-498f-ae61-5796268607d0',
    visible: true
  }])

  /**
   * Vue ensemble des bénéficiaires
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
   * Vue ensemble des fournisseurs
   */
  await knex("table_view").insert([{
    id: '9753bd58-ad09-4ed0-9301-fa9ea66b7d7f',
    text: 'Ensemble des fournisseurs',
    table_id: 'a7a05fec-be28-4876-b158-6b96d10d8e2b'
  }])

  await knex("table_view_has_table_column").insert([{
    table_column_id: '17ab6b13-5412-483e-ac7d-a9add38225f1',
    table_view_id: '9753bd58-ad09-4ed0-9301-fa9ea66b7d7f',
    visible: true
  }, {
    table_column_id: 'bf0da601-527b-434c-b5b7-fc25e370fe36',
    table_view_id: '9753bd58-ad09-4ed0-9301-fa9ea66b7d7f',
    visible: true
  }])

};
