import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
  await knex("workspace").insert([{
    id: 'eaddde8c-1de4-4e5e-960a-3872907475e5',
    text: 'v-logistique'
  }])
  await knex("chapter").insert([{
    id: '8da8f312-27cf-4810-a7e5-9430823eed29',
    text: 'Fournisseur',
    workspace_id: 'eaddde8c-1de4-4e5e-960a-3872907475e5'
  }, {
    id: 'dc1a1763-7786-4876-8b7d-2e65f772e658',
    text: 'Bénéficiaire',
    workspace_id: 'eaddde8c-1de4-4e5e-960a-3872907475e5'
  }, {
    id: '4336c4a8-3862-4846-b72d-6838b74051b6',
    text: 'v-logistique',
    workspace_id: 'eaddde8c-1de4-4e5e-960a-3872907475e5'
  }, {
    id: 'd7bb8c43-e96f-442c-96ae-34ab61132504',
    text: 'Rozo',
    workspace_id: 'eaddde8c-1de4-4e5e-960a-3872907475e5'
  }, {
    id: '51f2f984-5dbb-456d-a795-aabe83744e50',
    text: 'Morio',
    workspace_id: 'eaddde8c-1de4-4e5e-960a-3872907475e5'
  }])
  await knex("page").insert([{
    id: '4b64ffc0-229a-47ae-a5a2-0505fa9890ee',
    text: 'Usage vélos',
    chapter_id: 'dc1a1763-7786-4876-8b7d-2e65f772e658'
  }, {
    id: '4d427df2-79b2-4aba-84b1-cc0c98421d6d',
    text: 'Assistance',
    chapter_id: 'dc1a1763-7786-4876-8b7d-2e65f772e658'
  }, {
    id: 'f9bdf57a-de4d-4476-a765-84e6802d1342',
    text: 'Messagerie',
    chapter_id: 'dc1a1763-7786-4876-8b7d-2e65f772e658'
  }, {
    id: '596848de-1287-4b36-a8db-1cd4c228e468',
    text: 'Sensibilisation formation',
    chapter_id: 'dc1a1763-7786-4876-8b7d-2e65f772e658'
  }, {
    id: '53646407-caf7-4dd4-9422-edd378dd647d',
    text: 'Gestion flotte vélos',
    chapter_id: '8da8f312-27cf-4810-a7e5-9430823eed29'
  }, {
    id: 'f83be2bb-1cbb-4fb4-8fa1-b5dffc3062cc',
    text: 'Maintenances préventives',
    chapter_id: '8da8f312-27cf-4810-a7e5-9430823eed29'
  }, {
    id: '8bcfe997-4535-457b-8743-4ab02244f50c',
    text: 'Maintenances curatives',
    chapter_id: '8da8f312-27cf-4810-a7e5-9430823eed29'
  }, {
    id: '5b9461c8-9a0d-4326-97fc-bbe61663a4eb',
    text: 'Informations prestataires',
    chapter_id: '8da8f312-27cf-4810-a7e5-9430823eed29'
  }, {
    id: 'f199297d-ec2e-4b44-bb54-e44734e3eb01',
    text: 'Messagerie',
    chapter_id: '8da8f312-27cf-4810-a7e5-9430823eed29'
  }, {
    id: 'b23c29f9-ecfd-4f63-9f10-9b919e6a752f',
    text: 'Stock vélos',
    chapter_id: '4336c4a8-3862-4846-b72d-6838b74051b6'
  }, {
    id: '6d177b3f-a613-4557-afce-a0db2b4e980b',
    text: 'Pré-bénéficiaires / bénéficiaires',
    chapter_id: '4336c4a8-3862-4846-b72d-6838b74051b6'
  }, {
    id: '1f50ffd6-3c48-4c8a-a09e-34b85e89682d',
    text: 'Rozo',
    chapter_id: '4336c4a8-3862-4846-b72d-6838b74051b6'
  }, {
    id: '23453d24-c2bb-4ee8-9bb1-638512e43b81',
    text: 'Sensibilisation Formation Assistance',
    chapter_id: '4336c4a8-3862-4846-b72d-6838b74051b6'
  }, {
    id: 'c8b23f69-7067-48cf-8b3a-5ef15ad5cda1',
    text: 'Messagerie',
    chapter_id: '4336c4a8-3862-4846-b72d-6838b74051b6'
  }])
  await knex("container").insert([{
    id: '5cdbf483-aafe-4b6a-9ad1-99faf0a5e5f4',
    text: 'Container v-logistique',
    settings: JSON.stringify({
      class: 'yolo'
    }),
    page_id: 'b23c29f9-ecfd-4f63-9f10-9b919e6a752f'
  }, {
    id: 'da283b02-0679-424c-98b3-95f2779655be',
    text: 'Container 2',
    page_id: '4b64ffc0-229a-47ae-a5a2-0505fa9890ee'
  }, {
    id: '42be6c09-a6df-41c5-99e3-295d4696b492',
    text: 'Container 3',
    page_id: '53646407-caf7-4dd4-9422-edd378dd647d'
  }, {
    id: 'e8a4061b-a6a4-40b8-b309-f7658e949099',
    text: 'Container bénéficiaire v-logistique',
    page_id: '6d177b3f-a613-4557-afce-a0db2b4e980b'
  }, {
    id: '916bbc56-c26e-44b7-8107-46f2c4d21d2e',
    text: 'Container messagerie bénéficiaire',
    page_id: 'f9bdf57a-de4d-4476-a765-84e6802d1342'
  }, {
    id: 'c8a24d65-a9ba-4b73-811d-0096f523904a',
    text: 'Container messagerie fournisseur',
    page_id: 'f199297d-ec2e-4b44-bb54-e44734e3eb01'
  }])
  await knex("block").insert([{
    id: '3f70841d-a6fe-4586-b130-038331eacd7c',
    text: 'Listing vélo 2',
    container_id: '42be6c09-a6df-41c5-99e3-295d4696b492',
    type: 'TableView',
    settings: JSON.stringify({
      id: '2ef7f439-3946-4efb-87c7-0fd413bfc9d7'
    })
  }, {
    id: 'd7933493-b5d0-4363-a5e8-caf0abef6d05',
    text: 'Listing vélo 3',
    container_id: 'da283b02-0679-424c-98b3-95f2779655be',
    type: 'TableView',
    settings: JSON.stringify({
      id: 'b1345b1b-d5f9-4a6e-bded-265313e81ef9'
    })
  }, {
    id: '7b2dd5d0-b6d3-43d9-aadc-91de0a1ec84b',
    text: 'Listing vélo',
    container_id: '5cdbf483-aafe-4b6a-9ad1-99faf0a5e5f4',
    type: 'TableView',
    settings: JSON.stringify({
      id: '91d819b4-ff5d-498f-ae61-5796268607d0'
    })
  }, {
    id: '8958475f-e22e-4c8f-b480-b7911654d167',
    text: 'Listing fournisseur',
    container_id: '5cdbf483-aafe-4b6a-9ad1-99faf0a5e5f4',
    type: 'TableView',
    settings: JSON.stringify({
      id: '9753bd58-ad09-4ed0-9301-fa9ea66b7d7f'
    })
  }, {
    id: '07f3668f-c870-4761-8572-fc3ce447a50f',
    text: 'Listing bénéficiaire',
    container_id: 'e8a4061b-a6a4-40b8-b309-f7658e949099',
    type: 'TableView',
    settings: JSON.stringify({
      id: 'c804fae3-5d33-4759-9c1f-7d8f01c32d81'
    })
  }, {
    id: '59b05157-e4d8-4164-8ba5-1efc0fb68829',
    text: 'Page en construction. Pour tout contact, merci d\'envoyer un mail à contact@v-logistique.com.',
    container_id: '916bbc56-c26e-44b7-8107-46f2c4d21d2e',
    type: 'Paragraph'
  }, {
    id: '7815050f-aa93-4be5-8f18-6fe6adc866e1',
    text: 'Page en construction. Pour tout contact, merci d\'envoyer un mail à contact@v-logistique.com.',
    container_id: 'c8a24d65-a9ba-4b73-811d-0096f523904a',
    type: 'Paragraph'
  }])
  await knex("group_has_workspace").insert([{
    group_id: '163c21e6-5339-4748-903f-8c77e21314cf',
    workspace_id: 'eaddde8c-1de4-4e5e-960a-3872907475e5',
    role: 'OWNER',
    permission: null
  }, {
    group_id: '895ec967-fa3b-4710-82e7-b406e62f657d',
    workspace_id: 'eaddde8c-1de4-4e5e-960a-3872907475e5',
    role: 'MEMBER',
    permission: JSON.stringify([
      'VIEW_READ_2'
    ]),
    chapter_id: 'dc1a1763-7786-4876-8b7d-2e65f772e658'
  }, {
    group_id: 'd39f102b-398a-4d51-9680-3c479abdda73',
    workspace_id: 'eaddde8c-1de4-4e5e-960a-3872907475e5',
    role: 'MEMBER',
    permission: JSON.stringify([
      'VIEW_READ_1'
    ]),
    chapter_id: '8da8f312-27cf-4810-a7e5-9430823eed29'
  }])
  await knex("database").insert([{
    id: '895ec967-fa3b-4710-82e7-b406e62f657d',
    text: 'Base principale',
    workspace_id: 'eaddde8c-1de4-4e5e-960a-3872907475e5'
  }])
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
  await knex("table_column").insert([{
    id: 'e065323c-1151-447f-be0f-6d2728117b38',
    text: 'Nom du vélo',
    table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
    column_type_id: 3
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
    id: 'b7e0fddb-2a62-4906-8392-f88794600080',
    text: 'Référence vélo',
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

  await knex("table_view").insert([{
    id: 'b1345b1b-d5f9-4a6e-bded-265313e81ef9',
    text: 'Vélo bénéficiaire',
    table_id: '163c21e6-5339-4748-903f-8c77e21314cf'
  }, {
    id: '2ef7f439-3946-4efb-87c7-0fd413bfc9d7',
    text: 'Vélo fournisseur',
    table_id: '163c21e6-5339-4748-903f-8c77e21314cf'
  }, {
    id: '91d819b4-ff5d-498f-ae61-5796268607d0',
    text: 'Ensemble des vélos',
    table_id: '163c21e6-5339-4748-903f-8c77e21314cf'
  }, {
    id: 'c804fae3-5d33-4759-9c1f-7d8f01c32d81',
    text: 'Ensemble des bénéficiaires',
    table_id: 'bb145d9f-0976-419d-9fef-bc15799d1624'
  }, {
    id: '9753bd58-ad09-4ed0-9301-fa9ea66b7d7f',
    text: 'Ensemble des fournisseurs',
    table_id: 'a7a05fec-be28-4876-b158-6b96d10d8e2b'
  }])

  /**
   * Vue ensemble des vélos
   */
  await knex("table_view_has_table_column").insert([{
    table_column_id: 'e065323c-1151-447f-be0f-6d2728117b38',
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
    table_column_id: 'f114393e-eece-4e8f-8893-7c31dde09690',
    table_view_id: '91d819b4-ff5d-498f-ae61-5796268607d0',
    visible: true
  }, {
    table_column_id: 'b7e0fddb-2a62-4906-8392-f88794600080',
    table_view_id: '91d819b4-ff5d-498f-ae61-5796268607d0',
    visible: true
  }])

  /**
   * Vue ensemble des bénéficiaires
   */
  await knex("table_view_has_table_column").insert([{
    table_column_id: 'be137241-f97f-4fb9-9220-36d5c6c0c1af',
    table_view_id: 'c804fae3-5d33-4759-9c1f-7d8f01c32d81',
    visible: true
  }, {
    table_column_id: 'b93546a3-4459-40ed-9a76-fdcc45966479',
    table_view_id: 'c804fae3-5d33-4759-9c1f-7d8f01c32d81',
    visible: true
  }])

  /**
   * Vue ensemble des fournisseurs
   */
  await knex("table_view_has_table_column").insert([{
    table_column_id: '17ab6b13-5412-483e-ac7d-a9add38225f1',
    table_view_id: '9753bd58-ad09-4ed0-9301-fa9ea66b7d7f',
    visible: true
  }, {
    table_column_id: 'bf0da601-527b-434c-b5b7-fc25e370fe36',
    table_view_id: '9753bd58-ad09-4ed0-9301-fa9ea66b7d7f',
    visible: true
  }])

  /**
   * Vue Vélo bénéficiaire
   */
  await knex("table_view_has_table_column").insert([{
    table_column_id: 'e065323c-1151-447f-be0f-6d2728117b38',
    table_view_id: 'b1345b1b-d5f9-4a6e-bded-265313e81ef9',
    visible: true
  }, {
    table_column_id: '360a9a83-d046-4b64-a39e-944d2bfbd9c5',
    table_view_id: 'b1345b1b-d5f9-4a6e-bded-265313e81ef9',
    filter: JSON.stringify({
      $eq: "{userId}"
    }),
    visible: false
  }, {
    table_column_id: 'bde4bbbd-2584-447f-acff-f434f53619da',
    table_view_id: 'b1345b1b-d5f9-4a6e-bded-265313e81ef9',
    visible: true
  }, {
    table_column_id: 'f114393e-eece-4e8f-8893-7c31dde09690',
    table_view_id: 'b1345b1b-d5f9-4a6e-bded-265313e81ef9',
    visible: true
  }, {
    table_column_id: 'b7e0fddb-2a62-4906-8392-f88794600080',
    table_view_id: 'b1345b1b-d5f9-4a6e-bded-265313e81ef9',
    visible: true
  }, {
    table_column_id: 'e065323c-1151-447f-be0f-6d2728117b38',
    table_view_id: '2ef7f439-3946-4efb-87c7-0fd413bfc9d7',
    visible: true
  }, {
    table_column_id: '360a9a83-d046-4b64-a39e-944d2bfbd9c5',
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
  }, {
    table_column_id: 'b7e0fddb-2a62-4906-8392-f88794600080',
    table_view_id: '2ef7f439-3946-4efb-87c7-0fd413bfc9d7',
    visible: true
  }])
};
