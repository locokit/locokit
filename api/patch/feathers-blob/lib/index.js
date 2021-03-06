const { extname } = require('path')
const Proto = require('uberproto')
const errors = require('@feathersjs/errors')
const makeDebug = require('debug')

const {
  getBase64DataURI,
  parseDataURI,
} = require('dauria')

const toBuffer = require('concat-stream')
const mimeTypes = require('mime-types')
const debug = makeDebug('feathers-blob-store')

const {
  fromBuffer,
  bufferToHash,
} = require('./util')

class Service {
  constructor (options) {
    if (!options) {
      throw new Error('feathers-blob-store: constructor `options` must be provided')
    }

    if (!options.Model) {
      throw new Error('feathers-blob-store: constructor `options.Model` must be provided')
    }

    this.returnBuffer = options.returnBuffer || false
    this.returnUri = options.returnUri !== undefined ? options.returnUri : true
    this.Model = options.Model
    this.id = options.id || 'id'
  }

  extend (obj) {
    return Proto.extend(obj, this)
  }

  get (id, params = {}) {
    const s3Params = {
      ...params.s3,
      VersionId: (params.query && params.query.VersionId) ? params.query.VersionId : undefined,
    }

    const ext = extname(id)
    let contentType = mimeTypes.lookup(ext)
    // Unrecognized mime type
    if ((typeof contentType === 'boolean') && !contentType) {
      // Fallback to binary content
      contentType = 'application/octet-stream'
    }
    debug(`Retrieving blob ${id} with ext ${ext} and content type ${contentType}`)

    return new Promise((resolve, reject) => {
      this.Model.createReadStream({
        key: id,
        params: s3Params,
      })
        .on('error', reject)
        .pipe(toBuffer(buffer => {
          resolve({
            [this.id]: id,
            ...(this.returnBuffer && { buffer }),
            ...(this.returnUri && {
              uri: getBase64DataURI(buffer, contentType),
            }),
            size: buffer.length,
            contentType,
          })
        }))
    })
  }

  create (body, params = {}) {
    let { id, uri, buffer, contentType } = body
    if (uri) {
      const result = parseDataURI(uri)
      contentType = result.MIME
      buffer = result.buffer
    } else {
      uri = getBase64DataURI(buffer, contentType)
    }

    if (!uri && (!buffer || !contentType)) {
      throw new errors.BadRequest('Buffer or URI with valid content type must be provided to create a blob')
    }
    let ext = mimeTypes.extension(contentType)

    // Unrocognized mime type
    if ((typeof ext === 'boolean') && !ext) {
      // Fallback to binary content
      ext = 'bin'
      contentType = 'application/octet-stream'
    }

    if (!id) {
      const hash = bufferToHash(buffer)
      id = `${hash}.${ext}`
    }

    debug(`Creating blob ${id} with ext ${ext} and content type ${contentType}`)
    return new Promise((resolve, reject) => {
      fromBuffer(buffer)
        .pipe(this.Model.createWriteStream({
          key: id,
          params: params.s3,
        }, (error) =>
          error
            ? reject(error)
            : resolve({
              [this.id]: id,
              ...(this.returnBuffer && { buffer }),
              ...(this.returnUri && { uri }),
              size: buffer.length,
              contentType,
            }),
        ))
        .on('error', reject)
    })
  }

  remove (id, params = {}) {
    debug(`Removing blob ${id}`)
    return new Promise((resolve, reject) => {
      this.Model.remove({
        key: id,
        params: params.s3,
      }, error => error ? reject(error) : resolve({ [this.id]: id }))
    })
  }
}

module.exports = function init (options) {
  return new Service(options)
}

module.exports.Service = Service
