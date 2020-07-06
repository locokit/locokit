import * as Knex from "knex";
import bcrypt from 'bcryptjs'

export async function seed(knex: Knex): Promise<any> {
  const hashPassword = await bcrypt.hash("pouetpouet", 10)
  await knex("user").insert([
    {
      id: 1,
      first_name: "SUPER",
      last_name: "ADMIN",
      email: "superadmin@makina-corpus.net",
      password: hashPassword,
      profile: "SUPERADMIN"
    },
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
      last_name: "A",
      email: "fournisseura@makina-corpus.net",
      password: hashPassword,
      profile: "USER"
    },
    {
      id: 4,
      first_name: "Fournisseur",
      last_name: "B",
      email: "fournisseurb@makina-corpus.net",
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
    }
  ]);
};
