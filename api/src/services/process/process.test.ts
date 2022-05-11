import app from '../../app'
import { SetupData, builderTestEnvironment } from '../../abilities/helpers'
import { Process, ProcessTrigger } from '../../models/process.model'
import { Paginated, Params } from '@feathersjs/feathers'
import { Forbidden, NotAcceptable, NotFound } from '@feathersjs/errors'
import { ProcessRun, ProcessRunStatus } from '../../models/process_run.model'
import { wait } from '../../utils/wait.test'

describe('\'process\' service', () => {
  let setupData: SetupData
  const builder = builderTestEnvironment('process')
  const service = app.service('process')

  beforeAll(async () => {
    /**
     * Create a workspace
     */
    setupData = await builder.setupWorkspace()
  })

  describe('registrate', () => {
    it('registered the service', () => {
      expect(service).toBeTruthy()
    })
  })

  describe('abilities for SUPERADMIN users', () => {
    let superAdmin
    let superAdminAuthent
    let superAdminParams: Params

    beforeEach(async () => {
      superAdmin = setupData.userSuperAdmin
      superAdminAuthent = setupData.userSuperAdminAuthentication
      superAdminParams = {
        provider: 'external',
        user: superAdmin,
        accessToken: superAdminAuthent.accessToken,
        authenticated: true,
      }
    })

    it('allows to create process', async () => {
      expect.assertions(2)
      const p = await service.create({
        workspace_id: setupData.workspace1Id,
        trigger: ProcessTrigger.MANUAL,
        url: 'http://localhost',
      }, superAdminParams) as Process
      expect(p).toBeDefined()
      expect(p.workspace_id).toBe(setupData.workspace1Id)
      await service.remove(p.id)
    })

    it('allows to update process', async () => {
      expect.assertions(6)
      const p = await service.create({
        workspace_id: setupData.workspace1Id,
        trigger: ProcessTrigger.MANUAL,
        url: 'http://localhost',
      }, superAdminParams) as Process
      expect(p).toBeDefined()
      expect(p.workspace_id).toBe(setupData.workspace1Id)

      p.text = 'process updated'
      p.enabled = true
      p.maximumNumberSuccess = 4
      p.url = 'https://localhost:3000/'

      const updatedP = await service.update(p.id, p, superAdminParams)
      expect(updatedP.text).toBe('process updated')
      expect(updatedP.enabled).toBe(true)
      expect(updatedP.maximumNumberSuccess).toBe(4)
      expect(updatedP.url).toBe('https://localhost:3000/')
      await service.remove(p.id)
    })

    it('allows to read process', async () => {
      expect.assertions(2)
      const p = await service.create({
        workspace_id: setupData.workspace1Id,
        trigger: ProcessTrigger.MANUAL,
        url: 'http://localhost',
      }, superAdminParams) as Process

      const processes = await service.find({
        query: {
          workspace_id: setupData.workspace1Id,
        },
      }) as Paginated<Process>
      expect(processes.total).toBe(1)
      expect(processes.data[0].id).toBe(p.id)
      await service.remove(p.id)
    })

    it('allows to remove process', async () => {
      expect.assertions(0)
      const p = await service.create({
        workspace_id: setupData.workspace1Id,
        trigger: ProcessTrigger.MANUAL,
        url: 'http://localhost',
      }, superAdminParams) as Process
      await service.remove(p.id, superAdminParams)
    })

    // it('allows to trigger process', async () => {
    //   expect.assertions(1)
    // })
  })
  describe('for ADMIN users', () => {
    let admin
    let adminAuthent
    let adminParams: Params

    beforeEach(async () => {
      admin = setupData.userAdmin
      adminAuthent = setupData.userAdminAuthentication
      adminParams = {
        provider: 'external',
        user: admin,
        accessToken: adminAuthent.accessToken,
        authenticated: true,
      }
    })

    it('allows to create process', async () => {
      expect.assertions(2)
      const p = await service.create({
        workspace_id: setupData.workspace1Id,
        trigger: ProcessTrigger.MANUAL,
        url: 'http://localhost',
      }, adminParams) as Process
      expect(p).toBeDefined()
      expect(p.workspace_id).toBe(setupData.workspace1Id)
      await service.remove(p.id)
    })

    it('allows to update process', async () => {
      expect.assertions(6)
      const p = await service.create({
        workspace_id: setupData.workspace1Id,
        trigger: ProcessTrigger.MANUAL,
        url: 'http://localhost',
      }, adminParams) as Process
      expect(p).toBeDefined()
      expect(p.workspace_id).toBe(setupData.workspace1Id)

      p.text = 'process updated'
      p.enabled = true
      p.maximumNumberSuccess = 4
      p.url = 'https://localhost:3000/'

      const updatedP = await service.update(p.id, p, adminParams)
      expect(updatedP.text).toBe('process updated')
      expect(updatedP.enabled).toBe(true)
      expect(updatedP.maximumNumberSuccess).toBe(4)
      expect(updatedP.url).toBe('https://localhost:3000/')
      await service.remove(p.id)
    })

    it('allows to read process', async () => {
      expect.assertions(2)
      const p = await service.create({
        workspace_id: setupData.workspace1Id,
        trigger: ProcessTrigger.MANUAL,
        url: 'http://localhost',
      }, adminParams) as Process

      const processes = await service.find({
        query: {
          workspace_id: setupData.workspace1Id,
        },
      }) as Paginated<Process>
      expect(processes.total).toBe(1)
      expect(processes.data[0].id).toBe(p.id)
      await service.remove(p.id)
    })

    it('allows to remove process', async () => {
      expect.assertions(0)
      const p = await service.create({
        workspace_id: setupData.workspace1Id,
        trigger: ProcessTrigger.MANUAL,
        url: 'http://localhost',
      }, adminParams) as Process
      await service.remove(p.id, adminParams)
    })
  })
  describe('for manager users', () => {
    let user1
    let user1Authent
    let user1Params: Params

    beforeEach(async () => {
      user1 = setupData.user1
      user1Authent = setupData.user1Authentication
      user1Params = {
        provider: 'external',
        user: user1,
        accessToken: user1Authent.accessToken,
        authenticated: true,
      }
    })

    it('allows to create process on a workspace user is manager', async () => {
      expect.assertions(2)
      const p = await service.create({
        workspace_id: setupData.workspace1Id,
        trigger: ProcessTrigger.MANUAL,
        url: 'http://localhost',
      }, user1Params) as Process
      expect(p).toBeDefined()
      expect(p.workspace_id).toBe(setupData.workspace1Id)
      await service.remove(p.id)
    })
    it('allows to update process on a workspace user is manager', async () => {
      expect.assertions(6)
      const p = await service.create({
        workspace_id: setupData.workspace1Id,
        trigger: ProcessTrigger.MANUAL,
        url: 'http://localhost',
      }, user1Params) as Process
      expect(p).toBeDefined()
      expect(p.workspace_id).toBe(setupData.workspace1Id)

      p.text = 'process updated'
      p.enabled = true
      p.maximumNumberSuccess = 4
      p.url = 'https://localhost:3000/'

      const updatedP = await service.update(p.id, p, user1Params)
      expect(updatedP.text).toBe('process updated')
      expect(updatedP.enabled).toBe(true)
      expect(updatedP.maximumNumberSuccess).toBe(4)
      expect(updatedP.url).toBe('https://localhost:3000/')
      await service.remove(p.id)
    })
    it('forbid to update process workspace_id on a workspace user is manager', async () => {
      expect.assertions(3)
      const p = await service.create({
        workspace_id: setupData.workspace1Id,
        trigger: ProcessTrigger.MANUAL,
        url: 'http://localhost',
      }, user1Params) as Process
      expect(p).toBeDefined()
      expect(p.workspace_id).toBe(setupData.workspace1Id)

      p.workspace_id = setupData.workspace2Id

      await expect(service.update(p.id, p, user1Params)).rejects.toThrow(NotAcceptable)
      await service.remove(p.id)
    })
    it('allows to read process on a workspace user is manager', async () => {
      expect.assertions(2)
      const p = await service.create({
        workspace_id: setupData.workspace1Id,
        trigger: ProcessTrigger.MANUAL,
        url: 'http://localhost',
      }, user1Params) as Process

      const processes = await service.find({
        query: {
          workspace_id: setupData.workspace1Id,
        },
        ...user1Params,
      }) as Paginated<Process>
      expect(processes.total).toBe(1)
      expect(processes.data[0].id).toBe(p.id)
      await service.remove(p.id)
    })
    it('allows to remove process on a workspace user is manager', async () => {
      expect.assertions(0)
      const p = await service.create({
        workspace_id: setupData.workspace1Id,
        trigger: ProcessTrigger.MANUAL,
        url: 'http://localhost',
      }, user1Params) as Process
      await service.remove(p.id, user1Params)
    })
    it('allows to trigger process on a workspace user is manager', async () => {
      expect.assertions(2)
      const p = await service.create({
        workspace_id: setupData.workspace1Id,
        trigger: ProcessTrigger.MANUAL,
        url: 'http://localhost',
      }, user1Params) as Process

      const run = await app.services['process-run'].create({
        process_id: p.id,
      }, user1Params) as ProcessRun

      expect(run).toBeDefined()
      expect(run.status).toBe(ProcessRunStatus.RUNNING)
      await service.remove(p.id)
    })

    it('forbid to create process on a workspace user is not manager', async () => {
      expect.assertions(1)
      await expect(service.create({
        workspace_id: setupData.workspace2Id,
        trigger: ProcessTrigger.MANUAL,
      }, user1Params)).rejects.toThrow(Forbidden)
    })
    it('forbid to update process on a workspace user is not manager', async () => {
      expect.assertions(3)
      const p = await service.create({
        workspace_id: setupData.workspace2Id,
        trigger: ProcessTrigger.MANUAL,
        url: 'http://localhost',
      }) as Process
      expect(p).toBeDefined()
      expect(p.workspace_id).toBe(setupData.workspace2Id)

      p.text = 'process updated'
      p.enabled = true
      p.maximumNumberSuccess = 4
      p.url = 'https://localhost:3000/'

      await expect(service.update(p.id, p, user1Params)).rejects.toThrow(NotFound)
      await service.remove(p.id)
    })
    it('forbid to read process on a workspace user is not manager', async () => {
      expect.assertions(1)
      const p = await service.create({
        workspace_id: setupData.workspace2Id,
        trigger: ProcessTrigger.MANUAL,
        url: 'http://localhost',
      }) as Process

      await expect(service.find({
        query: {
          workspace_id: setupData.workspace2Id,
        },
        ...user1Params,
      })).rejects.toThrow(Forbidden)
      await service.remove(p.id)
    })
    it('forbid to remove process on a workspace user is not manager', async () => {
      expect.assertions(1)
      const p = await service.create({
        workspace_id: setupData.workspace2Id,
        trigger: ProcessTrigger.MANUAL,
        url: 'http://localhost',
      }) as Process

      await expect(service.remove(p.id, user1Params)).rejects.toThrow(Forbidden)
      await service.remove(p.id)
    })
    it('forbid to trigger process on a workspace user is not manager', async () => {
      expect.assertions(1)
      const p = await service.create({
        workspace_id: setupData.workspace2Id,
        trigger: ProcessTrigger.MANUAL,
        url: 'http://localhost',
      }) as Process

      await expect(app.services['process-run'].create({
        process_id: p.id,
      }, user1Params)).rejects.toThrow(Forbidden)

      await service.remove(p.id)
    })
    it('allow to trigger process on a workspace user is not manager by, eg, adding new record', async () => {
      expect.assertions(4)
      const p = await service.create({
        workspace_id: setupData.workspace2Id,
        trigger: ProcessTrigger.CREATE_ROW,
        table_id: setupData.table1Workspace2Id,
        url: 'http://localhost',
        enabled: true,
      }) as Process

      /**
       * Allow user related to ACL 4 to create new records in table1
       */
      await app.services.acltable.create({
        aclset_id: setupData.aclset4.id,
        table_id: setupData.table1Workspace2Id,
        create_rows: true,
      })

      const record1 = await app.services.row.create({
        table_id: setupData.table1Workspace2Id,
        data: {
          [setupData.columnTable1W2Ref]: 'ref process 1',
          [setupData.columnTable1W2Name]: 'name of the record 1',
        },
      }, user1Params)

      const runs = await app.services['process-run'].find({
        query: {
          process_id: p.id,
        },
      }) as Paginated<ProcessRun>

      expect(runs).toBeDefined()
      expect(runs.total).toBe(1)
      // the workflow need to throw an error as URL does not exist
      // expect(runs.data[0].status).toBe(ProcessRunStatus.ERROR)
      expect(runs.data[0].table_row_id).toBe(record1.id)
      expect(runs.data[0].process_id).toBe(p.id)
      console.log(runs.data[0].id)
      console.log(record1.id)
      console.log(p.id)
      await wait(1000)
      await app.services['process-run'].remove(runs.data[0].id)
      await app.services.row.remove(record1.id)
      await service.remove(p.id)
    })
  })
  describe('for lambda users', () => {
    let user2
    let user2Authent
    let user2Params: Params

    beforeEach(async () => {
      user2 = setupData.user2
      user2Authent = setupData.user2Authentication
      user2Params = {
        provider: 'external',
        user: user2,
        accessToken: user2Authent.accessToken,
        authenticated: true,
      }
    })

    it('forbid to create process on a workspace user has access to', async () => {
      expect.assertions(1)
      await expect(service.create({
        workspace_id: setupData.workspace1Id,
        trigger: ProcessTrigger.MANUAL,
        url: 'http://localhost',
      }, user2Params)).rejects.toThrow(Forbidden)
    })
    it('forbid to update process on a workspace user has access to', async () => {
      expect.assertions(3)
      const p = await service.create({
        workspace_id: setupData.workspace1Id,
        trigger: ProcessTrigger.MANUAL,
        url: 'http://localhost',
      }) as Process
      expect(p).toBeDefined()
      expect(p.workspace_id).toBe(setupData.workspace1Id)

      p.text = 'process updated'
      p.enabled = true
      p.maximumNumberSuccess = 4
      p.url = 'https://localhost:3000/'

      await expect(service.update(p.id, p, user2Params)).rejects.toThrow(Forbidden)
      await service.remove(p.id)
    })
    it('forbid to read process on a workspace user has access to', async () => {
      expect.assertions(1)
      const p = await service.create({
        workspace_id: setupData.workspace1Id,
        trigger: ProcessTrigger.MANUAL,
        url: 'http://localhost',
      }) as Process

      await expect(service.find({
        query: {
          workspace_id: setupData.workspace1Id,
        },
        ...user2Params,
      })).rejects.toThrow(Forbidden)
      await service.remove(p.id)
    })
    it('forbid to remove process on a workspace user has access to', async () => {
      expect.assertions(1)
      const p = await service.create({
        workspace_id: setupData.workspace1Id,
        trigger: ProcessTrigger.MANUAL,
        url: 'http://localhost',
      }) as Process

      await expect(service.remove(p.id, user2Params)).rejects.toThrow(Forbidden)
      await service.remove(p.id)
    })
    it('forbid to trigger process on a workspace user has access to', async () => {
      expect.assertions(1)
      const p = await service.create({
        workspace_id: setupData.workspace1Id,
        trigger: ProcessTrigger.MANUAL,
        url: 'http://localhost',
      }) as Process

      await expect(app.services['process-run'].create({
        process_id: p.id,
      }, user2Params)).rejects.toThrow(Forbidden)

      await service.remove(p.id)
    })

    it('allow the user to trigger a process indirectly with CREATE_ROW trigger', async () => {
      expect.assertions(4)
      const p = await service.create({
        workspace_id: setupData.workspace1Id,
        trigger: ProcessTrigger.CREATE_ROW,
        table_id: setupData.table1Id,
        enabled: true,
        url: 'http://localhost',
      }) as Process
      /**
       * Allow user related to ACL 4 to create new records in table1
       */
      await app.services.acltable.create({
        aclset_id: setupData.aclset2.id,
        table_id: setupData.table1Id,
        create_rows: true,
      })

      const record1 = await app.services.row.create({
        table_id: setupData.table1Id,
      }, user2Params)

      const runs = await app.services['process-run'].find({
        query: {
          process_id: p.id,
        },
      }) as Paginated<ProcessRun>

      expect(runs).toBeDefined()
      expect(runs.total).toBe(1)
      // the workflow need to throw an error as URL does not exist
      expect(runs.data[0].table_row_id).toBe(record1.id)
      expect(runs.data[0].process_id).toBe(p.id)
      console.log('run', runs.data[0].id)
      console.log('record', record1.id)
      console.log('process', p.id)
      await wait(1000)
      await app.services['process-run'].remove(runs.data[0].id)
      await app.services.row.remove(record1.id)
      await service.remove(p.id)
    })
  })
  afterAll(async () => {
    await builder.teardownWorkspace()
  })
})
