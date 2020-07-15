import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
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
  return await knex("user_has_group").insert([
    {
      user_id: 2,
      group_id: 'd39f102b-398a-4d51-9680-3c479abdda73',
      role: 'OWNER'
    },
    {
      user_id: 2,
      group_id: '895ec967-fa3b-4710-82e7-b406e62f657d',
      role: 'OWNER'
    },
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
