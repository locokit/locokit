// import { authenticationSettingsSchema } from '@feathersjs/authentication'
import { Type, Static, StringEnum, getValidator } from '@feathersjs/typebox'
import { dataValidator } from './validators'

/**
 * Conversion of the json schema of feathers-authentication-management
 * in TypeBox
 */
const authenticationSettingsSchema = Type.Object({
  secret: Type.String({
    description: 'The JWT signing secret',
  }),
  entity: Type.Union([Type.String(), Type.Null()], {
    description: 'The name of the authentication entity (e.g. user)',
  }),
  entityId: Type.Optional(
    Type.String({
      description: 'The name of the authentication entity id property',
    }),
  ),
  service: Type.Optional(
    Type.String({ description: 'The path of the entity service' }),
  ),
  authStrategies: Type.Array(Type.String(), {
    description:
      'A list of authentication strategy names that are allowed to create JWT access tokens',
  }),
  parseStrategies: Type.Optional(
    Type.Array(Type.String(), {
      description:
        'A list of authentication strategy names that should parse HTTP headers for authentication information (defaults to `authStrategies`)',
    }),
  ),
  jwtOptions: Type.Optional(Type.Any()),
  jwt: Type.Optional(
    Type.Object({
      header: Type.String({
        default: 'Authorization',
        description: 'The HTTP header containing the JWT',
      }),
      schemes: Type.Array(Type.String(), {
        description: 'An array of schemes to support',
      }),
    }),
  ),
  local: Type.Optional(
    Type.Object({
      usernameField: Type.String({
        description: 'Name of the username field (e.g. `email`)',
      }),
      passwordField: Type.String({
        description: 'Name of the password field (e.g. `password`)',
      }),
      hashSize: Type.Optional(
        Type.Number({ description: 'The BCrypt salt length' }),
      ),
      errorMessage: Type.Optional(
        Type.String({
          default: 'Invalid login',
          description: 'The error message to return on errors',
        }),
      ),
      entityUsernameField: Type.Optional(
        Type.String({
          description:
            'Name of the username field on the entity if authentication request data and entity field names are different',
        }),
      ),
      entityPasswordField: Type.Optional(
        Type.String({
          description:
            'Name of the password field on the entity if authentication request data and entity field names are different',
        }),
      ),
    }),
  ),
  oauth: Type.Optional(
    Type.Object({
      redirect: Type.String(),
      origins: Type.Array(Type.String()),
      defaults: Type.Object({
        key: Type.String(),
        secret: Type.String(),
      }),
    }),
  ),
})

export const configurationSchema = Type.Object(
  {
    host: Type.String(),
    port: Type.Number(),
    public: Type.String(),
    publicURL: Type.String(),
    publicPortalName: Type.String(),
    mail: Type.Object({
      host: Type.String(),
      port: Type.Number(),
      secure: Type.Boolean({ default: false }),
      needAuth: Type.Boolean({ default: false }),
      user: Type.Optional(Type.String()),
      pass: Type.Optional(Type.String()),
      from: Type.String({ default: 'contact@locokit.io' }),
    }),
    settings: Type.Object(
      {
        db: Type.Object({
          client: StringEnum(['pg', 'sqlite3']),
          connection: Type.String(),
        }),
        passwordPolicy: Type.Object({
          minLength: Type.Number({ default: 8 }),
          maxLength: Type.Number({ default: 128 }),
          uppercase: Type.Boolean({ default: true }),
          lowercase: Type.Boolean({ default: true }),
          digits: Type.Boolean({ default: true }),
          symbols: Type.Boolean({ default: true }),
        }),
        signup: Type.Object({
          allowed: Type.Boolean({ default: true }),
          verificationMailDelayDays: Type.Number({ default: 5 }),
          rateLimitMax: Type.Number({ default: 5 }),
          rateLimitDuration: Type.Number({ default: 6000 }),
        }),
      },
      {
        additionalProperties: false,
      },
    ),
    authentication: authenticationSettingsSchema,
    paginate: Type.Object(
      {
        default: Type.Number(),
        max: Type.Number(),
      },
      {
        additionalProperties: false,
      },
    ),
    datasources: Type.Array(
      Type.Intersect([
        Type.Object({
          name: Type.String(),
          client: Type.String({ pattern: 'pg' }),
          // client: StringEnum(['pg', 'sqlite3', 'baserow']),
          connection: Type.String(),
          credentials: Type.Object({
            read: Type.Object({
              username: Type.String(),
              password: Type.String(),
            }),
            readwrite: Type.Object({
              username: Type.String(),
              password: Type.String(),
            }),
            alter: Type.Object({
              username: Type.String(),
              password: Type.String(),
            }),
          }),
        }),
        Type.Object({
          name: Type.String(),
          client: Type.String({ pattern: 'sqlite3' }),
          // client: StringEnum(['pg', 'sqlite3', 'baserow']),
          connection: Type.String(),
        }),
        Type.Object({
          name: Type.String(),
          client: Type.String({ pattern: 'baserow' }),
          // client: StringEnum(['pg', 'sqlite3', 'baserow']),
          connection: Type.String(),
          apiURL: Type.String(),
          tableIds: Type.Array(Type.Integer()),
          token: Type.String(),
        }),
      ]),
    ),
    helmet: Type.Optional(
      Type.Object({
        isEnabled: Type.Boolean(),
        hstsEnabled: Type.Boolean(),
      }),
    ),
    cors: Type.Optional(
      Type.Object({
        origin: Type.String(),
      }),
    ),
  },
  {
    $id: 'ApplicationConfiguration',
    additionalProperties: false,
  },
)

export type ConfigurationSchema = Static<typeof configurationSchema>

export const configurationValidator = getValidator(
  configurationSchema,
  dataValidator,
)
