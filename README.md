# Low-Code Kit Frontend Platform

[![pipeline status](https://gitlab.makina-corpus.net/lck/lck-front/badges/master/pipeline.svg)](https://gitlab.makina-corpus.net/lck/lck-front/-/commits/master)
[![coverage report](https://gitlab.makina-corpus.net/lck/lck-front/badges/master/coverage.svg)](https://gitlab.makina-corpus.net/lck/lck-front/-/commits/master)

The frontend for the Low-Code Kit platform.


## Project setup
```
npm run install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Run your end-to-end tests
```
npm run test:e2e
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration

A configuration file is present in `public/assets/js/config.js`.

```js
const LCK_SETTINGS = {
  API_URL: 'http://localhost:3030',
  HOME_BACKGROUND_IMAGE_URL: '/img/bg-intro.jpg',
  LOGO_BG_WHITE_URL: '/img/logo-bg-white.png',
  LOGO_BG_PRIMARY_URL: '/img/logo-bg-primary.png',
  STORAGE_KEY: 'lck-auth',
  SENTRY_DSN: 'https://c66594db39164ca7831994d0ea68d117@o421199.ingest.sentry.io/5340581'
}
```

You can write your own configuration settings here,
when you deploy this front, you will have to override these settings
to match your environement configuration.
