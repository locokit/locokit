import { GenericAdapter } from '../src'
import { beforeAll, it, expect } from 'vitest'
import {
  Place,
  Company,
  Person,
  Room,
  Session,
  Participate,
  Event,
  LocoKitEngineTestType,
} from './definitions'

/**
 * Data Manipulation Language suite
 */
export function playDMLSuite(
  adapter: GenericAdapter,
  configuration?: {
    geojsonShouldFail: boolean
  },
) {
  const currentData: Record<string, LocoKitEngineTestType> = {}

  beforeAll(async () => {
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
  })

  it('can insert new data', async () => {
    expect.assertions(2)
    const company2 = (await adapter.create<Company>('company', {
      name: 'company2',
    })) as Company
    expect(company2).toBeDefined()
    expect(company2.name).toBe('company2')
  })
  it('can patch data', async () => {
    expect.assertions(1)
    const sessionPatched = (await adapter.patch<Session>(
      'session',
      currentData.session1.s_uuid as string,
      {
        begin: '2025-10-01T19:00:00',
      },
    )) as Session
    expect((sessionPatched.begin as unknown as Date).toISOString()).toBe('2025-10-01T19:00:00.000Z')
  })
  it('can update data', async () => {
    expect.assertions(4)
    const room2 = (await adapter.create<Room>('room', {
      name: 'room2',
      p_uuid: currentData.place1.p_uuid,
    })) as Room
    expect(room2).toBeDefined()
    const room3 = await adapter.update<Room>('room', room2.r_uuid, {
      name: 'room3',
      p_uuid: currentData.place2.p_uuid,
    })
    expect(room3).toBeDefined()
    expect(room3.name).toBe('room3')
    expect(room3.p_uuid).toBe(currentData.place2.p_uuid)
  })
  it('can delete data', async () => {
    expect.assertions(2)
    const room2 = (await adapter.create<Room>('room', {
      name: 'room2',
      p_uuid: currentData.place1.p_uuid,
    })) as Room
    expect(room2).toBeDefined()
    await adapter.delete<Room>('room', room2.r_uuid)
    const check = adapter.get<Room>('room', room2.r_uuid)
    await expect(check).rejects.toThrowError(/NotFoundError/)
  })

  it('can patch data with dedicated filters for security purpose', async () => {
    expect.assertions(1)
    const sessionPatched = (await adapter.patch<Session>(
      'session',
      currentData.session1.s_uuid as string,
      {
        begin: '2025-10-01T19:00:00',
      },
      {
        query: {
          $join: 'event as lck_event',
          'lck_event.name': 'event1',
        },
      },
    )) as Session
    expect((sessionPatched.begin as unknown as Date).toISOString()).toBe('2025-10-01T19:00:00.000Z')
  })
  it('cannot patch data with dedicated filters for security purpose if user cannot access the record', async () => {
    expect.assertions(1)
    const req = adapter.patch<Session>(
      'session',
      currentData.session1.s_uuid as string,
      {
        begin: '2025-10-01T19:00:00',
      },
      {
        query: {
          $join: 'event as lck_event',
          'lck_event.name': 'event2',
        },
      },
    )
    await expect(req).rejects.toThrowError(/NotFoundError/)
  })
  it('can remove data with dedicated filters for security purpose', async () => {
    expect.assertions(1)
    const sessionRemoved = (await adapter.delete<Session>(
      'session',
      currentData.session1.s_uuid as string,
    )) as Session
    expect(sessionRemoved).toBe(1)
  })
  it('cannot remove data with dedicated filters for security purpose if user cannot access the record', async () => {
    expect.assertions(1)
    const req = adapter.delete<Session>('session', currentData.session1.s_uuid as string, {
      query: {
        $join: 'event as lck_event',
        'lck_event.name': 'event2',
      },
    })
    await expect(req).rejects.toThrowError(/NotFoundError/)
  })
}
