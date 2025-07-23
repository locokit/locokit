import { GenericAdapter } from '../src'
import { beforeAll, it, expect } from 'vitest'
import { Company, Room, Session, LocoKitEngineTestType } from './definitions'
import { seedEventDatasource } from './adapters/pg/pg.init'

/**
 * Data Manipulation Language suite
 */
export function playDMLSuite(
  adapter: GenericAdapter,
  configuration?: {
    geojsonShouldFail: boolean
  },
) {
  let currentData: Record<string, LocoKitEngineTestType> = {}

  beforeAll(async () => {
    currentData = await seedEventDatasource(adapter)
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
