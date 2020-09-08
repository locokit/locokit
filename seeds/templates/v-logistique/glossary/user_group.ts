import { glossary } from '../../../core/glossary'

interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  profile: string
}

export const USERS: Record<string, User> = {
  admin: {
    id: 1,
    first_name: 'Admin',
    last_name: 'Makina Corpus',
    email: 'admin@makina-corpus.net',
    profile: glossary.USER_PROFILE.SUPERADMIN
  },
  makina_mda: {
    id: 2,
    first_name: 'Mathieu',
    last_name: 'DARTIGUES',
    email: 'mathieu.dartigues@makina-corpus.com',
    profile: glossary.USER_PROFILE.SUPERADMIN
  },
  makina_alc: {
    id: 3,
    first_name: 'Aline',
    last_name: 'CHETTA',
    email: 'aline.chetta@makina-corpus.com',
    profile: glossary.USER_PROFILE.SUPERADMIN
  },
  makina_hga: {
    id: 4,
    first_name: 'Henri',
    last_name: 'GAUFFRIAU',
    email: 'henri.gauffriau@makina-corpus.com',
    profile: glossary.USER_PROFILE.SUPERADMIN
  },
  makina_odu: {
    id: 5,
    first_name: 'Olivia',
    last_name: 'DUVAL',
    email: 'olivia.duval@makina-corpus.com',
    profile: glossary.USER_PROFILE.ADMIN
  },
  vlo_magali: {
    id: 6,
    first_name: 'Magali',
    last_name: 'CHAUMONT',
    email: 'magali.chaumont@unionsportcycle.com',
    profile: glossary.USER_PROFILE.ADMIN
  },
  vlo_beatrice: {
    id: 7,
    first_name: 'Béatrice',
    last_name: 'PREVOST',
    email: 'beatrice.prevost@unionsportcycle.com',
    profile: glossary.USER_PROFILE.ADMIN
  },
  morio_jean: {
    id: 8,
    first_name: 'Jean',
    last_name: 'VENET',
    email: 'jean@morio.co',
    profile: glossary.USER_PROFILE.USER
  },
  cyclable: {
    id: 9,
    first_name: 'Fournisseur',
    last_name: 'CYCLABLE ENTREPRISE',
    email: 'cyclable.entreprise@makina-corpus.net',
    profile: glossary.USER_PROFILE.USER
  },
  amsterdamair: {
    id: 10,
    first_name: 'Fournisseur',
    last_name: 'AMSTERDAMAIR',
    email: 'amsterdamair@makina-corpus.net',
    profile: glossary.USER_PROFILE.USER
  },
  cyclelab: {
    id: 11,
    first_name: 'Fournisseur',
    last_name: 'CYCLELAB',
    email: 'cyclelab@makina-corpus.net',
    profile: glossary.USER_PROFILE.USER
  },
  rozo_flavie: {
    id: 12,
    first_name: 'Flavie',
    last_name: 'JOLY',
    email: 'f.joly@rozo.fr',
    profile: glossary.USER_PROFILE.USER
  },
  rozo_aiquyen: {
    id: 13,
    first_name: 'Ai Quyên',
    last_name: 'DO TRINH',
    email: 'aq.dotrinh@rozo.fr',
    profile: glossary.USER_PROFILE.USER
  },
  hervelecoq: {
    id: 14,
    first_name: 'Hervé',
    last_name: 'LECOQ',
    email: 'la.boulangerie@orange.fr',
    profile: glossary.USER_PROFILE.USER
  },
  unknown: {
    id: 15,
    first_name: 'Inconnu',
    last_name: 'sans groupe',
    email: 'unknown@makina-corpus.net',
    profile: glossary.USER_PROFILE.USER
  },
  beneficiairea: {
    id: 16,
    first_name: 'Bénéficiaire',
    last_name: 'A',
    email: 'beneficiairea@makina-corpus.net',
    profile: glossary.USER_PROFILE.USER
  },
  fub: {
    id: 17,
    first_name: 'FUB',
    last_name: 'Formation',
    email: 'fub@makina-corpus.net',
    profile: glossary.USER_PROFILE.USER
  }
}

export const GROUPS = {
  ADMIN: '163c21e6-5339-4748-903f-8c77e21314cf',
  SUPPLIER: 'd39f102b-398a-4d51-9680-3c479abdda73',
  BENEFICIARY: '895ec967-fa3b-4710-82e7-b406e62f657d',
  MORIO: 'cee8d0de-f9f1-45c0-a03d-28d30890a3d6',
  ROZO: '6421abfa-de18-11ea-87d0-0242ac130003',
  FUB: '28c9d69b-630f-49dd-9d7b-053f1faebf9b'
}

export async function seed (): Promise<any> {
}
