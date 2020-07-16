import * as Knex from "knex";
import bcrypt from 'bcryptjs'

export async function seed(knex: Knex): Promise<any> {
  const hashPassword = await bcrypt.hash("pouetpouet", 10)
  await knex("user").insert([
    {
      id: 2,
      first_name: "ADMIN",
      last_name: "v-logistique",
      email: "admin@makina-corpus.net",
      password: hashPassword,
      profile: "ADMIN"
    },
    {
      id: 3,
      first_name: "Fournisseur",
      last_name: "CYCLABLE ENTREPRISE",
      email: "cyclable.entreprise@makina-corpus.net",
      password: hashPassword,
      profile: "USER"
    },
    {
      id: 4,
      first_name: "Fournisseur",
      last_name: "AMSTERDAMAIR",
      email: "amsterdamair@makina-corpus.net",
      password: hashPassword,
      profile: "USER"
    },
    {
      id: 5,
      first_name: "Bénéficiaire",
      last_name: "A",
      email: "beneficiairea@makina-corpus.net",
      password: hashPassword,
      profile: "USER"
    },
    {
      id: 6,
      first_name: "Bénéficiaire",
      last_name: "B",
      email: "beneficiaireb@makina-corpus.net",
      password: hashPassword,
      profile: "USER"
    },
    {
      id: 7,
      first_name: "Inconnu",
      last_name: "sans groupe",
      email: "unknown@makina-corpus.net",
      password: hashPassword,
      profile: "USER"
    },
    {
      id: 8,
      first_name: "Fournisseur",
      last_name: "CYCLELAB",
      email: "cyclelab@makina-corpus.net",
      password: hashPassword,
      profile: "USER"
    }
  ]);
  await knex("group").insert([
    {
      id: 'd39f102b-398a-4d51-9680-3c479abdda73',
      name: "Fournisseurs",
    },
    {
      id: '895ec967-fa3b-4710-82e7-b406e62f657d',
      name: "Bénéficiaires",
    },
    {
      id: '163c21e6-5339-4748-903f-8c77e21314cf',
      name: "Admin",
    },
  ]);
  await knex("user_has_group").insert([
    // {
    //   user_id: 2,
    //   group_id: 'd39f102b-398a-4d51-9680-3c479abdda73',
    //   role: 'OWNER'
    // },
    // {
    //   user_id: 2,
    //   group_id: '895ec967-fa3b-4710-82e7-b406e62f657d',
    //   role: 'OWNER'
    // },
    {
      user_id: 2,
      group_id: '163c21e6-5339-4748-903f-8c77e21314cf',
      role: 'OWNER'
    },
    {
      user_id: 3,
      group_id: 'd39f102b-398a-4d51-9680-3c479abdda73',
      role: 'MEMBER'
    },
    {
      user_id: 4,
      group_id: 'd39f102b-398a-4d51-9680-3c479abdda73',
      role: 'MEMBER'
    },
    {
      user_id: 8,
      group_id: 'd39f102b-398a-4d51-9680-3c479abdda73',
      role: 'MEMBER'
    },
    {
      user_id: 5,
      group_id: '895ec967-fa3b-4710-82e7-b406e62f657d',
      role: 'MEMBER'
    },
    {
      user_id: 6,
      group_id: '895ec967-fa3b-4710-82e7-b406e62f657d',
      role: 'MEMBER'
    },
  ]);
};
