export const DATABASE_ID = '895ec967-fa3b-4710-82e7-b406e62f657d'

export const TABLES = {
  // MORIO
  MORIO_TRACER: {
    ID: '3370bb91-c699-4f77-a970-ad574649915c',
    COLUMNS: {
      REF: '608a747b-efa3-4c1b-8462-a2df168c33ed',
      STATUS: 'ec342569-2bd3-45f5-8277-13f41456e15f'
    },
    DATA: {
      STATUS_STOLEN: '02876cfc-293e-4447-8c4f-c39cc4341442',
      STATUS_INPROGRESS: '0ec63580-8617-49bc-93b6-92d6f782ef55',
      STATUS_WORKING: '2ba34d39-73bf-4096-a1e3-5f00e32bbaba'
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
  },

  PROVIDER: {
    REQUEST: {
      ID: '59784479-ea06-4d10-a6ce-c9b863c9a995',
      COLUMNS: {
        SOCIETY: 'f6f06500-d187-4ad9-9def-abd97fd75861',
        PERSON: '79044be1-cf13-40ca-9211-e3c43fcf4603',
        STATUS: 'e68a42ed-10e4-4cfd-9d42-b52f065f9370',
        NUM_REQUEST: '77a5b38c-411d-4572-a5c3-e3acae8ef4bc',
        ADDRESS: '58db1cbf-12b0-422e-a9bb-725e86857e81',
        LOT: '002aed07-055b-4e2d-8dbe-e71ebd64e8fb',
        NB_VAE: '9cc3ddc3-74cd-4ea8-8b25-482cd06a31e1',
        NB_VCAE_BI: 'a9d0f78d-a072-4631-aea7-37e1e10145f1',
        NB_VCAE_TRI: '9fbc5213-0072-443c-9d81-8415197bc6a9'
      }
    },
    FLEET_BIKE: {
      ID: 'b87f2bea-82c5-4cd5-9167-7deb587538a8',
      COLUMNS: {
        TYPE: '697276ff-a3d2-4e5d-bf1c-ae54edea74cf',
        IDENTITY: '0217985c-7db9-409b-b364-ea887e9b1f24',
        BRAND: 'a52653af-72a4-444f-b01e-abfae9405537',
        STATUS: '6fa623ad-6a79-4631-a826-05f143e8c584',
        MAINTENANCE_DATE: '69b82396-3fc3-46da-813a-d6dd81ed648c',
        DELIVERY_ESTIMATED_DATE: '66874e11-5bcb-42f4-ba76-7e999462d746',
        PROVIDER: 'de10bc0e-b4ed-4543-86ea-f7acbdd20ede',
        RECIPIENT: '6d3b224c-c21c-4fb1-bd10-d05f150b2052'
      }
    },
    MAINTENANCE_PREVENTIVE_BIKE: {
      ID: 'aea1c6c7-1c83-4dec-adaa-2fc6563af9ab',
      COLUMNS: {
        TYPE: '416e0619-5bc7-42c4-a22f-78dd8ace9603',
        IDENTITY: '3d0ba54e-c07e-4a72-ba19-81a610ae4fc2',
        STATUS: 'b69cec56-f9f2-4dcf-beef-f7a4fdf38b72',
        RECIPIENT: '0b933f1d-d883-4a9d-884c-0573ac3e1b20',
        MAINTENANCE_DATE: 'e2784b4d-26ee-45de-a48b-5a8ad8ac350c',
        TECHNICIAN: 'dfce339f-c521-4ac1-9b05-88229c1110cb',
        MAINTENANCE_STEP: '8c4ecfb8-aec6-4162-b8b3-d145abaee993'
      }
    },
    MAINTENANCE_CURATIVE_BIKE: {
      ID: '8af67e32-14d8-4401-83e7-3f3720207b40',
      COLUMNS: {
        TYPE: '678fb5f3-1cc0-4151-82dd-40aece850565',
        IDENTITY: '71647569-caa3-4a4d-88ac-94188aed140f',
        INCIDENT: '0cc5550b-8ca6-4c86-9b8e-8ebc6d305c29',
        MAINTENANCE_DATE: '595f2c0f-967b-4a6b-97ce-852d782fd223',
        RECIPIENT: '2bc5c026-9407-4115-9280-996c5becabba'
      }
    }
  },
  RECIPIENT: {
    USING_BIKE: {
      ID: '163c21e6-5339-4748-903f-8c77e21314cf',
      COLUMNS: {
        TYPE: '520d890a-3547-4b01-b9b9-8d089eb89db6',
        IDENTITY: 'dcea9b9a-da47-4c80-ba0f-89df455dbe87',
        STATUS: '191bae3b-e28e-4dbd-a55d-c3a76e10c32f',
        BRAND: 'cf8ea6ec-8b5c-4456-b741-62ec9957a817',
        COMMISSIONING_DATE: '438862d6-6134-482d-b5cc-0f4f74d051bf',
        MAINTENANCE_DATE: 'd8b4254e-4366-4875-b5cd-bdb3ae708519',
        LAST_TRACER_DATA: 'ea73b16b-9910-441a-bcef-b3c0a31b22c4',
        ALERT: 'a9ed9ed7-cc74-4f9a-8173-87fc023b82c0'
      }
    },
    AWARENESS_FORMATION: {
      ID: '21f51f85-ac4f-4b29-b70a-8e4fdfc32156',
      COLUMNS: {
        TYPE: '09edd804-e528-4127-8780-2ebf3601d0ec',
        INSTITUTION: '59fe729e-d6be-4533-b00c-870ee931696e',
        TRAINER: 'e4451b45-0ba6-4914-97cb-d53101ebbc2f',
        FILE: 'e402a93d-07b3-45cd-ba13-f50807b09996',
        DATE: '482455fd-8224-48fd-a661-c8085184a8b0'
      }
    }
  },
  VLO: {
    STOCK_BIKE: {
      ID: '291ef2e2-9360-493f-b007-5bd12c3dd4fb',
      COLUMNS: {
        TYPE: 'e065323c-1151-447f-be0f-6d2728117b38',
        REF: 'b712959e-3808-4bbc-b86e-17ab2ded8c6d',
        STATUS: '3a659ea1-446f-4755-8db9-583a204279cc',
        BRAND: '1c4c27e9-ed7f-4c1c-b472-b8906a9ce9d7',
        REQUEST: '0ca5db3a-1db6-45c1-8f19-13127e9afe1c',
        MAINTENANCE_DATE: '80780a95-d709-43ec-b4f3-d6b5cb5dd31e',
        COMMISSIONING_DATE: '14a772f2-c161-4931-a8e5-bfb3acaaf42d',
        DELIVERY_ESTIMATED_DATE: 'b6c50d68-5979-46c8-8349-514fc1ba35fd',
        PERSON: 'f3d0b1e2-7ca8-4182-a7b5-998ca53f1f3d',
        PROVIDER: 'bde4bbbd-2584-447f-acff-f434f53619da',
        LOT: '1a0c3a02-2fcc-45fc-8cdd-8d46d4e98d63',
        TRACER: 'bbb35cac-87ae-4bb3-b9d9-64850b42fddb',
        LAST_TRACER_DATA: 'f114393e-eece-4e8f-8893-7c31dde09690'
      },
      DATA: {
        STATUS_STORED: '39b01a75-b03f-4b4b-bf05-36aac13a72b2',
        STATUS_IN_USE: '82cf06d0-4743-4716-8f97-072b968e0caf',
        STATUS_IN_MAINTENANCE: 'a00cdeb5-47b2-4a60-8e35-6b0f94ba3983'
      }
    },
    LIST_PRE_RECIPIENT: {
      ID: 'bb145d9f-0976-419d-9fef-bc15799d1624',
      COLUMNS: {
        SOCIETY: '8147e8f7-295a-49cb-ba34-f658e4adbe20',
        USER: 'c9be1ef3-e24c-40c8-ace3-ea4bf99f8406',
        STATUS: 'dc08d418-5c46-4a7a-96c4-3a5d58bb75e6',
        NUM_REQUEST: 'e4018570-187d-47ea-8d6d-bd5c31f7fa19',
        EMAIL: '0d98836d-e816-477d-a673-cc380892dd7f',
        PHONE: 'da23463c-0388-4b65-be42-3df51f10d24a',
        ADDRESS: '3c885d4e-8af2-46d0-9b96-a2c638959da2',
        LOT: 'e7b260ff-ec78-433f-b904-72d0b4f8e50c',
        APE: '5379abac-c48d-4a53-8fd2-76f2894a9ac5',
        NB_VAE: 'ce5daa1d-9d8a-472f-a9b3-e36f4be4fa87',
        NB_VCAE_BI: 'dff703a1-22d5-45c6-a47f-2fae756a0102',
        NB_VCAE_TRI: '39e3875b-6cbc-4abb-83e9-f71d30f62a22'
      }
    },
    LIST_RECIPIENT: {
      ID: 'cde1ffb0-f6ad-4449-821b-834e941e5246',
      COLUMNS: {
        SOCIETY: 'f8c073ce-54fa-4071-b7fa-f46f57ef3235',
        USER: 'f44d756a-a05c-447a-9c4c-e1268fca746f',
        STATUS: '065c3b17-a6f2-44f3-bef0-8d1e547d31cf',
        NUM_REQUEST: '579cb91f-83f7-49f9-b078-40d6dc72171b',
        EMAIL: '996c503a-dc52-46a6-86bd-60aec86839b4',
        PHONE: '6eb9c7ae-6e77-495e-b7bc-9a3595e51737',
        ADDRESS: 'a125f5fd-a18f-414b-880f-f47c33672a20',
        LOT: '0a59aa94-326f-4530-846b-c36eba3e1e14',
        APE: '777adf39-d8ae-4343-9e2e-2df6c1f55c4e',
        NB_VAE: '14410188-b293-4fd9-9f25-d1d51ebcf561',
        NB_VCAE_BI: 'd5f7b848-547f-4e7f-9e39-f3c1215367d4',
        NB_VCAE_TRI: '035a68cc-3ca7-4aa3-b70e-9e454c7fb516'
      }
    },
    ROZO_REQUEST: {
      ID: '056b065a-31f7-4408-9ce6-db6e1f1ef65e',
      COLUMNS: {
        NAME: '7a9c6160-e069-11ea-87d0-0242ac130003',
        TYPE: 'b95a6a20-e06c-11ea-87d0-0242ac130003',
        NUM_REQUEST: 'c3c22e08-e06c-11ea-87d0-0242ac130003',
        DATE_REQUEST: '6c20ca98-e08e-11ea-87d0-0242ac130003',
        STEP: 'c9d0980c-e06c-11ea-87d0-0242ac130003',
        STATUS: 'ce540512-e06c-11ea-87d0-0242ac130003'
      }
    },
    LIST_PROVIDER: {
      ID: 'a7a05fec-be28-4876-b158-6b96d10d8e2b',
      COLUMNS: {
        NAME: '17ab6b13-5412-483e-ac7d-a9add38225f1',
        USER: 'bf0da601-527b-434c-b5b7-fc25e370fe36'
      }
    },
    MORIO: {
      ID: 'caeae34a-0520-47cb-bc4a-fc4c0ace377d',
      COLUMNS: {
        USER: 'a54e65c6-7752-495b-b4ec-6ea3b39e6e18',
        TYPE: '918f8305-10b9-4f51-98d8-73cea5cb6f91',
        NUM_REQUEST: '541bfb5b-6658-40b1-a0f6-958413a02273',
        NUM_TRACER: '5dd0a1a9-a4a4-46d1-83b7-607f84e86828',
        STATUS: '8b9b3886-1788-44b9-b57c-05597a54647b'
      }
    },
    FORMATION: {
      ID: '005c641c-7480-44e6-9df6-96caf7b63086',
      COLUMNS: {
        USER: '2bd806de-34ce-4426-93e6-70138cb4c0da',
        FILE: '805d12e7-95c8-4ed7-bc47-7016710aaf7c',
        DATE: 'd2cdc762-8884-4194-80b3-47dfaf9d852a',
        RATING: '7e126aae-5235-4956-b4aa-0b104683e3ec'
      }
    }
  },
  ROZO: {
    FOLDER: {
      ID: '5d148903-59a8-4c69-a4e6-cbdd7026d8c5',
      COLUMNS: {
        SOCIETY: '20e2f25f-ef4f-4443-b9ed-8b6d157bb215',
        STATUS_PERSON: 'd0d13392-bbbf-48d5-895b-b793e9443abd',
        STATUS_FOLDER: '2fb0a1f6-e034-4198-adc2-00fa4c53728a',
        NUM_REQUEST: '167ff97f-95cb-4829-887c-4f9e4cb5235c',
        STEP: '86425d13-f3fc-4118-a315-1182c2e13620',
        STATUS_PROGRAM: '3e71a85a-3679-4e5a-ba71-631bf236425b',
        NB_BIKE: '8c40d255-e881-4400-99e5-59bba781e324'
      }
    },
    BIKE: {
      ID: '93100fff-3111-46ab-8aa6-d09e5478c24a',
      COLUMNS: {
        SOCIETY: 'b04ad135-95a6-4c3d-84ab-612c18dd8ca2',
        NB_BIKE: '6d7014ef-e77b-4acb-8142-423efb14f2b6',
        PERIOD: '86b856ac-665d-47d1-b141-41594a24d432',
        STATUS: '9e42040d-2159-4265-9333-dcde50521b56',
        PROVIDER: '3d7ce799-95ad-4eca-9c7d-7945e2d4d89d'
      }
    }
  },
  MORIO: {
    INCIDENT: {
      ID: 'd8240bed-aaa1-4156-9a63-9992a9269149',
      COLUMNS: {
        SOCIETY: '287bea3c-76cd-451d-bbc3-69d335e2a6f7',
        TYPE: '5bdefabe-2c54-4f7f-bae4-c913dccb5a6e',
        STATUS: '11ab89f5-2c07-40b6-a8fe-04a89b602120',
        INCIDENT: 'faae048d-403b-4818-922a-5731131f3143',
        DATE: '289a1ab1-7403-40d9-8b77-66b73d19c120'
      }
    },
    TRACER: {
      ID: '83ef9a56-3c2a-4a8f-8d14-71888ec7ff48',
      COLUMNS: {
        SOCIETY: '7daaa386-733c-4c38-bfe0-08d15cb95ed0',
        TYPE: 'a2c2de3f-800a-4066-9441-143f12e62574',
        STATUS: '289ca200-7fd7-4b84-a664-5ce5b46d8a72',
        TRACER: '08a0f9c6-08b4-4ce4-a2c6-1633f88a2bd5',
        DATE_BEGIN: '38e9229e-aac9-4ff6-8a34-508ca783215f'
      }
    }
  },
  FUB: {
    FORMATION: {
      ID: 'c13dbbf2-75f2-4a38-b139-2c6eb4d3f14c',
      COLUMNS: {
        SOCIETY: 'af4e69d5-c4ba-4217-9fb0-52cf17c2fc4a',
        TYPE: '445c9aa8-4858-4b14-8e51-41df77cef823',
        FORMATION: 'b6ee611d-3878-4b2d-9ccc-fead1a9f3b4f',
        DATE: 'f14d044b-fa6b-4cbb-9ffe-49fde1dac34e'
      }
    }
  },

}

export async function seed (): Promise<any> {
}
