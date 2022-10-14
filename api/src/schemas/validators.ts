import { Ajv, addFormats } from '@feathersjs/schema'
import type { FormatsPluginOptions } from '@feathersjs/schema'
import ajvErrors from 'ajv-errors'
import { PROFILE } from '@locokit/definitions'

const formats: FormatsPluginOptions = [
  'date-time',
  'time',
  'date',
  'email',
  'hostname',
  'ipv4',
  'ipv6',
  'uri',
  'uri-reference',
  'uuid',
  'uri-template',
  'json-pointer',
  'relative-json-pointer',
  'regex',
]

export const dataValidator = ajvErrors(
  addFormats(new Ajv({ allErrors: true }), formats),
)
dataValidator.addFormat('user-profile', {
  type: 'string',
  validate: (x: string) => Object.keys(PROFILE).includes(x),
})

export const queryValidator = ajvErrors(
  addFormats(
    new Ajv({
      allErrors: true,
      coerceTypes: true,
    }),
    formats,
  ),
)
queryValidator.addFormat('user-profile', {
  type: 'string',
  validate: (x: string) => Object.keys(PROFILE).includes(x),
})
