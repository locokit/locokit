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
    secret: '/jZiG6MPLaMr6JBptahMA+pxZh0A4XgX', // provided with custom environment variables
    authStrategies: ['jwt', 'local', 'public'],
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
  },
  datasources: [], // provided with custom environment variables
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
      verificationMailDelayDays: 'LCK_SIGNUP_MAIL_DELAY_DAYS', // provided with custom environment variables
    },
    db: {
      client: 'pg',
      connection: 'LCK_DATABASE_URL', // provided with custom environment variables
      seeds: {
        recursive: true,
      },
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
