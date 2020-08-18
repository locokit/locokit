import * as Knex from 'knex'
import { glossary } from '../../core/15-glossary'
import { WORKSPACE } from './150-v-logistique-chapters'

export const DATABASE = '895ec967-fa3b-4710-82e7-b406e62f657d'

export const TABLES = {
  PROVIDER: {
    ID: 'a7a05fec-be28-4876-b158-6b96d10d8e2b',
    COLUMNS: {
      NAME: '17ab6b13-5412-483e-ac7d-a9add38225f1',
      USER: 'bf0da601-527b-434c-b5b7-fc25e370fe36'
    }
  },
  BICYCLE: {
    ID: '163c21e6-5339-4748-903f-8c77e21314cf',
    COLUMNS: {
      TRACER: 'bbb35cac-87ae-4bb3-b9d9-64850b42fddb',
      REQUEST: '0ca5db3a-1db6-45c1-8f19-13127e9afe1c',
      PERSON: 'f3d0b1e2-7ca8-4182-a7b5-998ca53f1f3d',
      NAME: 'e065323c-1151-447f-be0f-6d2728117b38',
      REF: 'b712959e-3808-4bbc-b86e-17ab2ded8c6d',
      STATUS: '3a659ea1-446f-4755-8db9-583a204279cc',
      BRAND: '1c4c27e9-ed7f-4c1c-b472-b8906a9ce9d7',
      MAINTENANCE_DATE: '80780a95-d709-43ec-b4f3-d6b5cb5dd31e',
      COMMISSIONING_DATE: '14a772f2-c161-4931-a8e5-bfb3acaaf42d',
      DELIVERY_ESTIMATED_DATE: 'b6c50d68-5979-46c8-8349-514fc1ba35fd',
      PROVIDER: 'bde4bbbd-2584-447f-acff-f434f53619da',
      LAST_TRACER_DATA: 'f114393e-eece-4e8f-8893-7c31dde09690',
    },
    DATA: {
      STATUS_STORED: '39b01a75-b03f-4b4b-bf05-36aac13a72b2',
      STATUS_IN_USE: '82cf06d0-4743-4716-8f97-072b968e0caf',
      STATUS_IN_MAINTENANCE: 'a00cdeb5-47b2-4a60-8e35-6b0f94ba3983',
    }
  },
  ROZO_REQUEST: {
    ID: '056b065a-31f7-4408-9ce6-db6e1f1ef65e',
    COLUMNS: {
      NAME: '7a9c6160-e069-11ea-87d0-0242ac130003',
      TYPE: 'b95a6a20-e06c-11ea-87d0-0242ac130003',
      NUM_DEMAND: 'c3c22e08-e06c-11ea-87d0-0242ac130003',
      DATE_DEMAND: '6c20ca98-e08e-11ea-87d0-0242ac130003',
      STEP: 'c9d0980c-e06c-11ea-87d0-0242ac130003',
      STATUS: 'ce540512-e06c-11ea-87d0-0242ac130003',
    }
  },
  PROVIDER_FLEET_BIKE: {
    ID: 'b87f2bea-82c5-4cd5-9167-7deb587538a8',
    COLUMNS: {
      TYPE: '697276ff-a3d2-4e5d-bf1c-ae54edea74cf',
      IDENTITY: '0217985c-7db9-409b-b364-ea887e9b1f24',
      BRAND: 'a52653af-72a4-444f-b01e-abfae9405537',
      STATUS: '6fa623ad-6a79-4631-a826-05f143e8c584',
      MAINTENANCE_DATE: '69b82396-3fc3-46da-813a-d6dd81ed648c',
      DELIVERY_ESTIMATED_DATE: '66874e11-5bcb-42f4-ba76-7e999462d746',
      PROVIDER: 'de10bc0e-b4ed-4543-86ea-f7acbdd20ede',
      RECIPIENT: '6d3b224c-c21c-4fb1-bd10-d05f150b2052',
    }
  },
  PERSON: {
    ID: 'bb145d9f-0976-419d-9fef-bc15799d1624',
    COLUMNS: {
      LASTNAME: 'c5fde1df-7f65-4422-a852-d8f8e963ce2b',
      FIRSTNAME: '193cd4d8-e9a9-4492-a2f4-5b0a9ebe7360',
      USER: 'b49eb157-b150-4d2e-84b3-ae74e4ba99b1',
    }
  },
  REQUEST: {
    ID: 'b63b7008-5140-4eff-b89e-e73ce3ccea63',
    COLUMNS: {
      PERSON: '885719e3-ddda-441b-9b67-3ab99c90e8cd',
      CREATION_DATE: 'cd6aec18-b942-4cf8-a1f9-d3677b773a9d',
      NB_VAE: '557be004-a527-4981-8fa7-66d1ea810df0',
      NB_VCAE_BI: 'f525f934-1115-414b-88fc-4b9591491cf5',
      NB_VCAE_TRI: '85c9ffd5-5c47-4c5f-b729-fc9ad33c1eb4',
    }
  },
  MORIO_TRACER: {
    ID: '3370bb91-c699-4f77-a970-ad574649915c',
    COLUMNS: {
      REF: '608a747b-efa3-4c1b-8462-a2df168c33ed',
      STATUS: 'ec342569-2bd3-45f5-8277-13f41456e15f'
    },
    DATA: {
      STATUS_STOLEN: '02876cfc-293e-4447-8c4f-c39cc4341442',
      STATUS_INPROGRESS: '0ec63580-8617-49bc-93b6-92d6f782ef55',
      STATUS_WORKING: '2ba34d39-73bf-4096-a1e3-5f00e32bbaba',
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

export async function seed (knex: Knex): Promise<any> {
  /**
   * Database
   */
  await knex('database').insert([
    {
      id: DATABASE,
      text: 'Base principale',
      workspace_id: WORKSPACE
    }
  ])

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
      values: {
        [TABLES.MORIO_TRACER.DATA.STATUS_STOLEN]: {
          label: 'VOLÉ',
          color: '#c63737',
          backgroundColor: '#ffcdd2'
        },
        [TABLES.MORIO_TRACER.DATA.STATUS_INPROGRESS]: {
          label: 'EN COURS DE MONTAGE',
          color: '#23547b',
          backgroundColor: '#b3e5fc'
        },
        [TABLES.MORIO_TRACER.DATA.STATUS_WORKING]: {
          label: 'FONCTIONNEL',
          color: '#256029',
          backgroundColor: '#c8e6c9'
        },
      }
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
    id: TABLES.PERSON.COLUMNS.LASTNAME,
    text: 'Nom',
    table_id: TABLES.PERSON.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.PERSON.COLUMNS.FIRSTNAME,
    text: 'Prénom',
    table_id: TABLES.PERSON.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.PERSON.COLUMNS.USER,
    text: 'Utilisateur corrélé',
    table_id: TABLES.PERSON.ID,
    column_type_id: glossary.COLUMN_TYPE.USER
  }])

  /**
   * Table Fournisseur
   */
  await knex("table").insert([{
    id: TABLES.PROVIDER.ID,
    text: 'Fournisseur',
    database_id: DATABASE
  }])
  await knex("table_column").insert([{
    id: TABLES.PROVIDER.COLUMNS.NAME,
    text: 'Nom fournisseur',
    table_id: TABLES.PROVIDER.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.PROVIDER.COLUMNS.USER,
    text: 'Utilisateur corrélé',
    table_id: TABLES.PROVIDER.ID,
    column_type_id: glossary.COLUMN_TYPE.USER
  }])

  /**
   * Table demande
   */
  await knex("table").insert([{
    id: TABLES.REQUEST.ID,
    text: 'Demande',
    database_id: DATABASE
  }])
  await knex("table_column").insert([{
    id: TABLES.REQUEST.COLUMNS.PERSON,
    text: 'Personne à l\'origine de la demande',
    table_id: TABLES.REQUEST.ID,
    column_type_id: glossary.COLUMN_TYPE.RELATION_BETWEEN_TABLES,
    settings: {
      tableId: TABLES.PERSON.ID
    }
  }, {
    id: TABLES.REQUEST.COLUMNS.CREATION_DATE,
    text: 'Date de la demande',
    table_id: TABLES.REQUEST.ID,
    column_type_id: glossary.COLUMN_TYPE.DATE
  }, {
    id: TABLES.REQUEST.COLUMNS.NB_VAE,
    text: 'Nombre de VAE',
    table_id: TABLES.REQUEST.ID,
    column_type_id: glossary.COLUMN_TYPE.NUMBER
  }, {
    id: TABLES.REQUEST.COLUMNS.NB_VCAE_BI,
    text: 'Nombre de VCAE Bi-porteur',
    table_id: TABLES.REQUEST.ID,
    column_type_id: glossary.COLUMN_TYPE.NUMBER
  }, {
    id: TABLES.REQUEST.COLUMNS.NB_VCAE_TRI,
    text: 'Nombre de VAE Tri-porteur',
    table_id: TABLES.REQUEST.ID,
    column_type_id: glossary.COLUMN_TYPE.NUMBER
  }])

  /**
   * Table Vélo
   */
  await knex("table").insert([{
    id: TABLES.BICYCLE.ID,
    text: 'Vélo',
    database_id: DATABASE
  }])
  await knex("table_column").insert([{
    id: TABLES.BICYCLE.COLUMNS.NAME,
    text: 'Nom du vélo',
    table_id: TABLES.BICYCLE.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.BICYCLE.COLUMNS.REF,
    text: 'Identité',
    table_id: TABLES.BICYCLE.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.BICYCLE.COLUMNS.STATUS,
    text: 'État du vélo',
    table_id: TABLES.BICYCLE.ID,
    column_type_id: 9,
    settings: {
      values: {
        [TABLES.BICYCLE.DATA.STATUS_IN_MAINTENANCE]: {
          label: 'En maintenance',
          color: '#23547b',
          backgroundColor: '#b3e5fc'
        },
        [TABLES.BICYCLE.DATA.STATUS_IN_USE]: {
          label: 'En utilisation',
          color: '#256029',
          backgroundColor: '#c8e6c9'
        },
        [TABLES.BICYCLE.DATA.STATUS_STORED]: {
          label: 'Stocké',
          color: '#805b36',
          backgroundColor: '#ffd8b2'
        }
      }
    },
  }, {
    id: TABLES.BICYCLE.COLUMNS.BRAND,
    text: 'Marque',
    table_id: TABLES.BICYCLE.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.BICYCLE.COLUMNS.MAINTENANCE_DATE,
    text: 'Entretien',
    table_id: TABLES.BICYCLE.ID,
    column_type_id: glossary.COLUMN_TYPE.DATE
  }, {
    id: TABLES.BICYCLE.COLUMNS.COMMISSIONING_DATE,
    text: 'Mise en service',
    table_id: TABLES.BICYCLE.ID,
    column_type_id: glossary.COLUMN_TYPE.DATE
  }, {
    id: TABLES.BICYCLE.COLUMNS.DELIVERY_ESTIMATED_DATE,
    text: 'Date de livraison prévue',
    table_id: TABLES.BICYCLE.ID,
    column_type_id: glossary.COLUMN_TYPE.DATE
  }, {
    id: TABLES.BICYCLE.COLUMNS.PERSON,
    text: 'Bénéficiaire',
    table_id: TABLES.BICYCLE.ID,
    column_type_id: glossary.COLUMN_TYPE.USER,
    settings: {
      tableId: TABLES.PERSON.ID
    }
  }, {
    id: TABLES.BICYCLE.COLUMNS.PROVIDER,
    text: 'Fournisseur',
    table_id: TABLES.BICYCLE.ID,
    column_type_id: glossary.COLUMN_TYPE.USER
  }, {
    id: TABLES.BICYCLE.COLUMNS.TRACER,
    text: 'Traceur',
    table_id: TABLES.BICYCLE.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.BICYCLE.COLUMNS.LAST_TRACER_DATA,
    text: 'Derniers kms',
    table_id: TABLES.BICYCLE.ID,
    column_type_id: glossary.COLUMN_TYPE.LOOKED_UP_COLUMN
  }, {
    id: TABLES.BICYCLE.COLUMNS.REQUEST,
    text: 'Demande corrélée',
    table_id: TABLES.BICYCLE.ID,
    column_type_id: glossary.COLUMN_TYPE.RELATION_BETWEEN_TABLES,
    settings: {
      tableId: TABLES.REQUEST.ID
    }
  }])

  // View Fournisseur

  /**
   * Table FLEET BIKE
   */
  await knex('table').insert([
    {
      id: TABLES.PROVIDER_FLEET_BIKE.ID,
      text: 'Vélos',
      database_id: DATABASE
    }
  ])
  await knex('table_column').insert([
    {
      id: TABLES.PROVIDER_FLEET_BIKE.COLUMNS.TYPE,
      text: 'Type',
      table_id: TABLES.PROVIDER_FLEET_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.PROVIDER_FLEET_BIKE.COLUMNS.IDENTITY,
      text: 'Identité',
      table_id: TABLES.PROVIDER_FLEET_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.PROVIDER_FLEET_BIKE.COLUMNS.BRAND,
      text: 'Marque',
      table_id: TABLES.BICYCLE.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.PROVIDER_FLEET_BIKE.COLUMNS.STATUS,
      text: 'État du vélo',
      table_id: TABLES.PROVIDER_FLEET_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
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
      id: TABLES.PROVIDER_FLEET_BIKE.COLUMNS.MAINTENANCE_DATE,
      text: 'Dernier entretien',
      table_id: TABLES.PROVIDER_FLEET_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.DATE,
    }, {
      id: TABLES.PROVIDER_FLEET_BIKE.COLUMNS.DELIVERY_ESTIMATED_DATE,
      text: 'Mise en service',
      table_id: TABLES.PROVIDER_FLEET_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.DATE,
    }, {
      id: TABLES.PROVIDER_FLEET_BIKE.COLUMNS.PROVIDER,
      text: 'Prestataire',
      table_id: TABLES.PROVIDER_FLEET_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.PROVIDER_FLEET_BIKE.COLUMNS.RECIPIENT,
      text: 'Bénéficiaire',
      table_id: TABLES.PROVIDER_FLEET_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.USER,
      settings: {
        tableId: TABLES.PERSON.ID
      }
    }
  ])

  // View V-Logistique

  /**
   * Table Rozo
   */
  await knex('table').insert([
    {
      id: TABLES.ROZO_REQUEST.ID,
      text: 'Rozo',
      database_id: DATABASE
    }
  ])
  await knex('table_column').insert([
    {
      id: TABLES.ROZO_REQUEST.COLUMNS.NAME,
      text: 'Bénéficiaire',
      table_id: TABLES.ROZO_REQUEST.ID,
      column_type_id: glossary.COLUMN_TYPE.USER,
      settings: {
        tableId: TABLES.PERSON.ID
      }
    }, {
      id: TABLES.ROZO_REQUEST.COLUMNS.TYPE,
      text: 'Type',
      table_id: TABLES.ROZO_REQUEST.ID,
      column_type_id: glossary.COLUMN_TYPE.GROUP,
      settings: {
        tableId: TABLES.PERSON.ID
      }
    }, {
      id: TABLES.ROZO_REQUEST.COLUMNS.NUM_DEMAND,
      text: 'Numéro de demande',
      table_id: TABLES.ROZO_REQUEST.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING,
    }, {
      id: TABLES.ROZO_REQUEST.COLUMNS.DATE_DEMAND,
      text: 'Date de demande',
      table_id: TABLES.ROZO_REQUEST.ID,
      column_type_id: glossary.COLUMN_TYPE.DATE,
    }, {
      id: TABLES.ROZO_REQUEST.COLUMNS.STEP,
      text: 'Étape programme',
      table_id: TABLES.ROZO_REQUEST.ID,
      column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
      settings: {
        values: {
          1: {
            label: 'Premier contact',
            color: '#ef1'
          },
          2: {
            label: 'Questionnaire',
            color: '#ef1'
          },
          3: {
            label: 'Entretien téléphonique',
            color: '#ef1'
          },
          4: {
            label: 'Commande vélo&co',
            color: '#ef1'
          },
          5: {
            label: 'Livré',
            color: '#ef1'
          }
        }
      }
    }, {
      id: TABLES.ROZO_REQUEST.COLUMNS.STATUS,
      text: 'État',
      table_id: TABLES.ROZO_REQUEST.ID,
      column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
      settings: {
        values: {
          1: {
            label: 'À faire',
            color: '#ef1'
          },
          2: {
            label: 'En cours',
            color: '#ef1'
          },
          3: {
            label: 'Fait',
            color: '#ef1'
          }
        }
      }
    },
  ])
}
