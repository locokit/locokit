import { GenericAdapter } from '../src'
import { beforeAll, it, expect } from 'vitest'
import {
  LocoKitEngineTestType,
  Event,
  Room,
  Place,
  Session,
  Person,
  Company,
  Participate,
} from './definitions'
import { FeatureCollectionResult } from '../src/adapters/interface'

/**
 * Data Query Language
 */
export function playDQLSuite(
  adapter: GenericAdapter,
  // configuration?: {
  //   geojsonShouldFail: boolean
  // },
) {
  const currentData: Record<string, LocoKitEngineTestType> = {}

  beforeAll(async () => {
    const place1 = await adapter.create<Place>('place', {
      name: 'Toulouse',
      point: 'POINT(1.443774704895361 43.60490776433437)',
    })
    const place2 = await adapter.create<Place>('place', {
      name: 'Bagnères de Bigorre',
      point: 'POINT(0.15045479931004024 43.065363758275254)',
    })
    const company1 = await adapter.create<Company>('company', {
      name: 'company1',
    })
    const event1 = await adapter.create<Event>('event', {
      name: 'event1',
      p_uuid: place1.p_uuid,
      c_uuid: company1.id,
    })
    const speaker1 = await adapter.create<Person>('person', {
      name: 'Speaker 1',
    })
    const room1 = await adapter.create<Room>('room', {
      name: 'room1',
      p_uuid: place1.p_uuid,
    })
    const session1 = await adapter.create<Session>('session', {
      name: 'Session 1',
      event_uuid: event1.id,
      speaker_uuid: speaker1.id,
      room_uuid: room1.r_uuid,
      begin: '2025-10-01T08:00:00',
      end: '2025-10-01T09:00:00',
    })
    const session2 = await adapter.create<Session>('session', {
      name: 'Session 2',
      event_uuid: event1.id,
      speaker_uuid: speaker1.id,
      room_uuid: room1.r_uuid,
      begin: '2025-10-01T09:00:00',
      end: '2025-10-01T10:00:00',
    })
    const session3 = await adapter.create<Session>('session', {
      name: 'Session 3',
      event_uuid: event1.id,
      speaker_uuid: speaker1.id,
      room_uuid: room1.r_uuid,
      begin: '2025-10-01T10:00:00',
      end: '2025-10-01T11:00:00',
    })
    const person1 = await adapter.create<Person>('person', {
      name: 'Jack Black',
    })
    const person2 = await adapter.create<Person>('person', {
      name: '',
    })
    const person3 = await adapter.create<Person>('person', {
      name: 'Charles Darwin',
    })
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
  })

  /**
   * DQL
   */
  it('can retrieve a single record', async () => {
    expect.assertions(1)
    const singleRecord = await adapter.get<Event>('event', (currentData.event1 as Event).id)
    expect(singleRecord.id).toBe((currentData.event1 as Event).id)
  })
  it('can retrieve records through relations with primary keys not generic', async () => {
    expect.assertions(6)
    const sessions = await adapter.query<Session>('session', {
      query: {
        $joinRelated: ['event', 'person', 'room'],
      },
    })
    expect(sessions).toBeDefined()
    expect(sessions.data.length).toBe(3)
    expect(sessions.total).toBe(3)

    const data = sessions.data as Session[]

    expect(data[0].event).toBeDefined()
    expect(data[0].person).toBeDefined()
    expect(data[0].room).toBeDefined()
  })
  it('throw errors when retrieving records with relation that does not exist', async () => {
    expect.assertions(1)
    await expect(
      adapter.query<Session>('session', {
        query: {
          $joinRelated: ['pouet'],
        },
      }),
    ).rejects.toThrow()
  })
  it('can retrieve records through relations with primary keys generic `id`', async () => {
    const events = await adapter.query<Event>('event', {
      query: {
        $joinRelated: ['company'],
      },
    })
    expect(events.total).toBe(1)
    expect(events.data[0].company).toBeDefined()
    expect(events.data[0].company.id).toBe(currentData.company1.id)
  })
  it('can retrieve records for tables with composite keys', async () => {
    expect.assertions(4)
    const participations = await adapter.query<Participate>('participate')
    expect(participations.total).toBe(3)
    expect(participations.data[0].event_id).toBe(currentData.event1.id)
    expect(participations.data[1].event_id).toBe(currentData.event1.id)
    expect(participations.data[2].event_id).toBe(currentData.event1.id)
  })
  it('can retrieve records for tables with composite keys and their relations', async () => {
    expect.assertions(4)
    const participations = await adapter.query<Event>('participate', {
      query: {
        $joinRelated: ['event', 'person'],
      },
    })
    expect(participations.total).toBe(3)
    expect(participations.data[0].event.id).toBe(currentData.event1.id)
    expect(participations.data[1].event.id).toBe(currentData.event1.id)
    expect(participations.data[2].event.id).toBe(currentData.event1.id)
  })
  it('can retrieve records in a paginated way', async function () {
    expect.assertions(5)
    const sessions = await adapter.query<Session>('session')
    expect(sessions).toBeDefined()
    expect(sessions.limit).toBe(20)
    expect(sessions.skip).toBe(0)
    expect(sessions.data.length).toBe(3)
    expect(sessions.total).toBe(3)
  })
  it('can retrieve records through a geojson output if available', async () => {
    expect.assertions(8)
    const places = (await adapter.query('place', {
      query: {
        $output: 'geojson',
      },
    })) as FeatureCollectionResult<Place>
    console.log(places.data.features[0])
    expect(places).toBeDefined()
    expect(places.total).toBe(2)
    expect(places.data.type).toBe('FeatureCollection')
    expect(places.data.features.length).toBe(2)
    expect(places.data.features[0].geometry).toBeDefined()
    expect(places.data.features[0].geometry.type).toBe('Point')
    expect(places.data.features[0].geometry.coordinates[0]).toBeCloseTo(1.443774704895361, 4)
    expect(places.data.features[0].geometry.coordinates[1]).toBeCloseTo(43.60490776433437, 4)
  })
  it('can not retrieve records through a geojson output if not available in the model', async () => {
    expect.assertions(2)
    const query = adapter.query('event', {
      query: {
        $output: 'geojson',
      },
    })
    await expect(query).rejects.toThrow()
    // DataError: select ST_asGeoJSON(agj.*)::jsonb as "data" from "lck-engine"."event" as "agj" limit $1 - geometry column is missing
    await expect(query).rejects.toThrowError(/geometry column is missing/)
  })
  it('can filter data through ilike operator', async () => {
    expect.assertions(3)
    const persons = await adapter.query('person', {
      query: {
        name: {
          $ilike: '%dar%',
        },
      },
    })
    console.log(persons)
    expect(persons).toBeDefined()
    expect(persons.total).toBe(1)
    expect(persons.data[0].id).toBe(currentData.person3.id)
  })
  it('can filter data through unaccent operator if available', async () => {
    expect.assertions(3)
    const places = await adapter.query('place', {
      query: {
        name: {
          $unaccent: '%bagnere%',
        },
      },
    })
    expect(places).toBeDefined()
    expect(places.total).toBe(1)
    expect(places.data[0].id).toBe(currentData.place2.id)
  })
  it.todo('can not filter data through unaccent operator if not available')
  it.todo(
    'can retrieve multiple relations to the same foreign table, with different relation names',
  )
}
