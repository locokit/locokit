import app from '../../app'
import { open, rm } from 'fs/promises'
import path from 'path'
import uploadService from '../upload/upload.service'

import { SetupData, builderTestEnvironment } from '../../abilities/helpers'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { Paginated } from '@feathersjs/feathers'
import { LckAttachment } from '../../models/attachment.model'
import { TableColumn } from '../../models/tablecolumn.model'
import { createAbility } from '../../abilities/attachment.abilities'
import { Forbidden, NotAcceptable, NotFound } from '@feathersjs/errors'

describe('\'attachment\' service', () => {
  let setupData: SetupData
  const builder = builderTestEnvironment('attachment')
  let columnTable1Label: TableColumn
  let columnTable1File: TableColumn
  let columnTable1User: TableColumn
  let columnTable1Group: TableColumn
  // let row1Table1: TableRow
  // let row2Table1: TableRow
  // let row3Table1: TableRow
  // let row4Table1: TableRow
  let attachment1: LckAttachment
  let attachment2: LckAttachment
  const fsPath = '../fs-storage'
  const oldStorageConfig = app.get('storage')
  const fsConfig = {
    ...oldStorageConfig,
    type: 'fs',
    publicPath: '/fs-storage',
    fsPath,
  }

  it('registered the service', () => {
    expect.assertions(1)
    const service = app.service('attachment')
    expect(service).toBeTruthy()
  })

  beforeAll(async () => {
    /**
     * Create a workspace
     */
    setupData = await builder.setupWorkspace()

    /**
     * Upload a file
     */
    app.set('storage', fsConfig)
    // empty the folder of file storage
    try {
      await rm(fsPath, { recursive: true })
    } catch (error) {
      console.error('error during rm of ' + fsPath + ' (don\'t worry, be happy)')
    }

    // configure again the service to take the new config
    // this would create the folder fs-storage if necessary
    app.configure(uploadService)

    /**
     * Create a new attachment on a workspace
     */
    const file1 = await open(path.join(__dirname, '../../../public/logo.png'), 'r')
    const buffer1 = await file1.readFile()
    attachment1 = await app.service('upload').create({
      buffer: buffer1,
      contentType: 'image/png',
    }, {
      query: {
        workspaceId: setupData.workspace1Id,
        fileName: 'logo.png',
        contentType: 'image/png',
      },
    }) as LckAttachment
    await file1.close()
    const file2 = await open(path.join(__dirname, '../../../public/logo-dark.svg'), 'r')
    const buffer2 = await file2.readFile()
    attachment2 = await app.service('upload').create({
      buffer: buffer2,
      contentType: 'image/svg',
    }, {
      query: {
        workspaceId: setupData.workspace1Id,
        fileName: 'logo-dark.svg',
        contentType: 'image/svg',
      },
    }) as LckAttachment

    await file2.close()
    /**
     * Create a table + column file
     */
    const tableFile = await app.service('table').create({
      database_id: setupData.database1Id,
      text: 'attachement table with file',
    })
    columnTable1Label = await app.service('column').create({
      text: 'Label',
      column_type_id: COLUMN_TYPE.STRING,
      table_id: tableFile.id,
    })
    columnTable1File = await app.service('column').create({
      text: 'File',
      column_type_id: COLUMN_TYPE.FILE,
      table_id: tableFile.id,
    })
    columnTable1User = await app.service('column').create({
      text: 'User',
      column_type_id: COLUMN_TYPE.USER,
      table_id: tableFile.id,
    })
    columnTable1Group = await app.service('column').create({
      text: 'Group',
      column_type_id: COLUMN_TYPE.GROUP,
      table_id: tableFile.id,
    })

    /* row1Table1 = */ await app.service('row').create({
      table_id: tableFile.id,
      text: 'Row 1 Table File',
      data: {
        [columnTable1Label.id]: 'Label 1',
        [columnTable1File.id]: null,
        [columnTable1User.id]: setupData.user1.id,
        [columnTable1Group.id]: setupData.group1.id,
      },
    })

    /* row2Table1 = */ await app.service('row').create({
      table_id: tableFile.id,
      text: 'Row 2 Table File',
      data: {
        [columnTable1Label.id]: 'Label 3',
        [columnTable1File.id]: [attachment1.id],
        [columnTable1User.id]: setupData.user3.id,
        [columnTable1Group.id]: setupData.group5.id,
      },
    })

    /* row3Table1 = */ await app.service('row').create({
      table_id: tableFile.id,
      text: 'Row 3 Table File',
      data: {
        [columnTable1Label.id]: 'Label 4',
        [columnTable1File.id]: null,
        [columnTable1User.id]: setupData.user4.id,
        [columnTable1Group.id]: setupData.group2.id,
      },
    })

    /* row4Table1 = */ await app.service('row').create({
      table_id: tableFile.id,
      text: 'Row 4 Table File',
      data: {
        [columnTable1Label.id]: 'Label 4',
        [columnTable1File.id]: [attachment2.id],
        [columnTable1User.id]: setupData.user4.id,
        [columnTable1Group.id]: setupData.group5.id,
      },
    })

    await app.service('acltable').create({
      aclset_id: setupData.aclset2.id,
      table_id: tableFile.id,
      read_rows: true,
      read_filter: {
        data: {
          [`${columnTable1User.id as string}.reference`]: '{userId}',
        },
      },
    })
    await app.service('acltable').create({
      aclset_id: setupData.aclset5.id,
      table_id: tableFile.id,
      read_rows: true,
      read_filter: {
        data: {
          [`${columnTable1Group.id as string}.reference`]: '{groupId}',
        },
      },
    })
  })

  it('forbid users to use `find` endpoint if no workspace_id query params is set', async () => {
    expect.assertions(1)
    await expect(app.service('attachment').find({
      provider: 'external',
      user: setupData.user1,
      accessToken: setupData.user1Authentication.accessToken,
      authenticated: true,
    })).rejects.toThrow(NotAcceptable)
  })

  it('allow only ADMIN/SUPERADMIN users to use the `find` endpoint without any workspace_id query param', async () => {
    expect.assertions(6)

    const adminAttachments = await app.service('attachment').find({
      provider: 'external',
      user: setupData.userAdmin,
      accessToken: setupData.userAdminAuthentication.accessToken,
      authenticated: true,
    }) as Paginated<LckAttachment>
    expect(adminAttachments.total).toBe(2)
    expect(adminAttachments.data.find(a => a.id === attachment1.id)).toStrictEqual(attachment1)
    expect(adminAttachments.data.find(a => a.id === attachment2.id)).toStrictEqual(attachment2)

    const superAdminAttachments = await app.service('attachment').find({
      provider: 'external',
      user: setupData.userSuperAdmin,
      accessToken: setupData.userSuperAdminAuthentication.accessToken,
      authenticated: true,
    }) as Paginated<LckAttachment>
    expect(superAdminAttachments.total).toBe(2)
    expect(superAdminAttachments.data.find(a => a.id === attachment1.id)).toStrictEqual(attachment1)
    expect(superAdminAttachments.data.find(a => a.id === attachment2.id)).toStrictEqual(attachment2)
  })

  it('returns one attachment for user3 (MEMBER of a workspace group not manager) when using `find` endpoint with a workspace_id', async () => {
    expect.assertions(2)

    const attachments = await app.service('attachment').find({
      query: {
        workspace_id: setupData.workspace1Id,
      },
      provider: 'external',
      user: setupData.user3,
      accessToken: setupData.user3Authentication.accessToken,
      authenticated: true,
    }) as Paginated<LckAttachment>
    expect(attachments.total).toBe(1)
    expect(attachments.data[0].id).toBe(attachment1.id)
  })

  it('returns all attachment for user4 (MEMBER of a workspace group manager) when using `find` endpoint with a workspace_id', async () => {
    expect.assertions(2)

    const ability = await createAbility(setupData.user4, app.services, 'find', setupData.workspace1Id)
    expect(ability.can('read', 'attachment')).toBe(true)

    const attachments = await app.service('attachment').find({
      query: {
        workspace_id: setupData.workspace1Id,
      },
      provider: 'external',
      user: setupData.user4,
      accessToken: setupData.user4Authentication.accessToken,
      authenticated: true,
    }) as Paginated<LckAttachment>

    expect(attachments.total).toBe(2)
  })

  it('returns all attachment available for the user5, member of 2 groups (not manager) when using `find` attachment for the workspace', async () => {
    expect.assertions(2)

    const ability = await createAbility(setupData.user5, app.services, 'find', setupData.workspace1Id)
    expect(ability.can('read', 'attachment')).toBe(true)

    const attachments = await app.service('attachment').find({
      query: {
        workspace_id: setupData.workspace1Id,
      },
      provider: 'external',
      user: setupData.user5,
      accessToken: setupData.user5Authentication.accessToken,
      authenticated: true,
    }) as Paginated<LckAttachment>
    expect(attachments.total).toBe(2)
  })

  it('returns all attachments for ADMIN/SUPERADMIN users to use the `find` endpoint with a workspace_id query param', async () => {
    expect.assertions(2)

    const attachmentsAdmin = await app.service('attachment').find({
      provider: 'external',
      user: setupData.userAdmin,
      accessToken: setupData.userAdminAuthentication.accessToken,
      authenticated: true,
    }) as Paginated<LckAttachment>
    expect(attachmentsAdmin.total).toBe(2)

    const attachmentsSuperAdmin = await app.service('attachment').find({
      provider: 'external',
      user: setupData.userSuperAdmin,
      accessToken: setupData.userSuperAdminAuthentication.accessToken,
      authenticated: true,
    }) as Paginated<LckAttachment>
    expect(attachmentsSuperAdmin.total).toBe(2)
  })

  it('remove the attachement (n2) by a manager user (4) and the uploaded file if related rows are still present', async () => {
    expect.assertions(2)

    const attachment = await app.service('attachment').remove(attachment2.id, {
      provider: 'external',
      user: setupData.user4,
      accessToken: setupData.user4Authentication.accessToken,
      authenticated: true,
    }) as LckAttachment
    expect(attachment).toBeDefined()
    /**
     * Try to get the upload file,
     * need to be a 404
     */
    await expect(app.service('upload').get(attachment.filename, {
      query: {
        workspace_id: attachment.workspace_id,
      },
    })).rejects.toThrow()
  })

  it('forbid the GET on an attachment for a user (2) that do not have access to it', async () => {
    expect.assertions(1)
    await expect(app.service('attachment').get(attachment1.id, {
      provider: 'external',
      user: setupData.user2,
      accessToken: setupData.user2Authentication.accessToken,
      authenticated: true,
    })).rejects.toThrow(NotFound)
  })
  it('forbid the PATCH on an attachment for a user (2) that do not have permission to it', async () => {
    expect.assertions(1)
    await expect(app.service('attachment').patch(attachment1.id, {}, {
      provider: 'external',
      user: setupData.user2,
      accessToken: setupData.user2Authentication.accessToken,
      authenticated: true,
    })).rejects.toThrow(Forbidden)
  })
  it('forbid the UPDATE on an attachment for a user (2) that do not have permission to it', async () => {
    expect.assertions(1)
    await expect(app.service('attachment').update(attachment1.id, {}, {
      provider: 'external',
      user: setupData.user2,
      accessToken: setupData.user2Authentication.accessToken,
      authenticated: true,
    })).rejects.toThrow(Forbidden)
  })

  afterAll(async () => {
    await builder.teardownWorkspace()
  })
})
