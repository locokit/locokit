import * as Knex from "knex";

import { COLUMN_TYPE } from '@locokit/lck-glossary';

export async function seed(knex: Knex): Promise<any> {
  await knex("column_type").insert([{
    id: COLUMN_TYPE.BOOLEAN,
    text: 'Boolean',
  }, {
    id: COLUMN_TYPE.NUMBER,
    text: 'Number',
  }, {
    id: COLUMN_TYPE.DATE,
    text: 'Date',
  }, {
    id: COLUMN_TYPE.STRING,
    text: 'String',
  }, {
    id: COLUMN_TYPE.FLOAT,
    text: 'Float',
  }, {
    id: COLUMN_TYPE.USER,
    text: 'User',
  }, {
    id: COLUMN_TYPE.GROUP,
    text: 'Group',
  }, {
    id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
    text: 'Link / relation between tables',
  }, {
    id: COLUMN_TYPE.LOOKED_UP_COLUMN,
    text: 'Looked up column'
  }, {
    id: COLUMN_TYPE.SINGLE_SELECT,
    text: 'Single select'
  }, {
    id: COLUMN_TYPE.MULTI_SELECT,
    text: 'Multi select'
  }, {
    id: COLUMN_TYPE.FORMULA,
    text: 'Formula'
  }, {
    id: COLUMN_TYPE.FILE,
    text: 'File'
  }])
};
