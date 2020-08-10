import * as Knex from "knex";
import { glossary } from "../../core/15-glossary";
import { WORKSPACE } from "./150-v-logistique-chapters";

export const DATABASE = '895ec967-fa3b-4710-82e7-b406e62f657d';

export const TABLES = {
  BICYCLE: {
    ID: '163c21e6-5339-4748-903f-8c77e21314cf',
    COLUMNS: {

    }
  },
  PERSON: {
    ID: 'bb145d9f-0976-419d-9fef-bc15799d1624',
    COLUMNS: {

    }
  },
  MORIO_TRACER: {
    ID: '3370bb91-c699-4f77-a970-ad574649915c',
    COLUMNS: {
      REF: '608a747b-efa3-4c1b-8462-a2df168c33ed',
      STATUS: 'ec342569-2bd3-45f5-8277-13f41456e15f'
    }
  },
  MORIO_TRACER_DATA: {
    ID: 'c9c56cf2-3a20-40f1-9226-03618d255339',
    COLUMNS: {
      REF: 'e4f21669-9203-4167-85c7-252a17a637ae',
      BEGIN: 'c5461455-75b3-4ef9-a4be-9e9151c60725',
      END: '82afb76b-1afb-4cc7-ab39-e499064b7360',
      VALUE: 'f5a2692d-b1fe-4cd6-8678-33f42a7cc2ef'
    }
  }

}

export async function seed(knex: Knex): Promise<any> {
  /**
   * Database
   */
  await knex("database").insert([{
    id: DATABASE,
    text: 'Base principale',
    workspace_id: WORKSPACE
  }])

  /**
   * Tables
   */
  /**
   * Table Traceurs Morio
   */
  await knex("table").insert([{
    id: TABLES.MORIO_TRACER.ID,
    text: 'Traceurs Morio',
    database_id: DATABASE
  }, {
    id: TABLES.MORIO_TRACER_DATA.ID,
    text: 'Métriques traceurs Morio',
    database_id: DATABASE
  }])

  await knex("table_column").insert([{
    id: TABLES.MORIO_TRACER.COLUMNS.REF,
    text: 'Référence',
    table_id: TABLES.MORIO_TRACER.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.MORIO_TRACER.COLUMNS.STATUS,
    text: 'Statut',
    table_id: TABLES.MORIO_TRACER.ID,
    column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
    settings: {
      values: [{
        id: 'd426861f-162e-4cba-bd13-50152f2d665a',
        value: 'VOLÉ'
      }, {
        id: '82084b79-e523-4a04-9623-2d303a10c0a9',
        value: 'EN COURS DE MONTAGE'
      }, {
        id: 'a2d10d77-35bc-437f-ac26-3298229b56ed',
        value: 'FONCTIONNEL'
      }]
    }
  }, {
    id: TABLES.MORIO_TRACER_DATA.COLUMNS.REF,
    text: 'Référence',
    table_id: TABLES.MORIO_TRACER_DATA.ID,
    column_type_id: glossary.COLUMN_TYPE.RELATION_BETWEEN_TABLES,
    settings: {
      tableId: TABLES.MORIO_TRACER.ID
    }
  }, {
    id: TABLES.MORIO_TRACER_DATA.COLUMNS.BEGIN,
    text: 'Début de période',
    table_id: TABLES.MORIO_TRACER_DATA.ID,
    column_type_id: glossary.COLUMN_TYPE.DATE
  }, {
    id: TABLES.MORIO_TRACER_DATA.COLUMNS.END,
    text: 'Fin de période',
    table_id: TABLES.MORIO_TRACER_DATA.ID,
    column_type_id: glossary.COLUMN_TYPE.DATE
  }, {
    id: TABLES.MORIO_TRACER_DATA.COLUMNS.VALUE,
    text: 'Valeur',
    table_id: TABLES.MORIO_TRACER_DATA.ID,
    column_type_id: glossary.COLUMN_TYPE.NUMBER
  }])

  /**
   * Table Personne
   */
  await knex("table").insert([{
    id: TABLES.PERSON.ID,
    text: 'Personne',
    database_id: DATABASE
  }])
  await knex("table_column").insert([{
    id: 'c5fde1df-7f65-4422-a852-d8f8e963ce2b',
    text: 'Nom',
    table_id: TABLES.PERSON.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: '193cd4d8-e9a9-4492-a2f4-5b0a9ebe7360',
    text: 'Prénom',
    table_id: TABLES.PERSON.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: 'b49eb157-b150-4d2e-84b3-ae74e4ba99b1',
    text: 'Utilisateur corrélé',
    table_id: TABLES.PERSON.ID,
    column_type_id: glossary.COLUMN_TYPE.USER
  }])

  /**
   * Table Fournisseur
   */
  await knex("table").insert([{
    id: 'a7a05fec-be28-4876-b158-6b96d10d8e2b',
    text: 'Fournisseur',
    database_id: DATABASE
  }])
  await knex("table_column").insert([{
    id: '17ab6b13-5412-483e-ac7d-a9add38225f1',
    text: 'Nom fournisseur',
    table_id: 'a7a05fec-be28-4876-b158-6b96d10d8e2b',
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: 'bf0da601-527b-434c-b5b7-fc25e370fe36',
    text: 'Utilisateur corrélé',
    table_id: 'a7a05fec-be28-4876-b158-6b96d10d8e2b',
    column_type_id: glossary.COLUMN_TYPE.USER
  }])

  /**
   * Table Vélo
   */
  await knex("table").insert([{
    id: TABLES.BICYCLE.ID,
    text: 'Vélo',
    database_id: DATABASE
  }, {
    id: '7b9f0bef-f40d-4360-b244-767e44855cb0',
    text: 'Affectation vélo - bénéficiaire',
    database_id: DATABASE
  }])
  await knex("table_column").insert([{
    id: 'e065323c-1151-447f-be0f-6d2728117b38',
    text: 'Nom du vélo',
    table_id: TABLES.BICYCLE.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: 'b712959e-3808-4bbc-b86e-17ab2ded8c6d',
    text: 'Identité',
    table_id: TABLES.BICYCLE.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: '3a659ea1-446f-4755-8db9-583a204279cc',
    text: 'État du vélo',
    table_id: TABLES.BICYCLE.ID,
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
    table_id: TABLES.BICYCLE.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: '80780a95-d709-43ec-b4f3-d6b5cb5dd31e',
    text: 'Entretien',
    table_id: TABLES.BICYCLE.ID,
    column_type_id: 2
  }, {
    id: '14a772f2-c161-4931-a8e5-bfb3acaaf42d',
    text: 'Mise en service',
    table_id: TABLES.BICYCLE.ID,
    column_type_id: 2
  }, {
    id: '360a9a83-d046-4b64-a39e-944d2bfbd9c5',
    text: 'Bénéficiaire',
    table_id: TABLES.BICYCLE.ID,
    column_type_id: glossary.COLUMN_TYPE.USER,
    settings: {
      tableId: TABLES.PERSON.ID
    }
  }, {
    id: 'bde4bbbd-2584-447f-acff-f434f53619da',
    text: 'Fournisseur',
    table_id: TABLES.BICYCLE.ID,
    column_type_id: glossary.COLUMN_TYPE.USER
  }, {
    id: '6c9016a3-6b87-462d-893f-845b80380dfd',
    text: 'Traceur',
    table_id: TABLES.BICYCLE.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: 'f114393e-eece-4e8f-8893-7c31dde09690',
    text: 'Derniers kms',
    table_id: TABLES.BICYCLE.ID,
    column_type_id: glossary.COLUMN_TYPE.LOOKED_UP_COLUMN
  }])

};
