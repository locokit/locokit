import * as Knex from 'knex'
import { GROUPS, USERS } from '../glossary/user_group'

export async function seed (knex: Knex): Promise<any> {

  await knex('user_has_group').insert([{
    user_id: USERS.admin.id,
    group_id: GROUPS.ADMIN,
    role: 'OWNER'
  }, {
    user_id: USERS.makina_alc.id,
    group_id: GROUPS.ADMIN,
    role: 'OWNER'
  }, {
    user_id: USERS.makina_hga.id,
    group_id: GROUPS.ADMIN,
    role: 'OWNER'
  }, {
    user_id: USERS.makina_mda.id,
    group_id: GROUPS.ADMIN,
    role: 'OWNER'
  }, {
    user_id: USERS.makina_odu.id,
    group_id: GROUPS.ADMIN,
    role: 'OWNER'
  }, {
    user_id: USERS.vlo_beatrice.id,
    group_id: GROUPS.ADMIN,
    role: 'OWNER'
  }, {
    user_id: USERS.vlo_magali.id,
    group_id: GROUPS.ADMIN,
    role: 'OWNER'
  }, {
    user_id: USERS.amsterdamair.id,
    group_id: GROUPS.SUPPLIER,
    role: 'MEMBER'
  }, {
    user_id: USERS.cyclable.id,
    group_id: GROUPS.SUPPLIER,
    role: 'MEMBER'
  }, {
    user_id: USERS.cyclelab.id,
    group_id: GROUPS.SUPPLIER,
    role: 'MEMBER'
  }, {
    user_id: USERS.beneficiairea.id,
    group_id: GROUPS.BENEFICIARY,
    role: 'MEMBER'
  }, {
    user_id: USERS.hervelecoq.id,
    group_id: GROUPS.BENEFICIARY,
    role: 'MEMBER'
  }, {
    user_id: USERS.unknown.id,
    group_id: GROUPS.BENEFICIARY,
    role: 'MEMBER'
  }, {
    user_id: USERS.morio_jean.id,
    group_id: GROUPS.MORIO,
    role: 'MEMBER'
  }, {
    user_id: USERS.rozo_aiquyen.id,
    group_id: GROUPS.ROZO,
    role: 'MEMBER'
  }, {
    user_id: USERS.rozo_flavie.id,
    group_id: GROUPS.ROZO,
    role: 'MEMBER'
  }, {
    user_id: USERS.fub.id,
    group_id: GROUPS.FUB,
    role: 'MEMBER'
  }])
}
