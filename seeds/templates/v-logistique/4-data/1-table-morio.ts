import * as Knex from 'knex'
import { TABLES } from '../glossary/schema'

export async function seed (knex: Knex): Promise<any> {
  /**
   * Tracers
   */
  await knex('table_row').insert([
    {
      id: 'c6e48b1d-d53a-46cf-bc74-7c81870900f4',
      text: '300FBF',
      table_id: TABLES.MORIO_TRACER.ID,
      data: JSON.stringify({
        [TABLES.MORIO_TRACER.COLUMNS.REF]: '300FBF',
        [TABLES.MORIO_TRACER.COLUMNS.STATUS]: TABLES.MORIO_TRACER.DATA.STATUS_INPROGRESS
      })
    }, {
      id: '61074bd7-c224-4d7b-99a1-5cecfbd23728',
      text: '314AA5',
      table_id: TABLES.MORIO_TRACER.ID,
      data: JSON.stringify({
        [TABLES.MORIO_TRACER.COLUMNS.REF]: '314AA5',
        [TABLES.MORIO_TRACER.COLUMNS.STATUS]: TABLES.MORIO_TRACER.DATA.STATUS_WORKING
      })
    }, {
      id: 'd8cf9222-9fd6-406d-8b90-1b443e89aa7c',
      text: '314A6A',
      table_id: TABLES.MORIO_TRACER.ID,
      data: JSON.stringify({
        [TABLES.MORIO_TRACER.COLUMNS.REF]: '314A6A',
        [TABLES.MORIO_TRACER.COLUMNS.STATUS]: TABLES.MORIO_TRACER.DATA.STATUS_INPROGRESS
      })
    }, {
      id: '769152a2-ff39-4186-892e-2fdd111e012b',
      text: '314C05',
      table_id: TABLES.MORIO_TRACER.ID,
      data: JSON.stringify({
        [TABLES.MORIO_TRACER.COLUMNS.REF]: '314C05',
        [TABLES.MORIO_TRACER.COLUMNS.STATUS]: TABLES.MORIO_TRACER.DATA.STATUS_STOLEN,
        [TABLES.MORIO_TRACER.COLUMNS.DATE_BEGIN]: '26/08/2020'
      })
    }
  ])

}
