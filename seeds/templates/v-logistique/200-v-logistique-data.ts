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
   * Demande
   */
  await knex("table_row").insert([{
    id: 'd4f8cdd8-5426-4f88-b61a-456a3baf3dcd',
    text: "Test",
    table_id: TABLES.PROVIDER.REQUEST.ID,
    data: JSON.stringify({
      [TABLES.PROVIDER.REQUEST.COLUMNS.SOCIETY]: "FactoryTest",
      [TABLES.PROVIDER.REQUEST.COLUMNS.PERSON]: 'Test TEST',
      [TABLES.PROVIDER.REQUEST.COLUMNS.STATUS]: 1,
      [TABLES.PROVIDER.REQUEST.COLUMNS.NUM_REQUEST]: '17',
      [TABLES.PROVIDER.REQUEST.COLUMNS.ADDRESS]: "1 rue du test, Tes",
      [TABLES.PROVIDER.REQUEST.COLUMNS.LOT]: 2,
      [TABLES.PROVIDER.REQUEST.COLUMNS.NB_VAE]: 1,
      [TABLES.PROVIDER.REQUEST.COLUMNS.NB_VCAE_BI]: 0,
      [TABLES.PROVIDER.REQUEST.COLUMNS.NB_VCAE_TRI]: 0,
    })
  }, {
    id: '4f4cb5ab-7375-4568-8109-3474c7f86df4',
    text: "Bénéficiaire A",
    table_id: TABLES.PROVIDER.REQUEST.ID,
    data: JSON.stringify({
      [TABLES.PROVIDER.REQUEST.COLUMNS.SOCIETY]: "Makina",
      [TABLES.PROVIDER.REQUEST.COLUMNS.PERSON]: "Bénéficiaire A",
      [TABLES.PROVIDER.REQUEST.COLUMNS.STATUS]: 2,
      [TABLES.PROVIDER.REQUEST.COLUMNS.NUM_REQUEST]: '42',
      [TABLES.PROVIDER.REQUEST.COLUMNS.ADDRESS]: "11 rue du Marchix, Nantes",
      [TABLES.PROVIDER.REQUEST.COLUMNS.LOT]: 2,
      [TABLES.PROVIDER.REQUEST.COLUMNS.NB_VAE]: 1,
      [TABLES.PROVIDER.REQUEST.COLUMNS.NB_VCAE_BI]: 0,
      [TABLES.PROVIDER.REQUEST.COLUMNS.NB_VCAE_TRI]: 0,
    })
  }, {
    id: 'f0622f55-995f-4f8c-b0be-ae3ada79a533',
    text: "Hervé LECOQ",
    table_id: TABLES.PROVIDER.REQUEST.ID,
    data: JSON.stringify({
      [TABLES.PROVIDER.REQUEST.COLUMNS.SOCIETY]: "Sarl rc & co",
      [TABLES.PROVIDER.REQUEST.COLUMNS.PERSON]: 'Hervé LECOQ',
      [TABLES.PROVIDER.REQUEST.COLUMNS.STATUS]: 2,
      [TABLES.PROVIDER.REQUEST.COLUMNS.NUM_REQUEST]: '136',
      [TABLES.PROVIDER.REQUEST.COLUMNS.ADDRESS]: "4 allée Duquesne, Nantes",
      [TABLES.PROVIDER.REQUEST.COLUMNS.LOT]: 2,
      [TABLES.PROVIDER.REQUEST.COLUMNS.NB_VAE]: 0,
      [TABLES.PROVIDER.REQUEST.COLUMNS.NB_VCAE_BI]: 1,
      [TABLES.PROVIDER.REQUEST.COLUMNS.NB_VCAE_TRI]: 0,
    })
  }])

  /**
   * Flotte Vélos
   */
  await knex("table_row").insert([{
    id: '04eb6854-3550-4406-ad51-9fc478409cc4',
    text: "Vélo n° XXXX",
    table_id: TABLES.PROVIDER.FLEET_BIKE.ID,
    data: JSON.stringify({
      [TABLES.PROVIDER.FLEET_BIKE.COLUMNS.TYPE]: 2,
      [TABLES.PROVIDER.FLEET_BIKE.COLUMNS.IDENTITY]: 'Non communiqué',
      [TABLES.PROVIDER.FLEET_BIKE.COLUMNS.BRAND]: 'Non communiqué',
      [TABLES.PROVIDER.FLEET_BIKE.COLUMNS.STATUS]: 2,
      [TABLES.PROVIDER.FLEET_BIKE.COLUMNS.MAINTENANCE_DATE]: '10/10/2020',
      [TABLES.PROVIDER.FLEET_BIKE.COLUMNS.DELIVERY_ESTIMATED_DATE]: '10/07/2020',
      [TABLES.PROVIDER.FLEET_BIKE.COLUMNS.PROVIDER]: 'Prestataire',
      [TABLES.PROVIDER.FLEET_BIKE.COLUMNS.RECIPIENT]: {
        reference: 6,
        value: 'Hervé LECOQ'
      },
    })
  }])

  /**
   * Maintenance Préventive Vélos
   */
  await knex("table_row").insert([{
    id: 'f8f0a019-407e-447c-9b28-71ed7ef4dfe0',
    text: "Vélo n° XXXX",
    table_id: TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.ID,
    data: JSON.stringify({
      [TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.TYPE]: 2,
      [TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.IDENTITY]: 'Non communiqué',
      [TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.STATUS]: 1,
      [TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.RECIPIENT]: {
        reference: 6,
        value: 'Hervé LECOQ'
      },
      [TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.MAINTENANCE_DATE]: '10/10/2020',
      [TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.TECHNICIAN]: 'Non communiqué',
      [TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.MAINTENANCE_STEP]: 1,
    })
  }])

  /**
   * Maintenance Curative Vélos
   */
  await knex("table_row").insert([{
    id: 'f66879e0-a0b9-496f-bc02-f46c1fe91ccd',
    text: "Vélo n° XXXX",
    table_id: TABLES.PROVIDER.MAINTENANCE_CURATIVE_BIKE.ID,
    data: JSON.stringify({
      [TABLES.PROVIDER.MAINTENANCE_CURATIVE_BIKE.COLUMNS.TYPE]: 2,
      [TABLES.PROVIDER.MAINTENANCE_CURATIVE_BIKE.COLUMNS.IDENTITY]: 'Non communiqué',
      [TABLES.PROVIDER.MAINTENANCE_CURATIVE_BIKE.COLUMNS.INCIDENT]: 3,
      [TABLES.PROVIDER.MAINTENANCE_CURATIVE_BIKE.COLUMNS.MAINTENANCE_DATE]: '10/10/2020',
      [TABLES.PROVIDER.MAINTENANCE_CURATIVE_BIKE.COLUMNS.RECIPIENT]: {
        reference: 6,
        value: 'Hervé LECOQ' // Todo: Get society
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
    table_id: TABLES.RECIPIENT.USING_BIKE.ID,
    data: JSON.stringify({
      [TABLES.RECIPIENT.USING_BIKE.COLUMNS.TYPE]: 2,
      [TABLES.RECIPIENT.USING_BIKE.COLUMNS.IDENTITY]: 'Non communiqué',
      [TABLES.RECIPIENT.USING_BIKE.COLUMNS.STATUS]: 1,
      [TABLES.RECIPIENT.USING_BIKE.COLUMNS.BRAND]: 'Non communiqué',
      [TABLES.RECIPIENT.USING_BIKE.COLUMNS.COMMISSIONING_DATE]: '17/07/2020',
      [TABLES.RECIPIENT.USING_BIKE.COLUMNS.MAINTENANCE_DATE]: '10/10/2020',
      [TABLES.RECIPIENT.USING_BIKE.COLUMNS.LAST_TRACER_DATA]:  'Non communiqué',
      [TABLES.RECIPIENT.USING_BIKE.COLUMNS.ALERT]: 3,
    })
  }])

  /**
   * Awareness and Formation
   */
  await knex("table_row").insert([{
    id: '6b12a209-9a62-422b-80f2-3dad6340fecd',
    text: "Formaton n°XXXX",
    table_id: TABLES.RECIPIENT.AWARENESS_FORMATION.ID,
    data: JSON.stringify({
      [TABLES.RECIPIENT.AWARENESS_FORMATION.COLUMNS.TYPE]: 2,
      [TABLES.RECIPIENT.AWARENESS_FORMATION.COLUMNS.INSTITUTION]: 2,
      [TABLES.RECIPIENT.AWARENESS_FORMATION.COLUMNS.TRAINER]:  'Non communiqué',
      [TABLES.RECIPIENT.AWARENESS_FORMATION.COLUMNS.FILE]: '',
      [TABLES.RECIPIENT.AWARENESS_FORMATION.COLUMNS.DATE]: '10/10/2020',
    })
  }])


  // View V-Logistique

  /**
   * Stock Vélos
   */
  await knex("table_row").insert([{
    id: '38ed19db-588d-4ca1-8ab3-c8b17d60db2d',
    text: "Vélo n° XXXX",
    table_id: TABLES.VLO.STOCK_BIKE.ID,
    data: JSON.stringify({
      [TABLES.VLO.STOCK_BIKE.COLUMNS.PERSON]: {
        reference: 6,
        value: 'Hervé LECOQ'
      },
      [TABLES.VLO.STOCK_BIKE.COLUMNS.TYPE]: 2,
      [TABLES.VLO.STOCK_BIKE.COLUMNS.REF]: 'Non communiqué',
      [TABLES.VLO.STOCK_BIKE.COLUMNS.STATUS]: 2,
      [TABLES.VLO.STOCK_BIKE.COLUMNS.BRAND]: 'Non communiqué',
      [TABLES.VLO.STOCK_BIKE.COLUMNS.REQUEST]: 'Non communiqué',
      [TABLES.VLO.STOCK_BIKE.COLUMNS.MAINTENANCE_DATE]: '10/10/2020',
      [TABLES.VLO.STOCK_BIKE.COLUMNS.COMMISSIONING_DATE]: '17/07/2020',
      [TABLES.VLO.STOCK_BIKE.COLUMNS.DELIVERY_ESTIMATED_DATE]: '10/07/2020',
      [TABLES.VLO.STOCK_BIKE.COLUMNS.PERSON]: {
        reference: 6,
        value: 'Hervé LECOQ'
      },
      [TABLES.VLO.STOCK_BIKE.COLUMNS.PROVIDER]: {
        reference: 3,
        value: 'CYCLABLE ENTREPRISE'
      },
      [TABLES.VLO.STOCK_BIKE.COLUMNS.LOT]: 2,
      [TABLES.VLO.STOCK_BIKE.COLUMNS.TRACER]: 'Non communiqué',
      [TABLES.VLO.STOCK_BIKE.COLUMNS.LAST_TRACER_DATA]: 'Non communiqué',
    })
  }])

  /**
   * Pré-Bénéficiaires
   */
  await knex("table_row").insert([{
    id: '9df5d11e-a5a1-4ba8-94bd-c399944c9030',
    text: "Test",
    table_id: TABLES.VLO.LIST_PRE_RECIPIENT.ID,
    data: JSON.stringify({
      [TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.SOCIETY]: "FactoryTest",
      [TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.USER]: "Test TEST",
      [TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.STATUS]: 1,
      [TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.NUM_REQUEST]: 17,
      [TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.EMAIL]: "test@test.test",
      [TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.PHONE]: "0123456789",
      [TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.ADDRESS]: "1 rue du test, Test",
      [TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.LOT]: 1,
      [TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.APE]: "11111",
      [TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.NB_VAE]: 1,
      [TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.NB_VCAE_BI]: 0,
      [TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.NB_VCAE_TRI]: 0,
    })
  }, {
    id: '96c0ea7e-b261-4ec0-9477-024962911485',
    text: "Bénéficiaire A",
    table_id: TABLES.VLO.LIST_PRE_RECIPIENT.ID,
    data: JSON.stringify({
      [TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.SOCIETY]: "Makina",
      [TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.USER]: "Bénéficiaire A",
      [TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.STATUS]: 2,
      [TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.NUM_REQUEST]: '42',
      [TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.EMAIL]: "beneficiairea@makina-corpus.net",
      [TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.PHONE]: "0987654321",
      [TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.ADDRESS]: "11 rue du Marchix, Nantes",
      [TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.LOT]: 1,
      [TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.APE]: "1717A",
      [TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.NB_VAE]: 1,
      [TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.NB_VCAE_BI]: 0,
      [TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.NB_VCAE_TRI]: 0,
    })
  }, {
    id: '345f571b-b1df-4e8d-a636-e2121ba8ecfb',
    text: "Hervé LECOQ",
    table_id: TABLES.VLO.LIST_PRE_RECIPIENT.ID,
    data: JSON.stringify({
      [TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.SOCIETY]: "Sarl rc & co",
      [TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.USER]: "Hervé LECOQ",
      [TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.STATUS]: 2,
      [TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.NUM_REQUEST]: '136',
      [TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.EMAIL]: "la.boulangerie@orange.fr",
      [TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.PHONE]: "0626093607",
      [TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.ADDRESS]: "4 allée Duquesne, Nantes",
      [TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.LOT]: 2,
      [TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.APE]: "1071C",
      [TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.NB_VAE]: 0,
      [TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.NB_VCAE_BI]: 1,
      [TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.NB_VCAE_TRI]: 0,
    })
  }])

  /**
   * Bénéficiaires
   */
  await knex("table_row").insert([{
    id: '52cff74f-8e46-4f32-b3c1-932f8f7a3861',
    text: "Bénéficiaire A",
    table_id: TABLES.VLO.LIST_RECIPIENT.ID,
    data: JSON.stringify({
      [TABLES.VLO.LIST_RECIPIENT.COLUMNS.SOCIETY]: "Makina",
      [TABLES.VLO.LIST_RECIPIENT.COLUMNS.USER]: {
        reference: 5,
        value: 'Bénéficiaire A'
      },
      [TABLES.VLO.LIST_RECIPIENT.COLUMNS.STATUS]: 4,
      [TABLES.VLO.LIST_RECIPIENT.COLUMNS.NUM_REQUEST]: '42',
      [TABLES.VLO.LIST_RECIPIENT.COLUMNS.EMAIL]: "beneficiairea@makina-corpus.net",
      [TABLES.VLO.LIST_RECIPIENT.COLUMNS.PHONE]: "0987654321",
      [TABLES.VLO.LIST_RECIPIENT.COLUMNS.ADDRESS]: "11 rue du Marchix, Nantes",
      [TABLES.VLO.LIST_RECIPIENT.COLUMNS.LOT]: 1,
      [TABLES.VLO.LIST_RECIPIENT.COLUMNS.APE]: "1717A",
      [TABLES.VLO.LIST_RECIPIENT.COLUMNS.NB_VAE]: 1,
      [TABLES.VLO.LIST_RECIPIENT.COLUMNS.NB_VCAE_BI]: 0,
      [TABLES.VLO.LIST_RECIPIENT.COLUMNS.NB_VCAE_TRI]: 0,
    })
  }, {
    id: '15a29b4c-fc39-4acf-991a-c98f3622b638',
    text: "Hervé LECOQ",
    table_id: TABLES.VLO.LIST_RECIPIENT.ID,
    data: JSON.stringify({
      [TABLES.VLO.LIST_RECIPIENT.COLUMNS.SOCIETY]: "Sarl rc & co",
      [TABLES.VLO.LIST_RECIPIENT.COLUMNS.USER]: {
        reference: 6,
        value: 'Hervé LECOQ'
      },
      [TABLES.VLO.LIST_RECIPIENT.COLUMNS.STATUS]: 2,
      [TABLES.VLO.LIST_RECIPIENT.COLUMNS.NUM_REQUEST]: '136',
      [TABLES.VLO.LIST_RECIPIENT.COLUMNS.EMAIL]: "la.boulangerie@orange.fr",
      [TABLES.VLO.LIST_RECIPIENT.COLUMNS.PHONE]: "0626093607",
      [TABLES.VLO.LIST_RECIPIENT.COLUMNS.ADDRESS]: "4 allée Duquesne, Nantes",
      [TABLES.VLO.LIST_RECIPIENT.COLUMNS.LOT]: 2,
      [TABLES.VLO.LIST_RECIPIENT.COLUMNS.APE]: "1071C",
      [TABLES.VLO.LIST_RECIPIENT.COLUMNS.NB_VAE]: 0,
      [TABLES.VLO.LIST_RECIPIENT.COLUMNS.NB_VCAE_BI]: 1,
      [TABLES.VLO.LIST_RECIPIENT.COLUMNS.NB_VCAE_TRI]: 0,
    })
  }])

  /**
   * Rozo
   */
  await knex("table_row").insert([{
    id: 'bc280682-e093-11ea-87d0-0242ac130003',
    text: "Prise en charge de la demande n°XXXX",
    table_id: TABLES.VLO.ROZO_REQUEST.ID,
    data: JSON.stringify({
      [TABLES.VLO.ROZO_REQUEST.COLUMNS.NAME]: { // Todo: A voir si utilisateur (processus)
        reference: 5,
        value: 'Bénéficiaire A'
      },
      [TABLES.VLO.ROZO_REQUEST.COLUMNS.TYPE]: {
        reference: 5,
        value: 'Bénéficiaire'
      },
      [TABLES.VLO.ROZO_REQUEST.COLUMNS.NUM_REQUEST]: 'Non communiqué',
      [TABLES.VLO.ROZO_REQUEST.COLUMNS.DATE_REQUEST]: '10/07/2020',
      [TABLES.VLO.ROZO_REQUEST.COLUMNS.STEP]: 2,
      [TABLES.VLO.ROZO_REQUEST.COLUMNS.STATUS]: 2,
    })
  } ,{
    id: '487d8032-230d-4d21-bb4d-5cb9c6ff17bb',
    text: "Prise en charge de la demande n°XXXX",
    table_id: TABLES.VLO.ROZO_REQUEST.ID,
    data: JSON.stringify({
      [TABLES.VLO.ROZO_REQUEST.COLUMNS.NAME]: { // Todo: A voir si utilisateur (processus)
        reference: 6,
        value: 'Hervé LECOQ'
      },
      [TABLES.VLO.ROZO_REQUEST.COLUMNS.TYPE]: {
        reference: 6,
        value: 'Bénéficiaire'
      },
      [TABLES.VLO.ROZO_REQUEST.COLUMNS.NUM_REQUEST]: 'Non communiqué',
      [TABLES.VLO.ROZO_REQUEST.COLUMNS.DATE_REQUEST]: '25/06/2020',
      [TABLES.VLO.ROZO_REQUEST.COLUMNS.STEP]: 5,
      [TABLES.VLO.ROZO_REQUEST.COLUMNS.STATUS]: 3,
    })
  }])

  /**
   * Fournisseurs
   */
  await knex("table_row").insert([{
    id: 'e5328205-f34c-4fa1-a6d8-7da8c4f37036',
    text: "CYCLABLE ENTREPRISE",
    table_id: TABLES.VLO.LIST_PROVIDER.ID,
    data: JSON.stringify({
      [TABLES.VLO.LIST_PROVIDER.COLUMNS.NAME]: "CYCLABLE ENTREPRISE",
      [TABLES.VLO.LIST_PROVIDER.COLUMNS.USER]: {
        reference: 3,
        value: 'Fournisseur CYCLABLE ENTREPRISE'
      }
    })
  }, {
    id: 'a30a590b-2939-4240-8b20-4728bf0d7649',
    text: "AMSTERDAMAIR",
    table_id: TABLES.VLO.LIST_PROVIDER.ID,
    data: JSON.stringify({
      [TABLES.VLO.LIST_PROVIDER.COLUMNS.NAME]: "AMSTERDAMAIR",
      [TABLES.VLO.LIST_PROVIDER.COLUMNS.USER]: {
        reference: 4,
        value: 'Fournisseur AMSTERDAMAIR'
      }
    })
  }, {
    id: '22ba7040-7a38-4013-b993-52deacf1c729',
    text: "CYCLELAB",
    table_id: TABLES.VLO.LIST_PROVIDER.ID,
    data: JSON.stringify({
      [TABLES.VLO.LIST_PROVIDER.COLUMNS.NAME]: "CYCLELAB",
      [TABLES.VLO.LIST_PROVIDER.COLUMNS.USER]: {
        reference: 8,
        value: 'Fournisseur CYCLELAB'
      }
    })
  }])

  /**
   * Morio
   */
  await knex("table_row").insert([{
    id: '70c8b197-aaf5-4972-83ff-a4f9d5f5c7f9',
    text: "Traceur n°XXXX",
    table_id: TABLES.VLO.MORIO.ID,
    data: JSON.stringify({
      [TABLES.VLO.MORIO.COLUMNS.USER]: {
        reference: 6,
        value: 'Hervé LECOQ'
      },
      [TABLES.VLO.MORIO.COLUMNS.TYPE]: 2,
      [TABLES.VLO.MORIO.COLUMNS.NUM_REQUEST]: 'Non communiqué',
      [TABLES.VLO.MORIO.COLUMNS.NUM_TRACER]: 'Non communiqué',
      [TABLES.VLO.MORIO.COLUMNS.STATUS]: 5,
    })
  }])

  /**
   * Formations et assistances
   */
  await knex("table_row").insert([{
    id: 'b3a4def5-c490-4332-a84b-84c9bb057dc0',
    text: "Formations et assistances n°XXXX",
    table_id: TABLES.VLO.FORMATION.ID,
    data: JSON.stringify({
      [TABLES.VLO.FORMATION.COLUMNS.USER]: {
        reference: 6,
        value: 'Hervé LECOQ'
      },
      [TABLES.VLO.FORMATION.COLUMNS.FILE]: 'Doc',
      [TABLES.VLO.FORMATION.COLUMNS.DATE]: '10/07/2020',
      [TABLES.VLO.FORMATION.COLUMNS.RATING]: 6,
    })
  }])

  // View Rozo

  await knex("table_row").insert([{
    id: '060f54fa-f439-49dc-8fa4-0a10abeb64f4',
    text: "Dossier n°XXXX",
    table_id: TABLES.ROZO.FOLDER.ID,
    data: JSON.stringify({
      [TABLES.ROZO.FOLDER.COLUMNS.SOCIETY]: 'Sarl rc & co',
      [TABLES.ROZO.FOLDER.COLUMNS.STATUS_PERSON]: 2,
      [TABLES.ROZO.FOLDER.COLUMNS.STATUS_FOLDER]: 2,
      [TABLES.ROZO.FOLDER.COLUMNS.NUM_REQUEST]: '136',
      [TABLES.ROZO.FOLDER.COLUMNS.STEP]: 5,
      [TABLES.ROZO.FOLDER.COLUMNS.STATUS_PROGRAM]: 3,
      [TABLES.ROZO.FOLDER.COLUMNS.NB_BIKE]: 1,
    })
  }])

  // View Morio

  // View Fub

};
