import { schema, Ajv } from '@feathersjs/schema'
import type { Infer } from '@feathersjs/schema'
import { authenticationSettingsSchema } from '@feathersjs/authentication'

export const configurationSchema = schema({
  $id: 'ApplicationConfiguration',
  type: 'object',
  additionalProperties: false,
  required: [ 'host', 'port', 'public', 'paginate' ],
  properties: {
    host: { type: 'string' },
    port: { type: 'number' },
    public: { type: 'string' },
    sqlite: {
      type: 'object',
      properties: {
        client: { type: 'string' },
        connection: { type: 'string' }
      }
    },
    authentication: authenticationSettingsSchema,
    paginate: {
      type: 'object',
      additionalProperties: false,
      required: [ 'default', 'max' ],
      properties: {
        default: { type: 'number' },
        max: { type: 'number' }
      }
    },
    'locokit-providers': {
      type: 'array',
      additionalProperties: false,
      items: {
        type: 'object',
        required: ['type', 'options', 'name'],
        properties: {
          name: { type: 'string' },
          type: { 
            enum: ['pg', 'sqlite3', 'baserow']
          },
        },
        allOf: [
          {
            if: {
              properties: {
                type: { const: 'pg' }
              }
            },
            then: {
              properties: {
                options: { type: 'string' }
              }
            }
          }, {
            if: {
              properties: {
                type: { const: 'sqlite3' }
              }
            },
            then: {
              properties: {
                options: {
                   type: 'object',
                   properties: { filename: { type: 'string' } } 
                },
              }
            }
          }, {
            if: {
              properties: {
                type: { const: 'baserow' }
              }
            },
            then: {
              properties: {
                options: { 
                  type: 'object',
                  properties: {
                    apiURL: { type: 'string' },
                    tableIds: {
                      type: 'array',
                      items: {
                        type: 'integer'
                      }
                    },
                    token: { type: 'string'}
                  }
                }
              }
            }
          }
        ]
      }
    }
  }
} as const, new Ajv())

export type ConfigurationSchema = Infer<typeof configurationSchema>
