import * as Knex from "knex";
import bcrypt from 'bcryptjs'
import { glossary } from "../../../src/glossary";

export async function seed(knex: Knex): Promise<any> {
  const hashPassword = await bcrypt.hash("pouetpouet", 10)
  await knex("user").insert([
    {
      id: 1,
      first_name: "SUPER",
      last_name: "ADMIN",
      email: "superadmin@makina-corpus.net",
      password: hashPassword,
      profile: glossary.USER_PROFILE.SUPERADMIN
    }
  ]);
};
