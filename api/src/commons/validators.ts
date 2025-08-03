import { Ajv, addFormats } from '@feathersjs/schema'
import type { FormatsPluginOptions } from '@feathersjs/schema'
import ajvErrors from 'ajv-errors'
import {
  diffItemFieldSchema,
  diffItemFieldSettingsSchema,
  diffItemRelationSchema,
  diffItemRelationSettingsSchema,
  diffItemSchema,
  diffItemTableSchema,
  diffItemTableSettingsSchema,
  diffItemTypebox,
  diffSchema,
  GROUP_ROLE,
  USER_PROFILE,
} from '@locokit/shared'

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

/**
 * Add several diff schemas to a validator
 */
function addDiffSchemaToValidator(validator: Ajv) {
  validator.addSchema(diffItemTypebox)
  validator.addSchema(diffItemTableSettingsSchema)
  validator.addSchema(diffItemTableSchema)
  validator.addSchema(diffItemFieldSettingsSchema)
  validator.addSchema(diffItemFieldSchema)
  validator.addSchema(diffItemRelationSettingsSchema)
  validator.addSchema(diffItemRelationSchema)
  validator.addSchema(diffItemSchema)
  validator.addSchema(diffSchema)
}

export const dataValidator = ajvErrors(
  addFormats(
    new Ajv({
      allErrors: true,
      coerceTypes: true,
      allowUnionTypes: true,
    }),
    formats,
  ),
) as Ajv
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
) as Ajv
queryValidator.addFormat('user-profile', {
  type: 'string',
  validate: (x: string) => Object.keys(USER_PROFILE).includes(x),
})
queryValidator.addFormat('group-role', {
  type: 'string',
  validate: (x: string) => Object.keys(GROUP_ROLE).includes(x),
})
addDiffSchemaToValidator(queryValidator)
