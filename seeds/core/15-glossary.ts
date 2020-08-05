import * as Knex from "knex";

export const glossary = {
  COLUMN_TYPE: {
    NUMBER: 1,
    DATE: 2,
    STRING: 3,
    FLOAT: 4,
    USER: 5,
    GROUP: 6,
    RELATION_BETWEEN_TABLES: 7,
    LOOKED_UP_COLUMN: 8,
    SINGLE_SELECT: 9,
    MULTI_SELECT: 10
  }
}

export async function seed(knex: Knex): Promise<any> {
  await knex("column_type").insert([{
    id: glossary.COLUMN_TYPE.NUMBER,
    text: 'Number',
  }, {
    id: glossary.COLUMN_TYPE.DATE,
    text: 'Date',
  }, {
    id: glossary.COLUMN_TYPE.STRING,
    text: 'String',
  }, {
    id: glossary.COLUMN_TYPE.FLOAT,
    text: 'Float',
  }, {
    id: glossary.COLUMN_TYPE.USER,
    text: 'User',
  }, {
    id: glossary.COLUMN_TYPE.GROUP,
    text: 'Group',
  }, {
    id: glossary.COLUMN_TYPE.RELATION_BETWEEN_TABLES,
    text: 'Link / relation between tables',
  }, {
    id: glossary.COLUMN_TYPE.LOOKED_UP_COLUMN,
    text: 'Looked up column'
  }, {
    id: glossary.COLUMN_TYPE.SINGLE_SELECT,
    text: 'Single select'
  }, {
    id: glossary.COLUMN_TYPE.MULTI_SELECT,
    text: 'Multi select'
  }])
};
