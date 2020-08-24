import * as Knex from "knex";
import { GROUPS } from "./100-v-logistique-group";
import { VIEWS } from '../../../src/glossary-seed/view-glossary'

export const WORKSPACE = 'eaddde8c-1de4-4e5e-960a-3872907475e5';

export const CHAPTERS = {
  ADMIN:'4336c4a8-3862-4846-b72d-6838b74051b6',
  ROZO:'d7bb8c43-e96f-442c-96ae-34ab61132504',
  MORIO:'51f2f984-5dbb-456d-a795-aabe83744e50',
  PROVIDER:'8da8f312-27cf-4810-a7e5-9430823eed29',
  RECIPIENT:'dc1a1763-7786-4876-8b7d-2e65f772e658'
}


export async function seed(knex: Knex): Promise<any> {
  await knex("workspace").insert([{
    id: WORKSPACE,
    text: 'v-logistique'
  }])

  /**
   * Chapters
   */
  await knex("chapter").insert([{
    id: CHAPTERS.PROVIDER,
    text: 'Fournisseur',
    workspace_id: WORKSPACE
  }, {
    id: CHAPTERS.RECIPIENT,
    text: 'Bénéficiaire',
    workspace_id: WORKSPACE
  }, {
    id: CHAPTERS.ADMIN,
    text: 'v-logistique',
    workspace_id: WORKSPACE
  }, {
    id: CHAPTERS.ROZO,
    text: 'Rozo',
    workspace_id: WORKSPACE
  }, {
    id: CHAPTERS.MORIO,
    text: 'Morio',
    workspace_id: WORKSPACE
  }])

  /**
   * Pages
   */
  await knex("page").insert([{
    id: '4b64ffc0-229a-47ae-a5a2-0505fa9890ee',
    text: 'Usage vélos',
    chapter_id: CHAPTERS.RECIPIENT
  }, {
    id: '4d427df2-79b2-4aba-84b1-cc0c98421d6d',
    text: 'Assistance',
    chapter_id: CHAPTERS.RECIPIENT
  }, {
    id: 'f9bdf57a-de4d-4476-a765-84e6802d1342',
    text: 'Messagerie',
    chapter_id: CHAPTERS.RECIPIENT
  }, {
    id: '596848de-1287-4b36-a8db-1cd4c228e468',
    text: 'Sensibilisation formation',
    chapter_id: CHAPTERS.RECIPIENT
  }, {
    id: '53646407-caf7-4dd4-9422-edd378dd647d',
    text: 'Gestion flotte vélos',
    chapter_id: CHAPTERS.PROVIDER
  }, {
    id: 'f83be2bb-1cbb-4fb4-8fa1-b5dffc3062cc',
    text: 'Maintenances préventives',
    chapter_id: CHAPTERS.PROVIDER
  }, {
    id: '41910cbc-4065-4399-b05f-b73893a50dbb',
    text: 'Maintenances curatives',
    chapter_id: CHAPTERS.PROVIDER
  }, {
    id: '5b9461c8-9a0d-4326-97fc-bbe61663a4eb',
    text: 'Informations prestataires',
    chapter_id: CHAPTERS.PROVIDER
  }, {
    id: 'f199297d-ec2e-4b44-bb54-e44734e3eb01',
    text: 'Messagerie',
    chapter_id: CHAPTERS.PROVIDER
  }, {
    id: 'b23c29f9-ecfd-4f63-9f10-9b919e6a752f',
    text: 'Stock vélos',
    chapter_id: CHAPTERS.ADMIN
  }, {
    id: '6d177b3f-a613-4557-afce-a0db2b4e980b',
    text: 'Pré-bénéficiaires / bénéficiaires',
    chapter_id: CHAPTERS.ADMIN
  }, {
    id: '1f50ffd6-3c48-4c8a-a09e-34b85e89682d',
    text: 'Rozo',
    chapter_id: CHAPTERS.ADMIN
  }, {
    id: '23453d24-c2bb-4ee8-9bb1-638512e43b81',
    text: 'Sensibilisation Formation Assistance',
    chapter_id: CHAPTERS.ADMIN
  }, {
    id: 'c8b23f69-7067-48cf-8b3a-5ef15ad5cda1',
    text: 'Messagerie',
    chapter_id: CHAPTERS.ADMIN
  }])

  /**
   * Containers
   */
  await knex("container").insert([{
    id: '5cdbf483-aafe-4b6a-9ad1-99faf0a5e5f4',
    text: 'Container v-logistique',
    settings: JSON.stringify({
      class: 'yolo'
    }),
    page_id: 'b23c29f9-ecfd-4f63-9f10-9b919e6a752f'
  }, {
    id: 'da283b02-0679-424c-98b3-95f2779655be',
    text: 'Container 2',
    page_id: '4b64ffc0-229a-47ae-a5a2-0505fa9890ee'
  }, {
    id: '42be6c09-a6df-41c5-99e3-295d4696b492',
    text: 'Container Flotte',
    page_id: '53646407-caf7-4dd4-9422-edd378dd647d'
  }, {
    id: '3e5f7f61-8664-4db1-92f5-d87650b39e87',
    text: 'Container maintenance préventive',
    page_id: 'f83be2bb-1cbb-4fb4-8fa1-b5dffc3062cc'
  }, {
    id: '4d696142-5ac3-47bb-bfce-7bbbb0b59a6d',
    text: 'Container maintenance curative',
    page_id: '41910cbc-4065-4399-b05f-b73893a50dbb'
  }, {
    id: 'e8a4061b-a6a4-40b8-b309-f7658e949099',
    text: 'Container bénéficiaire v-logistique',
    page_id: '6d177b3f-a613-4557-afce-a0db2b4e980b'
  }, {
    id: '916bbc56-c26e-44b7-8107-46f2c4d21d2e',
    text: 'Container messagerie bénéficiaire',
    page_id: 'f9bdf57a-de4d-4476-a765-84e6802d1342'
  }, {
    id: '292d8b92-de2a-11ea-87d0-0242ac130003',
    text: 'Container Rozo',
    page_id: '1f50ffd6-3c48-4c8a-a09e-34b85e89682d'
  }, {
    id: 'c8a24d65-a9ba-4b73-811d-0096f523904a',
    text: 'Container messagerie fournisseur',
    page_id: 'f199297d-ec2e-4b44-bb54-e44734e3eb01'
  }, {
    id: '0e6a7204-7fa2-4f38-9112-2fe255bf9b3a',
    text: 'Container page en construction',
    page_id: '5b9461c8-9a0d-4326-97fc-bbe61663a4eb'
  }, {
    id: 'fa17cfc4-66b9-455f-96e6-9746c0c7f5f0',
    text: 'Container page en construction',
    page_id: '4d427df2-79b2-4aba-84b1-cc0c98421d6d'
  }])

  /**
   * Blocks
   */
  await knex("block").insert([{
    id: '3f70841d-a6fe-4586-b130-038331eacd7c',
    title: 'Vélos livrés',
    container_id: '42be6c09-a6df-41c5-99e3-295d4696b492',
    type: 'TableView',
    settings: JSON.stringify({
      id: VIEWS.PROVIDER.FLEET
    })
  }, {
    id: '875b2539-134f-4493-a9de-a71fe927bc94',
    title: 'Vélos à maintenir',
    container_id: '3e5f7f61-8664-4db1-92f5-d87650b39e87',
    type: 'TableView',
    settings: JSON.stringify({
      id: VIEWS.PROVIDER.MAINTENANCE_PREVENTIVE
    })
  }, {
    id: 'b69f3078-45e7-4934-ade2-4dd9972f2dfb',
    title: 'Vélos ayant des réparations',
    container_id: '4d696142-5ac3-47bb-bfce-7bbbb0b59a6d',
    type: 'TableView',
    settings: JSON.stringify({
      id: VIEWS.PROVIDER.MAINTENANCE_CURATIVE
    })
  }, {
    id: 'd7933493-b5d0-4363-a5e8-caf0abef6d05',
    title: 'Mes vélos',
    container_id: 'da283b02-0679-424c-98b3-95f2779655be',
    type: 'TableView',
    settings: JSON.stringify({
      id: VIEWS.RECIPIENT.BICYCLE_USE
    })
  }, {
    id: '7b2dd5d0-b6d3-43d9-aadc-91de0a1ec84b',
    title: 'Listing vélo',
    container_id: '5cdbf483-aafe-4b6a-9ad1-99faf0a5e5f4',
    type: 'TableView',
    settings: JSON.stringify({
      id: VIEWS.VLO.BICYCLE_STOCK_1
    })
  }, {
    id: '8958475f-e22e-4c8f-b480-b7911654d167',
    title: 'Listing fournisseur',
    container_id: '5cdbf483-aafe-4b6a-9ad1-99faf0a5e5f4',
    type: 'TableView',
    settings: JSON.stringify({
      id: VIEWS.VLO.BICYCLE_STOCK_2
    })
  }, {
    id: '07f3668f-c870-4761-8572-fc3ce447a50f',
    title: 'Listing bénéficiaire',
    container_id: 'e8a4061b-a6a4-40b8-b309-f7658e949099',
    type: 'TableView',
    settings: JSON.stringify({
      id: 'c804fae3-5d33-4759-9c1f-7d8f01c32d81'
    })
  }, {
    id: '4ffcd80e-de2a-11ea-87d0-0242ac130003',
    title: 'Liste des demandes',
    container_id: '292d8b92-de2a-11ea-87d0-0242ac130003',
    type: 'TableView',
    settings: JSON.stringify({
      id: VIEWS.ROZO
    })
  }, {
    id: '59b05157-e4d8-4164-8ba5-1efc0fb68829',
    settings: JSON.stringify({
      content: `
      Page en construction.

      Pour tout contact, merci d\'envoyer un mail à contact@v-logistique.com.

      En cas de sinistre, merci de contacter la hot-line Morio au 07 80 99 24 19.
    `
    }),
    container_id: '916bbc56-c26e-44b7-8107-46f2c4d21d2e',
    type: 'Paragraph'
  }, {
    id: '7815050f-aa93-4be5-8f18-6fe6adc866e1',
    settings: JSON.stringify({
      content: `
      Page en construction.

      Pour tout contact, merci d'envoyer un mail à contact@v-logistique.com.
      `
    }),
    container_id: 'c8a24d65-a9ba-4b73-811d-0096f523904a',
    type: 'Paragraph'
  }, {
    id: '2192b05b-e5aa-4058-b9fa-b99d611aed03',
    settings: JSON.stringify({
      content: `
      Page en construction.

      Pour tout contact, merci d'envoyer un mail à contact@v-logistique.com.
      `
    }),
    container_id: '0e6a7204-7fa2-4f38-9112-2fe255bf9b3a',
    type: 'Paragraph'
  }, {
    id: 'a960955f-f9ac-406e-a1c4-f7b192153c0c',
    settings: JSON.stringify({
      content: `
      Page en construction.

      Pour tout contact, merci d'envoyer un mail à contact@v-logistique.com.
      `
    }),
    container_id: 'fa17cfc4-66b9-455f-96e6-9746c0c7f5f0',
    type: 'Paragraph'
  }])

  /**
   * Workspace group associations
   */
  await knex("group_has_workspace").insert([{
    group_id: GROUPS.ADMIN,
    workspace_id: WORKSPACE,
    role: 'OWNER',
    permission: null
  }, {
    group_id: GROUPS.RECIPIENT,
    workspace_id: WORKSPACE,
    role: 'MEMBER',
    permission: JSON.stringify([
      'VIEW_READ_2'
    ]),
    chapter_id: CHAPTERS.RECIPIENT
  }, {
    group_id: GROUPS.PROVIDER,
    workspace_id: WORKSPACE,
    role: 'MEMBER',
    permission: JSON.stringify([
      'VIEW_READ_1'
    ]),
    chapter_id: CHAPTERS.PROVIDER
  }])
};
