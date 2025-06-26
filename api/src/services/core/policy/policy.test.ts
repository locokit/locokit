import { SERVICES } from '@locokit/definitions'
import { describe, it, assert, afterAll, beforeAll } from 'vitest'
import { createApp } from '../../../app'
import { Application } from '@/declarations'
// import { builderTestEnvironment, SetupData } from '@/configure.test'
import { Server } from 'http'

describe('[core] policy service', () => {
  let app: Application
  let server: Server
  let port: number
  // let builder: ReturnType<typeof builderTestEnvironment>
  // let setupData: SetupData

  beforeAll(async () => {
    app = createApp()
    // builder = builderTestEnvironment('core-polict', app)
    port = app.get('port') || 8998
    // setupData = await builder.setupWorkspace()
    await app.listen(port)
  })

  afterAll(async () => {
    // await builder.teardownWorkspace()
    await app.teardown(server)
  })

  it('registered the service', () => {
    const service = app.service(SERVICES.CORE_POLICY)

    assert.ok(service, 'Registered the service')
  })

  it('returns all group users when queried with $joinRelated users')

  it('creates a new group if user is ADMIN')

  it('creates a new group in a workspace if the user is CREATOR')
})
