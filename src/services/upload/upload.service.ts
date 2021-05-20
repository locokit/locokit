import AWS from 'aws-sdk'
import S3BlobStore from 's3-blob-store'
import FsBlobStore from 'fs-blob-store'
import createBlobService from 'feathers-blob'
import hooks from './upload.hooks'

// Initializes the `user` service on path `/user`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import fs from 'fs'
import path from 'path'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'upload': createBlobService.Service & ServiceAddons<any>
  }
}

export default function (app: Application): void {
  const config = app.get('storage')
  let blobStore
  switch (config.type) {
    case 's3':
      /**
       * cf https://docs.min.io/docs/how-to-use-aws-sdk-for-javascript-with-minio-server.html
       * if we use Minio, we need to specify path style & signature version,
       * so it's defined in the storage settings
       */
      blobStore = S3BlobStore({
        client: new AWS.S3({
          endpoint: config.endpoint,
          accessKeyId: config.accessKeyId,
          secretAccessKey: config.secretAccessKey,
          s3ForcePathStyle: config.s3ForcePathStyle === '1', // needed with minio
          signatureVersion: config.signatureVersion,
        }),
        bucket: config.defaultBucket,
      })
      break
    case 'fs':
    default:
      const fsPath = path.join(config.fsPath || '../fs-storage')
      if (!fs.existsSync(fsPath)) {
        fs.mkdirSync(fsPath)
      }
      blobStore = FsBlobStore(fsPath)
  }
  // Initialize our service with any options it requires
  app.use('/upload', createBlobService({
    Model: blobStore,
    returnBuffer: true,
    docs: {
      description: 'A service to send and receive users',
      definition: {
        type: 'object',
        properties: {
          uri: { type: 'string' },
          buffer: { type: 'Buffer' },
          contentType: { type: 'string' },
        },
      },
      securities: ['all'],
    },
  }))

  // Get our initialized service so that we can register hooks
  const service: createBlobService.Service & ServiceAddons<any> = app.service('upload')
  service.hooks(hooks)
}
