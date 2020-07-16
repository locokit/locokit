import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
  await knex("column_type").insert([{
    id: 1,
    text: 'Number',
  }, {
    id: 2,
    text: 'Date',
  }, {
    id: 3,
    text: 'String',
  }, {
    id: 4,
    text: 'Float',
  }, {
    id: 5,
    text: 'User',
  }, {
    id: 6,
    text: 'Group',
  }, {
    id: 7,
    text: 'Link / relation between tables',
  }, {
    id: 8,
    text: 'Looked up column'
  }, {
    id: 9,
    text: 'Single select'
  }, {
    id: 10,
    text: 'Multi select'
  }])
};
