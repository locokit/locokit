export const DATABASE_ID = '895ec967-fa3b-4710-82e7-b406e62f657d'

export const TABLES = {
  // MORIO
  MORIO_TRACER: {
    ID: '3370bb91-c699-4f77-a970-ad574649915c',
    COLUMNS: {
      REF: '608a747b-efa3-4c1b-8462-a2df168c33ed',
      STATUS: 'ec342569-2bd3-45f5-8277-13f41456e15f',
      BIKE: '08a0f9c6-08b4-4ce4-a2c6-1633f88a2bd5',
      TYPE: 'a2c2de3f-800a-4066-9441-143f12e62574',
      SOCIETY: '7daaa386-733c-4c38-bfe0-08d15cb95ed0',
      DATE_BEGIN: '38e9229e-aac9-4ff6-8a34-508ca783215f',
      PERSON: 'a54e65c6-7752-495b-b4ec-6ea3b39e6e18',
      NUM_REQUEST: '541bfb5b-6658-40b1-a0f6-958413a02273',
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

  // Directory
  PERSON: {
    ID: '20ac37ee-f931-4e84-ba35-4b61301a14e0',
    COLUMNS: {
      FIRST_NAME: 'e6c04798-93a8-4b3e-a3bd-42833cf0c3f6',
      LAST_NAME: 'a20915a9-0420-4bbe-be12-b73f81829a69',
      USER: '3d5681a5-9242-40a7-9e4c-21a6cbd5b5f4',
    }
  },
  PROVIDER: {
    ID: 'a7a05fec-be28-4876-b158-6b96d10d8e2b',
    COLUMNS: {
      NAME: '17ab6b13-5412-483e-ac7d-a9add38225f1',
      GEOZONE: 'bf0da601-527b-434c-b5b7-fc25e370fe36',
      USER: 'da8fdd15-f98e-4853-b685-0847da7450a3'
    }
  },

  // Request bike management
  REQUEST: {
    ID: 'b63b7008-5140-4eff-b89e-e73ce3ccea63',
    COLUMNS: {
      NUM_REQUEST: '77a5b38c-411d-4572-a5c3-e3acae8ef4bc',
      SOCIETY: 'f6f06500-d187-4ad9-9def-abd97fd75861',
      PERSON: '885719e3-ddda-441b-9b67-3ab99c90e8cd',
      ADDRESS: '58db1cbf-12b0-422e-a9bb-725e86857e81',
      // USER: 'c9be1ef3-e24c-40c8-ace3-ea4bf99f8406',
      CREATION_DATE: 'cd6aec18-b942-4cf8-a1f9-d3677b773a9d',
      NB_VAE: '557be004-a527-4981-8fa7-66d1ea810df0',
      NB_VCAE_BI: 'f525f934-1115-414b-88fc-4b9591491cf5',
      NB_VCAE_TRI: '85c9ffd5-5c47-4c5f-b729-fc9ad33c1eb4',
      NB_BIKE: '8c40d255-e881-4400-99e5-59bba781e324',
      STATUS: 'e68a42ed-10e4-4cfd-9d42-b52f065f9370',
      LOT: '002aed07-055b-4e2d-8dbe-e71ebd64e8fb',
      EMAIL: '0d98836d-e816-477d-a673-cc380892dd7f',
      PHONE: 'da23463c-0388-4b65-be42-3df51f10d24a',
      APE: '5379abac-c48d-4a53-8fd2-76f2894a9ac5',
      NAME: '7a9c6160-e069-11ea-87d0-0242ac130003',
      TYPE: 'b95a6a20-e06c-11ea-87d0-0242ac130003',
      // DATE_REQUEST: '6c20ca98-e08e-11ea-87d0-0242ac130003',
      STEP: 'c9d0980c-e06c-11ea-87d0-0242ac130003',
      STATUS_PERSON: 'd0d13392-bbbf-48d5-895b-b793e9443abd',
      STATUS_FOLDER: '2fb0a1f6-e034-4198-adc2-00fa4c53728a',
      STATUS_PROGRAM: '3e71a85a-3679-4e5a-ba71-631bf236425b',
    }
  },
  BIKE_TYPE: {
    ID: '08bfbd1e-5c96-4875-96eb-d1e318645464',
    COLUMNS: {
      NAME: 'b9308956-b125-4eec-bba6-36b452a08bb1',
      TYPE: '7ef11ae2-9c7c-4279-ae28-61e10bd68983',
      NEED_HELMET: 'd4017b33-8a9f-41da-bb58-0cb57e76415c',
      NEED_VEST: 'ef298fe4-7905-4cc1-8774-45212c86f660',
      NEED_BAG: 'a45bc12e-c56f-4b42-9aed-d52764c15f1c',
      BRAND: 'a52653af-72a4-444f-b01e-abfae9405537',
    },
    DATA: {
      TYPE_VAE: '185f575a-fdaf-4b17-b17e-74f17222a2e2',
      TYPE_VCAEBI: 'd4017b33-8a9f-41da-bb58-0cb57e76415c',
      TYPE_VCAETRI: 'ef298fe4-7905-4cc1-8774-45212c86f660'
    }
  },
  BIKE_TYPE_PROVIDER: {
    ID: '7214fb8e-8407-42ae-8942-727adb08e12e',
    COLUMNS: {
      BIKE_TYPE: '6b568894-c96d-477e-8315-96c7efee01d7',
      PROVIDER: 'b82db9e7-d9ad-4ab7-a171-9af409090d0e',
    }
  },
  BIKE: {
    ID: 'b87f2bea-82c5-4cd5-9167-7deb587538a8',
    COLUMNS: {
      REF: 'b712959e-3808-4bbc-b86e-17ab2ded8c6d',
      // IDENTITY: '0217985c-7db9-409b-b364-ea887e9b1f24',
      TYPE: '697276ff-a3d2-4e5d-bf1c-ae54edea74cf',
      BRAND: '2dc75ed7-7e90-4510-bee3-6d953978963a',
      STATUS: '6fa623ad-6a79-4631-a826-05f143e8c584',
      MAINTENANCE_DATE: '69b82396-3fc3-46da-813a-d6dd81ed648c',
      DELIVERY_ESTIMATED_DATE: '66874e11-5bcb-42f4-ba76-7e999462d746',
      COMMISSIONING_DATE: '438862d6-6134-482d-b5cc-0f4f74d051bf',
      PROVIDER: 'de10bc0e-b4ed-4543-86ea-f7acbdd20ede',
      RECIPIENT: '6d3b224c-c21c-4fb1-bd10-d05f150b2052',
      // PERSON: 'f3d0b1e2-7ca8-4182-a7b5-998ca53f1f3d',
      TRACER: 'bbb35cac-87ae-4bb3-b9d9-64850b42fddb',
      LAST_TRACER_DATA: 'ea73b16b-9910-441a-bcef-b3c0a31b22c4',
      ALERT: 'a9ed9ed7-cc74-4f9a-8173-87fc023b82c0',
      REQUEST: '0ca5db3a-1db6-45c1-8f19-13127e9afe1c',
      NUM_REQUEST: '8cf6f374-a028-4721-b645-7ee19cb5a9b8',
      LOT: '1a0c3a02-2fcc-45fc-8cdd-8d46d4e98d63',
      SOCIETY: 'b04ad135-95a6-4c3d-84ab-612c18dd8ca2',
      // NB_BIKE: '6d7014ef-e77b-4acb-8142-423efb14f2b6',
      PERIOD: '86b856ac-665d-47d1-b141-41594a24d432',
    },
    DATA: {
      STATUS_STORED: '39b01a75-b03f-4b4b-bf05-36aac13a72b2',
      STATUS_IN_USE: '82cf06d0-4743-4716-8f97-072b968e0caf',
      STATUS_IN_MAINTENANCE: 'a00cdeb5-47b2-4a60-8e35-6b0f94ba3983'
    }
  },
  GEAR_TYPE: {
    ID: '2943f796-4c28-4dd7-b586-bf505d75ddcd',
    COLUMNS: {
      NAME: 'b2ca9906-d801-458f-b724-cd6c094a22c5',
      TYPE: '24fe4ef3-0977-48ff-87c3-e57ff2244fb2',
      BRAND: '81cd44dd-e4df-4a2e-9889-234bca5bac99',
    },
    DATA: {
      TYPE_HELMET: 'b45b51e4-59ca-499f-9c06-8b419cb56653',
      TYPE_VEST: 'aeca0389-3da6-4f37-94ce-0c8f6ee06075',
      TYPE_BAG: 'a45bc12e-c56f-4b42-9aed-d52764c15f1c'
    }
  },
  GEAR_TYPE_PROVIDER: {
    ID: 'ca818629-6484-43b2-ad21-2e1baf493456',
    COLUMNS: {
      GEAR: '07b5267e-3451-49b3-8ba9-ddf5b82a2d53',
      PROVIDER: 'a5ac93e2-5aa2-4186-a6df-147ae988b7dd'
    }
  },
  GEAR: {
    ID: '047340fb-a044-43f7-b0c7-a99f22b3e383',
    COLUMNS: {
      GEAR_TYPE: '7b3d93a5-d189-4b3a-8df2-2e7137e5af14',
      REF: 'fd2e2ccb-9c4b-46af-85e7-8e0452c059d8',
      SIZE: 'dcbd8e62-d644-420d-8908-a4ae12ba5d96',
      BIKE: 'b69c86a1-aea5-4247-a53f-5bf69b33b50b'
    }
  },
  MAINTENANCE: {
    ID: 'aea1c6c7-1c83-4dec-adaa-2fc6563af9ab',
    COLUMNS: {
      TYPE: '416e0619-5bc7-42c4-a22f-78dd8ace9603',
      IDENTITY: '3d0ba54e-c07e-4a72-ba19-81a610ae4fc2',
      STATUS: 'b69cec56-f9f2-4dcf-beef-f7a4fdf38b72',
      RECIPIENT: '0b933f1d-d883-4a9d-884c-0573ac3e1b20',
      MAINTENANCE_DATE: 'e2784b4d-26ee-45de-a48b-5a8ad8ac350c',
      TECHNICIAN: 'dfce339f-c521-4ac1-9b05-88229c1110cb',
      MAINTENANCE_STEP: '8c4ecfb8-aec6-4162-b8b3-d145abaee993',
      INCIDENT: '0cc5550b-8ca6-4c86-9b8e-8ebc6d305c29',
      BIKE: '1902630f-88f7-45d6-9678-bb63123df075',
    }
  },
  INCIDENT: {
    ID: 'd8240bed-aaa1-4156-9a63-9992a9269149',
    COLUMNS: {
      BIKE: '7c7d8b52-07d9-4694-b6da-cf1de42594fc',
      SOCIETY: '287bea3c-76cd-451d-bbc3-69d335e2a6f7',
      TYPE: '5bdefabe-2c54-4f7f-bae4-c913dccb5a6e',
      STATUS: '11ab89f5-2c07-40b6-a8fe-04a89b602120',
      INCIDENT: 'faae048d-403b-4818-922a-5731131f3143',
      DATE: '289a1ab1-7403-40d9-8b77-66b73d19c120'
    }
  },

  // Message management
  MESSAGE: {
    ID: 'b4c89171-c2d1-4730-88bc-7df2b2dfb3ff',
    COLUMNS: {
      FROM_USER: 'b2cf1159-1876-4b60-b148-be6ec2aeb573',
      FROM_EMAIL: 'e23105fd-19a4-4b97-9af7-f9e8d28d5d0a',
      TO_USER: '34a9ff30-e10f-44f6-bb05-70c6b373295e',
      TO_EMAIL: '56b569d0-02eb-41b1-81e1-2e6f7d79fa48',
      SUBJECT: 'de16bc4b-240b-48ee-8dd3-3f5bd2d5db82',
      CONTENT: '4aa83839-e487-4cc2-994d-9bda7da70c61',
      DATE: '1320036c-e50b-4493-8c59-87bbfff5dd01',
    }
  },

  // Training management
  TRAINING: {
    ID: 'c13dbbf2-75f2-4a38-b139-2c6eb4d3f14c',
    COLUMNS: {
      REQUEST: 'fd9f6eb0-9be8-43cb-94bf-e692721fb6ef',
      SOCIETY: 'af4e69d5-c4ba-4217-9fb0-52cf17c2fc4a',
      TYPE: '445c9aa8-4858-4b14-8e51-41df77cef823',
      FORMATION: 'b6ee611d-3878-4b2d-9ccc-fead1a9f3b4f',
      DATE: 'f14d044b-fa6b-4cbb-9ffe-49fde1dac34e',
      INSTITUTION: '59fe729e-d6be-4533-b00c-870ee931696e',
      TRAINER: 'e4451b45-0ba6-4914-97cb-d53101ebbc2f',
      FILE: 'e402a93d-07b3-45cd-ba13-f50807b09996',
      USER: '2bd806de-34ce-4426-93e6-70138cb4c0da',
      RATING: '7e126aae-5235-4956-b4aa-0b104683e3ec'
    }
  }
}

export async function seed (): Promise<any> {
}
