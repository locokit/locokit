# Low-Code Kit Frontend Platform

[![pipeline status](https://gitlab.makina-corpus.net/lck/lck-front/badges/master/pipeline.svg)](https://gitlab.makina-corpus.net/lck/lck-front/-/commits/master)
[![coverage report](https://gitlab.makina-corpus.net/lck/lck-front/badges/master/coverage.svg)](https://gitlab.makina-corpus.net/lck/lck-front/-/commits/master)

The frontend for the Low-Code Kit platform.


## Project setup
```
npm install
cp -r patch/** node_modules
```

The last line is here to fix temporary some dependencies,
waiting for our PR to be merged.

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
first ask to the team where to begin (with an issue).

1. create an issue, or be assigned on an issue
2. put the issue in the "Doing" column of the board
3. create a local branch prefixed by the issue's id (this help gitlab to wire issue / branch / MR)
4. add some tests / stories for the code you're writing
5. when your work is ok for you, push it to the repo
6. create a MR
7. check the CI is ok. CD is configured too, you could check your storybook & on surge.sh to see if it's working (this will help us for the review process)
8. if all is green, put your issue in "To be reviewed" column of the board
9. affect your MR to someone in the team to be reviewed
10. maybe you'll have to take in consideration some aspects of your code, so discuss and take in consideration the remarks (restart to 4.)
11. if review is ok, the reviewer will approve it
12. now, you can merge it !!!... Congratulations !
