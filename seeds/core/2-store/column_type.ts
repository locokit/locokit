import * as Knex from "knex";

import { glossary } from "../../../src/glossary";

export async function seed(knex: Knex): Promise<any> {
  await knex("column_type").insert([{
    id: glossary.COLUMN_TYPE.BOOLEAN,
    text: 'Boolean',
  }, {
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
  }, {
    id: glossary.COLUMN_TYPE.FORMULA,
    text: 'Formula'
  }, {
    id: glossary.COLUMN_TYPE.FILE,
    text: 'File'
  }])
};
