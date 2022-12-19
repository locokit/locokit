import app from '../../app'
import { open, rm, mkdir, access, readdir } from 'fs/promises'
import path from 'path'
// import AWS from 'aws-sdk'
import uploadService from './upload.service'
import { Forbidden, NotAcceptable } from '@feathersjs/errors'
import { Paginated } from '@feathersjs/feathers'
import { LckAttachment } from '../../models/attachment.model'
import { builderTestEnvironment, SetupData } from '../../abilities/helpers'

describe('\'upload\' service', () => {
  let setupData: SetupData
  const builder = builderTestEnvironment('attachment')

  it('registered the service', () => {
    expect(app.service('upload')).toBeTruthy()
  })

  describe('for file storage', () => {
    const fsPath = '../fs-storage'
    let workspaceId: string
    const oldStorageConfig = app.get('storage')
    const fsConfig = {
      ...oldStorageConfig,
      type: 'fs',
      publicPath: '/fs-storage',
      fsPath,
    }
    beforeAll(async () => {
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
       * Create a workspace
       */
      setupData = await builder.setupWorkspace()

      /**
       * Create a new attachment on a workspace
       */
      const workspace = await app.service('workspace').create({ text: 'pouet' })
      workspaceId = workspace.id

      // no need to create the fsPath directory
      // await mkdir(fsPath)

      // upload a new file
      const file = await open(path.join(__dirname, '../../../public/logo.png'), 'r')
      const buffer = await file.readFile()
      await app.service('upload').create({
        buffer,
        contentType: 'image/png',
      }, {
        query: {
          workspace_id: workspaceId,
          fileName: 'logo.png',
          contentType: 'image/png',
        },
      })
      await file.close()
    })
    it('create the workspace folder if it does not exist', async () => {
      expect.assertions(1)
      const hasAccess = await access(path.join(fsPath, workspaceId))
      expect(hasAccess).toBeUndefined() // no error
    })
    it('create a thumbnail if it is an image', async () => {
      expect.assertions(3)
      const files = await readdir(path.join(fsPath, workspaceId))
      expect(files.length).toBe(2)
      expect(files[0]).toBe('logo.png')
      expect(files[1]).toBe('thumbnail_logo.png')
    })

    it('create an attachment on the workspace', async () => {
      expect.assertions(3)
      const attachments = await app.service('attachment').find({
        query: {
          workspace_id: workspaceId,
        },
      }) as Paginated<LckAttachment>
      expect(attachments.total).toBe(1)
      expect(attachments.data[0].filename).toBe('logo.png')
      expect(attachments.data[0].thumbnail).toBe(true)
    })

    it('doesn\'t crash when the thumbnail can\'t be generated', async () => {
      // empty the folder of file storage
      await rm(fsPath, { recursive: true })
      await mkdir(fsPath)
      // upload a new file
      const file = await open(path.join(__dirname, '../../../public/index.html'), 'r')
      const buffer = await file.readFile()
      await app.service('upload').create({
        buffer,
        contentType: 'image/png',
      }, {
        query: {
          workspace_id: workspaceId,
          fileName: 'logo1.png',
          contentType: 'image/png',
        },
      })
      await file.close()
      expect.assertions(5)
      const files = await readdir(path.join(fsPath, workspaceId))
      expect(files.length).toBe(1)
      expect(files[0]).toBe('logo1.png')

      const attachments = await app.service('attachment').find({
        query: {
          workspace_id: workspaceId,
          filepath: workspaceId + '/logo1.png',
        },
      }) as Paginated<LckAttachment>
      expect(attachments.total).toBe(1)
      expect(attachments.data[0].filename).toBe('logo1.png')
      expect(attachments.data[0].thumbnail).toBe(false)
    })

    it('forbid the upload of an already uploaded attachment', async () => {
      // empty the folder of file storage
      await rm(fsPath, { recursive: true })
      await mkdir(fsPath)
      // upload a new file
      const file = await open(path.join(__dirname, '../../../public/logo.png'), 'r')
      const buffer = await file.readFile()
      expect.assertions(1)
      await expect(app.service('upload').create({
        buffer,
        contentType: 'image/png',
      }, {
        query: {
          workspace_id: workspaceId,
          fileName: 'logo.png',
          contentType: 'image/png',
        },
      })).rejects.toThrowError(NotAcceptable)
      await file.close()
    })

    it('allows the upload of an already uploaded attachment if forceUpdate is set', async () => {
      // empty the folder of file storage
      await rm(fsPath, { recursive: true })
      await mkdir(fsPath)
      // upload a new file
      const file = await open(path.join(__dirname, '../../../public/logo.png'), 'r')
      const buffer = await file.readFile()
      expect.assertions(3)
      const attachment = await app.service('upload').create({
        buffer,
        contentType: 'image/png',
      }, {
        query: {
          workspace_id: workspaceId,
          fileName: 'logo.png',
          contentType: 'image/png',
          forceUpdate: 1,
        },
      })
      await file.close()

      expect(attachment).toBeDefined()
      expect(attachment.thumbnail).toBe(true)
      expect(attachment.filename).toBe('logo.png')
    })

    it('forbid the upload of an attachment if the user do not have access to the workspace', async () => {
      expect.assertions(1)
      // upload a new file
      const file = await open(path.join(__dirname, '../../../public/logo.png'), 'r')
      const buffer = await file.readFile()
      await expect(app.service('upload').create({
        buffer,
        contentType: 'image/png',
      }, {
        query: {
          workspaceId, // Todo: Why ?
          workspace_id: workspaceId,
          fileName: 'logoRejected.png',
          contentType: 'image/png',
        },
        provider: 'external',
        user: setupData.user4,
        accessToken: setupData.user4Authentication.accessToken,
        authenticated: true,
      })).rejects.toThrow(Forbidden)
      await file.close()
    })

    afterAll(async () => {
      app.set('storage', oldStorageConfig)
      // configure again the service to take the new config
      app.configure(uploadService)
      await builder.teardownWorkspace()
    })
  })

  // describe('for s3 storage', () => {
  //   const oldStorageConfig = app.get('storage')
  //   const s3Config = {
  //     ...oldStorageConfig,
  //     type: 's3',
  //     publicPath: '/s3-storage',
  //   }
  //   const s3Client = new AWS.S3({
  //     endpoint: s3Config.endpoint,
  //     accessKeyId: s3Config.accessKeyId,
  //     secretAccessKey: s3Config.secretAccessKey,
  //     s3ForcePathStyle: s3Config.s3ForcePathStyle === '1', // needed with minio
  //     signatureVersion: s3Config.signatureVersion,
  //   })

  //   let workspaceId: string
  //   beforeAll(async () => {
  //     /**
  //      * Create a new attachment on a workspace
  //      */
  //     const workspace = await app.service('workspace').create({ text: 'pouet' })
  //     workspaceId = workspace.id

  //     app.set('storage', s3Config)
  //     // configure again the service to take the new config
  //     app.configure(uploadService)
  //     const file = await open(path.join(__dirname, '../../../public/logo.png'), 'r')
  //     const buffer = await file.readFile()
  //     await app.service('upload').create({
  //       buffer,
  //       contentType: 'image/png',
  //     }, {
  //       query: {
  //         workspaceId,
  //         fileName: 'logo.png',
  //         contentType: 'image/png',
  //       },
  //     })
  //   })
  //   it('create the workspace bucket if it does not exist', async () => {
  //     expect.assertions(1)
  //     expect(async () => await s3Client.getBucketAcl({
  //       Bucket: workspaceId,
  //     }).promise()).not.toThrow()
  //   })
  //   it('create a thumbnail if it is an image', async () => {
  //     expect.assertions(3)
  //     const bucketFiles = await s3Client.listObjectsV2({
  //       Bucket: workspaceId,
  //       MaxKeys: 10,
  //     }).promise()
  //     expect(bucketFiles.Contents?.length).toBe(2)
  //     expect((bucketFiles.Contents as AWS.S3.ObjectList)[0].Key).toBe('logo.png')
  //     expect((bucketFiles.Contents as AWS.S3.ObjectList)[1].Key).toBe('thumbnail_logo.png')
  //   })

  //   it('create an attachment on the workspace', async () => {
  //     expect.assertions(3)
  //     const attachments = await app.service('attachment').find({
  //       query: {
  //         workspace_id: workspaceId,
  //         $sort: {
  //           filename: 1, // we sort by filename to guarantee assertions order
  //         },
  //       },
  //     }) as Paginated<LckAttachment>
  //     expect(attachments.total).toBe(1)
  //     expect(attachments.data[0].filename).toBe('logo.png')
  //     expect(attachments.data[0].thumbnail).toBe(true)
  //   })

  //   afterAll(async () => {
  //     app.set('storage', oldStorageConfig)
  //     // configure again the service to take the new config
  //     app.configure(uploadService)
  //   })
  // })
})
