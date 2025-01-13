import { knex } from 'knex'

export async function initDatasource(connection: string) {
  const knexConnection = knex({ client: 'pg', connection })
  const schemaName = 'lck-engine'

  await knexConnection.schema.dropSchemaIfExists(schemaName, true)
  await knexConnection.schema.createSchema(schemaName)

  await knexConnection.raw('CREATE EXTENSION IF NOT EXISTS unaccent;')
  /**
   * Create the schema
   */
  await knexConnection.schema.withSchema(schemaName).createTable('place', function (table) {
    table.uuid('p_uuid', { primaryKey: true }).defaultTo(knexConnection.raw('gen_random_uuid()')) // use a specific name instead of id

    table.string('name')
    table.geometry('point')
  })

  await knexConnection.schema.withSchema(schemaName).createTable('company', function (table) {
    table.uuid('id', { primaryKey: true }).defaultTo(knexConnection.raw('gen_random_uuid()'))

    table.string('name')
  })

  await knexConnection.schema.withSchema(schemaName).createTable('event', function (table) {
    table.uuid('id', { primaryKey: true }).defaultTo(knexConnection.raw('gen_random_uuid()'))

    table.string('name')
    table.uuid('p_uuid')
    table.foreign('p_uuid', 'FK_event_place_uuid').references('p_uuid').inTable('lck-engine.place')

    table.uuid('c_uuid').notNullable()
    table.foreign('c_uuid', 'FK_event_company_uuid').references('id').inTable('lck-engine.company')
  })

  await knexConnection.schema.withSchema(schemaName).createTable('person', function (table) {
    table.uuid('id', { primaryKey: true }).defaultTo(knexConnection.raw('gen_random_uuid()'))

    table.string('name')
  })

  await knexConnection.schema.withSchema(schemaName).createTable('participate', function (table) {
    table.uuid('event_id')
    table.uuid('person_id')
    table.primary(['event_id', 'person_id'])
    table
      .foreign('event_id', 'FK_participate_event_id')
      .references('id')
      .inTable('lck-engine.event')

    table
      .foreign('person_id', 'FK_participate_person_id')
      .references('id')
      .inTable('lck-engine.person')
  })

  await knexConnection.schema.withSchema(schemaName).createTable('room', function (table) {
    table.uuid('r_uuid', { primaryKey: true }).defaultTo(knexConnection.raw('gen_random_uuid()')) // use a specific name instead of id

    table.string('name')
    table.uuid('p_uuid')
    table.foreign('p_uuid', 'FK_room_place_uuid').references('p_uuid').inTable('lck-engine.place')
  })
  await knexConnection.schema.withSchema(schemaName).createTable('session', function (table) {
    table.uuid('s_uuid', { primaryKey: true }).defaultTo(knexConnection.raw('gen_random_uuid()')) // use a specific name instead of id

    table.string('name')

    table.uuid('event_uuid')
    table.foreign('event_uuid', 'FK_session_event_id').references('id').inTable('lck-engine.event')

    table.uuid('speaker_uuid')
    table
      .foreign('speaker_uuid', 'FK_session_person_id')
      .references('id')
      .inTable('lck-engine.person')

    table.uuid('room_uuid')
    table.foreign('room_uuid', 'FK_session_room_id').references('r_uuid').inTable('lck-engine.room')

    table.datetime('begin')
    table.datetime('end')
  })
}
