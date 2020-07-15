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
  }])
  await knex("page").insert([{
    id: '4b64ffc0-229a-47ae-a5a2-0505fa9890ee',
    text: 'Usage Vélos',
    chapter_id: 'dc1a1763-7786-4876-8b7d-2e65f772e658'
  }, {
    id: '53646407-caf7-4dd4-9422-edd378dd647d',
    text: 'Vélos livrés',
    chapter_id: '8da8f312-27cf-4810-a7e5-9430823eed29'
  }])
  await knex("container").insert([{
    id: '5cdbf483-aafe-4b6a-9ad1-99faf0a5e5f4',
    text: 'Container 1',
    settings: JSON.stringify({
      class: 'yolo'
    }),
    page_id: '4b64ffc0-229a-47ae-a5a2-0505fa9890ee'
  }, {
    id: 'da283b02-0679-424c-98b3-95f2779655be',
    text: 'Container 2',
    settings: JSON.stringify({
      class: 'pouic'
    }),
    page_id: '4b64ffc0-229a-47ae-a5a2-0505fa9890ee'
  }, {
    id: '42be6c09-a6df-41c5-99e3-295d4696b492',
    text: 'Container 3',
    settings: JSON.stringify({
      class: 'pouet'
    }),
    page_id: '53646407-caf7-4dd4-9422-edd378dd647d'
  }, {
    id: 'e8a4061b-a6a4-40b8-b309-f7658e949099',
    text: 'Container 4',
    settings: JSON.stringify({
      class: 'poum'
    }),
    page_id: '53646407-caf7-4dd4-9422-edd378dd647d'
  }])
  await knex("block").insert([{
    id: '28889a60-3d62-47a3-9c5e-12f0aa3ca896',
    text: 'Listing vélo 1',
    container_id: '5cdbf483-aafe-4b6a-9ad1-99faf0a5e5f4',
    type: 'TableView',
    settings: JSON.stringify({
      id: 'b1345b1b-d5f9-4a6e-bded-265313e81ef9'
    })
  }, {
    id: '3f70841d-a6fe-4586-b130-038331eacd7c',
    text: 'Listing vélo 2',
    container_id: 'da283b02-0679-424c-98b3-95f2779655be',
    type: 'TableView',
    settings: JSON.stringify({
      id: '2ef7f439-3946-4efb-87c7-0fd413bfc9d7'
    })
  }, {
    id: 'd7933493-b5d0-4363-a5e8-caf0abef6d05',
    text: 'Listing vélo 3',
    container_id: '42be6c09-a6df-41c5-99e3-295d4696b492',
    type: 'TableView',
    settings: JSON.stringify({
      id: 'b1345b1b-d5f9-4a6e-bded-265313e81ef9'
    })
  }, {
    id: '97f0eff5-b227-4b02-ac99-69d6846cac9c',
    text: 'Listing vélo 4',
    container_id: 'e8a4061b-a6a4-40b8-b309-f7658e949099',
    type: 'TableView',
    settings: JSON.stringify({
      id: '2ef7f439-3946-4efb-87c7-0fd413bfc9d7'
    })
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
  await knex("column_type").insert([{
    id: 1,
    text: 'Number',
  }, {
    id: 2,
    text: 'Date',
  }, {
    id: 3,
    text: 'String',
  }, {
    id: 4,
    text: 'Float',
  }, {
    id: 5,
    text: 'User',
  }, {
    id: 6,
    text: 'Group',
  }, {
    id: 7,
    text: 'Link / relation between tables',
  }, {
    id: 8,
    text: 'Looked up column'
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
    column_type_id: 5
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
  }])
  await knex("table_row").insert([{
    id: '38ed19db-588d-4ca1-8ab3-c8b17d60db2d',
    text: "Vélo n° XXXX",
    table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
    data: JSON.stringify({
      'e065323c-1151-447f-be0f-6d2728117b38': "Vélo pouet",
      '360a9a83-d046-4b64-a39e-944d2bfbd9c5': 5,
      'bde4bbbd-2584-447f-acff-f434f53619da': 4,
      'f114393e-eece-4e8f-8893-7c31dde09690': 'traceur_XXXX',
      'b7e0fddb-2a62-4906-8392-f88794600080': 'XXXX',
    })
  }, {
    id: 'cd57a998-1775-4d13-b493-2cbdf7c54e4c',
    text: "Vélo n° YYYY",
    table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
    data: JSON.stringify({
      'e065323c-1151-447f-be0f-6d2728117b38': "Vélo pouet",
      '360a9a83-d046-4b64-a39e-944d2bfbd9c5': 5,
      'bde4bbbd-2584-447f-acff-f434f53619da': 3,
      'f114393e-eece-4e8f-8893-7c31dde09690': 'traceur_YYYY',
      'b7e0fddb-2a62-4906-8392-f88794600080': 'YYYY'
    })
  }, {
    id: '5704c8be-0b7f-409d-9baf-e5cc7afb5df9',
    text: "Vélo n° ZZZZ",
    table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
    data: JSON.stringify({
      'e065323c-1151-447f-be0f-6d2728117b38': "Vélo pouet",
      '360a9a83-d046-4b64-a39e-944d2bfbd9c5': 6,
      'bde4bbbd-2584-447f-acff-f434f53619da': 3,
      'f114393e-eece-4e8f-8893-7c31dde09690': 'traceur_ZZZZ',
      'b7e0fddb-2a62-4906-8392-f88794600080': 'ZZZZ'
    })
  }])
  await knex("table_view").insert([{
    id: 'b1345b1b-d5f9-4a6e-bded-265313e81ef9',
    text: 'Vélo bénéficiaire',
    table_id: '163c21e6-5339-4748-903f-8c77e21314cf'
  }, {
    id: '2ef7f439-3946-4efb-87c7-0fd413bfc9d7',
    text: 'Vélo fournisseur',
    table_id: '163c21e6-5339-4748-903f-8c77e21314cf'
  }])
  await knex("table_view_has_table_column").insert([{
    table_column_id: 'e065323c-1151-447f-be0f-6d2728117b38',
    table_view_id: 'b1345b1b-d5f9-4a6e-bded-265313e81ef9'
  }, {
    table_column_id: '360a9a83-d046-4b64-a39e-944d2bfbd9c5',
    table_view_id: 'b1345b1b-d5f9-4a6e-bded-265313e81ef9',
    filter: JSON.stringify([{
      $eq: "userId"
    }])
  }, {
    table_column_id: 'bde4bbbd-2584-447f-acff-f434f53619da',
    table_view_id: 'b1345b1b-d5f9-4a6e-bded-265313e81ef9'
  }, {
    table_column_id: 'f114393e-eece-4e8f-8893-7c31dde09690',
    table_view_id: 'b1345b1b-d5f9-4a6e-bded-265313e81ef9'
  }, {
    table_column_id: 'b7e0fddb-2a62-4906-8392-f88794600080',
    table_view_id: 'b1345b1b-d5f9-4a6e-bded-265313e81ef9'
  }, {
    table_column_id: 'e065323c-1151-447f-be0f-6d2728117b38',
    table_view_id: '2ef7f439-3946-4efb-87c7-0fd413bfc9d7'
  }, {
    table_column_id: '360a9a83-d046-4b64-a39e-944d2bfbd9c5',
    table_view_id: '2ef7f439-3946-4efb-87c7-0fd413bfc9d7'
  }, {
    table_column_id: 'bde4bbbd-2584-447f-acff-f434f53619da',
    table_view_id: '2ef7f439-3946-4efb-87c7-0fd413bfc9d7',
    filter: JSON.stringify([{
      $eq: "userId"
    }])
  }, {
    table_column_id: 'f114393e-eece-4e8f-8893-7c31dde09690',
    table_view_id: '2ef7f439-3946-4efb-87c7-0fd413bfc9d7'
  }, {
    table_column_id: 'b7e0fddb-2a62-4906-8392-f88794600080',
    table_view_id: '2ef7f439-3946-4efb-87c7-0fd413bfc9d7'
  }])
};
