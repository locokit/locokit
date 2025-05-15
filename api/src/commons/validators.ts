import { Ajv, addFormats } from '@feathersjs/schema'
import type { FormatsPluginOptions } from '@feathersjs/schema'
import ajvErrors from 'ajv-errors'
import { addDiffSchemaToValidator, GROUP_ROLE, USER_PROFILE } from '@locokit/definitions'

export const formats: FormatsPluginOptions = [
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
  addFormats(
    new Ajv({
      allErrors: true,
      coerceTypes: true,
      allowUnionTypes: true,
    }),
    formats,
  ),
)
dataValidator.addFormat('user-profile', {
  type: 'string',
  validate: (x: string) => Object.keys(USER_PROFILE).includes(x),
})
dataValidator.addFormat('group-role', {
  type: 'string',
  validate: (x: string) => Object.keys(GROUP_ROLE).includes(x),
})
/**
 * Add definitions schema
 */
addDiffSchemaToValidator(dataValidator)

export const queryValidator = ajvErrors(
  addFormats(
    new Ajv({
      allErrors: true,
      coerceTypes: true,
      allowUnionTypes: true,
    }),
    formats,
  ),
)
queryValidator.addFormat('user-profile', {
  type: 'string',
  validate: (x: string) => Object.keys(USER_PROFILE).includes(x),
})
queryValidator.addFormat('group-role', {
  type: 'string',
  validate: (x: string) => Object.keys(GROUP_ROLE).includes(x),
})
addDiffSchemaToValidator(queryValidator)
