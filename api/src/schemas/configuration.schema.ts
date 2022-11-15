import { schema } from '@feathersjs/schema'
import type { Infer } from '@feathersjs/schema'
import { authenticationSettingsSchema } from '@feathersjs/authentication'

export const configurationSchema = schema({
  $id: 'ApplicationConfiguration',
  type: 'object',
  additionalProperties: false,
  required: [
    'host',
    'port',
    'public',
    'paginate',
    'publicURL',
    'settings',
    'mail',
    'authentication',
  ],
  properties: {
    host: { type: 'string' },
    port: { type: 'number' },
    public: { type: 'string' },
    publicURL: {
      type: 'string',
    },
    publicPortalName: {
      type: 'string',
    },
    mail: {
      type: 'object',
      required: ['host', 'port', 'secure', 'from', 'needAuth'],
      properties: {
        host: { type: 'string' },
        port: { type: 'number' },
        secure: { type: 'boolean', default: false },
        needAuth: { type: 'boolean', default: false },
        user: { type: 'string' },
        pass: { type: 'string' },
        from: { type: 'string', default: 'contact@locokit.io' },
      },
    },
    settings: {
      type: 'object',
      additionalProperties: false,
      required: ['db', 'passwordPolicy'],
      properties: {
        db: {
          type: 'object',
          required: ['client', 'connection'],
          properties: {
            client: { enum: ['pg', 'sqlite3'] },
            connection: { type: 'string' },
          },
        },
        signup: {
          type: 'object',
          properties: {
            allowed: {
              type: 'boolean',
              default: true,
            },
            verificationMailDelayDays: {
              type: 'number',
              default: 5,
            },
            rateLimitMax: {
              type: 'number',
              default: 5,
            },
            rateLimitDuration: {
              type: 'number',
              default: 6000,
            },
          },
        },
        passwordPolicy: {
          type: 'object',
          required: [
            'minLength',
            'maxLength',
            'uppercase',
            'lowercase',
            'digits',
            'symbols',
          ],
          properties: {
            minLength: { type: 'number', default: 8 },
            maxLength: { type: 'number', default: 128 },
            uppercase: { type: 'boolean', default: true },
            lowercase: { type: 'boolean', default: true },
            digits: { type: 'boolean', default: true },
            symbols: { type: 'boolean', default: true },
          },
        },
      },
    },
    authentication: authenticationSettingsSchema,
    paginate: {
      type: 'object',
      additionalProperties: false,
      required: ['default', 'max'],
      properties: {
        default: { type: 'number' },
        max: { type: 'number' },
      },
    },
    datasources: {
      type: 'array',
      items: {
        type: 'object',
        required: ['type', 'options', 'name'],
        properties: {
          name: { type: 'string' },
          type: {
            enum: ['pg', 'sqlite3', 'baserow'],
          },
        },
        allOf: [
          {
            if: {
              properties: {
                type: { const: 'pg' },
              },
            },
            then: {
              properties: {
                options: { type: 'string' },
                credentials: {
                  type: 'object',
                  properties: {
                    read: {
                      type: 'object',
                      properties: {
                        username: {
                          type: 'string',
                        },
                        password: {
                          type: 'string',
                        },
                      },
                    },
                    write: {
                      type: 'object',
                      properties: {
                        username: {
                          type: 'string',
                        },
                        password: {
                          type: 'string',
                        },
                      },
                    },
                    alter: {
                      type: 'object',
                      properties: {
                        username: {
                          type: 'string',
                        },
                        password: {
                          type: 'string',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          {
            if: {
              properties: {
                type: { const: 'sqlite3' },
              },
            },
            then: {
              properties: {
                options: {
                  type: 'object',
                  properties: { filename: { type: 'string' } },
                },
              },
            },
          },
          {
            if: {
              properties: {
                type: { const: 'baserow' },
              },
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
                        type: 'integer',
                      },
                    },
                    token: { type: 'string' },
                  },
                },
              },
            },
          },
        ],
      },
    },
    helmet: {
      type: 'object',
      properties: {
        isEnabled: { type: 'string', enum: ['true', 'false'] },
        hstsEnabled: { type: 'string', enum: ['true', 'false'] },
      },
    },
    cors: {
      type: 'object',
      properties: {
        origin: { type: 'string' },
      },
    },
  },
} as const)

export type ConfigurationSchema = Infer<typeof configurationSchema>
