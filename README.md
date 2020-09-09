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

* only stories of the storybook

```
npm run test:unit-stories
```

* except stories

```
npm run test:unit-src
```

* all unit tests

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

### Storybook

```
npm run storybook:serve
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

## Contribute

If you encounter a bug, please submit an issue.

If you want to contribute to the code,
first ask to the team where to begin.

When making a contribution, please name your branch with the issue's id.

For example, on the issue n° 23, you could name your branch `23-add-of-a-new-feature` or `23-fix-this-horrible-bug`.

Then you could submit a Merge Request.

The CI is configured, so you could check also if your branch is not breaking anything.
