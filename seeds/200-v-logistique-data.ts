import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
  /**
   * Bénéficiaires
   */
  await knex("table_row").insert([{
    id: '9df5d11e-a5a1-4ba8-94bd-c399944c9030',
    text: "Bénéficiaire A",
    table_id: 'bb145d9f-0976-419d-9fef-bc15799d1624',
    data: JSON.stringify({
      'be137241-f97f-4fb9-9220-36d5c6c0c1af': "Bénéficiaire A",
      'b93546a3-4459-40ed-9a76-fdcc45966479': {
        reference: 5,
        value: "Bénéficiaire A"
      }
    })
  }, {
    id: 'b258a1ee-cc9d-4d18-a6e9-553ed192e961',
    text: "Bénéficiaire B",
    table_id: 'bb145d9f-0976-419d-9fef-bc15799d1624',
    data: JSON.stringify({
      'be137241-f97f-4fb9-9220-36d5c6c0c1af': "Bénéficiaire B",
      'b93546a3-4459-40ed-9a76-fdcc45966479': {
        reference: 6,
        value: "Bénéficiaire B"
      }
    })
  }])
  /**
   * Fournisseurs
   */
  await knex("table_row").insert([{
    id: 'e5328205-f34c-4fa1-a6d8-7da8c4f37036',
    text: "CYCLABLE ENTREPRISE",
    table_id: 'a7a05fec-be28-4876-b158-6b96d10d8e2b',
    data: JSON.stringify({
      '17ab6b13-5412-483e-ac7d-a9add38225f1': "CYCLABLE ENTREPRISE",
      'bf0da601-527b-434c-b5b7-fc25e370fe36': {
        reference: 3,
        value: 'Fournisseur CYCLABLE ENTREPRISE'
      }
    })
  }, {
    id: 'a30a590b-2939-4240-8b20-4728bf0d7649',
    text: "AMSTERDAMAIR",
    table_id: 'a7a05fec-be28-4876-b158-6b96d10d8e2b',
    data: JSON.stringify({
      '17ab6b13-5412-483e-ac7d-a9add38225f1': "AMSTERDAMAIR",
      'bf0da601-527b-434c-b5b7-fc25e370fe36': {
        reference: 4,
        value: 'Fournisseur AMSTERDAMAIR'
      }
    })
  }, {
    id: '22ba7040-7a38-4013-b993-52deacf1c729',
    text: "CYCLELAB",
    table_id: 'a7a05fec-be28-4876-b158-6b96d10d8e2b',
    data: JSON.stringify({
      '17ab6b13-5412-483e-ac7d-a9add38225f1': "CYCLELAB",
      'bf0da601-527b-434c-b5b7-fc25e370fe36': {
        reference: 8,
        value: 'Fournisseur CYCLELAB'
      }
    })
  }])
  /**
   * Vélos
   */
  await knex("table_row").insert([{
    id: '38ed19db-588d-4ca1-8ab3-c8b17d60db2d',
    text: "Vélo n° XXXX",
    table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
    data: JSON.stringify({
      'e065323c-1151-447f-be0f-6d2728117b38': "VCAE",
      '360a9a83-d046-4b64-a39e-944d2bfbd9c5': {
        reference: 5,
        value: 'Bénéficiaire A'
      },
      'bde4bbbd-2584-447f-acff-f434f53619da': {
        reference: 4,
        value: 'Fournisseur AMSTERDAMAIR'
      },
      'f114393e-eece-4e8f-8893-7c31dde09690': 'traceur_XXXX',
      'b7e0fddb-2a62-4906-8392-f88794600080': 'XXXX'
    })
  }, {
    id: 'cd57a998-1775-4d13-b493-2cbdf7c54e4c',
    text: "Vélo n° YYYY",
    table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
    data: JSON.stringify({
      'e065323c-1151-447f-be0f-6d2728117b38': "VAE",
      '360a9a83-d046-4b64-a39e-944d2bfbd9c5': {
        reference: 5,
        value: 'Bénéficiaire A'
      },
      'bde4bbbd-2584-447f-acff-f434f53619da': {
        reference: 3,
        value: 'Fournisseur CYCLABLE ENTREPRISE'
      },
      'f114393e-eece-4e8f-8893-7c31dde09690': 'traceur_YYYY',
      'b7e0fddb-2a62-4906-8392-f88794600080': 'YYYY'
    })
  }, {
    id: '5704c8be-0b7f-409d-9baf-e5cc7afb5df9',
    text: "Vélo n° ZZZZ",
    table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
    data: JSON.stringify({
      'e065323c-1151-447f-be0f-6d2728117b38': "VCAE",
      '360a9a83-d046-4b64-a39e-944d2bfbd9c5': {
        reference: 6,
        value: 'Bénéficiaire B'
      },
      'bde4bbbd-2584-447f-acff-f434f53619da': {
        reference: 3,
        value: 'Fournisseur CYCLABLE ENTREPRISE'
      },
      'f114393e-eece-4e8f-8893-7c31dde09690': 'traceur_ZZZZ',
      'b7e0fddb-2a62-4906-8392-f88794600080': 'ZZZZ'
    })
  }])
};
