import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
  await knex("group").insert([
    {
      id: 1,
      name: "Fournisseurs",
    },
    {
      id: 2,
      name: "Bénéficiaires",
    },
    {
      id: 3,
      name: "Admin",
    },
  ]);
  return await knex("user_has_group").insert([
    {
      user_id: 2,
      group_id: 1,
      role: 'OWNER'
    },
    {
      user_id: 2,
      group_id: 2,
      role: 'OWNER'
    },
    {
      user_id: 2,
      group_id: 3,
      role: 'OWNER'
    },
    {
      user_id: 3,
      group_id: 1,
      role: 'MEMBER'
    },
    {
      user_id: 4,
      group_id: 1,
      role: 'MEMBER'
    },
    {
      user_id: 5,
      group_id: 2,
      role: 'MEMBER'
    },
    {
      user_id: 6,
      group_id: 2,
      role: 'MEMBER'
    },
  ]);

};
