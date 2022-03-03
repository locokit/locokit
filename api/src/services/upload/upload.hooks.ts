import { HookContext } from '@feathersjs/feathers'
import * as authentication from '@feathersjs/authentication'
import { iff, disallow } from 'feathers-hooks-common'
import { queryContainsKeys } from '../../hooks/lck-hooks/queryContainsKeys'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { NotAcceptable } from '@feathersjs/errors'
import * as Sentry from '@sentry/node'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Minio = require('minio')

const { authenticate } = authentication.hooks

/**
 * Manage workspaceId param
 * * for S3 Storage
 *    * create if not exist a new Bucket
 *    * use it as the Bucket storage
 * * for File Storage
 *    * create a sub folder for this workspace if not exist
 *    * save the file in this sub folder
 * For both, it updates the `id` for feathers-blob service
 */
async function createWorkspaceStorage (context: HookContext): Promise<HookContext> {
  const {
    type: storageType,
    /* s3 parameters */
    endPoint,
    port,
    useSSL,
    accessKeyId,
    secretAccessKey,
    /* file parameters */
    fsPath,
  } = context.app.get('storage')

  const workspaceId = context.params.query?.workspaceId as string
  /**
   * Depending the storage type,
   * we send the file to s3 or write it on the disk
   */
  switch (storageType) {
    case 's3':
      const minioClient = new Minio.Client({
        endPoint,
        port: parseInt(port),
        useSSL: useSSL === 'true',
        accessKey: accessKeyId,
        secretKey: secretAccessKey,
      })
      if (workspaceId) {
        try {
          const policy = {
            Version: '2012-10-17',
            Statement: [
              {
                Action: [
                  's3:GetObject',
                ],
                Effect: 'Allow',
                Principal: {
                  AWS: [
                    '*',
                  ],
                },
                Resource: [
                  `arn:aws:s3:::${workspaceId}/*`,
                ],
                Sid: '',
              },
            ],
          }

          const bucketExist = await minioClient.bucketExists(workspaceId)
          if (!bucketExist) {
            await minioClient.makeBucket(workspaceId, 'eu-west-3')
          }
          await minioClient.setBucketPolicy(workspaceId, JSON.stringify(policy))
        } catch (error: any) {
          console.log(error)
          if (error.statusCode !== 409) throw error
        }
        context.params.s3 = {
          Bucket: workspaceId,
          ACL: 'public-read',
        }
      }
      if (context.params.query?.fileName) {
        context.data.id = context.params.query.fileName
      }
      break
    case 'fs':
    default:
      // create a sub folder with the workspaceId as name if don't already exist
      if (workspaceId) {
        const storagePath = path.join(fsPath, workspaceId)
        if (!fs.existsSync(storagePath)) {
          fs.mkdirSync(storagePath)
        }
      }
      if (context.params.query?.fileName) {
        context.data.id = path.join(workspaceId, context.params.query.fileName)
      }

      break
  }
  return context
}

/**
 * Create an attachment with data returned by blob service,
 * for the workspace id
 */
async function createAttachment (context: HookContext): Promise<HookContext> {
  // do not create attachment if param noAttachment is set to true
  // this help us to avoid create an attachment for a thumbnail
  if (context.params?.query?.noAttachment === true) return context
  if (context.data.attachment_id) {
    context.result = await context.app.services.attachment.patch(context.data.attachment_id, {
      mime: context.params.query?.mime as string,
      ext: context.params.query?.ext as string,
      filename: context.params.query?.fileName || context.result.id,
      filepath: context.result.id,
      size: context.result.size,
      thumbnail: context.data.thumbnail,
    })
  } else {
    context.result = await context.app.services.attachment.create({
      workspace_id: context.params.query?.workspaceId as string,
      mime: context.params.query?.mime as string,
      ext: context.params.query?.ext as string,
      filename: context.params.query?.fileName || context.result.id,
      filepath: context.result.id,
      size: context.result.size,
      thumbnail: context.data.thumbnail,
    })
  }
  return context
}

/**
 * Create an image thumbnail
 */
async function createThumbnail (context: HookContext): Promise<HookContext> {
  /**
   * don't create a thumbnail if it's already one
   * Maybe would need better detection with contentType and size
   */
  if (context.result.id.indexOf('thumbnail_') >= 0) return context

  /**
   * Create a thumbnail if it's an image
   */
  if (context.result.contentType?.indexOf('image/') === 0) {
    try {
      const thumbnail = sharp(context.result.buffer).rotate().withMetadata().resize({ height: 200 })
      const buffer = await thumbnail.toBuffer()
      await context.service.create({
        buffer,
        contentType: context.result.contentType,
      }, {
        query: {
          ...context.params.query,
          fileName: `thumbnail_${context.params.query?.fileName as string}`,
          noAttachment: true,
        },
        s3: context.params.s3,
      })
      context.data.thumbnail = true
    } catch (error) {
      Sentry.captureException(error)
    }
  }

  return context
}

/**
 * Forbid the creation of an upload already uploaded
 */
async function checkUploadDoesNotAlreadyExist (context: HookContext): Promise<HookContext> {
  const isFileFound = await context.app.services.attachment.find({
    query: {
      workspace_id: context.params.query?.workspaceId as string,
      filename: context.params.query?.fileName,
    },
  })
  if (isFileFound.total === 1) {
    if (context.params.query?.forceUpdate) {
      context.data.attachment_id = isFileFound.data[0].id
    } else {
      throw new NotAcceptable('File already exist. You can\'t update this file. Please rename your file and retry.')
    }
  }
  return context
}

export default {
  before: {
    all: [
      // debug('upload'),
      authenticate('jwt'),
      // checkPermission (for create, access to workspace, for get, access to this upload, for remove, idem)
      iff(
        queryContainsKeys(['workspaceId']),
        createWorkspaceStorage,
      ),
    ],
    get: [
    ],
    create: [
      /**
       * Forbid the creation of an upload already uploaded
       */
      checkUploadDoesNotAlreadyExist,
    ],
    remove: [
      /**
       * Remove all links from this upload
       * but, for the moment, just don't remove an upload,
       * we need to think how manage the upload links (workspace & records)
       */
      disallow(),
    ],
  },

  after: {
    all: [],
    get: [],
    create: [
      createThumbnail,
      iff(
        queryContainsKeys(['workspaceId']),
        createAttachment,
      ),
    ],
    remove: [],
  },

  error: {
    all: [],
    get: [],
    create: [],
    remove: [],
  },
}
