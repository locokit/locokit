import { knex } from 'knex'
import { GenericAdapter } from 'packages/engine/src'
import {
  Place,
  Company,
  Person,
  Room,
  Session,
  Participate,
  Event,
  LocoKitEngineTestType,
} from '../../definitions'

/**
 * Configure the schema for an event database
 *
 * @param knexConnection Knex instance to the database
 * @param schemaName Name of the schema that will be (re)created
 */
export async function configureEventDatasource(
  knexConnection: knex.Knex,
  schemaName: string,
  drop: boolean = false,
) {
  if (drop) {
    await knexConnection.schema.dropSchemaIfExists(schemaName, true)
  }
  // await knexConnection.schema.createSchema(schemaName)

  console.log('configure event datasource', schemaName)

  await knexConnection.raw(`CREATE SCHEMA IF NOT EXISTS "${schemaName}";`)
  await knexConnection.schema.withSchema(schemaName).raw('CREATE EXTENSION IF NOT EXISTS unaccent;')
  await knexConnection.schema.withSchema(schemaName).raw('CREATE EXTENSION IF NOT EXISTS postgis;')

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
    table
      .foreign('p_uuid', 'FK_event_place_uuid')
      .references('p_uuid')
      .inTable(`${schemaName}.place`)

    table.uuid('c_uuid').notNullable()
    table
      .foreign('c_uuid', 'FK_event_company_uuid')
      .references('id')
      .inTable(`${schemaName}.company`)
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
      .inTable(`${schemaName}.event`)

    table
      .foreign('person_id', 'FK_participate_person_id')
      .references('id')
      .inTable(`${schemaName}.person`)
  })

  await knexConnection.schema.withSchema(schemaName).createTable('room', function (table) {
    table.uuid('r_uuid', { primaryKey: true }).defaultTo(knexConnection.raw('gen_random_uuid()')) // use a specific name instead of id

    table.string('name')
    table.uuid('p_uuid')
    table
      .foreign('p_uuid', 'FK_room_place_uuid')
      .references('p_uuid')
      .inTable(`${schemaName}.place`)
  })
  await knexConnection.schema.withSchema(schemaName).createTable('session', function (table) {
    table.uuid('s_uuid', { primaryKey: true }).defaultTo(knexConnection.raw('gen_random_uuid()')) // use a specific name instead of id

    table.string('name')

    table.uuid('event_uuid')
    table
      .foreign('event_uuid', 'FK_session_event_id')
      .references('id')
      .inTable(`${schemaName}.event`)

    table.uuid('speaker_uuid')
    table
      .foreign('speaker_uuid', 'FK_session_person_id')
      .references('id')
      .inTable(`${schemaName}.person`)

    table.uuid('room_uuid')
    table
      .foreign('room_uuid', 'FK_session_room_id')
      .references('r_uuid')
      .inTable(`${schemaName}.room`)

    table.datetime('begin')
    table.datetime('end')

    table.datetime('created_at').defaultTo(knexConnection.fn.now())
    table.datetime('updated_at').defaultTo(knexConnection.fn.now())
  })

  await knexConnection.schema.withSchema(schemaName).raw(`
    CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS trigger
      LANGUAGE plpgsql AS
    $$BEGIN
      NEW.updated_at := NOW();
      RETURN NEW;
    END;$$;

    CREATE OR REPLACE TRIGGER t_au_session
    BEFORE UPDATE ON "${schemaName}".session
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
  `)
}

/**
 * Feed the datasource with fake data
 */
export async function seedEventDatasource(adapter: GenericAdapter) {
  const currentData: Record<string, LocoKitEngineTestType> = {}

  const place1 = (await adapter.create<Place>('place', {
    name: 'Toulouse',
    point: 'POINT(1.443774704895361 43.60490776433437)',
  })) as Place
  const place2 = (await adapter.create<Place>('place', {
    name: 'Bagnères de Bigorre',
    point: 'POINT(0.15045479931004024 43.065363758275254)',
  })) as Place
  const company1 = (await adapter.create<Company>('company', {
    name: 'company1',
  })) as Company
  const event1 = (await adapter.create<Event>('event', {
    name: 'event1',
    p_uuid: place1.p_uuid,
    c_uuid: company1.id,
  })) as Event
  const speaker1 = (await adapter.create<Person>('person', {
    name: 'Speaker 1',
  })) as Person
  const room1 = (await adapter.create<Room>('room', {
    name: 'room1',
    p_uuid: place1.p_uuid,
  })) as Room
  const session1 = (await adapter.create<Session>('session', {
    name: 'Session 1',
    event_uuid: event1.id,
    speaker_uuid: speaker1.id,
    room_uuid: room1.r_uuid,
    begin: '2025-10-01T08:00:00',
    end: '2025-10-01T09:00:00',
  })) as Session
  const session2 = (await adapter.create<Session>('session', {
    name: 'Session 2',
    event_uuid: event1.id,
    speaker_uuid: speaker1.id,
    room_uuid: room1.r_uuid,
    begin: '2025-10-01T09:00:00',
    end: '2025-10-01T10:00:00',
  })) as Session
  const session3 = (await adapter.create<Session>('session', {
    name: 'Session 3',
    event_uuid: event1.id,
    speaker_uuid: speaker1.id,
    room_uuid: room1.r_uuid,
    begin: '2025-10-01T10:00:00',
    end: '2025-10-01T11:00:00',
  })) as Session
  const person1 = (await adapter.create<Person>('person', {
    name: 'Jack Black',
  })) as Person
  const person2 = (await adapter.create<Person>('person', {
    name: '',
  })) as Person
  const person3 = (await adapter.create<Person>('person', {
    name: 'Charles Darwin',
  })) as Person
  const participate1 = await adapter.create<Participate>('participate', {
    event_id: event1.id,
    person_id: person1.id,
  })
  const participate2 = await adapter.create<Participate>('participate', {
    event_id: event1.id,
    person_id: person2.id,
  })
  const participate3 = await adapter.create<Participate>('participate', {
    event_id: event1.id,
    person_id: person3.id,
  })
  currentData.place1 = place1
  currentData.place2 = place2
  currentData.company1 = company1
  currentData.event1 = event1
  currentData.speaker1 = speaker1
  currentData.room1 = room1
  currentData.session1 = session1
  currentData.session2 = session2
  currentData.session3 = session3
  currentData.person1 = person1
  currentData.person2 = person2
  currentData.person3 = person3
  return currentData
}

export function dropUnaccentExtension(connection: string) {
  const knexConnection = knex({ client: 'pg', connection })
  return async function () {
    await knexConnection.raw('DROP EXTENSION IF EXISTS unaccent;')
  }
}
