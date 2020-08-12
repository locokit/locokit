import * as Knex from "knex";
import { TABLES } from "./160-v-logistique-schema";

export async function seed(knex: Knex): Promise<any> {
  /**
   * Bénéficiaires
   */
  await knex("table_row").insert([{
    id: '9df5d11e-a5a1-4ba8-94bd-c399944c9030',
    text: "Bénéficiaire A",
    table_id: TABLES.PERSON.ID,
    data: JSON.stringify({
      [TABLES.PERSON.COLUMNS.FIRSTNAME]: "Prénom A",
      [TABLES.PERSON.COLUMNS.LASTNAME]: "Bénéficiaire A",
      [TABLES.PERSON.COLUMNS.USER]: {
        reference: 5,
        value: "Bénéficiaire A"
      }
    })
  }, {
    id: 'b258a1ee-cc9d-4d18-a6e9-553ed192e961',
    text: "Bénéficiaire B",
    table_id: TABLES.PERSON.ID,
    data: JSON.stringify({
      [TABLES.PERSON.COLUMNS.FIRSTNAME]: "Prénom B",
      [TABLES.PERSON.COLUMNS.LASTNAME]: "Bénéficiaire B",
      [TABLES.PERSON.COLUMNS.USER]: {
        reference: 6,
        value: "Bénéficiaire B"
      }
    })
  }, {
    id: '345f571b-b1df-4e8d-a636-e2121ba8ecfb',
    text: "Hervé LECOQ",
    table_id: TABLES.PERSON.ID,
    data: JSON.stringify({
      [TABLES.PERSON.COLUMNS.FIRSTNAME]: "Hervé",
      [TABLES.PERSON.COLUMNS.LASTNAME]: "LECOQ",
      [TABLES.PERSON.COLUMNS.USER]: null
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
   * Tracers
   */
  await knex("table_row").insert([{
    id: 'c6e48b1d-d53a-46cf-bc74-7c81870900f4',
    text: "Traceur n° 300FBF",
    table_id: TABLES.MORIO_TRACER.ID,
    data: JSON.stringify({
      [TABLES.MORIO_TRACER.COLUMNS.REF]: '300FBF',
      [TABLES.MORIO_TRACER.COLUMNS.STATUS]: TABLES.MORIO_TRACER.DATA.STATUS_INPROGRESS
    })
  }, {
    id: '61074bd7-c224-4d7b-99a1-5cecfbd23728',
    text: "Traceur n° 314AA5",
    table_id: TABLES.MORIO_TRACER.ID,
    data: JSON.stringify({
      [TABLES.MORIO_TRACER.COLUMNS.REF]: '314AA5',
      [TABLES.MORIO_TRACER.COLUMNS.STATUS]: TABLES.MORIO_TRACER.DATA.STATUS_WORKING
    })
  }, {
    id: 'd8cf9222-9fd6-406d-8b90-1b443e89aa7c',
    text: "Traceur n° 314A6A",
    table_id: TABLES.MORIO_TRACER.ID,
    data: JSON.stringify({
      [TABLES.MORIO_TRACER.COLUMNS.REF]: '314A6A',
      [TABLES.MORIO_TRACER.COLUMNS.STATUS]: TABLES.MORIO_TRACER.DATA.STATUS_INPROGRESS
    })
  }, {
    id: '769152a2-ff39-4186-892e-2fdd111e012b',
    text: "Traceur n° 314C05",
    table_id: TABLES.MORIO_TRACER.ID,
    data: JSON.stringify({
      [TABLES.MORIO_TRACER.COLUMNS.REF]: '314C05',
      [TABLES.MORIO_TRACER.COLUMNS.STATUS]: TABLES.MORIO_TRACER.DATA.STATUS_STOLEN
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
      [TABLES.BICYCLE.COLUMNS.NAME]: "VCAE",
      [TABLES.BICYCLE.COLUMNS.PERSON]: {
        reference: 5,
        value: 'Bénéficiaire A'
      },
      [TABLES.BICYCLE.COLUMNS.PROVIDER]: {
        reference: 4,
        value: 'AMSTERDAMAIR'
      },
      [TABLES.BICYCLE.COLUMNS.TRACER]: 'traceur_XXXX',
      [TABLES.BICYCLE.COLUMNS.REF]: 'XXXX',
      [TABLES.BICYCLE.COLUMNS.STATUS]: TABLES.BICYCLE.DATA.STATUS_IN_MAINTENANCE,
      [TABLES.BICYCLE.COLUMNS.MAINTENANCE_DATE]: '10/10/2020',
      [TABLES.BICYCLE.COLUMNS.COMMISSIONING_DATE]: '10/07/2020'
    })
  }, {
    id: 'cd57a998-1775-4d13-b493-2cbdf7c54e4c',
    text: "Vélo n° YYYY",
    table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
    data: JSON.stringify({
      [TABLES.BICYCLE.COLUMNS.NAME]: "VAE",
      [TABLES.BICYCLE.COLUMNS.PERSON]: {
        reference: 5,
        value: 'Bénéficiaire A'
      },
      [TABLES.BICYCLE.COLUMNS.PROVIDER]: {
        reference: 3,
        value: 'CYCLABLE ENTREPRISE'
      },
      [TABLES.BICYCLE.COLUMNS.TRACER]: 'traceur_YYYY',
      [TABLES.BICYCLE.COLUMNS.REF]: 'YYYY',
      [TABLES.BICYCLE.COLUMNS.STATUS]: TABLES.BICYCLE.DATA.STATUS_IN_USE,
      [TABLES.BICYCLE.COLUMNS.MAINTENANCE_DATE]: '01/10/2020',
      [TABLES.BICYCLE.COLUMNS.COMMISSIONING_DATE]: '01/07/2020'
    })
  }, {
    id: '5704c8be-0b7f-409d-9baf-e5cc7afb5df9',
    text: "Vélo n° ZZZZ",
    table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
    data: JSON.stringify({
      [TABLES.BICYCLE.COLUMNS.NAME]: "VCAE",
      [TABLES.BICYCLE.COLUMNS.PERSON]: {
        reference: 6,
        value: 'Bénéficiaire B'
      },
      [TABLES.BICYCLE.COLUMNS.PROVIDER]: {
        reference: 3,
        value: 'CYCLABLE ENTREPRISE'
      },
      [TABLES.BICYCLE.COLUMNS.TRACER]: 'traceur_ZZZZ',
      [TABLES.BICYCLE.COLUMNS.REF]: 'ZZZZ',
      [TABLES.BICYCLE.COLUMNS.STATUS]: TABLES.BICYCLE.DATA.STATUS_STORED,
      [TABLES.BICYCLE.COLUMNS.MAINTENANCE_DATE]: '16/10/2020',
      [TABLES.BICYCLE.COLUMNS.COMMISSIONING_DATE]: '16/07/2020'
    })
  }])
};
