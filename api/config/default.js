const defaultDatasources = [
  {
    name: 'fs-nutri',
    client: 'sqlite3',
    connection: './nutrieduc13.db',
  },
  {
    name: 'locokit',
    client: 'pg',
    connection: 'postgres://localhost:5432/public',
    credentials: {
      readonly: {
        username: 'postgres',
        password: 'pouicpouic',
      },
      readwrite: {
        username: 'postgres',
        password: 'pouicpouic',
      },
      alter: {
        username: 'postgres',
        password: 'pouicpouic',
      },
    },
  },
  {
    name: 'baserow-mda',
    client: 'baserow',
    connection: 'https://api.baserow.io/',
    tableIds: [12796, 12797],
    token: 'REUYxF8xqzStcc478r8LAyfB8I6UpCLC',
  },
]

module.exports = {
  host: 'localhost',
  port: 3030,
  publicURL: 'http://localhost:3000',
  public: './public/',
  publicPortalName: 'LocoKit dev',
  paginate: {
    default: 10,
    max: 50,
  },
  authentication: {
    entity: 'user',
    service: 'user',
    secret: '/jZiG6MPLaMr6JBptahMA+pxZh0A4XgX',
    authStrategies: ['jwt', 'local', 'api-key', 'github'],
    signup: true,
    jwtOptions: {
      header: {
        typ: 'access',
      },
      audience: 'https://yourdomain.com',
      algorithm: 'HS256',
      expiresIn: '1d',
    },
    local: {
      usernameField: 'email',
      passwordField: 'password',
    },
    oauth: {
      redirect: 'http://localhost:3000/github',
      github: {
        key: '7e52d97dd4f7c2252de3',
        secret: 'ebeb2acf10fb479ebef4a21277e7c0153f439024',
        scope: ['openid', 'profile', 'email'],
      },
    },
    // apikey: {
    //   header: 'x-api-key',
    //   service: 'apikey',
    // },
    // cookie: {
    //   enabled: true,
    //   name: 'locokit-next',
    //   httpOnly: false,
    //   secure: false,
    // },
    // github: {
    //   key: '7e52d97dd4f7c2252de3',
    //   secret: 'ebeb2acf10fb479ebef4a21277e7c0153f439024',
    //   scope: ['openid', 'profile', 'email'],
    // },
  },
  datasources: defaultDatasources,
  helmet: {
    isEnabled: true,
    hstsEnabled: true,
  },
  cors: {
    origin: '*',
  },
  settings: {
    signup: {
      allowed: true,
    },
    db: {
      client: 'LCK_DATABASE_CLIENT',
      connection: 'LCK_DATABASE_URL',
    },
    passwordPolicy: {
      minLength: 8,
      maxLength: 128,
      uppercase: true,
      lowercase: true,
      digits: true,
      symbols: true,
    },
  },
  mail: {
    host: '127.0.0.1',
    port: 1025,
    secure: false,
    needAuth: false,
    from: 'contact@locokit.io',
  },
}
