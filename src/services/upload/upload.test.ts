import app from '../../app'
import { open, rmdir, mkdir, access, readdir } from 'fs/promises'
import path from 'path'
import AWS from 'aws-sdk'
import uploadService from './upload.service'
import { NotAcceptable } from '@feathersjs/errors'

describe('\'upload\' service', () => {
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
      await rmdir(fsPath, { recursive: true })

      // configure again the service to take the new config
      // this would create the folder fs-storage if necessary
      app.configure(uploadService)

      /**
       * Create a new attachment on a workspace
       */
      const workspace = await app.service('workspace').create({ text: 'pouet' })
      workspaceId = workspace.id

      // no need to create the fsPath directory
      // await mkdir(fsPath)

      // upload a new file
      const file = await open(path.join(__dirname, '../../../public/logokit-grayscale.png'), 'r')
      const buffer = await file.readFile()
      await app.service('upload').create({
        buffer,
        contentType: 'image/png',
      }, {
        query: {
          workspaceId,
          fileName: 'logokit-grayscale.png',
          contentType: 'image/png',
        },
      })
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
      expect(files[0]).toBe('logokit-grayscale.png')
      expect(files[1]).toBe('thumbnail_logokit-grayscale.png')
    })

    it('create an attachment on the workspace', async () => {
      expect.assertions(3)
      const attachments = await app.service('attachment').find({
        query: {
          workspace_id: workspaceId,
        },
      })
      expect(attachments.total).toBe(1)
      expect(attachments.data[0].filename).toBe('logokit-grayscale.png')
      expect(attachments.data[0].thumbnail).toBe(true)
    })

    it('doesn\'t crash when the thumbnail can\'t be generated', async () => {
      // empty the folder of file storage
      await rmdir(fsPath, { recursive: true })
      await mkdir(fsPath)
      // upload a new file
      const file = await open(path.join(__dirname, '../../../public/index.html'), 'r')
      const buffer = await file.readFile()
      await app.service('upload').create({
        buffer,
        contentType: 'image/png',
      }, {
        query: {
          workspaceId,
          fileName: 'logokit-grayscale1.png',
          contentType: 'image/png',
        },
      })
      expect.assertions(5)
      const files = await readdir(path.join(fsPath, workspaceId))
      expect(files.length).toBe(1)
      expect(files[0]).toBe('logokit-grayscale1.png')

      const attachments = await app.service('attachment').find({
        query: {
          workspace_id: workspaceId,
          filepath: workspaceId + '/logokit-grayscale1.png',
        },
      })
      expect(attachments.total).toBe(1)
      expect(attachments.data[0].filename).toBe('logokit-grayscale1.png')
      expect(attachments.data[0].thumbnail).toBe(false)
    })

    it('forbid the upload of an already uploaded attachment', async () => {
      // empty the folder of file storage
      await rmdir(fsPath, { recursive: true })
      await mkdir(fsPath)
      // upload a new file
      const file = await open(path.join(__dirname, '../../../public/logokit-grayscale.png'), 'r')
      const buffer = await file.readFile()
      expect.assertions(1)
      await expect(app.service('upload').create({
        buffer,
        contentType: 'image/png',
      }, {
        query: {
          workspaceId,
          fileName: 'logokit-grayscale.png',
          contentType: 'image/png',
        },
      })).rejects.toThrowError(NotAcceptable)
    })

    it('allows the upload of an already uploaded attachment if forceUpdate is set to true', async () => {
      // empty the folder of file storage
      await rmdir(fsPath, { recursive: true })
      await mkdir(fsPath)
      // upload a new file
      const file = await open(path.join(__dirname, '../../../public/logokit-grayscale.png'), 'r')
      const buffer = await file.readFile()
      expect.assertions(3)
      const attachment = await app.service('upload').create({
        buffer,
        contentType: 'image/png',
      }, {
        query: {
          workspaceId,
          fileName: 'logokit-grayscale.png',
          contentType: 'image/png',
          forceUpdate: true,
        },
      })
      expect(attachment).toBeDefined()
      expect(attachment.thumbnail).toBe(true)
      expect(attachment.filename).toBe('logokit-grayscale.png')
    })

    afterAll(() => {
      app.set('storage', oldStorageConfig)
      // configure again the service to take the new config
      app.configure(uploadService)
    })
  })

  describe('for s3 storage', () => {
    const oldStorageConfig = app.get('storage')
    const s3Config = {
      ...oldStorageConfig,
      type: 's3',
      publicPath: '/s3-storage',
    }
    const s3Client = new AWS.S3({
      endpoint: s3Config.endpoint,
      accessKeyId: s3Config.accessKeyId,
      secretAccessKey: s3Config.secretAccessKey,
      s3ForcePathStyle: s3Config.s3ForcePathStyle === '1', // needed with minio
      signatureVersion: s3Config.signatureVersion,
    })

    let workspaceId: string
    beforeAll(async () => {
      /**
       * Create a new attachment on a workspace
       */
      const workspace = await app.service('workspace').create({ text: 'pouet' })
      workspaceId = workspace.id

      app.set('storage', s3Config)
      // configure again the service to take the new config
      app.configure(uploadService)
      const file = await open(path.join(__dirname, '../../../public/logokit-grayscale.png'), 'r')
      const buffer = await file.readFile()
      await app.service('upload').create({
        buffer,
        contentType: 'image/png',
      }, {
        query: {
          workspaceId,
          fileName: 'logokit-grayscale.png',
          contentType: 'image/png',
        },
      })
    })
    it('create the workspace bucket if it does not exist', async () => {
      expect.assertions(1)
      expect(async () => await s3Client.getBucketAcl({
        Bucket: workspaceId,
      }).promise()).not.toThrow()
    })
    it('create a thumbnail if it is an image', async () => {
      expect.assertions(3)
      const bucketFiles = await s3Client.listObjectsV2({
        Bucket: workspaceId,
        MaxKeys: 10,
      }).promise()
      expect(bucketFiles.Contents?.length).toBe(2)
      expect((bucketFiles.Contents as AWS.S3.ObjectList)[0].Key).toBe('logokit-grayscale.png')
      expect((bucketFiles.Contents as AWS.S3.ObjectList)[1].Key).toBe('thumbnail_logokit-grayscale.png')
    })

    it('create an attachment on the workspace', async () => {
      expect.assertions(3)
      const attachments = await app.service('attachment').find({
        query: {
          workspace_id: workspaceId,
          $sort: {
            filename: 1, // we sort by filename to guarantee assertions order
          },
        },
      })
      expect(attachments.total).toBe(1)
      expect(attachments.data[0].filename).toBe('logokit-grayscale.png')
      expect(attachments.data[0].thumbnail).toBe(true)
    })

    afterAll(async () => {
      app.set('storage', oldStorageConfig)
      // configure again the service to take the new config
      app.configure(uploadService)
    })
  })
})
