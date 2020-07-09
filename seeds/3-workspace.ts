import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
  await knex("workspace").insert([{
    id: 1,
    text: 'v-logistique'
  }])
  await knex("chapter").insert([{
    id: 1,
    text: 'Fournisseur',
    workspace_id: 1
  }, {
    id: 2,
    text: 'Bénéficiaire',
    workspace_id: 1
  }])
  await knex("page").insert([{
    id: 1,
    text: 'Usage Vélos',
    chapter_id: 2
  }, {
    id: 2,
    text: 'Vélos livrés',
    chapter_id: 1
  }])
  await knex("container").insert([{
    id: 1,
    text: 'Container 1',
    settings: JSON.stringify({
      class: 'yolo'
    }),
    page_id: 1
  }, {
    id: 2,
    text: 'Container 2',
    settings: JSON.stringify({
      class: 'pouic'
    }),
    page_id: 1
  }, {
    id: 3,
    text: 'Container 3',
    settings: JSON.stringify({
      class: 'pouet'
    }),
    page_id: 2
  }, {
    id: 4,
    text: 'Container 4',
    settings: JSON.stringify({
      class: 'poum'
    }),
    page_id: 2
  }])
  await knex("block").insert([{
    id: 1,
    text: 'Listing vélo 1',
    container_id: 1,
    type: 'TableView',
    settings: JSON.stringify({
      id: 1
    })
  }, {
    id: 2,
    text: 'Listing vélo 2',
    container_id: 2,
    type: 'TableView',
    settings: JSON.stringify({
      id: 2
    })
  }, {
    id: 3,
    text: 'Listing vélo 3',
    container_id: 3,
    type: 'TableView',
    settings: JSON.stringify({
      id: 1
    })
  }, {
    id: 4,
    text: 'Listing vélo 4',
    container_id: 4,
    type: 'TableView',
    settings: JSON.stringify({
      id: 2
    })
  }])
  await knex("group_has_workspace").insert([{
    group_id: 3,
    workspace_id: 1,
    role: 'OWNER',
    permission: null
  }, {
    group_id: 2,
    workspace_id: 1,
    role: 'MEMBER',
    permission: JSON.stringify([
      'VIEW_READ_2'
    ]),
    chapter_id: 2
  }, {
    group_id: 1,
    workspace_id: 1,
    role: 'MEMBER',
    permission: JSON.stringify([
      'VIEW_READ_1'
    ]),
    chapter_id: 1
  }])
  await knex("database").insert([{
    id: 1,
    text: 'Base principale',
    workspace_id: 1
  }])
  await knex("table").insert([{
    id: 1,
    text: 'Vélo',
    database_id: 1
  }, {
    id: 2,
    text: 'Traceur',
    database_id: 1
  }, {
    id: 3,
    text: 'Bénéficiaire',
    database_id: 1
  }, {
    id: 4,
    text: 'Fournisseur',
    database_id: 1
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
    text: 'Table'
  }])
  await knex("table_column").insert([{
    id: 1,
    text: 'Nom du vélo',
    table_id: 1,
    column_type_id: 3
  }, {
    id: 2,
    text: 'Bénéficiaire',
    table_id: 1,
    column_type_id: 5
  }, {
    id: 3,
    text: 'Fournisseur',
    table_id: 1,
    column_type_id: 5
  }, {
    id: 4,
    text: 'Traceur',
    table_id: 1,
    column_type_id: 3
  }, {
    id: 5,
    text: 'Référence vélo',
    table_id: 1,
    column_type_id: 3
  }])
  await knex("table_row").insert([{
    id: 1,
    text: "Vélo n° XXXX",
    table_id: 1,
    data: JSON.stringify({
      1: "Vélo pouet",
      2: 5,
      3: 4,
      4: 'traceur_XXXX',
      5: 'XXXX'
    })
  }, {
    id: 2,
    text: "Vélo n° YYYY",
    table_id: 1,
    data: JSON.stringify({
      1: "Vélo pouet",
      2: 5,
      3: 3,
      4: 'traceur_YYYY',
      5: 'YYYY'
    })
  }, {
    id: 3,
    text: "Vélo n° ZZZZ",
    table_id: 1,
    data: JSON.stringify({
      1: "Vélo pouet",
      2: 6,
      3: 3,
      4: 'traceur_ZZZZ',
      5: 'ZZZZ'
    })
  }])
  await knex("table_view").insert([{
    id: 1,
    text: 'Vélo bénéficiaire',
    table_id: 1
  }, {
    id: 2,
    text: 'Vélo fournisseur',
    table_id: 1
  }])
  await knex("table_view_has_table_column").insert([{
    table_column_id: 1,
    table_view_id: 1
  }, {
    table_column_id: 2,
    table_view_id: 1,
    filter: JSON.stringify([{
      $eq: "userId"
    }])
  }, {
    table_column_id: 3,
    table_view_id: 1
  }, {
    table_column_id: 4,
    table_view_id: 1
  }, {
    table_column_id: 5,
    table_view_id: 1
  }, {
    table_column_id: 1,
    table_view_id: 2
  }, {
    table_column_id: 2,
    table_view_id: 2
  }, {
    table_column_id: 3,
    table_view_id: 2,
    filter: JSON.stringify([{
      $eq: "userId"
    }])
  }, {
    table_column_id: 4,
    table_view_id: 2
  }, {
    table_column_id: 5,
    table_view_id: 2
  }])
};
