import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
  /**
   * Database
   */
  await knex("database").insert([{
    id: '895ec967-fa3b-4710-82e7-b406e62f657d',
    text: 'Base principale',
    workspace_id: 'eaddde8c-1de4-4e5e-960a-3872907475e5'
  }])

  /**
   * Tables
   */
  await knex("table").insert([{
    id: '163c21e6-5339-4748-903f-8c77e21314cf',
    text: 'Vélo',
    database_id: '895ec967-fa3b-4710-82e7-b406e62f657d'
  }, {
    id: '3370bb91-c699-4f77-a970-ad574649915c',
    text: 'Traceur',
    database_id: '895ec967-fa3b-4710-82e7-b406e62f657d'
  }, {
    id: 'bb145d9f-0976-419d-9fef-bc15799d1624',
    text: 'Bénéficiaire',
    database_id: '895ec967-fa3b-4710-82e7-b406e62f657d'
  }, {
    id: 'a7a05fec-be28-4876-b158-6b96d10d8e2b',
    text: 'Fournisseur',
    database_id: '895ec967-fa3b-4710-82e7-b406e62f657d'
  }, {
    id: '7b9f0bef-f40d-4360-b244-767e44855cb0',
    text: 'Affectation vélo - bénéficiaire',
    database_id: '895ec967-fa3b-4710-82e7-b406e62f657d'
  }])

  /**
   * Table columns
   */
  await knex("table_column").insert([{
    id: 'e065323c-1151-447f-be0f-6d2728117b38',
    text: 'Nom du vélo',
    table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
    column_type_id: 3
  }, {
    id: 'b712959e-3808-4bbc-b86e-17ab2ded8c6d',
    text: 'Identité',
    table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
    column_type_id: 3
  }, {
    id: '3a659ea1-446f-4755-8db9-583a204279cc',
    text: 'État du vélo',
    table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
    column_type_id: 9,
    settings: {
      values: {
        1: {
          label: 'En maintenance',
          color: '#ef1'
        },
        2: {
          label: 'En utilisation',
          color: '#ef1'
        },
        3: {
          label: 'Stocké',
          color: '#ef1'
        }
      }
    }
  }, {
    id: '1c4c27e9-ed7f-4c1c-b472-b8906a9ce9d7',
    text: 'Marque',
    table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
    column_type_id: 3
  }, {
    id: '80780a95-d709-43ec-b4f3-d6b5cb5dd31e',
    text: 'Entretien',
    table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
    column_type_id: 2
  }, {
    id: '14a772f2-c161-4931-a8e5-bfb3acaaf42d',
    text: 'Mise en service',
    table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
    column_type_id: 2
  }, {
    id: '360a9a83-d046-4b64-a39e-944d2bfbd9c5',
    text: 'Bénéficiaire',
    table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
    column_type_id: 5,
    settings: {
      tableId: 'bb145d9f-0976-419d-9fef-bc15799d1624'
    }
  }, {
    id: 'bde4bbbd-2584-447f-acff-f434f53619da',
    text: 'Fournisseur',
    table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
    column_type_id: 5
  }, {
    id: 'f114393e-eece-4e8f-8893-7c31dde09690',
    text: 'Traceur',
    table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
    column_type_id: 3
  }, {
    id: '17ab6b13-5412-483e-ac7d-a9add38225f1',
    text: 'Nom fournisseur',
    table_id: 'a7a05fec-be28-4876-b158-6b96d10d8e2b',
    column_type_id: 3
  }, {
    id: 'bf0da601-527b-434c-b5b7-fc25e370fe36',
    text: 'Utilisateur corrélé',
    table_id: 'a7a05fec-be28-4876-b158-6b96d10d8e2b',
    column_type_id: 5
  }, {
    id: 'be137241-f97f-4fb9-9220-36d5c6c0c1af',
    text: 'Nom bénéficiaire',
    table_id: 'bb145d9f-0976-419d-9fef-bc15799d1624',
    column_type_id: 3
  }, {
    id: 'b93546a3-4459-40ed-9a76-fdcc45966479',
    text: 'Utilisateur corrélé',
    table_id: 'bb145d9f-0976-419d-9fef-bc15799d1624',
    column_type_id: 5
  }])

};
