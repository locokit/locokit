import { HookContext } from '@feathersjs/feathers'
import * as authentication from '@feathersjs/authentication'
import { iff, debug, disallow } from 'feathers-hooks-common'
import { queryContainsKeys } from '../../hooks/lck-hooks/queryContainsKeys'
import AWS from 'aws-sdk'

const { authenticate } = authentication.hooks


/**
 * Manage workspaceId param
 * * for S3 Storage
 *    * create if not exist a new Bucket
 *    * use it as the Bucket storage
 * * for File Storage
 *    * create a sub folder for this workspace if not exist
 *    * save the file in this sub folder
 */
async function createWorkspaceStorage (context: HookContext): Promise<HookContext> {
  const uploadConfig = context.app.get('storage')
  const workspaceId = context.params.query?.workspaceId as string
  switch (uploadConfig.type) {
    case 's3':
      const s3Client = new AWS.S3({
        endpoint: uploadConfig.endpoint,
        accessKeyId: uploadConfig.accessKeyId,
        secretAccessKey: uploadConfig.secretAccessKey,
        s3ForcePathStyle: uploadConfig.s3ForcePathStyle === '1', // needed with minio
        signatureVersion: uploadConfig.signatureVersion
      })
      try {
        await s3Client.createBucket({
          Bucket: workspaceId
        }).promise()
      } catch (error) {
        console.log('error hook createWorkspaceStorage', error)
        if (error.statusCode === 409) {
          console.log('already present')
        }
      }
      context.params.s3 = {
        Bucket: context.params.workspaceId
      }
      break
    case 'fs':
    default:
      // create a sub folder with the workspaceId as name if don't already exist
      break
  }
  return context
}

/**
 * Create an attachment with data returned by blob service,
 * for the workspace id
 */
async function createAttachment (context: HookContext): Promise<HookContext> {
  await context.app.services.attachment.create({
    workspace_id: context.params.query?.workspaceId as string,
    filename: context.params.query?.fileName || context.result.id,
    filepath: context.result.id
  })
  return context
}

export default {
  before: {
    all: [
      debug('upload'),
      authenticate('jwt'),
      // checkPermission (for create, access to workspace, for get, access to this upload, for remove, idem)
      iff(
        queryContainsKeys(['workspaceId']),
        createWorkspaceStorage
      )
    ],
    get: [
    ],
    create: [
    ],
    remove: [
      disallow()
    ],
  },

  after: {
    all: [],
    get: [],
    create: [
      iff(
        queryContainsKeys(['workspaceId']),
        createAttachment
      )
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
