'use strict'

const downloader = require('s3-download-stream')
const debug = require('debug')('s3-blob-store')
const mime = require('mime-types')
const uploadStream = require('s3-stream-upload')

function S3BlobStore (opts) {
  if (!(this instanceof S3BlobStore)) return new S3BlobStore(opts)
  opts = opts || {}
  if (!opts.client) throw Error('S3BlobStore client option required (aws-sdk AWS.S3 instance)')
  if (!opts.bucket) throw Error('S3BlobStore bucket option required')
  this.accessKey = opts.accessKey
  this.secretKey = opts.secretKey
  this.bucket = opts.bucket
  this.s3 = opts.client
}

S3BlobStore.prototype.createReadStream = function (opts) {
  if (typeof opts === 'string') opts = { key: opts }
  const config = { client: this.s3, params: this.downloadParams(opts) }
  if (opts.concurrency) config.concurrency = opts.concurrency
  if (opts.chunkSize) config.chunkSize = opts.chunkSize
  const stream = downloader(config)
  // not sure if this a test bug or if I should be doing this in
  // s3-download-stream...
  stream.read(0)
  return stream
}

S3BlobStore.prototype.uploadParams = function (opts) {
  opts = Object.assign({}, opts, {
    params: Object.assign({}, opts.params),
  })

  const filename = opts.name || opts.filename
  const key = opts.key || filename
  let contentType = opts.contentType

  const params = opts.params
  params.Bucket = params.Bucket || this.bucket
  params.Key = params.Key || key

  if (!contentType) {
    contentType = filename ? mime.lookup(filename) : mime.lookup(opts.key)
  }
  if (contentType) params.ContentType = contentType

  return params
}

S3BlobStore.prototype.downloadParams = function (opts) {
  const params = this.uploadParams(opts)
  delete params.ContentType
  return params
}

S3BlobStore.prototype.createWriteStream = function (opts, s3opts, done) {
  if (typeof s3opts === 'function') {
    done = s3opts
    s3opts = {}
  }
  if (typeof opts === 'string') opts = { key: opts }
  const params = this.uploadParams(opts)
  const out = uploadStream(this.s3, params)
  out.on('error', function (err) {
    debug('got err %j', err)
    done && done(err)
  })
  out.on('finish', function () {
    debug('uploaded')
    done && done(null, { key: params.Key })
  })
  return out
}

S3BlobStore.prototype.remove = function (opts, done) {
  const key = typeof opts === 'string' ? opts : opts.key
  const params = typeof opts === 'object' ? opts.params : {}
  params.Bucket = params.Bucket || this.bucket
  params.Key = key
  console.log(opts, params)
  this.s3.deleteObject(params, done)
  return this
}

S3BlobStore.prototype.exists = function (opts, done) {
  if (typeof opts === 'string') opts = { key: opts }
  this.s3.headObject({ Bucket: this.bucket, Key: opts.key }, function (err, res) {
    if (err && err.statusCode === 404) return done(null, false)
    done(err, !err)
  })
}

module.exports = S3BlobStore
