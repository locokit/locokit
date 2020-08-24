export const DATABASE = '895ec967-fa3b-4710-82e7-b406e62f657d'

export const TABLES = {
  BENEFICIAIRE_BICYCLE: {
    ID: '163c21e6-5339-4748-903f-8c77e21314cf',
    COLUMNS: {
      TYPE: '520d890a-3547-4b01-b9b9-8d089eb89db6',
      IDENTITY: 'dcea9b9a-da47-4c80-ba0f-89df455dbe87',
      STATUS: '191bae3b-e28e-4dbd-a55d-c3a76e10c32f',
      BRAND: 'cf8ea6ec-8b5c-4456-b741-62ec9957a817',
      COMMISSIONING_DATE: '438862d6-6134-482d-b5cc-0f4f74d051bf',
      MAINTENANCE_DATE: 'd8b4254e-4366-4875-b5cd-bdb3ae708519',
      LAST_TRACER_DATA: 'ea73b16b-9910-441a-bcef-b3c0a31b22c4',
      ALERT: 'a9ed9ed7-cc74-4f9a-8173-87fc023b82c0',
    },
  },
  BENEFICIAIRE_AWARENESS: {
    ID: '21f51f85-ac4f-4b29-b70a-8e4fdfc32156',
    COLUMNS: {
      TYPE: '09edd804-e528-4127-8780-2ebf3601d0ec',
      INSTITUTION: '59fe729e-d6be-4533-b00c-870ee931696e',
      TRAINER: 'e4451b45-0ba6-4914-97cb-d53101ebbc2f',
      FILE: 'e402a93d-07b3-45cd-ba13-f50807b09996',
      DATE: '482455fd-8224-48fd-a661-c8085184a8b0',
    },
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
  PROVIDER_MAINTENANCE_PREVENTIVE_BIKE: {
    ID: 'aea1c6c7-1c83-4dec-adaa-2fc6563af9ab',
    COLUMNS: {
      TYPE: '416e0619-5bc7-42c4-a22f-78dd8ace9603',
      IDENTITY: '3d0ba54e-c07e-4a72-ba19-81a610ae4fc2',
      STATUS: 'b69cec56-f9f2-4dcf-beef-f7a4fdf38b72',
      RECIPIENT: '0b933f1d-d883-4a9d-884c-0573ac3e1b20',
      MAINTENANCE_DATE: 'e2784b4d-26ee-45de-a48b-5a8ad8ac350c',
      TECHNICIAN: 'dfce339f-c521-4ac1-9b05-88229c1110cb',
      MAINTENANCE_STEP: '8c4ecfb8-aec6-4162-b8b3-d145abaee993',
    }
  },
  PROVIDER_MAINTENANCE_CURATIVE_BIKE: {
    ID: '8af67e32-14d8-4401-83e7-3f3720207b40',
    COLUMNS: {
      TYPE: '678fb5f3-1cc0-4151-82dd-40aece850565',
      IDENTITY: '71647569-caa3-4a4d-88ac-94188aed140f',
      STATUS: '0cc5550b-8ca6-4c86-9b8e-8ebc6d305c29',
      MAINTENANCE_DATE: '595f2c0f-967b-4a6b-97ce-852d782fd223',
      RECIPIENT: '2bc5c026-9407-4115-9280-996c5becabba',
    }
  },
  VLO_STOCK_1: {
    ID: '291ef2e2-9360-493f-b007-5bd12c3dd4fb',
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
  VLO_STOCK_2: {
    ID: 'a7a05fec-be28-4876-b158-6b96d10d8e2b',
    COLUMNS: {
      NAME: '17ab6b13-5412-483e-ac7d-a9add38225f1',
      USER: 'bf0da601-527b-434c-b5b7-fc25e370fe36'
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
