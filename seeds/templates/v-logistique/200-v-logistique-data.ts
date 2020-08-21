import * as Knex from "knex";
import { TABLES } from "../../../src/glossary-seed/schema-glossary";

export async function seed(knex: Knex): Promise<any> {
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


  // View Fournisseur

  /**
   * Flotte Vélos
   */
  await knex("table_row").insert([{
    id: '04eb6854-3550-4406-ad51-9fc478409cc4',
    text: "Vélo n° XXXX",
    table_id: TABLES.PROVIDER_FLEET_BIKE.ID,
    data: JSON.stringify({
      [TABLES.PROVIDER_FLEET_BIKE.COLUMNS.TYPE]: "VCAE",
      [TABLES.PROVIDER_FLEET_BIKE.COLUMNS.IDENTITY]: 'XXXX',
      [TABLES.PROVIDER_FLEET_BIKE.COLUMNS.BRAND]: 'Trek',
      [TABLES.PROVIDER_FLEET_BIKE.COLUMNS.STATUS]: 1,
      [TABLES.PROVIDER_FLEET_BIKE.COLUMNS.MAINTENANCE_DATE]: '10/10/2020',
      [TABLES.PROVIDER_FLEET_BIKE.COLUMNS.DELIVERY_ESTIMATED_DATE]: '10/07/2020',
      [TABLES.PROVIDER_FLEET_BIKE.COLUMNS.PROVIDER]: 'Prestataire',
      [TABLES.PROVIDER_FLEET_BIKE.COLUMNS.RECIPIENT]: {
        reference: 5,
        value: 'Bénéficiaire A'
      },
    })
  }])

  /**
   * Maintenance Préventive Vélos
   */
  await knex("table_row").insert([{
    id: 'f8f0a019-407e-447c-9b28-71ed7ef4dfe0',
    text: "Vélo n° XXXX",
    table_id: TABLES.PROVIDER_MAINTENANCE_PREVENTIVE_BIKE.ID,
    data: JSON.stringify({
      [TABLES.PROVIDER_MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.TYPE]: "VCAE",
      [TABLES.PROVIDER_MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.IDENTITY]: 'XXXX',
      [TABLES.PROVIDER_MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.STATUS]: 1,
      [TABLES.PROVIDER_MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.RECIPIENT]: {
        reference: 5,
        value: 'Bénéficiaire A'
      },
      [TABLES.PROVIDER_MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.MAINTENANCE_DATE]: '10/10/2020',
      [TABLES.PROVIDER_MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.TECHNICIAN]: 'Nom?',
      [TABLES.PROVIDER_MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.MAINTENANCE_STEP]: 1,
    })
  }])

  /**
   * Maintenance Curative Vélos
   */
  await knex("table_row").insert([{
    id: 'f66879e0-a0b9-496f-bc02-f46c1fe91ccd',
    text: "Vélo n° XXXX",
    table_id: TABLES.PROVIDER_MAINTENANCE_CURATIVE_BIKE.ID,
    data: JSON.stringify({
      [TABLES.PROVIDER_MAINTENANCE_CURATIVE_BIKE.COLUMNS.TYPE]: "VCAE",
      [TABLES.PROVIDER_MAINTENANCE_CURATIVE_BIKE.COLUMNS.IDENTITY]: 'XXXX',
      [TABLES.PROVIDER_MAINTENANCE_CURATIVE_BIKE.COLUMNS.STATUS]: 2,
      [TABLES.PROVIDER_MAINTENANCE_CURATIVE_BIKE.COLUMNS.MAINTENANCE_DATE]: '10/10/2020',
      [TABLES.PROVIDER_MAINTENANCE_CURATIVE_BIKE.COLUMNS.RECIPIENT]: {
        reference: 5,
        value: 'Bénéficiaire A'
      },
    })
  }])



  // View Beneficiaire

  /**
   * Bicycle Use
   */
  await knex("table_row").insert([{
    id: 'b71f825b-6174-4a9c-ad02-f3feebd123f4',
    text: "Vélo n°XXXX",
    table_id: TABLES.BENEFICIAIRE_BICYCLE.ID,
    data: JSON.stringify({
      '520d890a-3547-4b01-b9b9-8d089eb89db6': 'VCAE',
      'dcea9b9a-da47-4c80-ba0f-89df455dbe87': 'XXXX',
      '191bae3b-e28e-4dbd-a55d-c3a76e10c32f': 1,
      'cf8ea6ec-8b5c-4456-b741-62ec9957a817': 'Trek',
      '438862d6-6134-482d-b5cc-0f4f74d051bf': '10/07/2020',
      'd8b4254e-4366-4875-b5cd-bdb3ae708519': '10/07/2020',
      'ea73b16b-9910-441a-bcef-b3c0a31b22c4': '',
      'a9ed9ed7-cc74-4f9a-8173-87fc023b82c0': 1,
    })
  }])


  // View V-Logistique

  /**
   * Stock Vélos
   */
  await knex("table_row").insert([{
    id: '38ed19db-588d-4ca1-8ab3-c8b17d60db2d',
    text: "Vélo n° XXXX",
    table_id: TABLES.VLO_STOCK_1.ID,
    data: JSON.stringify({
      [TABLES.VLO_STOCK_1.COLUMNS.PERSON]: {
        reference: 5,
        value: 'Bénéficiaire A'
      },
      [TABLES.VLO_STOCK_1.COLUMNS.NAME]: "VCAE",
      [TABLES.VLO_STOCK_1.COLUMNS.REF]: 'XXXX',
      [TABLES.VLO_STOCK_1.COLUMNS.STATUS]: TABLES.VLO_STOCK_1.DATA.STATUS_IN_MAINTENANCE,
      [TABLES.VLO_STOCK_1.COLUMNS.BRAND]: 'Trek',
      [TABLES.VLO_STOCK_1.COLUMNS.MAINTENANCE_DATE]: '10/10/2020',
      [TABLES.VLO_STOCK_1.COLUMNS.PROVIDER]: {
        reference: 4,
        value: 'AMSTERDAMAIR'
      },
      [TABLES.VLO_STOCK_1.COLUMNS.LAST_TRACER_DATA]: '',
    })
  }])

  /**
   * Fournisseurs
   */
  await knex("table_row").insert([{
    id: 'e5328205-f34c-4fa1-a6d8-7da8c4f37036',
    text: "CYCLABLE ENTREPRISE",
    table_id: TABLES.VLO_STOCK_2.ID,
    data: JSON.stringify({
      [TABLES.VLO_STOCK_2.COLUMNS.NAME]: "CYCLABLE ENTREPRISE",
      [TABLES.VLO_STOCK_2.COLUMNS.USER]: {
        reference: 3,
        value: 'Fournisseur CYCLABLE ENTREPRISE'
      }
    })
  }, {
    id: 'a30a590b-2939-4240-8b20-4728bf0d7649',
    text: "AMSTERDAMAIR",
    table_id: TABLES.VLO_STOCK_2.ID,
    data: JSON.stringify({
      [TABLES.VLO_STOCK_2.COLUMNS.NAME]: "AMSTERDAMAIR",
      [TABLES.VLO_STOCK_2.COLUMNS.USER]: {
        reference: 4,
        value: 'Fournisseur AMSTERDAMAIR'
      }
    })
  }, {
    id: '22ba7040-7a38-4013-b993-52deacf1c729',
    text: "CYCLELAB",
    table_id: TABLES.VLO_STOCK_2.ID,
    data: JSON.stringify({
      [TABLES.VLO_STOCK_2.COLUMNS.NAME]: "CYCLELAB",
      [TABLES.VLO_STOCK_2.COLUMNS.USER]: {
        reference: 8,
        value: 'Fournisseur CYCLELAB'
      }
    })
  }])

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
   * Rozo
   */
  await knex("table_row").insert([{
    id: 'bc280682-e093-11ea-87d0-0242ac130003',
    text: "Prise en charge de la demande n°XXXX",
    table_id: TABLES.ROZO_REQUEST.ID,
    data: JSON.stringify({
      [TABLES.ROZO_REQUEST.COLUMNS.NAME]: {
        reference: 5,
        value: 'Bénéficiaire A'
      },
      [TABLES.ROZO_REQUEST.COLUMNS.TYPE]: {
        reference: 6,
        value: 'Bénéficiaire'
      },
      [TABLES.ROZO_REQUEST.COLUMNS.NUM_DEMAND]: '42',
      [TABLES.ROZO_REQUEST.COLUMNS.DATE_DEMAND]: '10/07/2020',
      [TABLES.ROZO_REQUEST.COLUMNS.STEP]: 5,
      [TABLES.ROZO_REQUEST.COLUMNS.STATUS]: 3,
    })
  }])
};
